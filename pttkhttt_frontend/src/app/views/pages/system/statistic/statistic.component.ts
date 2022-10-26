import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {DataPackageService} from '../../../../core/service/service-model/data-package.service';
import {MatDialog} from '@angular/material/dialog';
import {StatisticSmsComponent} from './statistic-sms/statistic-sms.component';
import {SearchReport} from '../../../../core/service/model/searchReport';
import {ActionStaticComponent} from './action-static/action-static.component';
import {NO_ROW_GRID_TEMPLATE} from '../../../../helpers/constants';
import {Subscription} from 'rxjs';
import {Toast, ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Breadcrumb, SubheaderService} from '../../../../core/_base/layout/services/subheader.service';

@Component({
  selector: 'kt-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit, OnDestroy,AfterViewInit {

  columnDefs;
  rowData=[];
  gridApi;
  gridColumnApi;
  headerHeight = 56;
  rowHeight = 50;
  defaultColDef;
  columnDefsTree = [];
  listUnitParent = [];
  autoGroupColumnDefTree;
  serverSideStoreType;
  rowModelType;
  isServerSideGroupOpenByDefault;
  isServerSideGroupOpenByDefaultTree;
  isServerSideGroup;
  getServerSideGroupKey;
  rowSelection;
  autoGroupColumnDef;
  themeName;
  search = '';
  type;
  tooltipShowDelay = 0;
  searchReport: SearchReport = new SearchReport();
  data1: any[] = [];
  data2: any[] = [
    {
      kind: '',
      // share: 1,
      category: '',
      value: 1,
      color: '#C0C0C0'
    }
  ];
  listDataChar;
  item = {
    kind: '',
    share: null
  }
  noRowsTemplate= NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('MANAGES_SCHOOL.NO_INFO'));
  total = 0;
  icuoi = 0;
  langKey;
  internetGrowthData = [];
  internetGrowthData2 = [
    {
      data: this.data2
    }
  ];
  subscription: Subscription;
  // Mảng màu
  rgb: string;
  color: number;
  listColor = ['#F26522', '#7DFC00', '#0EC434', '#228C68', '#8AD8E8', '#235B54', '#29BDAB', '#3998F5', '#37294F', '#277DA7', '#3750DB', '#F22020', '#991919', '#FFCBA5', '#E68F66', '#C56133', '#96341C', '#632819', '#FFC413', '#201923', '#2F2AA0', '#B732CC', '#772B9D', '#F07CAB', '#D30B94', '#C3A5B4', '#946AA2', '#5D4C86', '#006410', '#907038'];
  cellStyle = {
    'font-size': '12px',
    'align-items': 'center',
    'font-weight': '500',
    color: '#101840',
    'white-space': 'nowrap',
    'text-overflow': 'ellipsis',
    overflow: 'hidden',
    'background-color': '#E6E8F0',
    'line-height': '20px'
    // display: 'flex'
  };
  cellStyle1 = {
    'font-size': '12px',
    'align-items': 'center',
    'font-weight': '500',
    color: '#101840',
    'white-space': 'nowrap',
    'text-overflow': 'ellipsis',
    overflow: 'hidden',
    top: '12px',
    'line-height': '20px'
  }
  cellStyleCode = {
    'font-size': '12px',
    'align-items': 'center',
    'font-weight': 'bold',
    color: '#101840',
    'white-space': 'nowrap',
    'text-overflow': 'ellipsis',
    overflow: 'hidden',
    'margin-right':'15px',
    'background-color': '#E6E8F0',
    'line-height': '20px'
  };
  cellStyleCode1 = {
    'font-size': '12px',
    'align-items': 'center',
    'font-weight': 'bold',
    color: '#101840',
    'white-space': 'nowrap',
    'text-overflow': 'ellipsis',
    overflow: 'hidden',
    'margin-right':'15px',
    'line-height': '20px'
  };
  cellStyleSMS = {
    display: 'flex',
    'align-items': 'center',
    'background-color': '#E6E8F0',
    // 'justify-content': 'center'
    'line-height': '20px'  };
  cellStyleSMS1 = {
    display: 'flex',
    'align-items': 'center',
    // 'justify-content': 'center',
    top: '-5px',
    'line-height': '20px'
  };
  cellStyleTotal = {
    'font-size': '12px',
    'align-items': 'center',
    'font-weight': 'bold',
    color: '#101840',
    'white-space': 'nowrap',
    'text-overflow': 'ellipsis',
    overflow: 'hidden',
    'background-color': '#E6E8F0',
    display: 'flex',
    'justify-content': 'center',
    'line-height': '20px'
  };
  cellStyleTotal1 = {
    'font-size': '12px',
    'align-items': 'center',
    'font-weight': '500',
    color: '#101840',
    'white-space': 'nowrap',
    'text-overflow': 'ellipsis',
    overflow: 'hidden',
    display: 'flex',
    'justify-content': 'center',
    'line-height': '20px'
  }

  breadCrumbs: Breadcrumb[] = [
    {
      title: this.translate.instant('MENU.STATISTIC.TITLE'),
      page: '/system/statistic',
    },
    {
      title: this.translate.instant('MENU.STATISTIC.PACKAGE_TRACKING'),
      page: '/system/statistic'
    }
  ]


  constructor(private dataPackageService: DataPackageService,
              private dialog: MatDialog,
              private toastr: ToastrService,
              private translate: TranslateService,
              private subheaderService: SubheaderService,
              private changeDetectorRef: ChangeDetectorRef) {
    this.langKey = (localStorage.getItem('language'));
    this.autoGroupColumnDefTree = {
      headerName: this.translate.instant(`STATISTIC_PACKAGE.SCHOOL_CODE`),
      field: 'code',
      height: 30,
      tooltipField: 'name',
      tooltip: (value: string): string => value
    }
    this.themeName = 'red-theme';
    this.noRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('MANAGES_SCHOOL.NO_INFO'));;;
    this.columnDefs = [
      {
        field: 'schoolCode',
        lockPosition: true,
        hide: true,
        headerName: this.translate.instant(`STATISTIC_PACKAGE.SCHOOL_CODE`),
        headerClass: 'upper',
        // headerTooltip: this.translate.instant(`STATISTIC_PACKAGE.SCHOOL_CODE`),
        // tooltipField: this.translate.instant(`STATISTIC_PACKAGE.SCHOOL_CODE`),
        tooltip: (value: string): string => value,
        minWidth:150,
        cellStyle: params => {
          if(!params.data.schoolName){
            return this.cellStyleCode;
          }else{
            return this.cellStyleCode1;
          }
        }
      },
      {
        headerName: this.translate.instant(`STATISTIC_PACKAGE.SCHOOL_NAME`),
        field: 'schoolName',
        headerTooltip: this.translate.instant(`STATISTIC_PACKAGE.SCHOOL_NAME`),
        lockPosition: true,
        tooltipField: 'schoolName',
        minWidth: 200,
        tooltip: (value: string): string => value,
        cellStyle: params => {
          if(!params.data.schoolName){
            return this.cellStyle;
          }else{
            return this.cellStyle1;
          }
        }
      },
      {
        headerName: this.translate.instant(`STATISTIC_PACKAGE.LEVEL`),
        field: 'levelSchool',
        lockPosition: true,
        headerTooltip: this.translate.instant(`STATISTIC_PACKAGE.LEVEL`),
        tooltipField: 'levelSchool',
        tooltip: (value: string): string => value,
        minWidth: 150,
        cellStyle: params => {
          if(!params.data.schoolName){
            return this.cellStyle;
          }else{
            return this.cellStyle1;
          }
        }
      },
      {
        headerName: this.translate.instant(`STATISTIC_PACKAGE.PROVINCE`),
        headerTooltip: this.translate.instant(`STATISTIC_PACKAGE.PROVINCE`),
        lockPosition: true,
        headerClass: 'upper',
        field: 'provinceName',
        minWidth: 120,
        tooltipField: 'provinceName',
        cellStyle: params => {
          if(!params.data.schoolName){
            return this.cellStyle;
          }else{
            return this.cellStyle1;
          }
        }
      },
      {
        headerName: this.translate.instant(`STATISTIC_PACKAGE.COUNT_USER`),
        headerTooltip: this.translate.instant(`STATISTIC_PACKAGE.COUNT_USER`),
        // tooltipField: this.translate.instant(`STATISTIC_PACKAGE.COUNT_USER`),
        lockPosition: true,
        minWidth: 180,
        maxWidth: 180,
        headerClass: 'custom-merge-header1 center',
        valueGetter: param => {
          return (new Intl.NumberFormat('en-US').format(param.data.total));
        },
        tooltipValueGetter: param => {
          return (new Intl.NumberFormat('en-US').format(param.data.total));
        },
        cellStyle: params => {
          if(!params.data.schoolName){
            return this.cellStyleTotal;
          }else{
            return this.cellStyleTotal1;
          }
        }
      },
      {
        headerName: this.translate.instant(`STATISTIC_PACKAGE.COUNT_SMS_SEEN`),
        headerTooltip: this.translate.instant(`STATISTIC_PACKAGE.COUNT_SMS_SEEN`),
        // tooltipField: this.translate.instant(`STATISTIC_PACKAGE.COUNT_SMS_SEEN`),
        field: '',
        cellRendererFramework: ActionStaticComponent,
        minWidth: 180,
        maxWidth: 180,
        cellStyle: params => {
          if(!params.data.schoolName){
            return this.cellStyleSMS;
          }else{
            return this.cellStyleSMS1;
          }
        }
      },
      {
        field: 'packageCode',
        hide: true,
      }
    ];
    this.autoGroupColumnDef = {
      // field: 'code',
      lockPosition: true,
      headerName: this.translate.instant(`STATISTIC_PACKAGE.SCHOOL_CODE`),
      headerTooltip: this.translate.instant(`STATISTIC_PACKAGE.SCHOOL_CODE`),
      // tooltipField: 'code',
      tooltip: (value: string): string => value,
      minWidth: 150,
      valueGetter: param => {
        let a;
        if(!param.data.schoolName)
          a = this.translate.instant(`STATISTIC_PACKAGE.DATA_PACKAGE`)+': ' + param.data.code;
        else
          a = param.data.code;
        return a;
      },
      tooltipValueGetter: param => {
        let a;
        if(!param.data.schoolName)
          a = this.translate.instant(`STATISTIC_PACKAGE.DATA_PACKAGE`)+': ' + param.data.code;
        else
          a = param.data.code;
        return a;
      },
      cellStyle: params => {
        if(!params.data.schoolName){
          return this.cellStyleCode;
        }else{
          return this.cellStyleCode1;
        }
      }
    };

    this.rowModelType = 'serverSide';
    this.serverSideStoreType = 'partial';
    // tslint:disable-next-line:only-arrow-functions
    this.isServerSideGroupOpenByDefault = function (params) {
      return params.rowNode.level < 90;
    };
    // tslint:disable-next-line:only-arrow-functions
    this.isServerSideGroupOpenByDefaultTree = function (params) {
      return params.rowNode.level <99;
    };
    // tslint:disable-next-line:only-arrow-functions
    this.isServerSideGroup = function (dataItem) {
      return dataItem.group;
    };
    // tslint:disable-next-line:only-arrow-functions
    this.getServerSideGroupKey = function (dataItem) {
      return dataItem.code;
    };
    this.defaultColDef = { sortable: true,  resizable: true , lockPosition: true, };
    this.searchReport.date = '';
    this.searchReport.schoolSearch = '';
    this.searchReport.packageSearch = '';

    this.noRowsTemplate= NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('MANAGES_SCHOOL.NO_INFO'));;

  }

  ngOnInit(): void {
    this.subheaderService.setBreadcrumbs(this.breadCrumbs);
    this.getSubheader();
  }

  // Thay đổi subheader
  getSubheader(){
    this.subscription = this.dataPackageService.currentSubheader$.subscribe( {
      next: subheader => {
        this.searchReport.year = subheader.year;
        if(subheader.type === '0'){
          this.searchReport.month = subheader.month;
          this.searchReport.quarters = null;
        }else if(subheader.type === '1'){
          this.searchReport.quarters = subheader.quarter;
          this.searchReport.month = null;
        }else{
          this.searchReport.quarters = null;
          this.searchReport.month = null;
        }
        // Tìm kiếm
        this.data1 = [];
        this.onSearch();
      }
    })
  }
  // Hàm trả data cho chart
  // dataCharts(){
  //   this.total = 0;
  //   this.data1 = [];
  //   this.dataPackageService.report2(this.searchReport).subscribe(res => {
  //     this.listDataChar = res;
  //     this.changeDetectorRef.detectChanges();
  //     console.log(this.listDataChar);
  //     this.listDataChar.forEach(e=>{
  //       if (e.total !== 0){
  //         this.total = this.total + e.total;
  //       }
  //     })
  //     this.listDataChar.forEach(e=>{
  //       if(e.total !== 0){
  //         // Tính %
  //       const a = ((e.total / this.total) * 100).toFixed(2);
  //       const item = {
  //         kind: '',
  //         share: a,
  //         category: e.code,
  //         name: e.code
  //       }
  //       this.data1.push(item);
  //       }
  //     })
  //   });
  // }


  onSearch(){
    console.log(this.searchReport);
    this.rowData = [];
    this.data1 = [];
    this.total = 0;
    this.dataPackageService.report2(this.searchReport).subscribe(res => {
      console.log('dataress',res);
      if(res.length !==0){
        this.rowData = res;
        if(this.rowData.length === 0){
          // this.gridApi.showNoRowsOverlay().title(this.translate.instant('MANAGES_SCHOOL.NO_INFO'));
          this.gridApi.showNoRowsOverlay();
        }
        this.listDataChar = res;
        this.changeDetectorRef.detectChanges();
        console.log(this.listDataChar);
        // this.listDataChar.forEach(e=>{
        //   if (e.total !== 0){
        //     this.total = this.total + e.total;
        //   }
        // })
        this.icuoi = 0;
        // tslint:disable-next-line:prefer-for-of
        for(let j=0; j < this.listDataChar.length; j++){
          this.total = this.total + this.listDataChar[j].total;
          if(this.listDataChar[j].total > 0)
            this.icuoi = j;
        }
        let i = 0;
        let total2 = 0;
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.listDataChar.length; j++) {
          // if(this.listDataChar[j].total !== 0){
              // Tính %
            let a = 0;
              if(this.total !== 0){
                if(this.icuoi !== j){
                  a = Number(((this.listDataChar[j].total / this.total) * 100).toFixed(2));
                  total2 = Number(total2) + a;
                }
                else{
                  a =  Number((100 * 1.0 - total2).toFixed(2));
                }
              }else
                a = 0;
              this.rgb = this.listColor[i];
              i ++;
              const item = {
                kind: '',
                value: a,
                category: this.listDataChar[j].code,
                color: this.rgb
              }
              this.data1.push(item);
            // }
        }
        this.internetGrowthData = [
          {
            data: this.data1
          }
        ]
        console.log(this.total);
        this.changeDetectorRef.detectChanges();
        const fakeServer = createFakeServer(this.rowData);
        const datasource = createServerSideDatasource(fakeServer);
        this.gridApi.setServerSideDatasource(datasource);
      }else{
        this.rowData = [];
        this.changeDetectorRef.detectChanges();
        const fakeServer = createFakeServer(this.rowData);
        const datasource = createServerSideDatasource(fakeServer);
        this.gridApi.setServerSideDatasource(datasource);
      }
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // params.api.sizeColumnsToFit();

    this.dataPackageService.report2(this.searchReport).subscribe(res => {
      this.rowData = res;
      this.changeDetectorRef.detectChanges();
      const fakeServer = createFakeServer(this.rowData);
      const datasource = createServerSideDatasource(fakeServer);
      this.gridApi.setServerSideDatasource(datasource);
    });
    setTimeout(() => {
      this.gridApi.sizeColumnsToFit()
      this.resizeColumns()
    }, 50);
  }

  gridSizeChanged(params) {
    setTimeout(() => {
      this.gridApi.sizeColumnsToFit()
      this.resizeColumns()
    }, 50);
    // params.api.sizeColumnsToFit();
  }

  gridColumnsChanged(params){
    setTimeout( () => {
      params.api.sizeColumnsToFit(),
        this.resizeColumns()
    }, 500)
  }

  loadingData() {
    this.dataPackageService.report2(this.searchReport).subscribe(res => {
      this.rowData = res;
      const fakeServer = createFakeServer(this.rowData);
      const datasource = createServerSideDatasource(fakeServer);
      this.gridApi.setServerSideDatasource(datasource);
    });

  }



  exportData(){
    console.log('searchReport',this.searchReport);
    this.dataPackageService.report2(this.searchReport).subscribe(res1=>{
      console.log('data',res1)

      if(res1.length !== 0){
        this.dataPackageService.exportData(this.searchReport).subscribe(res=>{
          const file = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          const fileURL = URL.createObjectURL(file);
          const anchor = document.createElement('a');
          // anchor.download = `DS_baocao_theogoicuoc_` + this.searchReport.year;
          anchor.download = this.translate.instant(`STATISTIC_PACKAGE.LIST_REPORT`) + this.searchReport.year;
          anchor.href = fileURL;
          anchor.click();
        })
      }else {
        // this.toastr.error("Không có dữ liệu");
        this.toastr.error(this.translate.instant(`STATISTIC_PACKAGE.NO_DATA`));
      }
    })

  }
	// remove left spacer
  removeLeftSpacer(){
    const element :any= document.getElementsByClassName('ag-horizontal-right-spacer');
    element[0].remove();
  }
  labelContent(e: any): string {
    console.log(e.series.color)
    console.log('Charts:', e)
    return e.category;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  resizeColumns(): void {
    const header = (document.querySelector('.ag-header-container') as HTMLElement)
    const body = (document.querySelector('.ag-center-cols-container') as HTMLElement)
    body.style.minWidth = `${header.offsetWidth+19}px`
    console.log(body)
    console.log(header)
  }
   ngAfterViewInit(): void {
    this.removeLeftSpacer();
  }

}


function createFakeServer(fakeServerData) {
  function FakeServer(allData) {
    this.data = allData;  }

  FakeServer.prototype.getData = function (request) {
    function extractRowsFromData(groupKeys, data) {
      if (groupKeys.length === 0) {
        // tslint:disable-next-line:only-arrow-functions
        return data.map(function (d) {
          return {
            group: !!d.chirdlen,
            code: d.code,
            schoolCode: d.schoolCode,
            schoolName: d.schoolName,
            levelSchool: d.levelSchool,
            provinceName: d.provinceName,
            total: d.total,
            packageCode: d.packageCode
          };
        });
      }
      const key = groupKeys[0];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < data.length; i++) {
        if (data[i].code === key) {
          return extractRowsFromData(
            groupKeys.slice(1),
            data[i].chirdlen.slice()
          );
        }
      }
    }

    return extractRowsFromData(request.groupKeys, this.data);
  };
  return new FakeServer(fakeServerData);
}


function createServerSideDatasource(fakeServer) {
  // tslint:disable-next-line:no-shadowed-variable
  function ServerSideDatasource(fakeServer) {
    this.fakeServer = fakeServer;
  }

  ServerSideDatasource.prototype.getRows = function (params) {
    console.log(params)
    const allRows = this.fakeServer.getData(params.request);
    const request = params.request;
    const doingInfinite = request.startRow != null && request.endRow != null;
    const result = doingInfinite
      ? {
        rowData: allRows.slice(request.startRow, request.endRow),
        rowCount: allRows.length,
      }
      : {rowData: allRows};
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function () {
      params.success(result);
    }, 200);
  };
  return new ServerSideDatasource(fakeServer);
}


