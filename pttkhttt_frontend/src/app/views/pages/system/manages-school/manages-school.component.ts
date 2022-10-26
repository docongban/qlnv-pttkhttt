import {ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';import {MatDialog} from '@angular/material/dialog';
import {NO_ROW_GRID_TEMPLATE, PAGE_SIZE} from '../../../../helpers/constants';
import {ActionManagesSchoolComponent} from './action-manages-school/action-manages-school.component';
import {SchoolService} from '../../../../core/service/service-model/school.service';
import {ProvinceService} from '../../../../core/service/service-model/province.service';
import {SearchSchoolModel} from '../../../../core/service/model/search-school.model';
import {ApParamService} from '../../../../core/service/service-model/ap-param.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SchoolModel} from '../../../../core/service/model/school.model';
import * as moment from 'moment';
import {ToastrService} from 'ngx-toastr';
import {CommonServiceService} from '../../../../core/service/utils/common-service.service';
import {ViewSchoolComponent} from './view-school/view-school.component';
import {DataPackageService} from '../../../../core/service/service-model/data-package.service';
import {TranslateService} from '@ngx-translate/core';
import {Breadcrumb, SubheaderService} from '../../../../core/_base/layout/services/subheader.service';

@Component({
  selector: 'kt-manages-school',
  templateUrl: './manages-school.component.html',
  styleUrls: ['./manages-school.component.scss']
})
export class ManagesSchoolComponent implements OnInit {

  listStatus = [
    {
      id: 0,
      name: this.translate.instant('MANAGES_SCHOOL.STATUS_LOCK')
    },
    {
      id: 1,
      name: this.translate.instant('MANAGES_SCHOOL.STATUS_ACTIVE')
    }
  ]
  columnDefs;
  rowData;
  gridApi;
  gridColumnApi;
  headerHeight = 56;
  rowHeight = 50;
  defaultColDef;
  currentPage = 1;
  listProvices = [];
  listLevelSchool = [];
  listDataPackage = [];
  _pageSize = 10;
  _page = 1;
  searchSchool: SearchSchoolModel = new SearchSchoolModel();
  school: SchoolModel;
  createSchool: FormGroup;
  // paging
  totalSchool = 0;
  first = 1;
  last = 10;
  total = 0;
  totalPage = 0;
  rangeWithDots = [];
  schoolList: any[] = [];
  overlayNoRowsTemplate;
  type = 'password';
  errorSchool = {
    code:{
      error: false,
      message: '',
    },
    name:{
      error: false,
      message: '',
    },
    abbreviationName:{
      error: false,
      message: '',
    },
    levelSchool:{
      error: false,
      message: '',
    },
    provide: {
      error: false,
      message: '',
    },
    dataPackage: {
      error: false,
      message: '',
    },
    database:{
      error: false,
      message: '',
    },
    accountAdmin:{
      error: false,
      message: '',
    },
    password:{
      error: false,
      message: '',
    }
  }

  showPadding = true;
  breadCrumbs: Breadcrumb[] = [
    {
      title: this.translate.instant('MENU.MANAGER_SCHOOL.TITLE'),
      page: '/system/school/manages-school',
    },
  ]
  langKey;
  @ViewChild('templateNewSubject') public newSchool: TemplateRef<any>;
  modalRef: BsModalRef;  constructor(private modalService: BsModalService,
              private schoolService: SchoolService,
              private provinceService: ProvinceService,
              private apParamService: ApParamService,
              private fb: FormBuilder,
              private toastr: ToastrService,
              private commonService: CommonServiceService,
              private changeDetectorRef: ChangeDetectorRef,
              private dataPackageService: DataPackageService,
              private subHeaderService: SubheaderService,
              private translate: TranslateService) {
    this.subHeaderService.setBreadcrumbs(this.breadCrumbs);
    this.columnDefs = [
      {
        headerName: this.tran('MANAGES_SCHOOL.GRID.NO'),
        valueGetter: param => {
          return param.node.rowIndex + (((this._page - 1) * this._pageSize) + 1)
        },
        pinned: 'left',
        lockPosition:'true',
        minWidth: 60,
        maxWidth: 60,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          left: '6px'
        },
      },
      {
        // headerName: this.tran('MANAGES_SCHOOL.GRID.SCHOOL_CODE'),
        headerComponentParams :{
          template:'<span style="width:100%;"><div style=" ' +
            'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
            'text-transform: uppercase; max-width:100%;">' +
            `${this.translate.instant(`MANAGES_SCHOOL.GRID.SCHOOL_CODE`)}` +
            '</div>'+
            '</span>',
        },
        headerClass: 'fontTitle',
        field: 'code',
        pinned: 'left',
        lockPosition:'true',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          color: '#3366FF',
          top: '13px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        minWidth: 126,
        maxWidth: 126,
        tooltipField: 'code',
      },
      {
        // headerName: this.tran('MANAGES_SCHOOL.GRID.SCHOOL_NAME'),
        headerComponentParams :{
          template:'<span style="width:100%;"><div style=" ' +
            'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
            'text-transform: uppercase; max-width:100%;">' +
            `${this.translate.instant(`MANAGES_SCHOOL.GRID.SCHOOL_NAME`)}` +
            '</div>'+
            '</span>',
        },
        headerClass: 'fontTitle',
        field: 'name',
        pinned: 'left',
        lockPosition:'true',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          color: '#101840',
          top: '13px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        minWidth: 126,
        resizable: true,
        tooltipField: 'name',
      },
      {
        // headerName: this.tran('MANAGES_SCHOOL.GRID.ABBREVIATIONS'),
        headerComponentParams :{
          template:'<span style="width:100%;"><div style=" ' +
            'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
            'text-transform: uppercase; max-width:100%;">' +
            `${this.translate.instant(`MANAGES_SCHOOL.GRID.ABBREVIATIONS`)}` +
            '</div>'+
            '</span>',
        },
        headerClass: 'fontTitle',
        field: 'abbreviationName',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          color: '#101840',
          top: '13px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        minWidth: 126,
        tooltipField: 'abbreviationName',
      },
      {
        // headerName: this.tran('MANAGES_SCHOOL.GRID.LEVEL_SCHOOL'),
        headerComponentParams :{
          template:'<span style="width:100%;"><div style=" ' +
            'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
            'text-transform: uppercase; max-width:100%;">' +
            `${this.translate.instant(`MANAGES_SCHOOL.GRID.LEVEL_SCHOOL`)}` +
            '</div>'+
            '</span>',
        },
        headerClass: 'fontTitle',
        field: 'levelSchoolName',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          color: '#101840',
          top: '13px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        minWidth: 126,
        tooltipField: 'levelSchoolName',
      },
      {
        // headerName: this.tran('MANAGES_SCHOOL.GRID.PROVINCE_CITY'),
        headerComponentParams :{
          template:'<span style="width:100%;"><div style=" ' +
            'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
            'text-transform: uppercase; max-width:100%;">' +
            `${this.translate.instant(`MANAGES_SCHOOL.GRID.PROVINCE_CITY`)}` +
            '</div>'+
            '</span>',
        },
        headerClass: 'fontTitle',
        field: 'provinceName',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          color: '#101840',
          top: '13px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        minWidth: 126,
        tooltipField: 'provinceName',
      },
      {
        // headerName: this.tran('MANAGES_SCHOOL.GRID.DATA_PACKAGE'),
        headerComponentParams :{
          template:'<span style="width:100%;"><div style=" ' +
            'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
            'text-transform: uppercase; max-width:100%;">' +
            `${this.translate.instant(`MANAGES_SCHOOL.GRID.DATA_PACKAGE`)}` +
            '</div>'+
            '</span>',
        },
        headerClass: 'fontTitle',
        field: 'dataPackageName',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          color: '#101840',
          top: '13px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        minWidth: 150,
        tooltipField: 'dataPackageName',
      },
      {
        // headerName: this.tran('MANAGES_SCHOOL.GRID.STATUS'),
        headerComponentParams :{
          template:'<span style="width:100%;"><div style=" ' +
            'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
            'text-transform: uppercase; max-width:100%;">' +
            `${this.translate.instant(`MANAGES_SCHOOL.GRID.STATUS`)}` +
            '</div>'+
            '</span>',
        },
        headerClass: 'fontTitle',
        field: 'status',
        valueGetter: param => {
          // tslint:disable-next-line:max-line-length
          return param.data == null ? '' : param.data.status === 1 ? this.translate.instant('MANAGES_SCHOOL.STATUS_ACTIVE') : this.translate.instant('MANAGES_SCHOOL.STATUS_LOCK')
        },
        tooltipValueGetter: param => {
          // tslint:disable-next-line:max-line-length
          return param.data == null ? '' : param.data.status === 1 ? this.translate.instant('MANAGES_SCHOOL.STATUS_ACTIVE') : this.translate.instant('MANAGES_SCHOOL.STATUS_LOCK')
        },
        cellStyle: param=>{
          let color = '';
          if(param.data.status === 0){
            color = '#D14343';
          }else{
            color = '#52BD94';
          }
          return{
            'font-weight': '500',
            'font-size': '12px',
            top: '13px',
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis',
            overflow: 'hidden',
            color: color,
          }
        },
        minWidth: 126,
        maxWidth: 126,
      },
      {
        // headerName: this.tran('MANAGES_SCHOOL.GRID.CREATE_DATE'),
        headerComponentParams :{
          template:'<span style="width:100%;"><div style=" ' +
            'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' +
            'text-transform: uppercase; max-width:100%;">' +
            `${this.translate.instant(`MANAGES_SCHOOL.GRID.CREATE_DATE`)}` +
            '</div>'+
            '</span>',
        },
        headerClass: 'fontTitle',
 		    field: 'createdTime',
        cellRenderer: param => {
          return `${moment(param.data.createdTime).format('DD/MM/YYYY')}`
        },
        tooltipValueGetter: param => {
          return `${moment(param.data.createdTime).format('DD/MM/YYYY')}`
        },
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          color: '#101840',
          top: '13px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        minWidth: 126,
        maxWidth: 126,
      },
      {
        headerName: '',
        field: '',
        cellRendererFramework: ViewSchoolComponent,
        minWidth: 150,
        maxWidth: 150,
        cellStyle:{
          display: 'flex',
          'align-items': 'center',
        }
      },
      {
        headerName: '',
        suppressMovable: true,
        field: '',
        cellRendererFramework: ActionManagesSchoolComponent,
        minWidth: 50,
        maxWidth: 50,
      },
    ];
    this.langKey = (localStorage.getItem('language'));
    this.searchSchool.code = '';
    this.searchSchool.name = '';
    this.searchSchool.levelSchool = null;
    this.searchSchool.provinceId = null;
    this.searchSchool.status = 1;
    this.searchSchool.langKey = this.langKey;
    this.overlayNoRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('MANAGES_SCHOOL.NO_INFO'));
  }

 	ngOnInit(): void {
    this.getProvince();
    this.getLevelSchool();
    this.findSchool(this._page);
	}
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    this.gridApi.setRowData(this.rowData);
  }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
    this.removeStyle();
  }

  openModalNewSchool(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'addnew-school-md modal-dialog-custom' })
    );
    this.school = new SchoolModel();
    this.school.status = 1;
    this.school.dataPackageCode = null;
    this.listDataPackage = null;
    this.errorSchool.code.error = false;
    this.errorSchool.name.error = false;
    this.errorSchool.abbreviationName.error = false;
    this.errorSchool.levelSchool.error = false;
    this.errorSchool.dataPackage.error = false;
    this.errorSchool.database.error = false;
    this.errorSchool.accountAdmin.error = false;
    this.errorSchool.password.error = false;
    this.type = 'password';
  }

  buildForm(){
    this.createSchool = this.fb.group({
      code: [null, Validators.required],
      name: [null, Validators.required],
      provincesId: [''],
      levelSchool: [''],
      packege: [''],
      status: [''],
      admin: [null, Validators.required],
      password: [null, Validators.required],
    });
  }
  // Ds tỉnh thành phố
  getProvince(){
    this.provinceService.getAll().subscribe(res =>{
      this.listProvices = res;
      let list = [];
      res.forEach(item => {
        let customItem = {};
        if(this.langKey === 'la')
          customItem = {...item, name: item.prName};
        else
          customItem = {...item, name: item.prNameEn}
        list = [...list, customItem];
      });
      this.listProvices = list;
      console.log(this.listProvices);
    })
  }

  // Ds cấp trường
  getLevelSchool(){
    this.apParamService.getListByType('LEVEL_SCHOOL').subscribe(res =>{
      this.listLevelSchool = res;
      console.log(this.listLevelSchool);
    })
    this.listDataPackage = null;
  }

  // Ds cấp các gói
  changeDataPackage(){
    this.listDataPackage = [];
    this.school.dataPackageCode = null;
    this.validateLevelSchool();
    this.dataPackageService.getAllLeveLSchool(this.school.levelShool).subscribe(res=>{
      let list = [];
      res.forEach(item => {
        let customItem = {};
        customItem = {...item, name: item.code + ' - ' + item.name};
        list = [...list, customItem];
      });
      this.listDataPackage = list;
    })
  }

  // Tìm kiếm trương
  onSearch(){
    console.log(this.searchSchool);
    this.schoolService.search(this.searchSchool, this._page, this._pageSize).subscribe(res=>{
      this.schoolList = res.schoolDTOList;
      this.changeDetectorRef.detectChanges();
      // Paging
      this.totalSchool = res.totalRecord;
      this.first = ((this._page - 1) * this._pageSize) +1;
      this.last = this.first + this.schoolList.length -1;
      if (this.totalSchool % this._pageSize === 0) {
        this.totalPage =  Math.floor(this.totalSchool / this._pageSize);
        this.rangeWithDots = this.commonService.pagination(
          this._page,
          this.totalPage
        );
      }else{
        this.totalPage =  Math.floor(this.totalSchool / this._pageSize) + 1;
        this.rangeWithDots = this.commonService.pagination(
          this._page,
          this.totalPage
        );
      }
      this.gridApi.setRowData(this.schoolList);
    })
  }

  // Export dataexcel
  exportData(){
    this.schoolService.export(this.searchSchool).subscribe((res)=>{
      const file = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const fileURL = URL.createObjectURL(file);
      const anchor = document.createElement('a');
      // anchor.download = `DS_truonghoc`;
      anchor.download = this.tran('MANAGES_SCHOOL.NAME_FILE');
      anchor.href = fileURL;
      anchor.click();
    });
  }
  // Thêm trường học mới
  onSubmit(){
    this.validateTMSchool();
    if(this.isEmpty(this.school.dataPackageCode)){
      this.errorSchool.dataPackage.error = true;
      this.errorSchool.dataPackage.message = this.translate.instant('MANAGES_SCHOOL.DATA_PACKAGE_BLANK');
      return;
    }
    if(this.errorSchool.code.error === true
      || this.errorSchool.name.error === true
      || this.errorSchool.abbreviationName.error === true
      || this.errorSchool.levelSchool.error === true
      || this.errorSchool.dataPackage.error === true
      || this.errorSchool.database.error === true
      || this.errorSchool.accountAdmin.error === true
      || this.errorSchool.password.error === true){
      this.validateTMSchool();
      return;
    }
    this.schoolService.createSchool(this.school).subscribe(res=>{
      this.modalRef.hide();
      this.toastr.success(this.translate.instant('MANAGES_SCHOOL.SAVE_SUCESS'));
      this.findSchool(1);
    },error => {
      this.toastr.error(this.translate.instant('MANAGES_SCHOOL.SAVE_FAILSE'));
    })
  }

  // ---- phân trang
  page(page: number): void {
    this._page = page
    this.findSchool(page);
  }

  prev(): void {
    this._page--
    if (this._page < 1) {
      this._page = 1
      return
    }
    console.log(this._page);
    this.findSchool(this._page);
  }

  next(): void {
    this._page++
    if (this._page > this.totalPage) {
      this._page = this.totalPage;
      return;
    }
    this.findSchool(this._page);
  }

  findSchool(page:number) {
    this._page = page;
    this.schoolService.search(this.searchSchool, page, this._pageSize).subscribe(res => {
      this.schoolList = res.schoolDTOList;
      if(this.schoolList.length === 0){
        this.showPadding = false;
      }else{
        this.showPadding = true;
      }
      this.totalSchool = res.totalRecord;
      this.first = ((page - 1) * this._pageSize) +1;
      this.last = this.first + this.schoolList.length -1;
      if (this.totalSchool % this._pageSize === 0) {
        this.totalPage =  Math.floor(this.totalSchool / this._pageSize);
        this.rangeWithDots = this.commonService.pagination(
          this._page,
          this.totalPage
        );
      }else{
        this.totalPage =  Math.floor(this.totalSchool / this._pageSize) + 1;
        this.rangeWithDots = this.commonService.pagination(
          this._page,
          this.totalPage
        );
      }
      this.gridApi.setRowData(this.schoolList);
      this.changeDetectorRef.detectChanges();
    });
  }

  // validate thêm mới
  validateTMSchool(): void{
    this.validatePassword();
    this.validateName();
    this.validateCode();
    this.validateAbbreviationName();
    this.validateLevelSchool();
    this.validateDatabase();
    this.validateDataPackage();
    this.validateAcoountAdmin();
  }
  isEmpty(data: any): boolean {
    return data === null || data === undefined || data === ''
  }
  // Code
  validateCode(){
    if(this.isEmpty(this.school.code)){
      this.errorSchool.code.error = true;
      // this.errorSchool.code.message = 'Mã trường không được để trống!';
      this.errorSchool.code.message = this.translate.instant('MANAGES_SCHOOL.MSG.SCHOOL_CODE_BLANK');
      return;
    }else{
      if(this.school.code.length > 50){
        this.errorSchool.code.error = true;
        // this.errorSchool.code.message = 'Mã trường có độ dài 50 ký tự!';
        this.errorSchool.code.message = this.translate.instant('MANAGES_SCHOOL.MSG.SCHOOL_CODE_MAXLENGHT');
        return;
      }else{
        const ad = this.school.code.trim().split(' ');
        if(ad.length > 1){
          this.errorSchool.code.error = true;
          // this.errorSchool.code.message = 'Mã trường không được có dấu cách!';
          this.errorSchool.code.message = this.translate.instant('MANAGES_SCHOOL.MSG.SCHOOL_CODE_SPACE');
          return;
        }else{
          this.schoolService.getByCode(this.school.code.trim()).subscribe(res=>{
            console.log(res);
            if(res !== null){
              this.errorSchool.code.error = true;
              // this.errorSchool.code.message = 'Mã trường đã tồn tại';
              this.errorSchool.code.message = this.translate.instant('MANAGES_SCHOOL.MSG.SCHOOL_CODE_NOT_EXIT');
              return;
            }else{
              this.errorSchool.code.error = false;
            }
          })
          return;
        }
      }
    }
    this.errorSchool.code.error = false;
  }
  // Tên trường
  validateName(){
    if(this.isEmpty(this.school.name)){
      this.errorSchool.name.error = true;
      // this.errorSchool.name.message = 'Tên trường không được để trống!';
      this.errorSchool.name.message = this.translate.instant('MANAGES_SCHOOL.MSG.SCHOOL_NAME_BLANK');
      return;
    }else{
      if(this.school.name.length > 250){
        this.errorSchool.name.error = true;
        // this.errorSchool.name.message = 'Tên trường có độ dài 250 ký tự!';
        this.errorSchool.name.message = this.translate.instant('MANAGES_SCHOOL.MSG.SCHOOL_NAME_MAXLENGHT');
        return;
      }
    }
    this.errorSchool.name.error = false;
  }
  // Tên viết tắt
  validateAbbreviationName(){
    if(this.isEmpty(this.school.abbreviationName)){
      this.errorSchool.abbreviationName.error = true;
      // this.errorSchool.abbreviationName.message = 'Tên viết tắt không được để trống!';
      this.errorSchool.abbreviationName.message = this.translate.instant('MANAGES_SCHOOL.MSG.ABBREVIATIONS_BLANK');
      return;
    }else{
      if(this.school.abbreviationName.length > 250){
        this.errorSchool.abbreviationName.error = true;
        this.errorSchool.abbreviationName.message = this.translate.instant('MANAGES_SCHOOL.MSG.ABBREVIATIONS_MAXLENGHT');
        return;
      }
    }
    this.errorSchool.abbreviationName.error = false;
  }
  // Cấp trường
  validateLevelSchool(){
    if(this.isEmpty(this.school.levelShool)){
      this.errorSchool.levelSchool.error = true;
      this.errorSchool.levelSchool.message = this.translate.instant('MANAGES_SCHOOL.MSG.LEVEL_SCHOOL_BLANK');
      return;
    }
    this.errorSchool.levelSchool.error = false;
  }
  // Gói cước
  validateDataPackage(){
    if(this.isEmpty(this.school.dataPackageCode)){
      this.errorSchool.dataPackage.error = true;
      this.errorSchool.dataPackage.message = this.translate.instant('MANAGES_SCHOOL.DATA_PACKAGE_BLANK');
      return;
    }
    this.errorSchool.dataPackage.error = false;
  }
  // Database
  validateDatabase(){
    if(this.isEmpty(this.school.database?.trim())){
      this.errorSchool.database.error = true;
      this.errorSchool.database.message = this.translate.instant('MANAGES_SCHOOL.DATABASE.BLANK');
      return;
    }
    if(this.school.database.length > 250){
      this.errorSchool.database.error = true;
      this.errorSchool.database.message = this.translate.instant('MANAGES_SCHOOL.DATABASE.MAX');
      return;
    }
    this.errorSchool.database.error = false;
  }
  // Tài khoản admin
  validateAcoountAdmin(){
    if(this.isEmpty(this.school.accountAdmin)){
      this.errorSchool.accountAdmin.error = true;
      this.errorSchool.accountAdmin.message = this.translate.instant('MANAGES_SCHOOL.ADMIN.BLANK');
      return;
    }else{
      if(this.school.accountAdmin.length > 50){
        this.errorSchool.accountAdmin.error = true;
        this.errorSchool.accountAdmin.message = this.translate.instant('MANAGES_SCHOOL.ADMIN.MAX');
        return;
      }
      // space giữa các ký tự
      const ad = this.school.accountAdmin.trim().split(' ');
      if(ad.length > 1){
        this.errorSchool.accountAdmin.error = true;
        this.errorSchool.accountAdmin.message = this.translate.instant('MANAGES_SCHOOL.ADMIN.SPACE');
        return;
      }
    }
    this.errorSchool.accountAdmin.error = false;
  }
  // Password
  validatePassword(){
    if(this.isEmpty(this.school.password)){
      this.errorSchool.password.error = true;
      this.errorSchool.password.message = this.translate.instant('MANAGES_SCHOOL.PASSWORD.BLANK');
      return;
    }else{
      if(this.school.password.length > 20){
        this.errorSchool.password.error = true;
        this.errorSchool.password.message = this.translate.instant('MANAGES_SCHOOL.PASSWORD.MAX');
        return;
      }
      // space giữa các ký tự
      const ad = this.school.password.trim().split(' ');
      if(ad.length > 1){
        this.errorSchool.password.error = true;
        this.errorSchool.password.message = this.translate.instant('MANAGES_SCHOOL.PASSWORD.SPACE');
        return;
      }
    }
    this.errorSchool.password.error = false;
  }

  // input password
  changeType(){
    if(this.type === 'password'){
      this.type = 'text';
    }else
      this.type = 'password';
  }

  // reload when change status
  listenReload() {
    this.schoolService.isReload$.subscribe(val => {
      if (val) {
        console.log(val)
        this.findSchool(this._page);
      }
    });
  }
  tran(key): string {
    return this.translate.instant(key)
  }

  removeStyle() {
    var removeStyle = document.querySelector('.ag-center-cols-container') as HTMLElement;
    var currentValue =  removeStyle.style.getPropertyValue('width');
    var newCurrentValueFloat = currentValue.slice(0,-2);
    var newCurrentValueInt = Math.round(parseFloat(newCurrentValueFloat));
    var newValue = newCurrentValueInt + 20;
    removeStyle.style.width=`${newValue}px`;
  }

}
