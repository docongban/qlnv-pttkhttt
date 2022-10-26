import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SelectableSettings} from '@progress/kendo-angular-grid';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {ConfigPointLockService} from '../../../../core/service/service-model/config-point-lock.service';
import {AddConfigComponent} from './add-config/add-config.component';
import {ActionConfLockPointComponent} from './action-conf-lock-point/action-conf-lock-point.component';
import {ConfigNotifyComponent} from './config-notify/config-notify.component';
import {ClassroomService} from '../../../../core/service/service-model/classroom.service';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {formatDate} from '@angular/common';
import {CommonServiceService} from '../../../../core/service/utils/common-service.service';
import {Overlay} from '@angular/cdk/overlay';
import * as moment from 'moment';

@Component({
  selector: 'kt-config-point-lock',
  templateUrl: './config-point-lock.component.html',
  styleUrls: ['./config-point-lock.component.scss']
})
export class ConfigPointLockComponent implements OnInit {
  rowData;
  gridApi;
  gridColumnApi;
  headerHeight = 56;
  rowHeight=50;

  columnDefs = [
    {
      headerName: '',
      field: 'refunded',
      aggFunc: 'sum',
      minWidth:40,
      maxWidth:40,
      headerCheckboxSelection: true,
      checkboxSelection: true,

    },
    {   headerName: 'STT',
      field: 'make',
      valueGetter: param => {
        return param.node.rowIndex + (((this._page - 1) * this._pageSize) + 1)
      },
      minWidth:90,
      maxWidth:90,
      cellStyle:{
        'font-weight': '500',
        'font-size': '12px',
        color: '#101840',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
      },

    },
    {   headerName: 'KIỂU MÔN',
      field: 'typeSubjectName',
      cellStyle:{
        'font-weight': '500',
        'font-size': '12px',
        color: '#101840',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden'
      },
      minWidth:140,
      maxWidth:150,
      tooltipField: 'typeSubjectName',
      suppressMovable: true,

    },
    { headerName: 'CỘT ĐIỂM',field:'scoreName',
      cellStyle:{
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden'
      },
      minWidth:160,
      tooltipField: 'scoreName',
      suppressMovable: true,

    },
    { headerName: 'NGÀY KHÓA NHẬP',field:'entryLockDateFormat',
      cellStyle:{
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden'
      },
      minWidth: 160,
      tooltipField: 'entryLockDateFormat',
      suppressMovable: true,
    },
    { headerName: 'TRẠNG THÁI',field:'statusName',
      cellStyle:param => {
        if (param.value === 'Khóa') {
          return{
            'font-weight': '600',
            'font-size': '12px',
            'align-items': 'center',
            color: '#D14343',
            display: 'flex',
            'justify-content': 'center',
            transform: 'translateX(-26px)',
          }
        }
        return{
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          'justify-content': 'center',
          transform: 'translateX(-26px)',
        }
      },
      minWidth: 130,
      maxWidth: 130,
      tooltipField: 'statusName',
      suppressMovable: true,
    },
    { headerName: 'NGƯỜI CẬP NHẬT',field:'userUpdate',
      cellStyle:{
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#696F8C',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden'
      },
      minWidth: 150,
      tooltipField: 'userUpdate',
      suppressMovable: true,
    },
    { headerName: 'NGÀY CẬP NHẬT',field:'updatedDateFormat',
      cellStyle:{
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#696F8C',
        display: 'flex'
      },
      minWidth:140,
      suppressMovable: true,
      tooltipField: 'updatedDateFormat',
    },
    { headerName: '',
      field:'',
      cellRendererFramework: ActionConfLockPointComponent,
      minWidth:30,
      maxWidth:30,
      cellStyle:{
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#696F8C',
        'justify-content': 'center'
      },
      suppressMovable: true,
    },
  ];

  formSearch: FormGroup;
  years = '2021-2022';
  dataSearch: any ={};
  gradeList: any = [];
  semesterList: any = [];
  listConfEntryKeyDetail: any = [];
  _pageSize = 10;
  _page = 1;
  totalPage = 0;
  first;
  last;
  totalRecord = 0;
  public pageSizes: Array<number> = [10,20];
  selectTableSetting: SelectableSettings = {
    checkboxOnly: true
  }
  rowCheckedList: any = [];
  subscription: Subscription;
  // paging
  rangeWithDots = [];
  constructor(private configPointLockService: ConfigPointLockService,
              private fb: FormBuilder,
              private matDialog: MatDialog,
              private toastr: ToastrService,
              private classroomService:ClassroomService,
              private changeDetectorRef: ChangeDetectorRef,
              private commonService: CommonServiceService,
              private overlay:Overlay) {
  }

  ngOnInit(): void {
    this.buildFormSearch();
    this.getCurrentYear();

    this.listeningIsLock();
    this.listeningIsUnlock();
    this.listeningIsUpdate();
  }

  getCurrentYear() {
    this.subscription = this.classroomService.yearCurrent$.subscribe(res => {
      this.years = res;
      this.getListSemester();
    });
  }

  listeningIsLock() {
    this.subscription = this.configPointLockService.lockConf$.subscribe(val => {
      if (val === true) {
        this.loadGridView();
      }
    });
  }

  listeningIsUnlock() {
    this.subscription = this.configPointLockService.unlockConf$.subscribe(val => {
      if (val === true) {
        this.loadGridView();
      }
    });
  }

  listeningIsUpdate() {
    this.subscription = this.configPointLockService.updateConf$.subscribe(val => {
      if (val === true) {
        this.loadGridView();
      }
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  getListSemester() {
    console.log(this.years);
    if (this.years === '') {
      return;
    }
    this.configPointLockService.getListSemesterOfSchoolYear(this.years).subscribe(resAPI => {
      if (resAPI.length === 0) {
        return;
      }
      this.formSearch.get('semester').setValue(resAPI.semesterNow.semester);
      this.semesterList = resAPI.schoolYearList;
      console.log(resAPI);
      this.getListGradeLevel();
    });
  }

  getListGradeLevel() {
    this.configPointLockService.getListGradeLevelToSearch().subscribe(resAPI => {
      this.formSearch.get('gradeLevel').setValue(resAPI[0].code);
      this.gradeList = resAPI;
      console.log(resAPI);
    });
  }

  loadGridView() {
    const semester = this.formSearch.get('semester').value;
    const gradeCode = this.formSearch.get('gradeLevel').value;
    if (semester === '' || gradeCode === '') {
      return;
    }
    this.notChose();
    this.configPointLockService.tranferSemester(semester);
    this.checkIsConfig();
    this.configPointLockService.transferGradeLevel(gradeCode);
    this.configPointLockService.loadGridView(semester, gradeCode, this.years, this._page, this._pageSize).subscribe(resAPI => {
      let listData = [];
      console.log(resAPI);
      resAPI.content.forEach(item => {
        if (item.id === null) {
          item = {...item,
            entryLockDateFormat: '',
          };
        }
        if (item.updatedDate !== null && item.id !== null) {
          item = {...item,
            entryLockDateFormat: this.formatDate(item.entryLockDate),
            updatedDateFormat: this.formatDate(item.updatedDate)
          };
        }
        if(item.updatedDate === null && item.id !==null){
          item = {...item,
            entryLockDateFormat: this.formatDate(item.entryLockDate),
          };
        }
        listData = [...listData, item];
      });
      this.listConfEntryKeyDetail = listData;
      this.totalPage = resAPI.totalPages;
      this.rangeWithDots = this.commonService.pagination(
        this._page,
        this.totalPage
      );
      this.totalRecord = resAPI.totalElements;
      this.first = ((this._page - 1) * this._pageSize) +1;
      this.last = this.first + listData.length -1;
      this.gridApi.setRowData(this.listConfEntryKeyDetail);
      this.changeDetectorRef.detectChanges();
    });
  }

  buildFormSearch() {
    this.formSearch = this.fb.group({
      semester: '',
      gradeLevel: '',
    })
    this.formSearch.valueChanges.subscribe(val => this.changeForm(val));
  }

  changeForm(val) {
    this._page = 1;
    this.loadGridView();
    this.configPointLockService.tranferSemester(val.semester);
    this.configPointLockService.transferGradeLevel(val.gradeLevel);
  }

  openAddDialog(action:string) {
    const dataConfig: any = {};
    dataConfig.years = this.years;
    dataConfig.gradeList = this.gradeList;
    dataConfig.semesterList = this.semesterList;
    dataConfig.gradeCurrent = this.formSearch.get('gradeLevel').value;
    dataConfig.semesterCurrent = this.formSearch.get('semester').value;
    this.matDialog.open(AddConfigComponent, {
      data: dataConfig,
      disableClose: true,
      hasBackdrop: true,
      width: '820px',
      autoFocus: false,
      scrollStrategy: this.overlay.scrollStrategies.noop()
    }).afterClosed().subscribe(res => {
      if (res.event === 'add') {
        console.log(res.data);
        this.getListSemester();
        // this.getListGradeLevel();
        this.toastr.success(res.data.message);
      }
    });

  }

  openConfNotify() {
    const dataConfigNotify:any = {};
    dataConfigNotify.years = this.years;
    dataConfigNotify.semester = this.formSearch.get('semester').value;
    dataConfigNotify.gradeCode = this.formSearch.get('gradeLevel').value;
    this.matDialog.open(ConfigNotifyComponent,{
      data:dataConfigNotify,
      disableClose: true,
      hasBackdrop: true,
      width: '466px',
      scrollStrategy: this.overlay.scrollStrategies.noop()
    }).afterClosed().subscribe(res => {
      if (res.event === 'confirm') {
        this.configPointLockService.configNotify(res.data).subscribe(resAPI => {
          if (resAPI.status === 'OK') {
            this.toastr.success(resAPI.message);
            this.loadGridView();
          }else{
            this.toastr.error(resAPI.message);
          }
        });
      }
    });
  }

  unlockList() {
    if (this.rowCheckedList === null || this.rowCheckedList === undefined || this.rowCheckedList?.length === 0) {
      this.toastr.error('Vui lòng chọn cấu hình muốn mở khóa');
      return;
    }
    let check = true;
    let checkIsConf = true;
    this.rowCheckedList.forEach(item => {
      if (item.id === null) {
        checkIsConf = false;
        return;
      }
      if (item.status === 1) {
        check = false;
        return;
      }
    });
    if (!checkIsConf) {
      this.toastr.error('Mở khoá không thành công - tồn tại bản ghi ở trạng thái chưa cấu hình khoá nhập điểm');
      return;
    }
    if (!check) {
      this.toastr.error('Mở khoá không thành công - tồn tại bản ghi đang ở trạng thái Mở khoá ');
      return;
    }

    const dataConfirm = {title: 'XÁC NHẬN MỞ KHÓA', message: 'Bạn có chắc chắn muốn mở khoá nhập điểm cho cột điểm đã chọn?'};
    this.matDialog.open(ConfirmDialogComponent, {
      data: dataConfirm,
      disableClose: true,
      hasBackdrop: true,
      width: '418px',
      scrollStrategy: this.overlay.scrollStrategies.noop()
    }).afterClosed().subscribe(res => {
      if (res.event === 'confirm') {
        this.configPointLockService.unlockList(this.rowCheckedList).subscribe(resAPI => {
          this.rowCheckedList = [];
          if (resAPI.status === 'OK') {
            this.toastr.success(resAPI.message);
            this.loadGridView();
          }else {
            this.toastr.error(resAPI.message);
          }
        });
      }
    });
  }

  lockList() {
    if (this.rowCheckedList === null || this.rowCheckedList === undefined || this.rowCheckedList?.length === 0) {
      this.toastr.error('Vui lòng chọn cấu hình muốn khóa');
      return;
    }
    let check = true;
    let checkIsConf = true;
    this.rowCheckedList.forEach(item => {
      if(item.id === null){
        checkIsConf = false;
        return;
      }
      if (item.status === 0) {
        check = false;
        return;
      }
    });
    if (!checkIsConf) {
      this.toastr.error('Khoá không thành công - tồn tại bản ghi ở trạng thái chưa cấu hình khoá nhập điểm ');
      return;
    }
    if (!check) {
      this.toastr.error('Khoá không thành công - tồn tại bản ghi đang ở trạng thái Khoá');
      return;
    }
    this.rowCheckedList.forEach(item => {
      const entryLockDate = formatDate(new Date(item.entryLockDate),'yyyy/MM/dd', 'en');
      const today = formatDate(new Date(), 'yyyy/MM/dd', 'en');
      console.log(entryLockDate);
      if (today < entryLockDate) {
        check = false;
        return;
      }
    });
    if (!check) {
      this.toastr.error('Khoá không thành công , Ngày hiện tại nhỏ hơn Ngày khoá nhập');
      return;
    }
    const dataConfirm = {title: 'XÁC NHẬN KHÓA', message: 'Bạn có chắc chắn muốn khoá nhập điểm cho cột điểm đã chọn?'};
    this.matDialog.open(ConfirmDialogComponent, {
      data: dataConfirm,
      disableClose: true,
      hasBackdrop: true,
      width: '418px',
      scrollStrategy: this.overlay.scrollStrategies.noop()
    }).afterClosed().subscribe(res => {
      if (res.event === 'confirm') {
        this.configPointLockService.lockList(this.rowCheckedList).subscribe(resAPI => {
          this.rowCheckedList = [];
          if (resAPI.status === 'OK') {
            this.toastr.success(resAPI.message);
            this.loadGridView();
          }else {
            this.toastr.error(resAPI.message);
          }
        });
      }
    });
  }

  // Get row selected to transfer classroom to next year
  onRowSelected(event) {
    const listRowSelected = [];
    this.gridApi.forEachNode(row => {
      if (row.isSelected()) {
        listRowSelected.push(row.data);
      }
    });
    this.rowCheckedList = listRowSelected;
  }

  notChose() {
    this.gridApi.forEachNode(row => {
      if (row.isSelected()) {
        row.setSelected(false);
      }
    });
  }

  // ==============================Paging=====================================

  page(page: number): void {
    this._page = page
    this.loadGridView();
    console.log(this._page);
  }

  prev(): void {
    this._page--
    if (this._page < 1) {
      this._page = 1
      return
    }
    console.log(this._page);

    this.loadGridView();
  }

  next(): void {
    this._page++
    if (this._page > this.totalPage) {
      this._page = this.totalPage;
      return;
    }
    console.log(this._page);
    this.loadGridView();
    // this.page(this.currentPage)
  }

  counter(i: number) {
    return new Array(i);
  }


  // ================Format date: dd/mm/yyyy ========================
  formatDate(originalDate: string): string {
    const date = new Date(originalDate)
    return `${('0'+date.getDate()).slice(-2)}/${('0'+(date.getMonth()+1)).slice(-2)}/${date.getFullYear()}`
  }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
  }

  checkIsConfig() {
    const semester = this.formSearch.get('semester').value;
    const grade = this.formSearch.get('gradeLevel').value;
    this.configPointLockService.checkIsConfig(this.years, semester, grade).subscribe(resAPI => {
      if (!resAPI.data) {
        this.toastr.warning('Khối chưa được cấu hình khoá nhập điểm');
      }
      this.configPointLockService.changeIsConfig(resAPI.data);
    });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  exportTest() {
    const dataTest ={
      gradeLevel:"K9",
      semester:1,
      schoolYear:"2021-2022",
      classCode:"L9A1",
      applyDate:"2021-08-25"
    }
    // const dataTest = {
    //   classCode: 'L6D154',
    //   schoolYear: '2021-2022',
    //   semester: 1,
    //   subjectCode: 'VATLY07'
    // }
    // {
    //   "classCode": "L6D154",
    //   "schoolYear": "2021-2022",
    //   "semester": 1,
    //   "subjectCode": "HH"
    // }
    this.configPointLockService.testExport(dataTest).subscribe(res => {
      const file = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const fileURL = URL.createObjectURL(file);
      // window.open(fileURL, '_blank');
      const anchor = document.createElement('a');
      anchor.download = `DS_lophoc_${moment().format('DDMMYYYY').toString()}`;
      anchor.href = fileURL;
      anchor.click();
    });
  }
}
