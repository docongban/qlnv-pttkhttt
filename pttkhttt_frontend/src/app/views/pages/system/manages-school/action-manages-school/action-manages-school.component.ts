import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';
import {SchoolService} from '../../../../../core/service/service-model/school.service';
import {ToastrService} from 'ngx-toastr';
import {SchoolModel} from '../../../../../core/service/model/school.model';
import {DataPackageService} from '../../../../../core/service/service-model/data-package.service';
import {ManagesSchoolComponent} from '../manages-school.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'kt-action-manages-school',
  templateUrl: './action-manages-school.component.html',
  styleUrls: ['./action-manages-school.component.scss']
})

export class ActionManagesSchoolComponent implements OnInit , ICellRendererAngularComp{

  rowIndex;
  type = 'password';
  listDemo = [
    {
      id: 1,
      name: ''
    }
  ];
  demo;
  listStatus = [
    {
      id: 0,
      // name: 'Khóa',
      name: this.translate.instant('MANAGES_SCHOOL.STATUS_LOCK')
    },
    {
      id: 1,
      // name: 'Đang hoạt động'
      name: this.translate.instant('MANAGES_SCHOOL.STATUS_ACTIVE')
    }
  ]
  errorSchool = {
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
  @ViewChild('templateNewSubject') public newSchool: TemplateRef<any>;
  modalRef: BsModalRef;
  school: any;
  listDataPackage = [];
  cellValue;
  schoolUpdate: SchoolModel = new SchoolModel();
  constructor(private modalService: BsModalService,
              private schoolService: SchoolService,
              private toastr: ToastrService,
              private dataPackageService: DataPackageService,
              private managesSchool: ManagesSchoolComponent,
              private translate: TranslateService) { }

  ngOnInit(): void {
  }

  agInit(params ): void {
    this.cellValue = params;
    this.rowIndex = +params.rowIndex + 1;
    this.school = params.data;
  }
  openModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'addnew-unit-md modal-dialog-custom' })
    );
    // Thông tin của trường theo id
    this.schoolService.getById(this.school.id).subscribe(res=>{
      this.schoolUpdate = res;
      console.log(this.schoolUpdate);
      console.log(this.schoolUpdate.hashPassword);
      this.dataPackageService.getAllLeveLSchool(res.levelShool).subscribe(resAPI=>{
        let list = [];
        resAPI.forEach(item => {
          let customItem = {};
          customItem = {...item, name: item.code + ' - ' + item.name};
          list = [...list, customItem];
        });
        this.listDataPackage = list;
      })
    })
    // this.getDataPackage();
    this.errorSchool = {
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
  }
  // Danh sách gói cước theo cấp học
  getDataPackage(){
    this.listDataPackage = [];
    this.dataPackageService.getAllLeveLSchool(this.schoolUpdate.levelShool).subscribe(res=>{
      this.listDataPackage = res;
      console.log(res);
    })
  }
  deleteSchool(){
    this.schoolService.deleteSchool(this.school.id).subscribe(res=>{
      this.schoolService.changeIsReload(true);
      this.modalRef.hide();
      this.managesSchool.page(1);
      this.toastr.success(this.translate.instant('MANAGES_SCHOOL.DELETE_SUCESS'));
    }, error => {
      this.toastr.error(this.translate.instant('MANAGES_SCHOOL.DELETE_FAILSE'));
    })
  }

  updateSchool(){
    this.validateUpdate();
    if(this.errorSchool.accountAdmin.error === true
      || this.errorSchool.password.error === true
      || this.errorSchool.database.error === true
      || this.errorSchool.dataPackage.error === true){
      return;
    }
    this.schoolService.updateSchool(this.schoolUpdate).subscribe(res=>{
      this.schoolService.changeIsReload(true);
      this.modalRef.hide();
      this.managesSchool.page(1);
      this.toastr.success(this.translate.instant('MANAGES_SCHOOL.UPDATE_SUCESS'));
    }, error => {
      this.toastr.error(this.translate.instant('MANAGES_SCHOOL.UPDATE_FAILSE'));
    })
  }

  refresh(params) {
    return true;
  }

  // validate
  validateUpdate():void{
    this.validateDataPackage();
    this.validateAcoountAdmin();
    this.validateDatabase();
    this.validatePassword();
  }
  isEmpty(data: any): boolean {
    return data === null || data === undefined || data === ''
  }
  // Gói cước
  validateDataPackage(){
    if(this.isEmpty(this.schoolUpdate.dataPackageCode)){
      this.errorSchool.dataPackage.error = true;
      this.errorSchool.dataPackage.message = this.translate.instant('MANAGES_SCHOOL.DATA_PACKAGE_BLANK');
      return;
    }
    this.errorSchool.dataPackage.error = false;
  }
  // Database
  validateDatabase(){
    if(this.isEmpty(this.schoolUpdate.database.trim())){
      this.errorSchool.database.error = true;
      this.errorSchool.database.message = this.translate.instant('MANAGES_SCHOOL.DATABASE.BLANK');
      return;
    }else{
      if(this.schoolUpdate.database.length > 250){
        this.errorSchool.database.error = true;
        this.errorSchool.database.message = this.translate.instant('MANAGES_SCHOOL.DATABASE.MAX');
        return;
      }
    }
    this.errorSchool.database.error = false;
  }
  // Tài khoản admin
  validateAcoountAdmin(){
    if(this.isEmpty(this.schoolUpdate.accountAdmin)){
      this.errorSchool.accountAdmin.error = true;
      this.errorSchool.accountAdmin.message = this.translate.instant('MANAGES_SCHOOL.ADMIN.BLANK');
      return;
    }else{
      if(this.schoolUpdate.accountAdmin.length > 50){
        this.errorSchool.accountAdmin.error = true;
        this.errorSchool.accountAdmin.message = this.translate.instant('MANAGES_SCHOOL.ADMIN.MAX');
        return;
      }
      // space giữa các ký tự
      const ad = this.schoolUpdate.accountAdmin.trim().split(' ');
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
    if(this.isEmpty(this.schoolUpdate.password)){
      this.errorSchool.password.error = true;
      this.errorSchool.password.message = this.translate.instant('MANAGES_SCHOOL.PASSWORD.BLANK');
      return;
    }else{
      if(this.schoolUpdate.password.length > 20){
        this.errorSchool.password.error = true;
        this.errorSchool.password.message = this.translate.instant('MANAGES_SCHOOL.PASSWORD.MAX');
        return;
      }
      // space giữa các ký tự
      const ad = this.schoolUpdate.password.trim().split(' ');
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
}
