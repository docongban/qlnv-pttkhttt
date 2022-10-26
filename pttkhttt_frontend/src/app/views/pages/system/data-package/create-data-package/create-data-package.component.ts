import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
  Pipe,
  PipeTransform,
  ElementRef,
  Optional,
  Inject
} from '@angular/core';
import {BsModalRef, BsModalService, ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as moment from 'moment';
import {equals} from '@ngx-translate/core/lib/util';
import {forEach} from 'ag-grid-community/dist/lib/utils/array';
import {GetData} from 'src/app/core/service/actions/school-information-action';
import {FormBuilder, FormGroup} from '@angular/forms';
import {first} from 'lodash';
import {forkJoin} from 'rxjs';
import {DataPackageService} from 'src/app/core/service/service-model/data-package.service';
import {JobTransferHistoryService} from 'src/app/core/service/service-model/job-transfer-history.service';
import {PriceDirective} from './PriceDirective';
import {TranslateService} from '@ngx-translate/core';
import {ApParamService} from '../../../../../core/service/service-model/ap-param.service';


@Component({
  selector: 'kt-create-data-package',
  templateUrl: './create-data-package.component.html',
  styleUrls: ['./create-data-package.component.scss']
})
export class CreateDataPackageComponent implements OnInit, AfterViewInit {

  @ViewChild('disable1', {static: false}) disable1: ElementRef;
  @ViewChild('disable2', {static: false}) disable2: ElementRef;
  @ViewChild('disable3', {static: false}) disable3: ElementRef;
  @ViewChild('focusInput', {static: false}) focus: ElementRef<HTMLInputElement>;

  isCreateNew = false;
  schoolLevels = [];
  listServices = [];
  form;
  datas;
  action;
  isSubmit = false;
  isFirstTimeload = true;
  isReadOnly = true;
  hide = true;

  dataPackageType = [
    {
      id: 0,
      name: this.translateService.instant('PACKAGE_MANAGEMENT.SUB_PACKAGE')
    },
    {
      id: 1,
      name: this.translateService.instant('PACKAGE_MANAGEMENT.PRIMARY_PACKAGE1')
    }
  ];

  dataSemesterApplyDefalut = [
    {
      id: 1,
      name: this.translateService.instant('PACKAGE_MANAGEMENT.SEMESTER1')
    },
    {
      id: 2,
      name: this.translateService.instant('PACKAGE_MANAGEMENT.SEMESTER2')
    },
    {
      id: 3,
      name: this.translateService.instant('PACKAGE_MANAGEMENT.SEMESTER3')
    },
    {
      id: 4,
      name: this.translateService.instant('PACKAGE_MANAGEMENT.SEMESTER4')
    }
  ];

  dataSemesterApply = [];

  quantitySemester = [2, 3, 4];

  listPrimaryPackage;


  // ====================data in form============================
  code = {
    value: null,
    error: null,
    message: ''
  }

  schoolLevel = {
    value: [],
    error: null,
    message: ''
  }

  name = {
    value: null,
    error: null,
    message: ''
  }

  typePackage = {
    value: null,
    error: null,
    message: ''
  }

  primaryPackage = {
    value: null,
    error: null,
    message: ''
  }

  quantitySemesterApply = {
    value: null,
    error: null,
    message: ''
  }

  quantitySMS = {
    value: null,
    error: null,
    message: ''
  }

  semesterApply = {
    value: null,
    error: null,
    message: ''
  }

  prices = {
    value: '',
    error: null,
    message: ''
  }

  service1 = {
    value: [],
    error: null,
    message: ''
  }

  constructor(
    public dialogRef: MatDialogRef<CreateDataPackageComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private dataPackageService: DataPackageService,
    private translateService: TranslateService,
    private apParamService: ApParamService
  ) {
    this.schoolLevels = data.listLevelSchool;
    this.listServices = data.listService;
    const listCustom = [];
    this.listServices.forEach(e => {
      if (e.code.toUpperCase().includes('CONTACT_BOOK')) {
        listCustom.push(e);
      }
    })

    this.listServices.forEach(e => {
      if (e.code.toUpperCase().includes('ONLINE_LEARNING')) {
        listCustom.push(e);
      }
    })

    this.listServices.forEach(e => {
      if (e.code.toUpperCase().includes('ONLINE_EXAM')) {
        listCustom.push(e);
      }
    })

    this.listServices = listCustom;


    this.isCreateNew = data.isCreateNew;
    this.action = data.action;
    this.datas = data;
    this.buildForm();
  }

  ngAfterViewInit() {
    if (this.typePackage.value === 1) {
      (<any>this.disable1).setDisabledState(true);
      (<any>this.disable2).setDisabledState(true);
      (<any>this.disable3).setDisabledState(true);
    } else {
      setTimeout(() => {
        this.semesterApply.value = parseInt(this.datas.oldData.semesterApply);
      }, 0);
    }
    this.isFirstTimeload = false;
    this.focus.nativeElement.focus();
  }

  ngOnInit(): void {
    this.getData();
    this.loadForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      id: [null],
      code: [null],
      listLevelSchool: [null],
      name: [null],
      typePackage: [null],
      primaryPackage: [null],
      quantitySemesterApply: [null],
      quantitySms: [null],
      semesterApply: [null],
      prices: [null],
      listService: [null],
    });
    setTimeout(() => {
      this.resetData();
    }, 0);
  }

  resetData() {
    setTimeout(() => {
      this.code.error = false;
      this.name.error = false;
      this.schoolLevel.error = false;
      this.primaryPackage.error = false;
      this.quantitySMS.error = false;
      this.prices.error = false;
      this.service1.error = false;
    }, 100);
  }

  loadForm() {
    if (this.action == 'add') {
      this.isReadOnly = false;
      this.typePackage.value = 1;

    }
    if (this.action == 'edit') {
      this.code.value = this.datas.oldData.code;
      this.form.get('id').setValue(this.datas.oldData.id);
      this.typePackage.value = this.datas.oldData.typePackage;
      this.name.value = this.datas.oldData.name;
      this.quantitySMS.value = this.datas.oldData.quantitySms;
      if (this.datas.oldData.responsePrice.toString().split('.')[1] == '00') {
        this.prices.value = this.datas.oldData.responsePrice.toString().split('.')[0];
      } else {
        if ((this.datas.oldData.responsePrice.toString().split('.')[1])[1] == '0') {
          this.prices.value = this.datas.oldData.responsePrice.toString().split('.')[0]
            + '.' + (this.datas.oldData.responsePrice.toString().split('.')[1])[0];
        } else {
          this.prices.value = this.datas.oldData.responsePrice.toString().split(',').join('.');
        }
      }
      this.primaryPackage.value = this.datas.oldData.primaryPackage;
      let levelData = this.datas.oldData.levelSchool.split(',');
      levelData.forEach(element => {
        this.schoolLevel.value.push(element);
      });

      let serviceData = this.datas.oldData.service.split(',');
      serviceData.forEach(e => {
        this.service1.value.push(e);
      })

      this.changeDetectorRef.detectChanges();
      setTimeout(() => {
        if (this.typePackage.value == 0) {
          this.quantitySemesterApply.value = this.datas.oldData.quantitySemesterApply;
        }
      }, 0);
    }
  }

  getData() {
    console.log(this.datas);
    if (!this.datas.isCreateNew) {
      this.dataPackageService.checkUpdate(this.datas.oldData).subscribe((res) => {
        if (res.data.includes(true)) {
          this.isReadOnly = true;
        } else {
          this.isReadOnly = false;
        }
      })
    }
    this.dataPackageService.getListPrimary(this.datas).subscribe((res) => {
      this.listPrimaryPackage = res.map(item => {
        return {
          code: item.code,
          name: item.code + ' - ' + item.name,
          levelSchool: item.levelSchool
        }
      });
      this.changeDetectorRef.detectChanges();
    })
    console.log(this.listPrimaryPackage);
  }

  closeModal() {
    this.dialogRef.close({event: 'cancel'});
  }


// ==========================validate ============================

  checkPrimaryPackage() {
    console.log('abc')

    if (this.isFirstTimeload) {
      return;
    }
    if (this.primaryPackage.value == null || this.primaryPackage.value == undefined) {
      if (this.typePackage.value == 0) {
        this.primaryPackage.error = true;
        this.primaryPackage.message = this.translateService.instant('PACKAGE_MANAGEMENT.PRIMARY_PACKAGE_NOT_EMPTY');
      } else {
        this.primaryPackage.error = false;
        this.primaryPackage.message = '';
      }
      if (this.typePackage.value === 1) {
        this.service1.value = [];
        this.listServices.forEach(e => {
          if (e.code === 'CONTACT_BOOK') {
            e.disabled = true;
          }
          this.service1.value.push(e.code);
        })
        this.changeDetectorRef.detectChanges();
      } else {
        this.service1.value = [];
        this.changeDetectorRef.detectChanges();
      }
    } else {

      this.primaryPackage.error = false;
      this.primaryPackage.message = '';
      const levelData = this.listPrimaryPackage.find(value => value.code == this.primaryPackage.value).levelSchool.split(',');
      this.schoolLevel.value = [];
      //console.log("level-data:",levelData)
      levelData.forEach(element => {
        this.schoolLevel.value.push(element);
      });
      this.changeDetectorRef.detectChanges();
      console.log("school-Level:",this.schoolLevel.value)
      if (this.typePackage.value === 1) {
        this.service1.value = [];
        this.listServices.forEach(e => {
          if (e.code === 'CONTACT_BOOK') {
            e.disabled = true;
          }
          this.service1.value.push(e.code);
        })
        this.changeDetectorRef.detectChanges();
      } else {
        this.service1.value = [];
        this.apParamService.getAllByDataPackageCode(this.primaryPackage.value).subscribe(e => {
          const a = [];
          e.forEach(e1 => {
            a.push(e1.code);
          })
          console.log(a);
          this.service1.value = a;
          this.changeDetectorRef.detectChanges();

        })
      }
    }
    //console.log("school-Level:",this.schoolLevel.value)
  }

  checkQuantitySemesterApply() {
    this.semesterApply.error = false;
    if (this.quantitySemesterApply.value == null || this.quantitySemesterApply.value == undefined) {
      this.semesterApply.value = null;
    } else {
      this.dataSemesterApply = this.dataSemesterApplyDefalut.slice(0, this.quantitySemesterApply.value);
      this.semesterApply.value = this.dataSemesterApply[0].id;
    }
  }

  checkService() {
    console.log('service:', this.service1.value);
    // if(this.service1.value.length > 0){
    //   this.service1.error = false;
    //   this.service1.message = '';
    // }else{
    //   this.service1.error = true;
    //   this.service1.message = this.translateService.instant('PACKAGE_MANAGEMENT.SERVICE_NOT_EMPTY')
    // }
  }

  checkTypePackage() {
    if (this.isFirstTimeload) {
      if (this.action === 'add') {
        this.service1.value = [];
        this.listServices.forEach(e => {
          if (e.code === 'CONTACT_BOOK') {
            e.disabled = true;
          }
          this.service1.value.push(e.code);
          console.log(this.service1.value)
        })
      } else {
        this.listServices.forEach(e => {
          if (e.code === 'CONTACT_BOOK') {
            e.disabled = true;
          }
        })
      }
      return;
    }
    if (this.typePackage.value === 1) {
      this.service1.value = [];
      this.schoolLevel.value = [];
      const a = [];
      this.listServices.forEach(e => {
        if (e.code === 'CONTACT_BOOK') {
          e.disabled = true;
        }
        a.push(e.code);
      })
      this.service1.value = a;
      console.log(this.service1.value);
      this.changeDetectorRef.detectChanges();
      this.quantitySemesterApply.value = null;
      this.primaryPackage.value = null;
      this.primaryPackage.error = false;
      if (this.disable1 !== undefined) {
        (<any>this.disable1).setDisabledState(true);
      }
      if (this.disable2 !== undefined) {
        (<any>this.disable2).setDisabledState(true);
      }
      if (this.disable3 !== undefined) {
        (<any>this.disable3).setDisabledState(true);
      }
    } else {
      this.service1.value = [];
      this.schoolLevel.value = [];
      this.service1.value.push('CONTACT_BOOK');
      this.service1.value.push('ONLINE_LEARNING');
      this.service1.value.push('ONLINE_EXAM');
      this.changeDetectorRef.detectChanges();
      (<any>this.disable1).setDisabledState(false);
      (<any>this.disable2).setDisabledState(false);
      (<any>this.disable3).setDisabledState(false);
      this.quantitySemesterApply.value = this.quantitySemester[0];
    }
  }

  checkPrices(event) {
    const reg = new RegExp(/^[0-9]+\.?\d{0,2}$/g);
    event = event.replaceAll(',', '');
    // event = event.replace(',','');
    if (this.prices.value == null || this.prices.value == undefined || this.prices.value.trim() == '') {
      this.prices.error = true;
      this.prices.message = this.translateService.instant('PACKAGE_MANAGEMENT.PRICES_NOT_EMPTY');
    } else {
      if (event.replace('.', '').length > 20) {
        this.prices.error = true;
        this.prices.message = this.translateService.instant('PACKAGE_MANAGEMENT.PRICES_MAX_LENGTH');
      } else {
        if (!event.match(reg) || event.slice(-1) == '.') {
          this.prices.error = true;
          this.prices.message = this.translateService.instant('PACKAGE_MANAGEMENT.PRICES_ERROR_FORMAT');
        } else {
          this.prices.error = false;
          this.prices.message = '';
        }
      }
    }
    // console.log(parseInt(event));
    if (parseInt(event) == 0) {
      this.prices.value = '';
    } else {
      this.prices.value = event.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  }

  checkCode() {
    const pattern = /^[0-9A-Za-z{}|\\;:\[\]''/+=\-~_ )(><?.,!@#$%^&*]{1,50}$/;
    if (this.code.value == null || this.code.value.trim() == '' || this.code.value == undefined) {
      this.code.error = true;
      this.code.message = this.translateService.instant('PACKAGE_MANAGEMENT.CODE_NOT_EMPTY');
    } else {
      if (this.code.value.trim().includes(' ')) {
        this.code.message = this.translateService.instant('PACKAGE_MANAGEMENT.CODE_NOT_WHITE_SPACE');
        this.code.error = true;
      } else {
        if (this.code.value.trim().length > 50) {
          this.code.error = true;
          this.code.message = this.translateService.instant('PACKAGE_MANAGEMENT.CODE_MAX_LENGTH');
        } else {
          // if(!pattern.test(this.code.value.trim())){
          //   this.code.error = true;
          //   this.code.message = 'Số/ ký hiệu không được có dấu'
          // }else{
          this.code.error = false;
          this.code.message = '';
          // }
        }
      }
    }
  }

  checkName() {
    if (this.name.value == null || this.name.value == undefined || this.name.value.trim() == '') {
      this.name.error = true;
      this.name.message = this.translateService.instant('PACKAGE_MANAGEMENT.NAME_NOT_EMPTY');
    } else {
      if (this.name.value.trim().length > 250) {
        this.name.error = true;
        this.name.message = this.translateService.instant('PACKAGE_MANAGEMENT.NAME_MAX_LENGTH');
      } else {
        this.name.error = false;
        this.name.message = '';
      }
    }
  }

  checkLevelSchool() {
    if (this.schoolLevel.value == null || this.schoolLevel.value == undefined || this.schoolLevel.value.length == 0) {
      if (this.typePackage.value == 1) {
        this.schoolLevel.error = true;
        this.schoolLevel.message = this.translateService.instant('PACKAGE_MANAGEMENT.LEVEL_SCHOOL_NOT_EMPTY');
      } else {
        this.schoolLevel.error = false;
        this.schoolLevel.message = '';
      }
    } else {
      this.schoolLevel.error = false;
      this.schoolLevel.message = '';
    }
  }

  checkSemesterApply() {
    this.semesterApply.error = false;
    this.semesterApply.message = '';
  }

  validate1(e) {
    const pattern = /^[0-9\,]$/;
    if (e.key == ',' && (this.prices.value.includes(',') || this.prices.value == '' || this.prices.value == null)) {
      return false;
    }
    // let priceSplit = this.prices.value.split(',');
    // if(priceSplit[1] != undefined || priceSplit[1] != null){
    //   if(priceSplit[1].length >= 2){
    //     return false;
    //  }
    // }
    return pattern.test(e.key)
  }


  validate(e) {
    if (e.code === 'Backspace' || e.code === 'Delete') {
      return true;
    }
    const pattern = /^[0-9]$/;
    return pattern.test(e.key)
  }


  checkQuantitySms() {
    // console.log(this.quantitySMS.value);
    if (this.quantitySMS.value == null || this.quantitySMS.value == undefined || this.quantitySMS.value == '') {
      this.quantitySMS.error = true;
      this.quantitySMS.message = this.translateService.instant('PACKAGE_MANAGEMENT.SMS_NOT_EMPTY');
    } else {
      if (this.quantitySMS.value > 500) {
        this.quantitySMS.error = true;
        this.quantitySMS.message = this.translateService.instant('PACKAGE_MANAGEMENT.SMS_MAX');
      } else {
        this.quantitySMS.error = false;
        this.quantitySMS.message = '';
      }
    }
  }

  changeCode() {
    this.code.value = this.code.value.trim();
    let data = {
      code: this.code.value
    };
    if (this.action == 'add') {
      this.dataPackageService.checkExistDataPackage(data).subscribe((res) => {
        if (res.status == 'BAD_REQUEST') {
          this.code.error = true;
          this.code.message = res.message;
        }
      })
    }
  }

  changeName() {
    this.name.value = this.name.value.trim();
  }

//================================create====================================
  create() {
    this.isSubmit = true;
    this.checkCode();
    this.checkName();
    this.checkLevelSchool();
    this.checkQuantitySms();
    this.checkPrices(this.prices.value);
    if (this.typePackage.value == 0) {
      this.checkPrimaryPackage();
    }
    if (this.code.error || this.schoolLevel.error || this.name.error || this.primaryPackage.error || this.quantitySMS.error || this.prices.error) {
      this.isSubmit = false;
      return;
    }

    const data = this.form.value;
    console.log(data);
    data.code = data.code.trim();
    data.name = data.name.trim();
    try {
      data.prices = (data.prices.replaceAll(',', ''));
    } catch (e) {
    }
    this.hide = false;
    this.dataPackageService.create(data).subscribe((res) => {
        this.hide = true;
        if (res.status == 'OK') {
          this.toastr.success(res.message);
          this.dialogRef.close({event: 'add'});
          this.isSubmit = false;
        } else {
          if (res.status == 'BAD_REQUEST') {
            this.toastr.error(res.message);
          } else if (res.status == 'INTERNAL_SERVER_ERROR') {
            this.toastr.error(res.message);
          } else {
            this.toastr.error(res.message);
          }
          this.isSubmit = false;
        }
      },
      err => {
        this.hide = true;
        this.isSubmit = false;
        this.toastr.error(this.translateService.instant('MANAGES_SCHOOL.SAVE_FAILSE'));
      }
    )
  }

  update() {
    this.isSubmit = true;
    this.checkCode();
    this.checkName();
    this.checkLevelSchool();
    this.checkQuantitySms();
    this.checkPrices(this.prices.value);
    if (this.typePackage.value == 0) {
      this.checkPrimaryPackage();
    }
    if (this.code.error || this.schoolLevel.error || this.name.error || this.primaryPackage.error || this.quantitySMS.error || this.prices.error) {
      this.isSubmit = false;
      return;
    }

    const data = this.form.value;
    data.code = data.code.trim();
    data.name = data.name.trim();
    console.log(data);
    try {
      data.prices = (data.prices.replaceAll(',', ''));
    } catch (e) {
    }
    this.hide = false;
    this.dataPackageService.update(data).subscribe((res) => {
        this.hide = true;
        if (res.status == 'OK') {
          this.toastr.success(res.message);
          this.dialogRef.close({event: 'update'});
          this.isSubmit = false;
        } else {
          if (res.status == 'INTERNAL_SERVER_ERROR') {
            this.toastr.error(res.message);
          } else if (res.status == 'BAD_REQUEST') {
            this.toastr.error(res.message);
          } else {
            this.toastr.error(res.message);
          }
          this.isSubmit = false;
        }
      },
      err => {
        this.hide = true;
        this.isSubmit = false;
        this.toastr.error(this.translateService.instant('MANAGES_SCHOOL.UPDATE_FAILSE'));
      }
    )
  }

  testUTF8($event) {
    for (var i = 0; i < $event.key.length; i++) {
      if ($event.key.charCodeAt(i) > 127)
        $event.key = null;
    }
    //return false;
    console.log('event of keydown:', $event)
  }

}
