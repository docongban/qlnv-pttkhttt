// import { DownloadButtonRenderComponent } from './../../official-letter-document/download-button-render/download-button-render.component';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {NgbCalendar, NgbDate, NgbDateParserFormatter, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';

import {CommonServiceService} from 'src/app/core/service/utils/common-service.service';
import {GradeLevelService} from 'src/app/core/service/service-model/grade-level.service';
import {ClassroomService} from 'src/app/core/service/service-model/classroom.service';
import {ManageContactService} from 'src/app/core/service/service-model/manage-contact.service';

import {MatDialog} from '@angular/material/dialog';
import * as moment from 'moment';
// import {NO_ROW_GRID_TEMPLATE} from "../../../../../helpers/constants";
import {DatePipe, formatDate} from "@angular/common";
import {PackageManagementService} from "../../../../core/service/service-model/package-management.service";
import {NgSelectComponent} from "@ng-select/ng-select";
import {NO_ROW_GRID_TEMPLATE} from "../../../../helpers/constants";
import {TranslateService} from "@ngx-translate/core";
import {Breadcrumb, SubheaderService} from "../../../../core/_base/layout/services/subheader.service";

@Component({
  selector: 'kt-package-management',
  templateUrl: './package-management.component.html',
  styleUrls: ['./package-management.component.scss'],
})
export class PackageManagementComponent implements OnInit {

  breadCrumbs: Breadcrumb[] = [
    {
      title: this.translate.instant('MENU.MANAGER_REGISTER.TITLE'),
      page: '/system/package-management',
    }
  ]

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private matDialog: MatDialog,
    private modalService: BsModalService,
    private changeDetectorRef: ChangeDetectorRef,
    private commonService: CommonServiceService,
    private gradeLevelService: GradeLevelService,
    private classRoomService: ClassroomService,
    private manageContactService: ManageContactService,
    private toast: ToastrService,
    private packageManagementService : PackageManagementService,
    private datePipe: DatePipe,
    private translate: TranslateService,
    private subheaderService: SubheaderService,
    private calendar: NgbCalendar,
    // private auth: AuthService,
  ) {
    this.columnDefs = [
      {
        headerName: '',
        minWidth: 52,
        maxWidth: 52,
        headerClass: 'custom-merge-header1',
        suppressMovable: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        pinned:'left',
        lockPosition:'true',
        // cellClass: param => {
        //   if (param.rowIndex % 2 === 1) {
        //     return 'normal-col';
        //   }else return 'normal-col2'
        // },
      },
      {
        headerName: this.translate.instant(`MANAGER_REGISTER.NUMBER`),
        headerTooltip: this.translate.instant(`MANAGER_REGISTER.NUMBER`),
        pinned: 'left',
        lockPosition:'true',
        field: 'id',
        valueGetter: param => {
          return param.node.rowIndex + (((this.currentPage - 1) * this.perPage) + 1)
        },
        minWidth: 48,
        maxWidth: 48,
        headerClass: 'center unPadding custom-merge-header1',
        suppressMovable: true,
        cellStyle: {
          ...this.cellStyle,
          'justify-content': 'center',

        },
        // cellClass: param => {
        //   if (param.rowIndex % 2 === 1) {
        //     return 'normal-col';
        //   }else return 'normal-col2'
        // },
      },
      {
        headerComponentParams :{
          template:'<span style="width:100%;"><div style=" ' +
              'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
              'text-transform: uppercase; max-width:100%;">' +
              `${this.translate.instant(`MANAGER_REGISTER.STUDENT_CODE`)}` +
              '</div>'+
              '</span>',
        },
        headerClass: 'custom-merge-header1 fontTitle',
        headerTooltip:  this.translate.instant(`MANAGER_REGISTER.STUDENT_CODE`),
        field: 'studentCode',
        tooltipField: 'studentCode',
        pinned: 'left',
        lockPosition:'true',
        minWidth: 100,
        // maxWidth: 100,
        suppressMovable: true,
        resizable :true,
        cellStyle: {
          ...this.cellStyle,
          color: '#3366FF',
        },
        cellRenderer: (params) => this.limitStringCellValue(params),
        // cellClass: param => {
        //   if (param.rowIndex % 2 === 1) {
        //     return 'normal-col';
        //   }else return 'normal-col2'
        // },
      },
      {
        headerComponentParams :{
          template:'<span style="width:100%;"><div style=" ' +
              'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
              'text-transform: uppercase; max-width:100%;">' +
              `${this.translate.instant(`MANAGER_REGISTER.STUDENT_NAME`)}` +
              '</div>'+
              '</span>',
        },
        headerClass: 'custom-merge-header1 fontTitle',
        headerTooltip: this.translate.instant(`MANAGER_REGISTER.STUDENT_NAME`),
        field: 'studentName',
        pinned: 'left',
        lockPosition:'true',
        tooltipField: 'studentName',
        minWidth: 120,
        // maxWidth: 120,
        suppressMovable: true,
        resizable :true,
        cellStyle: {
          ...this.cellStyle,
          // 'text-align':'center',
        },
        cellRenderer: (params) => this.limitStringCellValue(params),
        // cellClass: param => {
        //   if (param.rowIndex % 2 === 1) {
        //     return 'normal-col';
        //   }else return 'normal-col2'
        // },
      },
      {
        headerComponentParams :{
          template:'<span style="width:100%;"><div style=" ' +
              'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
              'text-transform: uppercase; max-width:100%;">' +
              `${this.translate.instant(`MANAGER_REGISTER.SCHOOL`)}` +
              '</div>'+
              '</span>',
        },
        headerClass: 'custom-merge-header1 fontTitle',
        headerTooltip: this.translate.instant(`MANAGER_REGISTER.SCHOOL`),
        pinned: 'left',
        field: 'schoolName',
        tooltipField: 'schoolName',
        minWidth: 150,
        // maxWidth: 120,
        suppressMovable: true,
        resizable: true,
        cellStyle: {
          ...this.cellStyle,
          // 'text-align':'center',
          // 'background-color':'white !important',
        },
        cellRenderer: (params) => this.limitStringCellValue(params),
        // cellClass: param => {
        //   if (param.rowIndex % 2 === 1) {
        //     return 'normal-col';
        //   }else return 'normal-col2'
        // },
      },
      {
        headerName: this.translate.instant(`MANAGER_REGISTER.REGISTRATION_INFORMATION`),
        headerClass: 'header-color header-color1',
        headerTooltip: this.translate.instant(`MANAGER_REGISTER.REGISTRATION_INFORMATION`),
        children: [
          {
            headerComponentParams :{
              template:'<span style="width:100%;"><div style=" ' +
                  'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
                  'text-transform: uppercase; max-width:100%;">' +
                  `${this.translate.instant(`MANAGER_REGISTER.PHONE_NUMBER_PARENT`)}` +
                  '</div>'+
                  '</span>',
            },
            headerClass: 'header-color fontTitle',
            headerTooltip: this.translate.instant(`MANAGER_REGISTER.PHONE_NUMBER_PARENT`),
            field: 'phone',
            tooltipField: 'phone',
            minWidth: 140,
            // maxWidth: 80,
            suppressMovable: true,
            cellStyle: {
              ...this.cellStyle,
            },
            cellRenderer: (params) => this.limitStringCellValue(params),
          },
          {
            // headerName: this.translate.instant(`MANAGER_REGISTER.DATA_PACKAGE`),
            headerComponentParams :{
              template:'<span style="width:100%;"><div style=" ' +
                  'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
                  'text-transform: uppercase; max-width:100%;">' +
                  `${this.translate.instant(`MANAGER_REGISTER.DATA_PACKAGE`)}` +
                  '</div>'+
                  '</span>',
            },
            headerClass: 'header-color fontTitle',
            headerTooltip: this.translate.instant(`MANAGER_REGISTER.DATA_PACKAGE`),
            field: 'dataPackage',
            tooltipField: 'dataPackage',
            minWidth: 80,
            // maxWidth: 80,
            suppressMovable: true,
            cellStyle: {
              ...this.cellStyle,
            },
            cellRenderer: (params) => this.limitStringCellValue(params),
          },
          {
            headerComponentParams :{
              template:'<span style="width:100%;"><div style=" ' +
                  'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
                  'text-transform: uppercase; max-width:100%;">' +
                  `${this.translate.instant(`MANAGER_REGISTER.REGISTRATION_DATE`)}` +
                  '</div>'+
                  '</span>',
            },
            headerClass: 'align-class unPadding fontTitle',
            headerTooltip: this.translate.instant(`MANAGER_REGISTER.REGISTRATION_DATE`),
            field: 'createDate',
            minWidth: 120,
            // maxWidth: 80,
            suppressMovable: true,
            cellRenderer: (params) => {
              const element = formatDate(params.value,'dd/MM/yyyy','en_US');
              params.value = element;
              return this.limitStringCellValueCenter(params);
              // return element;
            },
            cellStyle: {
              ...this.cellStyle,
              'justify-content':'center !important',
            },
            // cellClass: param => {
            //   if (param.rowIndex % 2 === 1) {
            //     return 'normal-col';
            //   }else return 'normal-col2'
            // },
          },
          {
            headerComponentParams :{
              template:'<span style="width:100%;"><div style=" ' +
                  'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
                  'text-transform: uppercase; max-width:100%;">' +
                  `${this.translate.instant(`MANAGER_REGISTER.REGISTRATION_CREATOR`)}` +
                  '</div>'+
                  '</span>',
            },
            headerClass: 'header-color fontTitle',
            headerTooltip: this.translate.instant(`MANAGER_REGISTER.REGISTRATION_CREATOR`),
            field: 'creator',
            // tooltipField: 'creator',
            tooltipValueGetter: param => {
              if(param.data.creator === '1'){
                return this.translate.instant(`MANAGER_REGISTER.SCHOOL1`);
              }
              if(param.data.creator === '2'){
                return  this.translate.instant(`MANAGER_REGISTER.PHHS`);
              }
              return null;
            },
            minWidth: 120,
            // maxWidth: 80,
            suppressMovable: true,
            cellRenderer: (params) => {
              if(params.value==='1'){
                params.value = this.translate.instant(`MANAGER_REGISTER.SCHOOL1`);
                return this.limitStringCellValue(params);
                // return 'Nhà trường'
              }
              if(params.value==='2'){
                params.value = this.translate.instant(`MANAGER_REGISTER.PHHS`);
                return this.limitStringCellValue(params);
                // return 'Phụ huynh học sinh'
              }
            },
            cellStyle: {
              ...this.cellStyle,
            },
            // cellClass: param => {
            //   if (param.rowIndex % 2 === 1) {
            //     return 'normal-col';
            //   }else return 'normal-col2'
            // },
          },
        ],
      },
      {
        headerName: this.translate.instant(`MANAGER_REGISTER.DURATION`),
        headerClass: 'header-color1',
        headerTooltip: this.translate.instant(`MANAGER_REGISTER.DURATION`),
        children: [
          {
            headerName: this.translate.instant(`MANAGER_REGISTER.FROM`),
            headerTooltip: this.translate.instant(`MANAGER_REGISTER.FROM`),
            field: 'startDate',
            minWidth: 120,
            // maxWidth: 80,
            suppressMovable: true,
            headerClass: 'register-date-cell align-class',
            cellRenderer: (params) => {
              const element = formatDate(params.value,'dd/MM/yyyy','en_US');
              params.value = element;
              return this.limitStringCellValueCenter(params);
              // return element;
            },
            cellStyle: {
              ...this.cellStyle,
            },
            // cellClass: param => {
            //   if (param.rowIndex % 2 === 1) {
            //     return 'normal-col';
            //   }else return 'normal-col2'
            // },
          },
          {
            headerName: this.translate.instant(`MANAGER_REGISTER.TO`),
            headerTooltip: this.translate.instant(`MANAGER_REGISTER.TO`),
            field: 'endDate',
            minWidth: 120,
            // maxWidth: 80,
            suppressMovable: true,
            headerClass: 'register-date-cell align-class',
            cellRenderer: (params) => {
              const element = formatDate(params.value,'dd/MM/yyyy','en_US');
              params.value = element;
              return this.limitStringCellValueCenter(params);
              // return element;
            },
            cellStyle: {
              ...this.cellStyle,
            },
            // cellClass: param => {
            //   if (param.rowIndex % 2 === 1) {
            //     return 'normal-col';
            //   }else return 'normal-col2'
            // },
          },
        ],
      },
      {
        headerName: this.translate.instant(`MANAGER_REGISTER.ACTIVATION_DATE`),
        // headerComponentParams :{
        //   template:'<span style="width:100%;"><div style=" ' +
        //       'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
        //       'text-transform: uppercase; max-width:100%;">' +
        //       `${this.translate.instant(`MANAGER_REGISTER.ACTIVATION_DATE`)}` +
        //       '</div>'+
        //       '</span>',
        // },
        headerClass: 'custom-merge-header1 header-color align-class1 unPadding',
        headerTooltip: this.translate.instant(`MANAGER_REGISTER.ACTIVATION_DATE`),
        // maxWidth: 120,
        minWidth: 160,
        resizable :true,
        field: 'activeDate',
        suppressMovable: true,
        cellRenderer: (params) => {
          if(!params.value){
            return `<span style="padding-right: 25px !important; display: flex !important; justify-content: center !important;"> - </span>`
          }
          const element = formatDate(params.value,'dd/MM/yyyy','en_US');
          params.value = element;
          return this.limitStringCellValueCenter1(params);
          // return element;
        },
        cellStyle: {
          ...this.cellStyle,
          'justify-content': 'center',
        },
        // cellClass: param => {
        //   if (param.rowIndex % 2 === 1) {
        //     return 'normal-col';
        //   }else return 'normal-col2'
        // },
      },
      {
        headerComponentParams :{
          template:'<span style="width:100%;"><div style=" ' +
              'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
              'text-transform: uppercase; max-width:100%;">' +
              `${this.translate.instant(`MANAGER_REGISTER.STATUS`)}` +
              '</div>'+
              '</span>',
        },
        headerClass: 'custom-merge-header1 header-color fontTitle',
        pinned: 'right',
        headerTooltip: this.translate.instant(`MANAGER_REGISTER.STATUS`),
        // lockPosition:'true',
        tooltipValueGetter: param => {
          if(param.data.status === 1){
            return  this.mappingStatus[1] ;
          }
          if(param.data.status === 2){
            return  this.mappingStatus[2] ;
          }
          if(param.data.status === 3){
            return  this.mappingStatus[3] ;
          }
          return null;
        },
        maxWidth: 120,
        minWidth: 120,
        resizable :true,
        field: 'status',
        suppressMovable: true,
        cellRenderer: (params) => {
          const element = document.createElement('p');
          element.className = `package-status ${
            this.mappingStyleStatus[params.value]
          }`;
          this.returnValue = this.mappingStatus[params.value];
          if(this.returnValue.length > 18){
              this.returnValue = this.returnValue.substring(0,16)+"...";
              console.log(this.returnValue);
          }
          if (params.value !== 0) {
            const iconElement = document.createElement('span');
            iconElement.className = 'fas fa-circle ';
            element.appendChild(iconElement);
            element.appendChild(
              document.createTextNode(this.returnValue)
            );
          }
          // else {
          //   const iconElement = document.createElement('span');
          //   element.appendChild(
          //     document.createTextNode(this.mappingStatus[params.value])
          //   );
          // }
          // params.value = element;
          // return this.limitStringCellValue(params);
          return element;
        },
        cellStyle: {
          ...this.cellStyle,
          padding: '0px',
        },
        // cellClass: param => {
        //   if (param.rowIndex % 2 === 1) {
        //     return 'normal-col';
        //   }else return 'normal-col2'
        // },
      },
    ];
    this.noRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('MANAGES_SCHOOL.NO_INFO'));
    // this.rowData = [];
    this.frameworkComponents = {
      // buttonRenderer: DownloadButtonRenderComponent,
    };
  }

  private currentYear: any;
  modalRef: BsModalRef;
  @ViewChild('confirmRegisterModal')
  public confirmRegisterModal: TemplateRef<any>;

  // ag-grid
  gridApi;
  gridColumnApi;
  cacheBlockSize=10;
  columnDefs;
  returnValue;
  defaultColDef = {
    width: 150,
    lockPosition: true,
    suppressMenu: true,
  };
  rowData = [];
  ROW_HEIGHT = 60;
  HEADER_HEIGHT = 32;
  rowStyle;
  rowSelection = 'multiple';
  noRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('MANAGES_SCHOOL.NO_INFO'));
  frameworkComponents;
  cellStyle = {
    'font-style': 'normal',
    'font-size': '12px',
    'line-height': '20px',
    color: '#101840',
    'align-items': 'center',
    display: 'flex',
    'white-space': 'nowrap',
    'text-overflow': 'ellipsis',
    overflow: 'hidden',
    'font-weight': '500',
    'font-family': 'Inter',
  };

  // search form
  dataSearch: any = {};
  formSearch: FormGroup;

  showPagination = true;
  // paging
  perPage = 10;
  currentPage = 1;
  first = 0;
  last = 0;
  total = 0;
  totalPage = 0;
  rangeWithDots = [];

  listSchool;
  listDataPackage;
  // this.translate.instant(`MANAGER_REGISTER.STATUS`),
  listStatus = [
    {id: 1, name: this.translate.instant(`MANAGER_REGISTER.WAITING_FOR_ACTIVATION`)},
    {id: 2, name: this.translate.instant(`MANAGER_REGISTER.ACTIVATED`)},
    {id: 3, name: this.translate.instant(`MANAGER_REGISTER.PAUSE`)},
  ];
  dateFrom;
  dateTo;
  mappingStatus = {
    // 0: '-',
    1: this.translate.instant(`MANAGER_REGISTER.WAITING_FOR_ACTIVATION`),
    2: this.translate.instant(`MANAGER_REGISTER.ACTIVATED`),
    3: this.translate.instant(`MANAGER_REGISTER.PAUSE`),
  };
  mappingStyleStatus = {
    // 0: 'unregistered',
    1: 'unregistered',
    2: 'actived',
    3: 'canceled',
  };

  selectedId = [];
  KEYCODE_0 = 48;
  KEYCODE_9 = 57;
  quaCh;
  quaCh2;
  showErrDateFrom = false;
  messageErrDateFrom;
  showErrDateTo = false;
  messageErrDateTo;
  dateFromInvalid = false
  dateToInvalid = false
  hide;

  limitStringCellValueCenter = (params) => {
    const element = document.createElement('span');
    element.style.display = 'flex';
    element.style.justifyContent= 'center'
    element.className = 'one-line-ellipsis w-100';
    element.appendChild(document.createTextNode(params.value));
    return element;
  };

  limitStringCellValueCenter1 = (params) => {
    const element = document.createElement('span');
    element.style.paddingRight = '30px';
    element.style.display = 'flex';
    element.style.justifyContent= 'center'
    element.className = 'one-line-ellipsis w-100';
    element.appendChild(document.createTextNode(params.value));
    return element;
  };

  limitStringCellValue = (params) => {
    const element = document.createElement('span');
    element.className = 'one-line-ellipsis w-100';
    element.appendChild(document.createTextNode(params.value));
    return element;
  };

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    setTimeout(()=>{this.gridApi.sizeColumnsToFit()}, 50);
  }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
  }

  disableActive = true;
  onSelectionChanged(event) {
    console.log('event', event);
    const selectedNodes = event.api.getSelectedNodes();
    console.log('selectedNodes', selectedNodes);
    this.selectedId = selectedNodes.map((node) => ({
      id: node.data.id,
      status : node.data.status,
    }));
    console.log('this.selectedId', this.selectedId);
    let count = 0;
    this.selectedId.forEach(item=>{
        if(item.status==1){
          count++;
        }
    })
    if(count!==0){
      this.disableActive=true;
    }
    else {
      this.disableActive=false;
    }
    console.log('disableActive',this.disableActive);
  }

  dateTest;
  ngOnInit(): void {
    // this.loadCurrentYear();
    // this.dateFrom = formatDate(new Date(),'yyyy-MM-dd','en_US');
    // this.dateTo = formatDate(new Date(),'yyyy-MM-dd','en_US').toString();
    this.subheaderService.setBreadcrumbs(this.breadCrumbs);

    console.log('date',formatDate(new Date(),'yyyy-MM-dd','en_US').toString());

    this.dateFrom = this.convert(formatDate(new Date(),'yyyy-MM-dd','en_US').toString());
    // console.log('date',this.dateTo);
    this.dateTo = this.convert(formatDate(new Date(),'yyyy-MM-dd','en_US').toString());
    this.dateTest = this.convert(formatDate(new Date(),'yyyy-MM-dd','en_US').toString());
    console.log('stringDate', this.convertDateToString(this.dateTo));
    this.loadListSchool();
    this.changeDetectorRef.detectChanges();
    // this.currentUser = this.auth.currentUserValue;
  }

  convert(date:any){
    // console.log('dateTo',this.dateTo.toString());

    var values = date.split('-').map(function(v) {
      return v.replace(/\D/g, '')
    });
    console.log('values',values);
    return {
      year: parseInt(values[0]),
      month: parseInt(values[1]),
      day : parseInt(values[2])
    }
  }

  loadCurrentYear() {
    // console.log('year123111', this.currentYear);
    this.classRoomService.yearCurrent$.subscribe((currentYear) => {
      this.currentYear = currentYear;
      if (currentYear) {
        // this.getClassroomByUserIdAndYears();
      }
    });
    this.changeDetectorRef.detectChanges();
  }

  loadListSchool(){
    this.packageManagementService.getSchoolHasLimit50('').subscribe((listSchool)=>{
      // this.listSchool = listSchool;
      this.listSchool = listSchool.map( item => {
        return {...item, schoolNameCode: item.code + ' - ' + item.name};
      });
      this.loadListDataPackage();
      this.changeDetectorRef.detectChanges();
    })
  }

  loadListDataPackage(){
    this.packageManagementService.getDataPackageLimit50('').subscribe((listDataPackage)=>{
      this.listDataPackage = listDataPackage.map( item => {
        return {...item, dataPackageNameCode: item.code + ' - ' + item.name};
      });
      this.loadData(1);
      this.changeDetectorRef.detectChanges();
    })
  }

  schoolCode;
  dataPackageCode;
  statusId;
  valuePhoneSearch;

  checkEnableButton = true;

  unsubscribe$ = new Subject<void>();

  convertDateToString(date:any){
      return date.year + '-' + date.month + '-' + date.day;
  }

  loadData(page: number){
    // this.gridApi.hideOverlay();
    this.disableActive=false;
    this.selectedId=[];
    this.rowData= [];
    this.currentPage = page;
    this.dataSearch = {};
    this.hide = false;

    // const dataSearch: any = {};
    this.dataSearch.schoolCode = this.schoolCode;
    this.dataSearch.dataPackage = this.dataPackageCode;
    this.dataSearch.status = this.statusId;
    // this.dataSearch.fromDateSearch = this.dateFrom.toString(),

    if(this.dateFrom !== null){
      this.dataSearch.fromDateSearch = this.convertDateToString(this.dateFrom).toString();
    }
    if(this.dateTo !== null){
      this.dataSearch.toDateSearch = this.convertDateToString(this.dateTo).toString();
    }

    // this.dataSearch.toDateSearch = this.dateTo.toString();

    if(this.valuePhoneSearch!== undefined){
      this.dataSearch.phoneSearch = this.valuePhoneSearch
    }
    this.dataSearch.page = this.currentPage;
    this.dataSearch.pageSize = this.perPage;

    console.log('dataSearch', this.dataSearch);


    this.packageManagementService
      .searchManagementRegistration(this.dataSearch)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (searchContactResponse) => {
          console.log(`searchManagementRegistrationResponse`, searchContactResponse);

          const {managementRegistrationDTOS: managementRegistration, totalRecord: totalElements} =
            searchContactResponse;
          console.log('managementRegistrationDTOS', {managementRegistration});
          if(managementRegistration?.length ===0 && totalElements > 0){
            this.loadData(page-1);
          }else{
            if (totalElements > 0) {
              this.total = totalElements;
              this.totalPage = Math.ceil(this.total / this.perPage);
              this.rangeWithDots = this.commonService.pagination(
                this.currentPage,
                this.totalPage
              );
              this.first = this.perPage * (this.currentPage - 1) + 1;
              this.last = this.first + managementRegistration.length - 1;

              this.rowData = managementRegistration;

            } else {
              this.total = 0;
              this.rangeWithDots = [];
              this.first = 0;
              this.last = 0;
              this.rowData = [];

            }

            console.log(`this.rowData`, this.rowData);
            this.gridApi.setRowData(this.rowData);
            this.gridApi.sizeColumnsToFit();

            this.hide= true;
            this.changeDetectorRef.detectChanges();
          }

        },
        error: (res) => {
          alert(res);
        },
      });



  }


  autoSearchSchool(event){
    this.packageManagementService.getSchoolHasLimit50(event.term).subscribe((listSchool)=>{
      console.log('data',listSchool);
      this.listSchool = listSchool.map( item => {
        return {...item, schoolNameCode: item.code + ' - ' + item.name};
      });
      this.changeDetectorRef.detectChanges();
    })
  }

  autoSearchSchoolClear(){
    this.packageManagementService.getSchoolHasLimit50('').subscribe((listSchool)=>{
      console.log('data',listSchool);
      this.listSchool = listSchool.map( item => {
        return {...item, schoolNameCode: item.code + ' - ' + item.name};
      });
      this.changeDetectorRef.detectChanges();
    })
  }

  autoSearchDataPackage(event){
    this.packageManagementService.getDataPackageLimit50(event.term).subscribe((listDataPackage)=>{
      this.listDataPackage = listDataPackage.map( item => {
        return {...item, dataPackageNameCode: item.code + ' - ' + item.name};
      });
      this.changeDetectorRef.detectChanges();
    })
  }

  autoSearchDataPackageClear(){
    this.packageManagementService.getDataPackageLimit50('').subscribe((listDataPackage)=>{
      this.listDataPackage = listDataPackage.map( item => {
        return {...item, dataPackageNameCode: item.code + ' - ' + item.name};
      });
      this.changeDetectorRef.detectChanges();
    })
  }

  blurSchool(){
    console.log('blurSchool',this.schoolCode)
    if(this.schoolCode===null || this.schoolCode === undefined){
      this.packageManagementService.getSchoolHasLimit50("").subscribe((listSchool)=>{
        console.log('data',listSchool);
        this.listSchool = listSchool.map( item => {
          return {...item, schoolNameCode: item.code + ' - ' + item.name};
        });
        this.schoolCode = null;
        this.changeDetectorRef.detectChanges();
      })
    }
  }

  goToPage(page: number) {
    if (page !== this.currentPage && page >= 1 && page <= this.totalPage) {
      this.currentPage = page;
      this.loadData(page);
    }
  }

  exportData() {
    console.log('searchDataExport', this.dataSearch);

    this.packageManagementService
      .export(this.dataSearch)
      .subscribe((responseMessage) => {
        const file = new Blob([responseMessage], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const fileURL = URL.createObjectURL(file);
        // window.open(fileURL, '_blank');
        const anchor = document.createElement('a');
        anchor.download = this.translate.instant(`MANAGER_REGISTER.LIST_REGISTER`);
        anchor.href = fileURL;
        anchor.click();
      });
  }

  activeMultiRegister() {
    console.log('this.selectedId',this.selectedId);
    let count =0;
    this.selectedId.forEach(item=>{
      if(item.status !==1){
        count++;
      }
    })
    this.selectedId.find(
      (condition) => condition.status !== 1
    )

    if (count!=0) {
      this.toastr.error(this.translate.instant(`MANAGER_REGISTER.EXISTS_1`)+` ${count}/${this.selectedId.length} `+this.translate.instant(`MANAGER_REGISTER.EXISTS_2`));
      // this.disableActive = true;
      return;
    }
    // this.disableActive = false;
    this.openModalConfirmRegister(this.confirmRegisterModal);
  }

  openModalConfirmRegister(template1: TemplateRef<any>){
    this.modalRef = this.modalService.show(
      template1,
      Object.assign({}, { class: 'action-contact-dialog-custom' })
    );
  }

  activeRegister(){
    const listId = [];
    console.log('selectedId',listId);
    this.selectedId.forEach(item=>{
      listId.push(item.id);
    })

    const dataActive : any={};
    dataActive.listIdRegisterPackageDetail = listId;

    console.log('dataActive',dataActive);
    this.packageManagementService
      .activeRegister(dataActive)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (activeResponse) => {
            console.log('activeResponse',activeResponse);
          if (activeResponse.status === 'OK') {
            this.loadData(this.currentPage);
            this.toastr.success(this.translate.instant(`MANAGER_REGISTER.PACKAGE_ACTIVATION_SUCCESSFUL`));
            this.modalRef.hide();
          } else {
            this.toastr.error(activeResponse.message);
            this.modalRef.hide();
          }
        },
      });
  }

  unSelected(){
    this.gridApi.forEachNode(row => {
      if (row.isSelected()) {
        row.setSelected(false);
      }
    });
  }

  isEmpty(data: any): boolean {
    return data === null || data === undefined || data === ''
  }


  validateFromDate(){
    console.log('this.dateTo',this.dateTo);
    console.log('this.dateFrom',this.dateFrom);
    this.showErrDateFrom = false;
    if(this.dateFrom===null || typeof this.dateFrom === 'object'){
      console.log('typeof this.dateFrom',typeof this.dateFrom);
      if(typeof this.dateFrom === 'object' && this.dateFrom!==null &&
        typeof this.dateTo === 'object' && this.dateTo!==null
      ){
        if(new Date(this.convertDateToString(this.dateFrom).toString()) >
          new Date(this.convertDateToString(this.dateTo).toString())){
          this.showErrDateFrom = true;
          this.messageErrDateFrom = this.translate.instant(`MANAGER_REGISTER.VALIDATE_DATE1`);
          return;
        }
      }

      return;
    }

    this.showErrDateFrom = true;
    this.messageErrDateFrom = this.translate.instant(`MANAGER_REGISTER.VALIDATE_DATE2`);
  }

  validateDateTo(){
    this.validateFromDate();
    console.log('this.dateTo',this.dateTo);
    this.showErrDateTo = false;
    if(this.dateTo===null || typeof this.dateTo === 'object'){
      return;
    }

    this.showErrDateTo = true;
    this.messageErrDateTo = this.translate.instant(`MANAGER_REGISTER.VALIDATE_DATE3`);

  }

  interceptKeyboard(event): void {
    const keyCode = event.keyCode
    if (keyCode === 'KeyD') {
      event.preventDefault()
    }
  }
  onKeyDown(event: KeyboardEvent) {
    console.log(event);
    const regex: RegExp = new RegExp(/^[0-9/]$/g);
    const array = ["0","1", "2", "3", "4","5","6","7","8","9","/","Backspace","ArrowLeft","ArrowRight","Home","End","Delete","Tab"];
    if(!array.includes(event.key)){
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    // return !regex.test(event.key);
  }

  selectTodayDateFrom(datepicker: NgbInputDatepicker) {
    this.dateFrom = this.calendar.getToday();
    this.validateFromDate();
    datepicker.navigateTo()
  }

  selectTodayDateTo(datepicker: NgbInputDatepicker){
    this.dateTo = this.calendar.getToday();
    this.validateDateTo();
    datepicker.navigateTo()
  }
  clearDateFrom(){
    this.dateFrom = null;
  }
  clearDateTo(){
    this.dateTo = null;
  }
  removeTabIndex(d: NgbInputDatepicker) {
    d.toggle();
    console.log('Xem D la cai gi');
    console.log(d);
    // console.log(this.nativeElementInput);
    const listElement = Array.from(document.getElementsByClassName('ngb-dp-day'));
    listElement?.forEach((item) => {
      item.removeAttribute('tabindex')
    })
  }
}
