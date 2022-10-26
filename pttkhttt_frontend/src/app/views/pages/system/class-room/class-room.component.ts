import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ClassroomService} from '../../../../core/service/service-model/classroom.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SelectableSettings} from '@progress/kendo-angular-grid';
import {MatDialog} from '@angular/material/dialog';
import {UpdateClassComponent} from './update-class/update-class.component';
import {SelectActionComponent} from './select-action/select-action.component';
import {ImportFileComponent} from './import-file/import-file.component';
import {TransferClassroomComponent} from './transfer-classroom/transfer-classroom.component';
import {ToastrService} from 'ngx-toastr';
import {Subscription} from 'rxjs';
import * as moment from 'moment';
import {GridOptions, ICellRendererParams} from 'ag-grid-community';
import {TooltipComponent} from './tooltip/tooltip.component';
import {CommonServiceService} from '../../../../core/service/utils/common-service.service';
import {TranslateService} from '@ngx-translate/core';
import {NavigateStudentComponent} from './navigate-student/navigate-student.component';
import {NavigateSubjectComponent} from './navigate-subject/navigate-subject.component';
import {NavigateSchedualComponent} from './navigate-schedual/navigate-schedual.component';

@Component({
  selector: 'kt-class-room',
  templateUrl: './class-room.component.html',
  styleUrls: ['./class-room.component.scss']
})
export class ClassRoomComponent implements OnInit {

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
      suppressMovable: true,
      pinned: 'left',
      lockPosition: true,
    },
    {   headerName: 'STT',
      field: 'make',
      valueGetter: param => {
        return param.node.rowIndex + (((this._page - 1) * this._pageSize) + 1)
      },
      minWidth:80,
      cellStyle:{
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        justify: 'space-between',
        color: '#101840',
        display: 'flex',
      },
      suppressMovable: true,
      pinned: 'left',
      lockPosition: true,
    },
    {   headerName: 'TÊN KHỐI',
      field: 'gradeLevelName',
      cellStyle:{
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
        'border-right': 'none'
      },
      minWidth:100,
      tooltipField: 'gradeLevelName',
      suppressMovable: true,
      pinned: 'left',
      lockPosition: true,
    },
    { headerName: 'KHOA/BAN',field:'deptName',
      cellStyle:{
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
        'border-right': 'none'
      },
      minWidth:200,
      tooltipField: 'deptName',
      suppressMovable: true,
      pinned: 'left',
      lockPosition: true,
    },
    { headerName: 'MÃ LỚP',field:'code',
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
      minWidth: 120,
      tooltipField: 'code',
      suppressMovable: true,
      pinned: 'left',
      lockPosition: true,
    },
    { headerName: 'TÊN LỚP',field:'name',
      cellStyle:{
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
        'border-right': 'none'
      },
      minWidth: 120,
      tooltipField: 'name',
      suppressMovable: true,
      lockPosition: true,
      pinned: 'left',
      lockPinned: true
    },
    { headerName: 'MÔN CHUYÊN',field:'specializeName',
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
      minWidth: 150,
      tooltipField: 'specializeName',
      // cellRendererFramework: TooltipComponent,
      suppressMovable: true,
    },
    { headerName: 'GIÁO VIÊN CHỦ NHIỆM',field:'teacherName',
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
      minWidth:200,
      tooltipField: 'teacherName',
      sortable: true,
      resizable: true,
      suppressMovable: true,
    },
    { headerName: '',
      field:'',
      cellRendererFramework: NavigateStudentComponent,
      cellStyle:{
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        display: 'flex',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden'
      },
      minWidth:100,
      suppressMovable: true,
    },
    { headerName: '',
      field:'',
      cellRendererFramework: NavigateSubjectComponent,
      cellStyle:{
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        display: 'flex',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden'
      },
      minWidth:100,
      suppressMovable: true,
    },
    { headerName: '',
      field:'',
      cellRendererFramework: NavigateSchedualComponent,
      cellStyle:{
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        display: 'flex',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden'
      },
      minWidth:100,
      suppressMovable: true,
    },
    { headerName: '',
      field:'',
      cellRendererFramework: SelectActionComponent,
      minWidth:40,
      maxWidth:40,
      cellStyle:{
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#696F8C',
      },
      suppressMovable: true,
    },
  ];

  formSearch: FormGroup;
  deptId: any;
  years;
  dataSearch: any ={};
  deptList: any = [];
  gradeList: any = [];
  classroomList: any[] = [];
  _pageSize = 10;
  _page = 1;
  public pageSizes: Array<number> = [10,20];
  selectTableSetting: SelectableSettings = {
    checkboxOnly: true
  }
  rowCheckedList: any = [];
  subscription: Subscription;

  gradeId: any;

  // paging
  totalClassroom = 0;
  first = 1;
  last = 10;
  total = 0;
  totalPage = 0;
  rangeWithDots = [];

  constructor(private classroomService: ClassroomService,
              private fb: FormBuilder,
              private matDialog: MatDialog,
              private toastr: ToastrService,
              private changeDetectorRef: ChangeDetectorRef,
              private commonService: CommonServiceService,
              private translate: TranslateService,) {
  }

  ngOnInit(): void {
    this.buildFormSearch();
    this.listeningCurrentYear();
    this.listeningIsUpdate();
    this.listeningIsDelete();
  }

  listeningCurrentYear() {
    this.subscription = this.classroomService.yearCurrent$.subscribe(val => {
      console.log('this.years',val);
      this.years = val;
      this.deptId = null;
      this.gradeId = null;
      this._page = 1;
      this.formSearch.get('name').setValue('');
      this.findClassroom(this._page);
      this.getAllDept();
    });
  }

  onGridReady(params) {
    console.log(params);
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    setTimeout(()=>{this.gridApi.sizeColumnsToFit()}, 50);
  }

  onSelectionChanged() {
    const selectedRows = this.gridApi.getSelectedRows();
    console.log(selectedRows)
  }

  listeningIsUpdate() {
    this.subscription = this.classroomService.update$.subscribe(val => {
      if (val === true) {
        console.log('thay doi roi ne');
        this.onSearch();
      }
    });
  }

  listeningIsDelete() {
    this.subscription = this.classroomService.delete$.subscribe(val => {
      if (val === true) {
        console.log('xoa roi ne');
        this.findClassroom(this._page);
      }
    });
  }

  // Load page and find by multi field
  onSearch() {
    this.dataSearch.years = this.years;
    console.log(this.dataSearch);
    this.classroomService.onSearch(this.dataSearch, this._page, this._pageSize).subscribe(res => {
      this.classroomList = res.classRoomDTOList;
      this.gradeList = res.gradeLevelList;
      // Paging
      this.totalClassroom = res.totalRecord;
      this.first = ((this._page - 1) * this._pageSize) +1;
      this.last = this.first + this.classroomList.length -1;
      if (this.totalClassroom % this._pageSize === 0) {
        this.totalPage =  Math.floor(this.totalClassroom / this._pageSize);
        this.rangeWithDots = this.commonService.pagination(
          this._page,
          this.totalPage
        );
      }else{
        this.totalPage =  Math.floor(this.totalClassroom / this._pageSize) + 1;
        this.rangeWithDots = this.commonService.pagination(
          this._page,
          this.totalPage
        );
      }
      console.log('onsearch', res);
      this.gridApi.setRowData(this.classroomList);
    });
  }

  buildFormSearch() {
    this.formSearch = this.fb.group({
      deptId: '',
      name: ''
    })
  }

  getAllDept() {
    const dept: any = {};
    dept.name = '';
    this.classroomService.autoSearchDept(dept).subscribe(res => {
      let list = [];
      res.forEach(item => {
        let customItem = {};
        customItem = {...item, deptIdName: item.code + ' - ' + item.name};
        list = [...list, customItem];
      });
      this.deptList = list;
      console.log(this.deptList);
    });
  }

  openAddDialog(action:string) {
    const dataCLass: any = {};
    dataCLass.action = action;
    dataCLass.gradeList = this.gradeList;
    dataCLass.years = this.years;
    this.matDialog.open(UpdateClassComponent, {
      data: dataCLass,
      disableClose: true,
      hasBackdrop: true,
      width: '446px',
      autoFocus: false
    }).afterClosed().subscribe(res => {
      if (res.event === 'add') {
        console.log(res.data);
        this.gradeId = null;
        this.deptId = null;
        this.formSearch.get('name').setValue('');
        this.findClassroom(1);
        this.toastr.success(res.data.message);
      }
    });
  }

  openImportDialog() {
    const dataImport:any = {};
    dataImport.years = this.years;
    this.matDialog.open(ImportFileComponent, {
      data: dataImport,
      disableClose: true,
      hasBackdrop: true,
      width: '446px',
      autoFocus: false
    }).afterClosed().subscribe(res => {
      console.log('dong import');
      this.findClassroom(1);
    });
  }

  openTransferClass() {
    const year1 = this.years.split('-');
    const nextThisYear1:number = +year1[0] + 1;
    const nextThisYear2:number = +year1[1] + 1;
    const nextYears: string = nextThisYear1 + '-' + nextThisYear2;
    const dataTransfer: any = {};
    dataTransfer.years = this.years;
    dataTransfer.nextYear = nextYears;

    this.classroomService.preTransferClassroom(this.rowCheckedList, this.years, nextYears).subscribe(responseAPI => {
      const obj: any = responseAPI;
      if (obj.status === 'BAD_REQUEST') {
        this.toastr.error(obj.message);
        return;
      }else if (obj.status === 'OK') {
        this.matDialog.open(TransferClassroomComponent, {
          data:dataTransfer,
          disableClose: true,
          hasBackdrop: true,
          width: '446px'
        }).afterClosed().subscribe(res => {
          if (res.event === 'confirm') {
            // Call API
            console.log(this.rowCheckedList);
            this.classroomService.transferClassroom(this.rowCheckedList, this.years, nextYears).subscribe(response => {
              console.log(response);
              const objres: any = response;
              if (objres.status === 'OK') {
                this.toastr.success(objres.message);
              }else if (objres.status === 'BAD_REQUEST') {
                this.toastr.error(objres.message);
              }
            });
          }
        });
      }
    });
  }

  findClassroom(page:number) {
    this._page = page;
    // tslint:disable-next-line:forin
    for(const controlName in this.formSearch.controls){
      // @ts-ignore
      this.dataSearch[controlName] = this.formSearch.get(controlName)?.value;
    }
    this.dataSearch.name = this.formSearch.get('name').value.trim();
    this.dataSearch.years = this.years;
    this.dataSearch.gradeLevel = this.gradeId;
    this.dataSearch.deptId = this.deptId;
    this.classroomService.onSearch(this.dataSearch, page, this._pageSize).subscribe(res => {
      console.log('tim kiem:',res);
      this.classroomList = res.classRoomDTOList;
      this.gradeList = res.gradeLevelList;
      // this.deptList = res.departmentList;
      this.totalClassroom = res.totalRecord;
      this.first = ((page - 1) * this._pageSize) +1;
      this.last = this.first + this.classroomList.length -1;
      if (this.totalClassroom % this._pageSize === 0) {
        this.totalPage =  Math.floor(this.totalClassroom / this._pageSize);
        this.rangeWithDots = this.commonService.pagination(
          this._page,
          this.totalPage
        );
      }else{
        this.totalPage =  Math.floor(this.totalClassroom / this._pageSize) + 1;
        this.rangeWithDots = this.commonService.pagination(
          this._page,
          this.totalPage
        );
      }
      console.log(this.classroomList.length);
      this.gridApi.setRowData(this.classroomList);
      this.changeDetectorRef.detectChanges();
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

  // =================================export ================================
  export() {
    console.log(this.dataSearch);
    this.classroomService.export(this.dataSearch).subscribe((responseMessage) => {
      const file = new Blob([responseMessage], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const fileURL = URL.createObjectURL(file);
      const anchor = document.createElement('a');
      anchor.download = `DS_lophoc_${moment().format('DDMMYYYY').toString()}`;
      anchor.href = fileURL;
      anchor.click();
    });
  }

  // ==============================Paging=====================================

  page(page: number): void {
    this._page = page
    this.findClassroom(page);
    console.log(this._page);
  }

  prev(): void {
    this._page--
    if (this._page < 1) {
      this._page = 1
      return
    }
    console.log(this._page);

    this.findClassroom(this._page);
  }

  next(): void {
    this._page++
    if (this._page > this.totalPage) {
      this._page = this.totalPage;
      return;
    }
    console.log(this._page);
    this.findClassroom(this._page);
    // this.page(this.currentPage)
  }

  counter(i: number) {
    return new Array(i);
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
    const toolTipString = 'Hello World'
    return { toolTipString, lineBreak }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
  }
}

