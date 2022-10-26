import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidationErrors } from '@angular/forms';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'
import { RwDclStudentService } from '../../../../../core/service/service-model/rw_dcl_student.service';
import { ToastrService } from 'ngx-toastr';
import { ClassroomService } from '../../../../../core/service/service-model/classroom.service';
import { Subscription, forkJoin } from 'rxjs';
import { StudentsService } from '../../../../../core/service/service-model/students.service';
import { RwDclStudentModel } from '../RwDclStudent.model';
import { formatDate} from '@angular/common';
import { SubjectExemptionModel } from '../SubjectExemption.model';
import { ApParamService } from 'src/app/core/service/service-model/ap-param.service';
import { SubjectExemptionService } from '../subject-exemtions.service';
import { STUDENTS, MAX_LENGTH_250, KEYCODE_9 } from '../../../../../helpers/constants';
import { ValidatorFn } from '@angular/forms';
import { KEYCODE_0 } from 'src/app/helpers/constants';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'kt-action-student',
  templateUrl: './action-student.component.html',
  styleUrls: ['./action-student.component.scss', './popup-exemption.component.scss']
})
export class ActionStudentComponent implements OnInit, ICellRendererAngularComp {
  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private rwDclStudentService: RwDclStudentService,
    private toastr: ToastrService,
    private studentsService: StudentsService,
    private classroomService: ClassroomService,
    private changeDetectorRef: ChangeDetectorRef,
    private apParamService: ApParamService,
    private subjectExemptionService: SubjectExemptionService
  ) {
    this.createdName = JSON.parse(localStorage.getItem('currentUser')).login;
  }

  get getTransferClassControl() {
    return this.formTransferClass.controls;
  }

  createdName: string;

  public year;
  subscription: Subscription;

  modalRef: BsModalRef;


  cellValue: any;

  thoiHoc;
  valueRadio = 1;

  componentParent
  checkBoxValue = false;
  checkBoxValue1 = false;
  valueHinhThucKyLuat;
  valueNgayKyLuat;
  valueNgayThoiHoc;
  valueDiaDiemKyLuat;
  valueNoiDungKyLuat;
  valueNamHoc;
  className;
  schoolYear;
  valueHocKy;
  valueLiDoNghi;
  valueGhiChu;
  valueTruongChuyen;
  valueReason;
  editable = true;
  rowIndex
  isLoading: boolean = false

  public idHocKy;
  valueClassRoom;

  listHocKy: any[];
  listClassRoomOfGrade: any[];

  messageHinhThucKyLuat = {
    message: '',
    status: 'false',
  }

  messageNgayKyLuat = {
    message: '',
    status: 'false',
  }

  messageDiaDiemKyLuat = {
    message: '',
    status: 'false',
  }

  messageNoiDungKyLuat = {
    message: '',
    status: 'false',
  }

  messageHocKy = {
    message: '',
    status: 'false',
  }

  messageNgayThoiHoc = {
    message: '',
    status: 'false',
  }

  messageLiDoNghi = {
    message: '',
    status: 'false',
  }

  studentId: number | string;
  studentCode: string;
  studentName: string;
  listDataYear;

  /* ========================= mien giam ======================== */
  PARENT_CODE_TYPE_SEMESTER = 'EXEM'
  PARENT_CODE_EXEMPTION_OBJECT = 'EXEM_OBJ'

  errorSubjectExemption = [
  ]

  subjectList: any[]
  apParamList: any[]
  exemptionObjectList: any[]

  exemptionRowTables: SubjectExemptionModel[] = [

  ]
  /* ========================= mien giam ======================== */

  /* ========================= khen thuong ====================== */
  TYPE_KHEN_THUONG = 1

  khenThuong: RwDclStudentModel

  errorKhenThuong = {
    formality: {
      error: false,
      message: ''
    },
    rdDate: {
      error: false,
      message: ''
    },
    location: {
      error: false,
      message: ''
    },
    content: {
      error: false,
      message: ''
    }
  }

  // ===========================================CHUYEN LOP CHUYEN TRUONG=====================================//
  classId: string | number;
  formTransferClass = this.fb.group({
    isTransferClass: ['1'],
    transferDate: [null, [Validators.required, this.validateTransferDate()]],
    semester: [null, [Validators.required, this.validateSemester()]],
    years: [null, [Validators.required]],
    classId: [null, [Validators.required]],
    transferSchool: [null, [Validators.maxLength(250)]],
    transferClassId: [null, [Validators.required]],
    reason: [null, [Validators.required, Validators.maxLength(250)]],
  });

  /* ========================= khen thuong ====================== */

  ngOnInit() {
    this.listenYear();
    this.changeDetectorRef.detectChanges();
  }

  listenYear() {
    this.classroomService.yearCurrent$.subscribe(res => {
      this.year = res;
    })
    this.changeDetectorRef.detectChanges();
  }

  // gets called once before the renderer is used
  agInit(params): void {
    this.cellValue = params;
    this.studentCode = params.data.code;
    this.studentName = params.data.fullName;
    this.studentId = params.data.id;
    this.rowIndex = `${params.rowIndex * -22}px`
    this.componentParent = params.context.componentParent

    const { status } = params.data

    const [a, b, leave, transferSchool] = STUDENTS.STATUS
    if (status === leave.id || status === transferSchool.id) {
      this.editable = false
    }
  }

  // gets called whenever the cell refreshes

  refresh(params) {
    // set value into cell again
    return true
  }


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'action-student-modal-dialog-custom' })
    );
  }

  openModalMienGiam(template: TemplateRef<any>): void {

    this.studentsService.getSemesterOfYearNow().subscribe(res => {
      this.listDataYear = res;
      this.loadSubjectExemption()
    })
    this.loadSubject()
    this.loadTypeSemester()
    this.loadExemptionObject()

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'subject-exemption action-student-modal-dialog-custom' })
    );
  }

  openModalKhenThuong(template: TemplateRef<any>): void {

    this.errorKhenThuong = {
      formality: {
        error: false,
        message: ''
      },
      rdDate: {
        error: false,
        message: ''
      },
      location: {
        error: false,
        message: ''
      },
      content: {
        error: false,
        message: ''
      }
    }
    this.studentsService.getSemesterOfYearNow().subscribe(res => {
      this.listDataYear = res;
    })
    this.khenThuong = new RwDclStudentModel()
    this.khenThuong.year = this.year
    this.khenThuong.studentCode = this.studentCode
    this.khenThuong.type = this.TYPE_KHEN_THUONG
    this.khenThuong.content = ''
    this.openModal(template)
  }

  openModalKyLuat(template: TemplateRef<any>) {
    this.messageHinhThucKyLuat.status = 'false';
    this.messageNgayKyLuat.status = 'false';
    this.messageDiaDiemKyLuat.status = 'false';
    this.messageNoiDungKyLuat.status = 'false';
    this.valueHinhThucKyLuat = undefined;
    this.valueNgayKyLuat = undefined;
    this.valueDiaDiemKyLuat = undefined;
    this.valueNoiDungKyLuat = undefined;
    this.checkBoxValue = false;

    // let listData : any= [];
    this.studentsService.getSchoolYear().subscribe(res => {
      console.log('res', res);
      this.schoolYear = res;
      this.valueNamHoc = res.years;
      this.changeDetectorRef.detectChanges();
    })

    this.studentsService.getSemesterOfYearNow().subscribe(res => {
      this.listDataYear = res;
    })

    this.openModal(template)
  }


  openModalThoiHoc(template: TemplateRef<any>) {
    this.thoiHoc = 'true';
    this.valueNgayThoiHoc = undefined
    this.valueLiDoNghi = undefined;
    this.valueGhiChu = undefined;
    this.messageNgayThoiHoc.status = 'false';
    this.messageHocKy.status = 'false';
    this.messageLiDoNghi.status = 'false';
    this.checkBoxValue = true;
    this.valueNamHoc = this.year

    this.studentsService.getStudentStopStudyingLatest(this.studentCode, this.valueNamHoc).subscribe(res1 => {
      if (res1.status === 'OK') {
        this.valueLiDoNghi = res1.data.reason;
        this.valueGhiChu = res1.data.description;
        this.valueNgayThoiHoc = formatDate(res1.data.createdDate, 'yyyy-MM-dd', 'en_US');
        this.checkBoxValue = res1.data.status !== 0
        this.idHocKy = res1.data.semester
      }
    })

    this.studentsService.getSemesterOfYearNow().subscribe(res => {
      this.listHocKy = res.map(value => {
        return {...value, nameHocKy: 'Học kỳ ' + value.semester }
      });
      
      // this.idHocKy = this.getIdSemester(this.listHocKy);
    })

    this.changeDetectorRef.detectChanges();
    this.openModal(template)
  }

  openModalBaoLuu(template: TemplateRef<any>) {
    this.thoiHoc = 'false';
    this.valueNgayThoiHoc = undefined
    this.valueLiDoNghi = undefined;
    this.valueGhiChu = undefined;
    this.messageNgayThoiHoc.status = 'false';
    this.messageHocKy.status = 'false';
    this.messageLiDoNghi.status = 'false';
    this.checkBoxValue = true;
    this.valueNamHoc = this.year
    this.valueNgayThoiHoc = formatDate(new Date().toISOString(), 'yyyy-MM-dd', 'en_US');

    this.studentsService.getStudentReserve(this.studentCode, this.valueNamHoc).subscribe(res1 => {
      if (res1.status === 'OK') {
        this.valueLiDoNghi = res1.data.reason;
        this.valueGhiChu = res1.data.description;
        this.valueNgayThoiHoc = formatDate(res1.data.createdDate, 'yyyy-MM-dd', 'en_US');
        this.checkBoxValue = res1.data.status !== 0
        this.idHocKy = res1.data.semester
      }
    })

    this.changeDetectorRef.detectChanges();

    this.studentsService.getSemesterOfYearNow().subscribe(res => {
      this.listHocKy = res.map(value => {
        return {...value, nameHocKy: 'Học kỳ ' + value.semester}
       });
      //  this.idHocKy = this.getIdSemester(this.listHocKy)
    })

    this.changeDetectorRef.detectChanges();
    this.openModal(template)
  }

  openModalChuyenLop(template: TemplateRef<any>) {

    this.formTransferClass.reset();
    this.getTransferClassControl.isTransferClass.setValue('1');
    
    const { className, classRoomCode, classRoomId } = this.cellValue.data

    this.className = className
    this.classId = classRoomId
    this.getTransferClassControl.classId.setValue(this.className);
    this.getTransferClassControl.classId.disable();

    this.studentsService.getClassOfGrade(classRoomCode, this.year).subscribe(res => {
      this.listClassRoomOfGrade = res;
    })

    forkJoin([
        this.studentsService.getSemesterOfYearNow(),
        this.studentsService.getSchoolYear()
    ]).subscribe(([listYear, year]) => {
      console.log(listYear, year)
      this.listDataYear = listYear
      this.listHocKy = listYear.map(value => {
        return {...value, nameHocKy: 'Học kỳ ' + value.semester}
      })

      this.schoolYear = year;
      this.idHocKy = year.id
      this.changeSemester(year)
      this.valueNamHoc = year.years;
      this.getTransferClassControl.semester.setValue(year.id)
      this.getTransferClassControl.years.setValue(this.valueNamHoc);
      this.getTransferClassControl.years.disable();

    })

    this.changeDetectorRef.detectChanges();
    this.openModal(template)
  }

  validateSemester(): ValidatorFn {
    return (group): ValidationErrors => {

      const value = group.value

      if (value < this.idHocKy) {
        return {isPast: true}
      }

      return null;
    }
  }

  validateTransferDate(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {

      if (this.isEmpty(group.value)) {
        return null
      }

      const today = formatDate(new Date(), 'yyyy-MM-dd', 'en_US')
      if (group.value < today) {
        return { invalid: true }
      }

      if (this.checkDate(new Date(group.value).toISOString())) {
        return { outscopeSemester: true }
      }
      return null
    };
  }

  changeSemester(event) {
    this.listDataYear = []
    this.listDataYear.push(event)
    const {transferDate} =this.getTransferClassControl
    transferDate.setValue(transferDate.value)
  }

  changeTransferClass(event) {
    this.formTransferClass.get('classId').setValue(this.className);
    this.formTransferClass.get('years').setValue(this.valueNamHoc);
    if (event.target.value == '1') {
      this.formTransferClass.get('transferClassId').setValidators([Validators.required]);
      this.formTransferClass.get('transferSchool').setValidators([]);
      this.formTransferClass.get('transferSchool').setValue(null);
    } else {
      this.formTransferClass.get('transferSchool').setValidators([Validators.required]);
      this.formTransferClass.get('transferClassId').setValidators([]);
      this.formTransferClass.get('transferClassId').setValue(null);
    }
  }

  onSubmitTransferClass() {
    const recursive = (f: FormGroup | FormArray) => {
      for (const i in f.controls) {
        if (typeof f.controls[i].value === 'string') {
          if (!Boolean(f.controls[i].value)) {
            f.controls[i].value = null;
          } else {
            f.controls[i].value = f.controls[i].value.trim();
          }
        }
        if (f.controls[i] instanceof FormControl) {
          f.controls[i].markAsDirty();
          f.controls[i].updateValueAndValidity();
        } else {
          recursive(f.controls[i] as any);
        }
      }
    };

    recursive(this.formTransferClass);

    this.formTransferClass.enable();

    Object.keys(this.formTransferClass.controls).forEach(key => {
      const e = this.formTransferClass.get(key).errors
      console.log(e)
    })

    if (
      this.messageHocKy.status == 'true' ||
      this.formTransferClass.invalid
    ) {
      this.formTransferClass.get('years').disable();
      this.formTransferClass.get('classId').disable();
    };

    if (this.formTransferClass.invalid) {
      return
    }

    const body = { ...this.formTransferClass.value };
    body.transferDate = new Date(body.transferDate).toISOString();
    body.createdName = this.createdName;
    body.updateName = this.createdName;
    body.classId = this.classId;
    body.studentId = this.studentId;

    this.openLoading()
    this.studentsService.transferClasses(body).subscribe({
      next: res => {
        if (res.status === 'INTERNAL_SERVER_ERROR') {
          this.toastr.error(res.message);
        } else {
          this.toastr.success('Thành công');
          this.close();
        }
        this.closeLoading()
      },
      error: res => {
        this.toastr.error(res.title);
        this.formTransferClass.get('classId').setValue(this.className);
        this.closeLoading()
      }
    });

  }

  checkHocKy(event) {
    const date = new Date().toDateString();
    const date1: Date = new Date(date);
    this.listHocKy.forEach(item => {
      if (item.id === event) {
        const toDate = item.toDate.slice(0, 10);
        if (new Date(toDate) >= date1) {
          this.messageHocKy.message = '';
          this.messageHocKy.status = 'false';
        }
        else {
          this.messageHocKy.message = this.translate.instant('STUDENT.LEAVE.NOTIFY.SEMESTER.PAST');
          this.messageHocKy.status = 'true';
        }
      }
    })
    this.checkNgayThoiHoc();
  }

  checkNgayThoiHoc() {
    if (!Boolean(this.valueNgayThoiHoc)) {
      if (this.thoiHoc !== 'true') {
        this.messageNgayThoiHoc.message = this.translate.instant('STUDENT.RESERVE.NOTIFY.DATE.BLANK');
      }
      else {
        this.messageNgayThoiHoc.message = this.translate.instant('STUDENT.LEAVE.NOTIFY.DATE.BLANK');
      }
      this.messageNgayThoiHoc.status = 'true';
    } else {

      const today = new Date()
      const todayFormatted = formatDate(today, 'yyyy-MM-dd', 'en_US')

      if (todayFormatted > this.valueNgayThoiHoc) {
        this.messageNgayThoiHoc.message = this.translate.instant('STUDENT.RESERVE.NOTIFY.DATE.PAST');
        this.messageNgayThoiHoc.status = 'true';
        return
      }

      if (this.thoiHoc !== 'true') {
        this.listHocKy.forEach(item => {
          if (item.id === this.idHocKy) {
            // const toDate = item.toDate.slice(0, 10);
            const toDate = formatDate(item.toDate, 'yyyy-MM-dd', 'en_US');
            if (new Date(toDate) >= new Date(this.valueNgayThoiHoc)) {
              this.messageNgayThoiHoc.message = '';
              this.messageNgayThoiHoc.status = 'false';
            }
            else {
              this.messageNgayThoiHoc.message = this.translate.instant('STUDENT.RESERVE.NOTIFY.DATE.OUT');
              this.messageNgayThoiHoc.status = 'true';
            }
          }
        })
      } else {
        this.listHocKy.forEach(item => {
          if (item.id === this.idHocKy) {
            // const fromDate = item.fromDate.slice(0, 10);
            // const toDate = item.toDate.slice(0, 10);
            const fromDate = formatDate(item.fromDate, 'yyyy-MM-dd', 'en_US');
            const toDate = formatDate(item.toDate, 'yyyy-MM-dd', 'en_US');
            if (new Date(fromDate) <= new Date(this.valueNgayThoiHoc) && new Date(toDate) >= new Date(this.valueNgayThoiHoc)) {
              this.messageNgayThoiHoc.message = '';
              this.messageNgayThoiHoc.status = 'false';
            }
            else {
              this.messageNgayThoiHoc.message = this.translate.instant('STUDENT.LEAVE.NOTIFY.DATE.OUT');
              this.messageNgayThoiHoc.status = 'true';
            }
          }
        })
    }  
  }
}


  // ===========================================END CHUYEN LOP CHUYEN TRUONG=====================================//
  checkLiDoNghi() {
    if (this.valueLiDoNghi === undefined || this.valueLiDoNghi.toString().trim() === null || this.valueLiDoNghi.toString().trim() === '') {
      this.messageLiDoNghi.message = this.translate.instant('STUDENT.LEAVE.NOTIFY.REASON.BLANK');
      this.messageLiDoNghi.status = 'true';
    } else {
      this.messageLiDoNghi.message = '';
      this.messageLiDoNghi.status = 'false';
    }
  }

  checkBoxKyLuat() {
    this.checkBoxValue = !this.checkBoxValue;
  }

  checkHinhThuckyLuat() {
    const pattern = /^[0-9A-Za-z {}_<>/:\\?.,~\[\]"'+=|)(;\-!@#$%^&*aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ]{1,250}$/;
    this.messageHinhThucKyLuat.status = 'false';
    if(this.valueHinhThucKyLuat === undefined){
      this.messageHinhThucKyLuat.message = this.translate.instant('STUDENT.DISCIPLINE.NOTIFY.FORMALITY.BLANK');
      this.messageHinhThucKyLuat.status = 'true';
    }else {
      if (this.valueHinhThucKyLuat.trim().length === 0 ||
        this.valueHinhThucKyLuat.trim() == null ||
        this.valueHinhThucKyLuat === ''
      ) {
        this.messageHinhThucKyLuat.message = this.translate.instant('STUDENT.DISCIPLINE.NOTIFY.FORMALITY.BLANK');
      this.messageHinhThucKyLuat.status = 'true';
    } else {
      if (!pattern.test(this.valueHinhThucKyLuat)) {
        this.messageHinhThucKyLuat.message = this.translate.instant('STUDENT.DISCIPLINE.NOTIFY.FORMALITY.MAX');
        this.messageHinhThucKyLuat.status = 'true';
      } else {
        this.messageHinhThucKyLuat.message = '';
        this.messageHinhThucKyLuat.status = 'false';
      }
    }
  }}

  checkNgayKyLuat() {

    if (this.isEmpty(this.valueNgayKyLuat)) {
      this.messageNgayKyLuat.message = this.translate.instant('STUDENT.DISCIPLINE.NOTIFY.DCL_DATE.BLANK');
      this.messageNgayKyLuat.status = 'true';
      return
    }

    if (this.checkDate(new Date(this.valueNgayKyLuat).toISOString())) {
      this.messageNgayKyLuat.message = this.translate.instant('STUDENT.DISCIPLINE.NOTIFY.DCL_DATE.OUT');
      this.messageNgayKyLuat.status = 'true';
      return
    }
    this.messageNgayKyLuat.status = 'false';

  }

  checkDiaDiemKyLuat() {
    const pattern = /^[0-9A-Za-z {}_<>/:\\?.,~\[\]"'+=|)(;\-!@#$%^&*aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ]{1,250}$/;
    this.messageDiaDiemKyLuat.status = 'false';
    if (this.valueDiaDiemKyLuat === undefined) {
      this.messageDiaDiemKyLuat.message = this.translate.instant('STUDENT.DISCIPLINE.NOTIFY.LOCATION.BLANK');
      this.messageDiaDiemKyLuat.status = 'true';
    } else {
      if (this.valueDiaDiemKyLuat.trim().length === 0 ||
        this.valueDiaDiemKyLuat.trim() == null ||
        this.valueDiaDiemKyLuat.trim() === ''
      ) {
        this.messageDiaDiemKyLuat.message = this.translate.instant('STUDENT.DISCIPLINE.NOTIFY.LOCATION.BLANK');
        this.messageDiaDiemKyLuat.status = 'true';
      } else {
        if (!pattern.test(this.valueDiaDiemKyLuat)) {
          this.messageDiaDiemKyLuat.message = this.translate.instant('STUDENT.DISCIPLINE.NOTIFY.LOCATION.MAX');
          this.messageDiaDiemKyLuat.status = 'true';
        } else {
          this.messageDiaDiemKyLuat.message = '';
          this.messageDiaDiemKyLuat.status = 'false';
        }
      }
    }
  }

  checkNoiDungKyLuat() {
    const pattern = /^[0-9A-Za-z {}_<>/:\\?.,~\[\]"'+=|)(;\-!@#$%^&*aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ]{1,500}$/;
    this.messageNoiDungKyLuat.status = 'false';
    if (!pattern.test(this.valueNoiDungKyLuat)) {
      this.messageNoiDungKyLuat.message = this.translate.instant('STUDENT.DISCIPLINE.NOTIFY.CONTENT.MAX');
      this.messageNoiDungKyLuat.status = 'true';
    } else {
      this.messageNoiDungKyLuat.message = '';
      this.messageNoiDungKyLuat.status = 'false';
    }
  }


  saveKiLuat() {
    this.checkHinhThuckyLuat();
    this.checkNgayKyLuat();
    this.checkDiaDiemKyLuat();
    this.checkNoiDungKyLuat();

    if (this.messageHinhThucKyLuat.status === 'false' && this.messageNgayKyLuat.status === 'false' && this.messageDiaDiemKyLuat.status === 'false' && this.messageNoiDungKyLuat.status === 'false') {
      const addData: any = {};
      
      addData.type = 0;
      addData.createdDate = formatDate(new Date(), 'yyyy-MM-dd', 'en_US') + 'T00:00:00Z';
      addData.studentCode = this.studentCode;
      addData.formality = this.valueHinhThucKyLuat.trim();
      addData.year = this.valueNamHoc;
      addData.rdDate = new Date(this.valueNgayKyLuat).toISOString();
      addData.location = this.valueDiaDiemKyLuat.trim();
      addData.isSave = this.checkBoxValue ? 1 : 0

      if(this.valueNoiDungKyLuat !== undefined && this.valueNoiDungKyLuat !== null){
        addData.content = this.valueNoiDungKyLuat.trim();
      }
      
      this.openLoading()
      this.rwDclStudentService.addRwDclStudent(addData)
        .subscribe(resonseAPI => {
          if (resonseAPI.status === 'OK') {
            this.toastr.success(this.translate.instant('STUDENT.DISCIPLINE.NOTIFY.SUCCESS'));
            this.close();
          } else {
            this.toastr.error(this.translate.instant('STUDENT.DISCIPLINE.NOTIFY.FAIL'));
          }
          this.closeLoading()
        });
    }
  }

  saveThoiHoc() {
    this.checkNgayThoiHoc();
    this.checkLiDoNghi();
    const addData: any = {};
    if (this.messageNgayThoiHoc.status === 'false' && this.messageHocKy.status === 'false' && this.messageLiDoNghi.status === 'false') {
      addData.type = 0;
      addData.status = this.checkBoxValue ? 1 : 0
      addData.createdDate = this.valueNgayThoiHoc.toString() + 'T00:00:00Z';
      addData.studentCode = this.studentCode;
      addData.semester = this.idHocKy;
      addData.schoolYear = this.valueNamHoc;
      if (this.valueLiDoNghi !== undefined && this.valueLiDoNghi !== null) {
        addData.reason = this.valueLiDoNghi.trim();
      }
      
      if (this.valueGhiChu !== undefined && this.valueGhiChu !== null) {
        addData.description = this.valueGhiChu.trim();
      }

      this.openLoading()
      this.studentsService.addRLStudent(addData)
        .subscribe(responseAPI => {
          if (responseAPI.status === 'OK') {
            this.toastr.success(this.translate.instant('STUDENT.LEAVE.NOTIFY.SUCCESS'));
            this.close();
          } else {
            this.toastr.error(this.translate.instant('STUDENT.LEAVE.NOTIFY.FAIL'));
          }
          this.closeLoading()
        });
    }
  }

  saveBaoLuu() {
    this.checkNgayThoiHoc();
    this.checkLiDoNghi();
    const addData: any = {};

    if (this.messageNgayThoiHoc.status === 'false' && this.messageHocKy.status === 'false' && this.messageLiDoNghi.status === 'false') {
      
      addData.createdDate = new Date(this.valueNgayThoiHoc).toISOString();
      addData.studentCode = this.studentCode;
      
      addData.semester = this.idHocKy;
      addData.schoolYear = this.valueNamHoc;
      addData.status = this.checkBoxValue ? 1 : 0
      addData.type = 1

      if (this.valueLiDoNghi !== undefined && this.valueLiDoNghi !== null) {
        addData.reason = this.valueLiDoNghi.trim();
      }

      if (this.valueGhiChu !== undefined && this.valueGhiChu !== null) {
        addData.description = this.valueGhiChu.trim();
      }

      this.openLoading()
      this.studentsService.addRLStudent(addData)
        .subscribe({
          next: responseAPI => {
            if (responseAPI.status === 'OK') {
              this.toastr.success(this.translate.instant('STUDENT.RESERVE.NOTIFY.SUCCESS'));
              this.close();
            } else {
              this.toastr.error(this.translate.instant('STUDENT.RESERVE.NOTIFY.FAIL'));
            }
            this.closeLoading()
          },
          error: res => {
            this.toastr.error(res.message)
            this.closeLoading()
          }
        });
    }
  }

  // khen thuong

  validate(): void {
    this.validateFormality()
    this.validateRdDate()
    this.validateLocation()
    this.validateContent()
  }

  validateFormality(): void {
    if (this.isEmpty(this.khenThuong.formality)) {
      this.errorKhenThuong.formality.error = true
      this.errorKhenThuong.formality.message = this.translate.instant('STUDENT.REWARD.NOTIFY.FORMALITY.BLANK')
      return
    }

    if (this.isMaxLength(this.khenThuong.formality)) {
      this.errorKhenThuong.formality.error = true
      this.errorKhenThuong.formality.message = this.translate.instant('STUDENT.REWARD.NOTIFY.FORMALITY.MAX')
      return
    }

    this.errorKhenThuong.formality.error = false
  }

  validateRdDate(): void {
    const rdDate = this.khenThuong.rdDate;

    if (this.isEmpty(rdDate)) {
      this.errorKhenThuong.rdDate.error = true
      this.errorKhenThuong.rdDate.message = this.translate.instant('STUDENT.REWARD.NOTIFY.RW_DATE.BLANK')
      return
    }

    if (this.checkDate(new Date(rdDate).toISOString())) {
      this.errorKhenThuong.rdDate.error = true
      this.errorKhenThuong.rdDate.message = this.translate.instant('STUDENT.REWARD.NOTIFY.RW_DATE.OUT')
      return
    }

    this.errorKhenThuong.rdDate.error = false

  }
  validateLocation(): void {
    if (this.isEmpty(this.khenThuong.location)) {
      this.errorKhenThuong.location.error = true
      this.errorKhenThuong.location.message = this.translate.instant('STUDENT.REWARD.NOTIFY.LOCATION.BLANK')
      return
    }

    if (this.isMaxLength(this.khenThuong.location)) {
      this.errorKhenThuong.location.error = true
      this.errorKhenThuong.location.message = this.translate.instant('STUDENT.REWARD.NOTIFY.LOCATION.MAX')
      return
    }

    this.errorKhenThuong.location.error = false
  }

  validateContent(event?: any): void {
    if (this.khenThuong.content.length > 500) {
      this.errorKhenThuong.content.error = true
      this.errorKhenThuong.content.message = this.translate.instant('STUDENT.REWARD.NOTIFY.CONTENT.MAX')
    }
  }


  saveKhenThuong(): void {
    this.validate()
    let messages = ''
    for (const key in this.errorKhenThuong) {
      if (this.errorKhenThuong[key].error) {
        messages += `* ${this.errorKhenThuong[key].message.slice(0, 30)}... <br>`
      }
    }

    // tslint:disable-next-line:triple-equals
    if (messages != '') {
      this.toastr.error(messages, '', { enableHtml: true })
      return
    }


    this.khenThuong.rdDate += 'T00:00:00Z'
    this.khenThuong.isSave = this.checkBoxValue ? 1 : 0
    this.trim(this.khenThuong)

    this.openLoading()
    this.rwDclStudentService.addRwDclStudent(this.khenThuong)
      .subscribe({
        next: res => {
          if (res.status !== 'OK') {
            this.toastr.error(this.translate.instant('STUDENT.REWARD.NOTIFY.FAIL'))
          } else {
            this.close()
            this.toastr.success(this.translate.instant('STUDENT.REWARD.NOTIFY.SUCCESS'))
          }
          
          this.closeLoading()
        },
        error: res => {
          this.toastr.error(res)
          this.closeLoading()
        }
      })
  }
  // khen thuong

  // exemption

  validateSubjectExemption(): void {
    this.exemptionRowTables.forEach((value, index) => {
      this.validateSubjectCode(index)
      this.validateExemptionObject(index)
      this.validateTypeSemester(index)
    })
  }

  validateSubjectCode(i: number): void {
    const { subjectCode } = this.exemptionRowTables[i]

    if (this.isEmpty(subjectCode)) {
      this.errorSubjectExemption[i].subjectCode.error = true
      this.errorSubjectExemption[i].subjectCode.message = this.translate.instant('STUDENT.EXEMPTION.NOTIFY.SUBJECT.BLANK')
      return
    }

    let isExist = false
    this.exemptionRowTables.every((value, index) => {
      if (value.subjectCode === subjectCode && index !== i) {
        isExist = true
        this.errorSubjectExemption[i].subjectCode.error = true
        this.errorSubjectExemption[i].subjectCode.message = this.translate.instant('STUDENT.EXEMPTION.NOTIFY.SUBJECT.EXIST')
        return false
      }
      isExist = false
      return true
    })
    if (!isExist) {
      this.errorSubjectExemption[i].subjectCode.error = false
      this.errorSubjectExemption[i].subjectCode.message = ''
    }

  }

  validateExemptionObject(i: number): void {
    const { exemptionObject } = this.exemptionRowTables[i]

    if (this.isEmpty(exemptionObject)) {
      this.errorSubjectExemption[i].exemptionObject.error = true
      this.errorSubjectExemption[i].exemptionObject.message = this.translate.instant('STUDENT.EXEMPTION.NOTIFY.OBJECT.BLANK')
      return
    }
    this.errorSubjectExemption[i].exemptionObject.message = ''
    this.errorSubjectExemption[i].exemptionObject.error = false
  }

  validateTypeSemester(i) {
    const { subjectExemptionsDetails } = this.exemptionRowTables[i]
      let count = 0;
      subjectExemptionsDetails.forEach( e => {
        if ( this.isEmpty(e.typeSemester) ) {
          count++
        }
      });
      if (count === subjectExemptionsDetails.length) {
        this.errorSubjectExemption[i].typeSemester.error = true
        this.errorSubjectExemption[i].typeSemester.message = this.translate.instant('STUDENT.EXEMPTION.NOTIFY.SEMESTER.MIN')
        return
      }

      this.errorSubjectExemption[i].typeSemester.error = false
        this.errorSubjectExemption[i].typeSemester.message = ''
  }

  addRow(): void {
    this.errorSubjectExemption.push(
      this.createErrorSubjectExemption()
    )
    this.exemptionRowTables.push(
      this.createSubjectExemption()
    )
  }

  deleteRow(i: number): void {

    this.exemptionRowTables = this.exemptionRowTables.filter((value, index) => index !== i)
    this.errorSubjectExemption = this.errorSubjectExemption.filter((value, index) => index !== i)

  }

  createSubjectExemption(): SubjectExemptionModel {
    const sub = new SubjectExemptionModel()
    sub.schoolYear = this.year
    sub.studentCode = this.studentCode
    sub.subjectExemptionsDetails = this.listDataYear.map(value => {
      return {
        id: null,
        typeSemester: null,
        semester: value.id
      }
    })
    return sub
  }

  createErrorSubjectExemption(): any {
    const error = {
      subjectCode: {
        error: false,
        message: ''
      },
      typeSemester: {
        error: false,
        message: ''
      },
      exemptionObject: {
        error: false,
        message: ''
      }
    }
    return error
  }

  saveMienGiam(): void {

    if (this.isEmpty(this.studentCode)) {
      this.toastr.error(this.translate.instant('STUDENT.EXEMPTION.NOTIFY.STUDENT_CODE.BLANK'))
      return
    }

    if (this.isEmpty(this.year)) {
      this.toastr.error(this.translate.instant('STUDENT.EXEMPTION.NOTIFY.YEAR.BLANK'))
      return
    }

    if (this.exemptionRowTables.length < 1) {
      this.toastr.error(this.translate.instant('STUDENT.EXEMPTION.NOTIFY.RECORD.MIN'))
      return
    }


    this.validateSubjectExemption()

    let error = false

    this.errorSubjectExemption.every(value => {

      if (value.subjectCode.error) {
        this.toastr.error(value.subjectCode.message)
        error = true
        return false

      }

      if (value.exemptionObject.error) {
        this.toastr.error(value.exemptionObject.message)
        error = true
        return false
      }
      if (value.typeSemester.error) {
        this.toastr.error(value.typeSemester.message)
        error = true
        return false
      }
      return true

    })

    if (error) {
      return
    }

    this.openLoading()
    this.subjectExemptionService.save(this.exemptionRowTables)
      .subscribe({
        next: res => {

          if (res.status !== 'OK') {
            this.toastr.error(this.translate.instant('STUDENT.EXEMPTION.NOTIFY.FAIL'))
          } else {
            this.toastr.success(this.translate.instant('STUDENT.EXEMPTION.NOTIFY.SUCCESS'))
            this.close()
          }
          this.closeLoading()

        },
        error: res => {
          this.toastr.error(res)
          this.closeLoading()
        }
      })
  }

  createRowAndError() {

    this.errorSubjectExemption = [
      this.createErrorSubjectExemption()
    ]

    this.exemptionRowTables = [
      this.createSubjectExemption()
    ]
  }

  loadSubjectExemption(): void {
    this.subjectExemptionService.findBySchoolYearAndStudentCode({
      schoolYear: this.year,
      studentCode: this.studentCode
    }).subscribe({
      next: res => {
        if (res.length > 0) {

          this.exemptionRowTables = res

          this.exemptionRowTables.forEach(ex => {
            if (ex.subjectExemptionsDetails.length !== this.listDataYear.length) {
                ex.subjectExemptionsDetails = this.listDataYear.map( (value, index) => {
                  const d = ex.subjectExemptionsDetails.find(x => x.semester == value.id)
                  return d != undefined ? d : {id: null, typeSemester: null, semester: value.id}
              })
            }
          })

          this.errorSubjectExemption = this.exemptionRowTables.map(value => {
            return this.createErrorSubjectExemption()
          })
          return
        }

        this.createRowAndError()

      },
      error: res => {
        this.createRowAndError()
      }
    })
  }

  loadSubject(): void {
    const { classRoomId } = this.cellValue.data
    this.classroomService.getSubjects(classRoomId)
      .subscribe({
        next: res => {
          if (res.status !== 'OK') {
            this.toastr.error(res.message)
            return
          }

          this.subjectList = res.data.map(x => {
            x.name = `${x.code}-${x.name}`
            return x;
          })
        },
        error: res => {
          this.toastr.error('LOI')
        }
      })
  }

  loadTypeSemester(): void {
    this.apParamService.getByParenCode(this.PARENT_CODE_TYPE_SEMESTER)
      .subscribe({
        next: res => {

          if (res.status !== 'OK') {
            this.toastr.error(res.message)
            return
          }

          this.apParamList = res.data

        },
        error: res => {
          this.toastr.error('LOI')
        }
      })
  }

  loadExemptionObject(): void {
    this.apParamService.getByParenCode(this.PARENT_CODE_EXEMPTION_OBJECT)
      .subscribe({
        next: res => {

          if (res.status !== 'OK') {
            this.toastr.error(res.message)
            return
          }

          this.exemptionObjectList = res.data

        },
        error: res => {
          this.toastr.error('LOI')
        }
      })
  }

  isEmpty(data: string): boolean {
    return data === undefined || data === null || data.trim() === ''
  }

  isMaxLength(data: string): boolean {
    return data.length > MAX_LENGTH_250
  }

  checkDate(rwDate: any): boolean {
    // fromDate of first semester
    let fromDate = this.listDataYear[0].fromDate
    fromDate = formatDate(fromDate, 'yyyy-MM-dd', 'en_US');

    // toDate of last semester
    let toDate = this.listDataYear[this.listDataYear.length-1].toDate
    toDate = formatDate(toDate, 'yyyy-MM-dd', 'en_US');
    rwDate = formatDate(rwDate, 'yyyy-MM-dd', 'en_US');
    return rwDate < fromDate || rwDate > toDate
  }

  trim(obj: any): void {
    for (const key in obj) {
      const v = obj[key]
      if (v && typeof v === 'string') {
        obj[key] = v.trim()
      }
    }
  }

  onChangeCheckBox(): void {
    this.checkBoxValue = !this.checkBoxValue;
  }

  interceptKeyboard(event): void {
    const keyCode = event.keyCode
    if (keyCode >= KEYCODE_0 && keyCode <= KEYCODE_9) {
      event.preventDefault();
    }
  }

  getIdSemester(listHocKy): number {
    const date = new Date()
    const s = listHocKy.filter(value => {
      const fromDate = formatDate(value.fromDate, 'yyyy-MM-dd', 'en_US');
      const toDate = formatDate(value.toDate, 'yyyy-MM-dd', 'en_US');
      const now = formatDate(date, 'yyyy-MM-dd', 'en_US');
      return fromDate <= now && toDate >= now
    })
    return s[0].id
  }

  close(): void {
    this.modalRef.hide()
    this.componentParent.doSearch(this.componentParent.currentPage)
  }

  openLoading() {
    this.isLoading = true
    this.changeDetectorRef.detectChanges()
  }

  closeLoading() {
    this.isLoading = false
    this.changeDetectorRef.detectChanges()
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

}
