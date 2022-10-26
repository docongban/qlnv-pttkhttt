import {ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup} from '@angular/forms';
import {forkJoin} from 'rxjs';
import {TeacherService} from '../../../../../core/service/service-model/teacher.service';
import {TranslateService} from '@ngx-translate/core';
import {TooltipComponent} from '../../class-room/tooltip/tooltip.component';
import {ICellRendererParams} from 'ag-grid-community';
import {SelectActionComponent} from '../../class-room/select-action/select-action.component';
import {ClassroomService} from '../../../../../core/service/service-model/classroom.service';
import {CommonServiceService} from '../../../../../core/service/utils/common-service.service';
import {constant} from '@progress/kendo-data-query/dist/npm/funcs';
import {ButtonRendererComponent} from './button-renderer/button-renderer.component';
import {Department} from '../../../../../core/service/model/department.model';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../../../../environments/environment';

export interface DataDropdown {
  code: string | null;
  name: string;
}

@Component({
  selector: 'kt-teacher-ratings',
  templateUrl: './teacher-ratings.component.html',
  styleUrls: ['./teacher-ratings.component.scss']
})

export class TeacherRatingsComponent implements OnInit {
  @ViewChild('file') file: ElementRef;
  formData;
  valueDefault;
  isSubmitImport = false;
  dropDownDefault: DataDropdown = {
    code: '',
    name: null
  };
  dropDownImport: DataDropdown = {
    code: '',
    name: 'Lựa chọn'
  };
  modalRef: BsModalRef;
  modalRefApprove: BsModalRef;
  form: FormGroup;
  listRate = [];
  listScoreRating = [];
  listScoreRatingDefault = [];
  listDept = [];
  dataGrid = [];
  rowCheckedList = [];
  rangeWithDots;
  columnDefs = [];

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

  constructor(private modalService: BsModalService,
              private formBuilder: FormBuilder,
              private teacherService: TeacherService,
              private translate: TranslateService,
              private cdr: ChangeDetectorRef,
              private classroomService: ClassroomService,
              private commonService: CommonServiceService,
              private toatr: ToastrService
  ) {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    };
  }


  ngOnInit(): void {
    this.lStorage = JSON.parse(localStorage.getItem('currentUser'));
    this.role = this.checkRole();
    this.buildForm();
    this.getData();
    this.dropDownDefault.name = this.translate.instant('TEACHER_RATING.ALL');
    this.subscription = this.classroomService.yearCurrent$.subscribe(val => {
      this.years = val;
      this._page = 1;
      if(this.form && this.valueDefault){
        this.form.patchValue(this.valueDefault)
        this.searchEvent(1)
      }
    });
    this.columnDefs = [
      {
        headerName: '',
        field: 'refunded',
        aggFunc: 'sum',
        minWidth: 40,
        maxWidth: 40,
        headerCheckboxSelection: true,
        checkboxSelection: true,
      },
      {
        headerName: 'STT',
        field: 'make',
        valueGetter: param => {
          return param.node.rowIndex + (((this._page - 1) * this._pageSize) + 1);
        },
        width: 100,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          'margin-left': '8px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
      },
      {
        headerName: 'MÃ CÁN BỘ',
        field: 'teacherCode',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#3366FF',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        minWidth: 100,
        tooltipField: 'teacherCode'
      },
      {
        headerName: 'TÊN CÁN BỘ', field: 'fullName',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        minWidth: 100,
        tooltipField: 'fullName',
      },
      {
        headerName: 'TÊN ĐƠN VỊ', field: 'deptName',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        minWidth: 120,
        tooltipField: 'deptName'
      },
      {
        headerName: 'TRẠNG THÁI', field: 'status',
        cellStyle: params => {
          const status = params.data.status;
          let color;
          switch (status) {
            case 'Chưa đánh giá':
              color = '#D14343';
              break;
            case 'Tự đánh giá':
              color = '#F26522';
              break;
            case 'Quản lý đã đánh giá':
              color = '#3366FF';
              break;
            case 'Đã phê duyệt':
              color = '#52BD94';
              break;
            default:
              color = '#000000';
              break;
          }
          return {
            'font-weight': '500',
            'font-size': '12px',
            'align-items': 'center',
            color,
            top: '12px',
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis',
            overflow: 'hidden'
          };
        },
        minWidth: 150,
        tooltipField: 'status',
        cellRenderer: (params) => {
          return `<p class="d-flex align-items-center"><span class="fas fa-circle">&nbsp;</span>${params.value}</p>`;
        },

      },
      {
        headerName: 'ĐIỂM ĐÁNH GIÁ',
        field: 'score',
        cellRenderer: param => {
          if (param.data.score) {
            return param.data.score;
          } else {
            return '-';
          }
        },
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        minWidth: 100,
        tooltipField: 'score'
      },
      {
        headerName: 'FILE ĐÁNH GIÁ',
        field: '',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.downloadFileSelfAssessment.bind(this),
        },
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        minWidth: 100,

      },
    ];
  }

  buildForm() {
    this.form = this.formBuilder.group({
      deptId: [null],
      score: [''],
      status: [''],
      teacherName: ['']
    });
    this.cdr.detectChanges();
  }

  downloadFileSelfAssessment(path) {
    const fileName = `Danhgialaodong_${this.years}.doc`;
    this.teacherService.fileSelfAssessment(path.data.pathFile, fileName);
  }

  getData() {
    forkJoin(
      this.teacherService.data('RATE'),
      this.teacherService.data('SCORE_RATING'),
      this.teacherService.dataDept(this.role),
    ).subscribe(([resRate, resScoreRating, resDept]) => {
      this.listDept = resDept;
      this.listRate = resRate;
      this.listScoreRating = resScoreRating;
      this.listScoreRatingDefault = JSON.parse(JSON.stringify(resScoreRating));
      if (resDept.length > 0) {
        this.form.get('deptId').setValue(resDept[0].key);
      }
      this.listRate.unshift(this.dropDownDefault);
      this.listScoreRating.unshift(this.dropDownDefault);
      this.listScoreRatingDefault.unshift(this.dropDownImport);
      this.valueDefault = this.form.value
      this.searchEvent(1);
    });
  }

  cancelImport() {
    this.modalRef.hide();
  }


  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    setTimeout(() => {
      this.gridApi.sizeColumnsToFit();
    }, 50);
  }

  onSelectionChanged() {
    const selectedRows = this.gridApi.getSelectedRows();
  }


  onRowSelected(event) {
    const listRowSelected = [];
    this.gridApi.forEachNode(row => {
      if (row.isSelected()) {
        listRowSelected.push(row.data);
      }
    });
    this.rowCheckedList = listRowSelected;
  }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
  }

  // ==============================Paging=====================================

  page(page: number): void {
    this._page = page;
    this.searchEvent(page);
  }

  // tooltip
  formatToolTip(params: any) {
    // USE THIS FOR TOOLTIP LINE BREAKS
    // const first = params.fName;
    // const last = params.lName;
    // const lineBreak = true;
    // const toolTipArray = [first, last]
    // return { toolTipArray, lineBreak }

    // USE THIS FOR SINGLE LINE TOOLTIP

    const lineBreak = false;
    const toolTipString = 'Hello World';
    return {toolTipString, lineBreak};
  }

  prev(): void {
    this._page--;
    if (this._page < 1) {
      this._page = 1;
      return;
    }

    this.searchEvent(this._page);
  }

  next(): void {
    this._page++;
    if (this._page > this.totalPage) {
      this._page = this.totalPage;
      return;
    }
    this.searchEvent(this._page);
    // this.page(this.currentPage)
  }

  searchEvent(page: number) {
    this._page = page;
    // tslint:disable-next-line:forin
    const data = Object.assign({}, this.form.value, {
      years: this.years,
      teacherCode: this.role === 0 ? this.lStorage.login : null
    });
    const body = {
      data,
      page,
      pageSize: this._pageSize,
    };
    this.teacherService.onSearch(body).subscribe(res => {
      this.rowCheckedList = [];
      this.dataGrid = res.data;
      // this.deptList = res.departmentList;
      this.totalRecord = res.total;
      this.first = ((page - 1) * this._pageSize) + 1;
      this.last = this.first + this.dataGrid.length - 1;
      if (this.totalRecord % this._pageSize === 0) {
        this.totalPage = Math.floor(this.totalRecord / this._pageSize);
        this.rangeWithDots = this.commonService.pagination(
          this._page,
          this.totalPage
        );
      } else {
        this.totalPage = Math.floor(this.totalRecord / this._pageSize) + 1;
        this.rangeWithDots = this.commonService.pagination(
          this._page,
          this.totalPage
        );
      }
      this.gridApi.sizeColumnsToFit();
      this.gridApi.setRowData(this.dataGrid);
      this.cdr.detectChanges();
    });
  }

  openModal(template: TemplateRef<any>, isMe: boolean) {
    this.scorePopup = '';
    this.isSubmitImport = false;
    this.isMe = isMe;
    this.resultImport = null;
    this.removeFile();
    this.modalRef = this.modalService.show(
      template,
      {class: 'modal-center'}
    );
    const interval = setInterval(() => {
      const el = document.getElementById('cancelBtn');
      if (el) {
        el.focus();
        clearInterval(interval);
      }
    }, 200);
  }

  disableIsMe() {
    if (this.rowCheckedList.length) {
      return !(this.rowCheckedList.length === 1 && this.rowCheckedList[0].status === 'Chưa đánh giá'
        && this.lStorage.login.toUpperCase() === this.rowCheckedList[0].teacherCode.toUpperCase());
    }
    return true;
  }

  disableNotMe() {
    if (this.rowCheckedList.length) {
      return !(this.rowCheckedList.length === 1 && this.rowCheckedList[0].status === 'Tự đánh giá'
        && this.lStorage.login.toUpperCase() !== this.rowCheckedList[0].teacherCode.toUpperCase());
    }
    return true;
  }

  disableApprove() {
    if (this.rowCheckedList.length > 0) {
      const data = this.rowCheckedList.find(it => this.lStorage.login.toUpperCase() === it.teacherCode.toUpperCase() || it.status !== 'Quản lý đã đánh giá');
      if (data) {
        return true;
      }
      return false;
    }
    return true;
  }

  openModalApprove(template: TemplateRef<any>) {
    if (this.rowCheckedList)

      this.modalRefApprove = this.modalService.show(
        template,
        Object.assign({}, {class: 'center modal-dialog-custom'})
      );

    const interval = setInterval(() => {
      const el = document.getElementById('cancelBtnApprove');
      if (el) {
        el.focus();
        clearInterval(interval);
      }
    }, 200);
  }

  removeFile() {
    this.resultImport = null;
    this.file = null;
    this.fileName = null;
    this.fileSize = null;
  }

  exportTemplate() {
    const path = {
      data: {
        pathFile: this.rowCheckedList[0] ? this.rowCheckedList[0].pathFile : null
      }
    };
    const fileName = `Danhgialaodong_${this.years}.doc`;
    this.isMe ? this.teacherService.fileSelfAssessmentTemplate(`teacher-rating/sample-file`, fileName)
      : this.downloadFileSelfAssessment(path);
  }

  upload(file) {

    this.fileName = file[0].name;
    this.fileSize = file[0].size;

    if (file.length === 0) {
      this.toatr.error(this.translate.instant('TEACHER_RATING.IMPORT.NOTIFY.BLANK'));
      this.isShowImport = true;
      return;
    }
    // if (!(file[0].name.includes('.doc'))) {
    //   this.toatr.error(this.translate.instant('TEACHER_RATING.IMPORT.NOTIFY.FORMAT'));
    //   this.isShowImport = true;
    //   return;
    // }

    const formData = new FormData();

    formData.append('file', file[0]);
    this.formData = formData;
    this.isShowImport = false;
  }

  // exportDataErrors() {
  //   if (this.resultImport === undefined) {
  //     this.toatr.error('Chưa có file data lỗi, cần import trước')
  //     return;
  //   }
  //   if (this.resultImport.listErrors.length > 0) {
  //     this.teacherService.exportDataErrors(this.resultImport.listErrors);
  //   } else {
  //     this.toatr.warning('Không có data lỗi!')
  //   }
  // }
  importFile() {
  this.isSubmitImport = true;
    if (!this.isMe && !this.scorePopup) {
      return;
    }
    if (this.isMe ? this.disableIsMe() : this.disableNotMe()) {
      this.toatr.error(this.translate.instant('TEACHER_RATING.IMPORT.NOTIFY.NOT'));
      return;
    }
    if (!this.fileName) {
      this.toatr.error(this.isMe ? 'Vui lòng upload file tự đánh giá!' : 'Vui lòng upload file đánh giá!');
      return;
    }
    if(this.fileSize/1024/1024 > 5 ){
      this.toatr.error('File upload phải có dung lượng nhỏ hơn 5Mb');
      return;
    }
    this.teacherService.uploadTeacherRatings(this.formData, this.isMe ? `teacher-rating/${this.rowCheckedList[0].teacherCode}/self-rate/${this.years}` : `teacher-rating/${this.rowCheckedList[0].teacherCode}/rate-management`, this.isMe ? null : this.scorePopup, this.years).subscribe((res: any) => {
      this.modalRef.hide();
      this.resultImport = res;
      this.file = null;
      this.toatr.success(this.translate.instant(this.isMe ?  'TEACHER_RATING.IMPORT.IS_ME.SUCCESS' : 'TEACHER_RATING.IMPORT.NOT_ME.SUCCESS'));
      this.searchEvent(1);
    }, err => {
      this.toatr.error(this.translate.instant('TEACHER_RATING.IMPORT.ERROR'));
    });
  }

  approve() {
    if (this.disableApprove()) {
      this.toatr.error(this.translate.instant('TEACHER_RATING.IMPORT.NOTIFY.NOT'));
      return;
    }
    this.teacherService.approve(this.rowCheckedList).subscribe((res: any) => {

      this.toatr.success(this.translate.instant('TEACHER_RATING.IMPORT.APPROVE.SUCCESS'));
      this.searchEvent(1);
      this.modalRefApprove.hide();
    }, err => {
      this.toatr.error(this.translate.instant('TEACHER_RATING.IMPORT.ERROR'));
    });
  }

  checkRole() {
    const roleNormal = [this.roleParam.GV_BM, this.roleParam.GV_CN];
    const roleTK = [this.roleParam.TK];
    const roleADMIN = [this.roleParam.HP, this.roleParam.HT, this.roleParam.ADMIN];

    const role = this.lStorage.authorities;
    if (role.length > 0) {

      if (roleADMIN.some(value => role.includes(value))) {
        return 2
      }

      if (roleTK.some(value => role.includes(value))) {
        return 1
      }

      if (roleNormal.some(value => role.includes(value))) {
        return 0
      }
      
    }
    return null;
  }
}
