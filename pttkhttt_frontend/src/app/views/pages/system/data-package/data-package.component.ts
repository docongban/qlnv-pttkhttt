import {TranslateService} from '@ngx-translate/core';
import {Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NO_ROW_GRID_TEMPLATE} from 'src/app/helpers/constants';
import {DataPackageService} from 'src/app/core/service/service-model/data-package.service'
import {CommonServiceService} from 'src/app/core/service/utils/common-service.service';
import {ActionDataPackageComponent} from './action-data-package/action-data-package.component';
import {CreateDataPackageComponent} from './create-data-package/create-data-package.component';
import {GridOptions} from 'ag-grid-community';
import {Breadcrumb, SubheaderService} from 'src/app/core/_base/layout/services/subheader.service';
import {ApParamService} from "../../../../core/service/service-model/ap-param.service";

export interface DataDropdown {
  code: string | null;
  name: string;
}

@Component({
  selector: 'kt-data-package',
  templateUrl: './data-package.component.html',
  styleUrls: ['./data-package.component.scss']
})
export class DataPackageComponent implements OnInit, AfterViewInit {

  @ViewChild('focus') inputFocus: ElementRef<HTMLInputElement>;

  HEADER_HEIGHT = 56;
  ROW_HEIGHT = 56;
  page = 1;
  pageSize = 10;
  totalRecord = 0;
  first = 1;
  last = 10;
  total = 0;
  totalPage = 0;
  rangeWithDots: any[];
  gridOptions: GridOptions;
  hide = true;
  la = localStorage.getItem('language');
  columnDefs;
  rowData: any[];
  gridApi;
  gridColumnApi;
  frameworkComponents;
  noRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('MANAGES_SCHOOL.NO_INFO'));
  form;
  searchDataExport;

  dropDownDefault: DataDropdown = {
    code: '',
    name: this.trans('PACKAGE_MANAGEMENT.PLACE_HOLDER'),
  };

  capHoc = [];
  levelSchool = [];
  listService = [];
  language: string;

  breadCrumbs: Breadcrumb[] = [
    {
      title: this.translate.instant('MENU.DATA_PACKAGE.TITLE'),
      page: '/system/data-package',
    },
  ]


  cellStyle = {
    'font-style': 'normal',
    'font-size': '12px',
    color: '#101840',
    'align-items': 'center',
    'font-weight': '500',
    'font-family': 'Inter',
    'white-space': 'nowrap',
    'text-overflow': 'ellipsis',
    'border-right': 'none',
    top: '12px',
    overflow: 'hidden',
    'padding-left': '6px !important',
    'padding-right': '6px !important',
  }

  constructor(
    private toastr: ToastrService,
    private matDialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private dataPackageService: DataPackageService,
    private commonService: CommonServiceService,
    private translate: TranslateService,
    private subHeaderService: SubheaderService,
    private apParamService: ApParamService
  ) {
    this.language = localStorage.getItem('language');
    console.log('language:', this.language);
    this.subHeaderService.setBreadcrumbs(this.breadCrumbs);
    this.gridOptions = {
      suppressCellSelection: true
    };
    this.columnDefs = [
      {
        headerName: this.trans('COMMON.NO'),
        // lockPosition: true,
        // suppressMovable: true,
        field: 'id',
        minWidth: 48,
        maxWidth: 48,
        cellStyle: {
          ...this.cellStyle,
          'text-align': 'center',
        },
        headerClass: 'center unPadding custom-merge-header1 style-custom-general-header',
        valueGetter: (param) => {
          return (
            param.node.rowIndex + ((this.page - 1) * this.pageSize + 1)
          );
        },
      },
      {
        headerComponentParams: {
          template: '<span style="width:100%;"><div style=" ' +
            'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
            'text-transform: uppercase; max-width:100%">' +
            `${this.translate.instant(`PACKAGE_MANAGEMENT.CODE`)}` +
            '</div>' +
            '</span>',
        },
        headerTooltip: this.translate.instant(`PACKAGE_MANAGEMENT.CODE`),
        headerClass: 'padding6px style-custom-general-header',
        field: 'code',
        suppressMovable: true,
        minWidth: 100,
        width: 100,
        cellStyle: this.cellStyle,
        tooltipField: 'code',
      },
      {
        // headerName: this.trans('PACKAGE_MANAGEMENT.NAME'),
        headerComponentParams: {
          template: '<span style="width:100%;"><div style=" ' +
            'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
            'text-transform: uppercase; max-width:100%">' +
            `${this.translate.instant(`PACKAGE_MANAGEMENT.NAME`)}` +
            '</div>' +
            '</span>',
        },
        headerTooltip: this.translate.instant(`PACKAGE_MANAGEMENT.NAME`),
        headerClass: 'padding6px style-custom-general-header',
        field: 'name',
        suppressMovable: true,
        minWidth: 120,
        width: 120,
        cellStyle: this.cellStyle,
        tooltipField: 'name',
      },
      {
        headerComponentParams: {
          template: '<span style="width:100%;"><div style=" ' +
            'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
            'text-transform: uppercase; max-width:100%">' +
            `${this.translate.instant(`PACKAGE_MANAGEMENT.TYPE_PACKAGE`)}` +
            '</div>' +
            '</span>',
        },
        headerTooltip: this.translate.instant(`PACKAGE_MANAGEMENT.TYPE_PACKAGE`),
        headerClass: 'padding6px style-custom-general-header',
        field: 'mapPackageTypeToName',
        suppressMovable: true,
        minWidth: 120,
        width: 120,
        cellStyle: this.cellStyle,
        valueFormatter: (params) => {
          return params.data.mapPackageTypeToName[Object.keys(params.data.mapPackageTypeToName)[0]];
        },
        tooltipValueGetter: (params) => {
          return (params.valueFormatted);
        }
      },
      {
        headerComponentParams: {
          template: '<span style="width:100%;"><div style=" ' +
            'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
            'text-transform: uppercase; max-width:100%">' +
            `${this.translate.instant(`PACKAGE_MANAGEMENT.PRIMARY_PACKAGE`)}` +
            '</div>' +
            '</span>',
        },
        headerTooltip: this.translate.instant(`PACKAGE_MANAGEMENT.PRIMARY_PACKAGE`),
        headerClass: 'padding6px style-custom-general-header',
        field: 'primaryPackage',
        suppressMovable: true,
        minWidth: 120,
        width: 123,
        cellStyle: this.cellStyle,
        valueFormatter: (params) => {
          if (params.data.primaryPackage == null || params.data.primaryPackage.trim() == '') {
            return '-';
          }
          return params.data.primaryPackage;
        },
        tooltipValueGetter: (params) => {
          return (params.valueFormatted == '-' ? '' : params.valueFormatted);
        }
      },
      {
        headerComponentParams: {
          template: '<span style="width:100%;"><div style=" ' +
            'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
            'text-transform: uppercase; max-width:100%">' +
            `${this.translate.instant(`PACKAGE_MANAGEMENT.LEVEL_SCHOOL`)}` +
            '</div>' +
            '</span>',
        },
        headerTooltip: this.translate.instant(`PACKAGE_MANAGEMENT.LEVEL_SCHOOL`),
        headerClass: 'padding6px style-custom-general-header',
        field: 'levelSchoolName',
        suppressMovable: true,
        minWidth: 120,
        cellStyle: this.cellStyle,
        valueFormatter: (params) => {
          if (params.data.levelSchoolName == null || params.data.levelSchoolName.trim() == '') {
            return '-';
          } else {
            return params.data.levelSchoolName;
          }
        },
        tooltipField: 'levelSchoolName',
      },
      {
        headerComponentParams: {
          template: '<span style="width:100%;"><div style=" ' +
            'display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; white-space: normal;' +
            'text-transform: uppercase; max-width:95%; overflow: hidden; text-overflow: ellipsis;">' +
            `${this.translate.instant(`PACKAGE_MANAGEMENT.QUANTITY_SEMESTER_APPLY_PART`)}` +
            '</div>' +
            '</span>',
        },
        headerTooltip: this.translate.instant(`PACKAGE_MANAGEMENT.QUANTITY_SEMESTER_APPLY_PART`),
        headerClass: 'padding6px style-custom-general-header',

        field: 'quantitySemesterApply',
        suppressMovable: true,
        minWidth: 116,
        width: 116,
        cellStyle: this.cellStyle,
        tooltipField: 'quantitySemesterApply',
        valueFormatter: (params) => {
          if (params.data.quantitySemesterApply == null || params.data.quantitySemesterApply == '')
            return '-';
          return params.data.quantitySemesterApply;
        },
      },
      {
        headerComponentParams: {
          template: '<span style="width:100%;"><div style=" ' +
            'display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; white-space: normal;' +
            'text-transform: uppercase; max-width:50%; overflow: hidden; text-overflow: ellipsis;">' +
            `${this.translate.instant(`PACKAGE_MANAGEMENT.SERVICE_PROVIDER`)}` +
            '</div>' +
            '</span>',
        },
        headerTooltip: this.translate.instant(`PACKAGE_MANAGEMENT.SERVICE_PROVIDER`),
        headerClass: 'padding6px style-custom-general-header',
        field: 'serviceName',
        suppressMovable: true,
        minWidth: 160,
        width: 160,
        cellStyle: {
         // ...this.cellStyle,
        },
        cellClass: 'my-class1',
        cellRenderer(params) {
          const data = params.data.serviceName;
          let html;
          if (params.data.serviceName === null || params.data.serviceName.trim() === '') {
            html = `-`;
          } else {
            html = `<span style="width: 100%"><div class="my-class">`+data+`</div></span>`;
          }
          return html;
        },
        tooltipField: 'serviceName'
      },
      {
        headerComponentParams: {
          template: '<span style="width:100%;"><div style=" ' +
            'display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; white-space: normal;' +
            'text-transform: uppercase; max-width:100%; overflow: hidden; text-overflow: ellipsis;">' +
            `${this.translate.instant(`PACKAGE_MANAGEMENT.PACKAGE_PRICE`)}` +
            '</div>' +
            '</span>',
        },
        headerTooltip: this.translate.instant(`PACKAGE_MANAGEMENT.PACKAGE_PRICE`),
        headerClass: 'padding6px style-custom-general-header',
        field: 'prices',
        minWidth: 100,
        width: 100,
        suppressMovable: true,
        cellStyle: this.cellStyle,
        valueFormatter: (params) => {
          console.log(params.data.prices);
          if (params.data.prices === null || params.data.prices === '') {
            return '';
          }
          if (params.data.responsePrice.toString().split('.')[1] == '00') {
            return params.data.responsePrice.toString().split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }
          if ((params.data.responsePrice.toString().split('.')[1])[1] == '0') {
            return params.data.responsePrice.toString().split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              + '.' + (params.data.responsePrice.toString().split('.')[1])[0];
          }
          // params.data.responsePrice = params.data.responsePrice.toString().replace('.',",");
          return params.data.responsePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
        tooltipValueGetter: (params) => {
          return (params.valueFormatted);
        }
      },
      {
        headerName: this.trans('PACKAGE_MANAGEMENT.NUMBER_SMS'),
        headerComponentParams: {
          template: '<span style="width:100%;"><div style=" ' +
            'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
            'text-transform: uppercase; max-width:100%">' +
            `${this.translate.instant(`PACKAGE_MANAGEMENT.NUMBER_SMS`)}` +
            '</div>' +
            '</span>',
        },
        headerTooltip: this.translate.instant(`PACKAGE_MANAGEMENT.NUMBER_SMS`),
        headerClass: 'padding6px style-custom-general-header',
        field: 'quantitySms',
        minWidth: 100,
        width: 100,
        suppressMovable: true,
        cellStyle: this.cellStyle,
        tooltipField: 'quantitySms',
      },
      {
        headerName: '',
        field: '',
        suppressMovable: true,
        cellRendererFramework: ActionDataPackageComponent,
        minWidth: 48,
        maxWidth: 48,
      },
    ];
  }

  ngOnInit(): void {
    this.buildForm();
    this.getData();
    setTimeout(this.removeStyle, 1000);
    this.changeDetectorRef.detectChanges();
  }


  // Css for ng-select
  // Change Input Point
  changeInputPositionPoint() {
    // const parent = document.querySelector('.modal-body .row');
    // 2 3 4 5
    const parent = document.querySelectorAll('.modal-body .row .col-md-6');
    console.log(parent);
    const child2 = parent[1].children[1].firstElementChild.getElementsByClassName('ng-placeholder');
    console.log('Child 2');
    console.log(child2);
    // const child3 = parent[3].children[1].firstElementChild.getElementsByClassName('ng-input');
    // const child31 = parent[3].children[1].firstElementChild.getElementsByClassName('ng-value-container');
    // const child311 = parent[3].children[1].firstElementChild.getElementsByClassName('ng-placeholder');
    // const child4 = parent[4].children[1].firstElementChild.getElementsByClassName('ng-input');
    // const child5 = parent[5].children[1].firstElementChild.getElementsByClassName('ng-input');
    // console.log(child31);
    // child31.item(0).setAttribute('style','padding:8.5px');
    // child311.item(0).setAttribute('style','margin-top:4px');
    child2.item(0).setAttribute('style', 'margin-top : 4px');
    // child3.item(0).setAttribute('style','margin-bottom : 2px');
    // child4.item(0).setAttribute('style','margin-top : 5px');
    // child5.item(0).setAttribute('style','margin-top : 5px');
  }

  getData() {
    this.dataPackageService.dataPackage('LEVEL_SCHOOL').subscribe((res) => {
      this.capHoc = res.map(obj => {
        const objRes: any = {}
        objRes.code = obj.code
        objRes.name = this.la === 'la' ? obj.nameLA : (this.la === 'en' ? obj.nameEN : obj.name)
        return objRes
      });
      this.levelSchool = JSON.parse(JSON.stringify(res)).map(obj => {
        const objRes: any = {}
        objRes.code = obj.code
        objRes.name = this.la === 'la' ? obj.nameLA : (this.la === 'en' ? obj.nameEN : obj.name)
        return objRes
      });
      // this.capHoc.unshift(this.dropDownDefault);
      // this.form.get('levelSchool').setValue(this.capHoc[0].code);
    })

    this.apParamService.getAllByTypeDataPackageService(this.language).subscribe((res) => {
      this.listService = res;
    })
    this.search(1);
  }

  removeStyle() {
    const removeStyle = document.querySelector('.ag-center-cols-container') as HTMLElement;
    const currentValue = removeStyle.style.getPropertyValue('width');
    const newCurrentValueFloat = currentValue.slice(0, -2);
    const newCurrentValueInt = Math.round(parseFloat(newCurrentValueFloat));
    const newValue = newCurrentValueInt + 14;
    removeStyle.style.width = `${newValue}px`;

  }

  // =========================Search======================
  // ===============================Paging=============
  paging(pageSearch: number): void {
    if (this.page == pageSearch) {
      return;
    }
    this.page = pageSearch;
    this.search(pageSearch);
    console.log(this.page);
  }

  prev(): void {
    this.page--;
    if (this.page < 1) {
      this.page = 1;
      return;
    }
    this.search(this.page);
  }

  next(): void {
    this.page++;
    if (this.page > this.totalPage) {
      this.page = this.totalPage;
      return;
    }
    this.search(this.page);
  }

  search(page: number) {
    //
    this.hide = false;
    this.page = page;
    const data = Object.assign(this.form.value);
    // console.log(data.releaseDate);
    // if(data.levelSchool != null && data.levelSchool != ""){
    //   switch(data.levelSchool){
    //     case 'KID':
    //       data.levelSchool = 0;
    //       break;
    //     case 'PRIMARY':
    //       data.levelSchool = 1;
    //         break;
    //     case 'JUNIOR':
    //       data.levelSchool = 2;
    //       break;
    //     case 'JUNIOR':
    //       data.levelSchool = 3;
    //       break;
    //     case 'UNI':
    //       data.levelSchool = 4;
    //       break;
    //     case 'COLLEGE':
    //       data.levelSchool = 4;
    //       break;
    //   }
    // }
    if (data.code != null) {
      data.code = data.code.trim();
    }
    if (data.name != null) {
      data.name = data.name.trim();
    }
    data.languageType = this.la

    this.searchDataExport = data;
    this.dataPackageService.onSearch(page, this.pageSize, data).subscribe(res => {
      this.hide = true;
      // console.log(res);
      this.rowData = res.dataPackageDTOList.map(obj => {
        let objRes: any = {}
        objRes = obj
        objRes.languageType = this.la
        return objRes
      });
      this.totalRecord = res.total;
      this.first = ((page - 1) * this.pageSize) + 1;
      this.last = this.first + this.rowData.length - 1;
      if (this.totalRecord % this.pageSize === 0) {
        this.totalPage = Math.floor(this.totalRecord / this.pageSize);
        this.rangeWithDots = this.commonService.pagination(
          this.page,
          this.totalPage
        );
      } else {
        this.totalPage = Math.floor(this.totalRecord / this.pageSize) + 1;
        this.rangeWithDots = this.commonService.pagination(
          this.page,
          this.totalPage
        );
      }
      this.gridApi.sizeColumnsToFit();
      this.gridApi.setRowData(this.rowData);
      this.removeStyle();
      this.changeDetectorRef.detectChanges();
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      code: [null],
      name: [null],
      levelSchool: [null]
    })
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit() {
    this.inputFocus.nativeElement.focus();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
    // this.resizeWidthScroll();
    this.removeStyle();
  }

  // resizeWidthScroll(): void {
  //   const scroll = (document.querySelector('.ag-body-horizontal-scroll-container') as HTMLElement)
  //   const allSemesterColumns = (document.querySelector('.ag-header-container') as HTMLElement)
  //   scroll.style.width = `${allSemesterColumns.offsetWidth}px`
  // }

  // ====================Excel=================
  exportExcel() {
    this.dataPackageService.export(this.searchDataExport);
  }

  // =========================Open Modal===================================
  openModalNewDataPackage() {
    console.log('list Service = ', this.listService);
    const dataAdd: any = {};
    dataAdd.listLevelSchool = this.levelSchool;
    dataAdd.isCreateNew = true;
    dataAdd.action = 'add';
    dataAdd.listService = this.listService;
    this.matDialog.open(
      CreateDataPackageComponent, {
        data: dataAdd,
        maxHeight: '90vh',
        disableClose: true,
        hasBackdrop: true,
        width: '860px',
        autoFocus: false,
      }
    ).afterClosed().subscribe((res) => {
      console.log(res);
      if (res.event != 'cancel') {
        this.search(1);
      }
    });
    setTimeout(this.changeInputPositionPoint, 500);
  }


  trans(key): string {
    return this.translate.instant(key)
  }
}
