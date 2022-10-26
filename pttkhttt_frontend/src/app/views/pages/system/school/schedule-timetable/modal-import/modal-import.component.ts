import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup} from '@angular/forms';
import {forkJoin} from 'rxjs';
import {TeacherService} from '../../../../../../core/service/service-model/teacher.service';
import {TranslateService} from '@ngx-translate/core';
import {ClassroomService} from '../../../../../../core/service/service-model/classroom.service';
import {CommonServiceService} from '../../../../../../core/service/utils/common-service.service';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../../../../../environments/environment';
import {SchoolServices} from '../../school.service';
import {DatePipe} from '@angular/common';
import {MatDialogRef} from '@angular/material/dialog';

export interface DataDropdown {
  code: string | null;
  name: string;
}

@Component({
  selector: 'kt-modal-import',
  templateUrl: './modal-import.component.html',
  styleUrls: ['./modal-import.component.scss', '../schedule-timetable.component.scss']
})

export class ModalImportComponent implements OnInit {
  @ViewChild('file') file: ElementRef;
  formData;
  empty = true;
  delete = false;
  formatDate = 'yyyy-MM-dd';
  dropDownDefault: DataDropdown = {
    code: '',
    name: null
  };
  showErr = false;
  messageErr;
  modalRef: BsModalRef;
  modalRefApprove: BsModalRef;
  form: FormGroup;
  formImport: FormGroup;
  listGradeLevels = [];
  listClass = [];
  listScoreRatingDefault = [];
  listSemester = [];
  dataGrid = [];
  rowCheckedList = [];
  rangeWithDots;

  _pageSize = 10;
  _page = 1;
  lStorage;
  headerHeight = 56;
  rowHeight = 50;
  rowData;
  gridApi;
  gridColumnApi;
  totalRecord = 0;
  first = 1;
  last = 10;
  total = 0;
  totalPage = 0;
  subscription;
  years;
  fileName;
  fileSize;
  resultImport;
  isMe;
  isShowImport = false;
  scorePopup;
  frameworkComponents;
  roleParam = environment.ROLE;
  role;
  fromDate;
  toDate;
  listYears = [];
  isSubmit = false;
  sub = [];

  constructor(private modalService: BsModalService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<ModalImportComponent>,
              private teacherService: TeacherService,
              private translate: TranslateService,
              private cdr: ChangeDetectorRef,
              private classroomService: ClassroomService,
              private commonService: CommonServiceService,
              private toatr: ToastrService,
              private schoolServices: SchoolServices,
              private datePipe: DatePipe
  ) {
  }


  ngOnInit(): void {
    this.getYear();
    this.buildForm();
    this.getData();
    this.dropDownDefault.name = this.translate.instant('TEACHER_RATING.ALL');
  }

  buildForm() {
    this.form = this.formBuilder.group({
      years: [this.years],
      classCode: [null],
      gradeLevel: [''],
      applyDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
      semester: [''],
      notify: [false]
    });
    this.cdr.detectChanges();
    this.form.get('semester').valueChanges.subscribe(val => {
      const data = this.listSemester.find(it => it.semester === val);
      console.log(data);
      if (data) {
        this.fromDate = this.datePipe.transform(data.fromDate, this.formatDate);
        this.toDate = this.datePipe.transform(data.toDate, this.formatDate);
      }
    });
  }

  getData() {
    forkJoin(
      this.schoolServices.getGradeLevels(),
    ).subscribe(([resGradeLevels]) => {
      this.listGradeLevels = resGradeLevels;
      if (resGradeLevels.length > 0) {
        this.form.get('gradeLevel').setValue(resGradeLevels[0].code);
      }
    });
  }

  cancelImport() {
    this.dialogRef.close();
  }

  removeFile() {
    this.resultImport = null;
    this.file = null;
    this.fileName = null;
    this.fileSize = null;
  }

  exportTemplate() {
    const fileName = `DS_TKB.xls`;
    const data = this.form.value;
    this.schoolServices.downloadTemplate(data.years, data.gradeLevel, fileName);
  }

  upload(file) {
    this.fileName = file[0].name;
    this.fileSize = file[0].size;

    if (file.length === 0) {
      this.toatr.error(this.translate.instant('TEACHER_RATING.IMPORT.NOTIFY.BLANK'));
      this.isShowImport = true;
      return;
    }
    if (!(file[0].name.includes('.xlsx') || file[0].name.includes('.xls'))) {
      this.toatr.error(this.translate.instant('TEACHER_RATING.IMPORT.NOTIFY.FORMAT'));
      this.isShowImport = true;
      return;
    }

    const formData = new FormData();

    formData.append('file', file[0]);
    this.formData = formData;
    this.isShowImport = false;
  }

  exportDataErrors() {
    if (this.resultImport === undefined) {
      this.toatr.error(this.messageErr = this.translate.instant('SCHEDULE_TIMETABLE.NOT_ERROR'));
      return;
    }

    this.schoolServices.exportDataErrors(this.resultImport);
  }

  importFile() {
    const data = this.form.value;
    console.log(data);
    this.changeApplyDate();
    if (this.showErr || !data.gradeLevel) {
      return;
    }
    if (!this.fileName) {
      this.toatr.error(this.translate.instant('TEACHER_RATING.IMPORT.NOTIFY.BLANK'));
      return;
    }

    if(this.fileSize/1024/1024 > 5 ){
      this.toatr.error('File danh sách có dung lượng > 5MB');
      return;
    }

    this.schoolServices.uploadFile(this.formData, data ).subscribe((res: any) => {
      this.resultImport = res && res.data ? res.data[res.data.length -1 ] : null;
      this.file = null;
      if(this.resultImport){
          this.resultImport.total = this.resultImport.totalFail + this.resultImport.totalSuccess
      } else {
        this.toatr.error('Import thất bại - File import không đúng định dạng');
        return;
      }
      if(this.resultImport.totalSuccess > 0){
        this.toatr.success(this.translate.instant('TEACHER_RATING.IMPORT.SUCCESS') + ' '
          + this.resultImport.totalSuccess + '/'
          + this.resultImport.total + ' '
          + this.translate.instant('TEACHER_RATING.IMPORT.RECORD'))
        return;
      }else if(this.resultImport.totalFail > 0  && this.resultImport.totalFail === this.resultImport.total){
        this.toatr.error(this.translate.instant('TEACHER_RATING.IMPORT.ERROR') + ' '
          + this.resultImport.totalFail + '/' + this.resultImport.total + this.translate.instant('TEACHER_RATING.IMPORT.RECORD'))
        return;
      }
      this.dialogRef.close(true);
    }, err => {
      this.toatr.error(this.translate.instant('TEACHER_RATING.IMPORT.ERROR'));
    });
  }

  changeApplyDate() {
    const dateApply = this.form.value.applyDate;
    console.log(dateApply);
    console.log(new Date(dateApply).getDay());
    if (dateApply === '' || dateApply === undefined) {
      if (this.empty || this.delete) {
        this.showErr = true;
        this.messageErr = 'Ngày áp dụng không được để trống';
        return;
      }

      this.empty = false;

      this.showErr = true;
      this.messageErr = ' Ngày áp dụng không tồn tại';
      return;
    }

    // check them endDate
    const dateValue = new Date(dateApply).getTime();
    const fromDate = new Date(this.fromDate).getTime();
    const toDate = new Date(this.toDate).getTime();
    if (dateValue < fromDate || dateValue > toDate) {
      this.showErr = true;
      this.messageErr = `Ngày áp dụng không thuộc học kì đã chọn của năm học ${this.years}`;
      return;
    }
    const dateNow = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    if (dateValue < new Date().getTime() && dateNow !== dateApply) {
      this.showErr = true;
      this.messageErr = this.translate.instant('SCHEDULE_TIMETABLE.DATE.MORE');
      return;
    }

    if (new Date(dateApply).getDay() !== 1) {
      this.showErr = true;
      this.messageErr = 'Ngày áp dụng phải là thứ 2 đầu tuần';
      return;
    }

    this.showErr = false;
    this.messageErr = '';
  }

  getYear() {
    this.classroomService.yearCurrent$.subscribe(res => {
      console.log(res);
      this.years = res;
      if (this.years) {
        this.getDateToFrom(this.years);
        this.showErr = false;
        this.messageErr = '';
      }
    });
  }

  getDateToFrom(year: any) {
    this.schoolServices.getYear(year).subscribe(res => {
      this.listSemester = res && res.semesterList ? res.semesterList : [];
      this.form.get('semester').setValue(res && res.semesterCurrent? res.semesterCurrent.semester : null);
    });
  }

  keyUpDate(event) {
    if (event.keyCode >= 48 && event.keyCode <= 57) {
      this.empty = false;
      this.delete = false;
    }
    if (event.keyCode === 8) {
      this.delete = true;
    }
  }
}

