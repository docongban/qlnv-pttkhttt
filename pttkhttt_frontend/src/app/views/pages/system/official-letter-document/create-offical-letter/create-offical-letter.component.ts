import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, TemplateRef , Renderer2, ElementRef, Optional, Inject} from '@angular/core';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { equals } from '@ngx-translate/core/lib/util';
import { forEach } from 'ag-grid-community/dist/lib/utils/array';
import { CommonServiceService } from 'src/app/core/service/utils/common-service.service';
import { DocumentaryService } from 'src/app/core/service/service-model/documentary.service';
import { GetData } from 'src/app/core/service/actions/school-information-action';
import {FormBuilder, FormGroup} from '@angular/forms';
import { first } from 'lodash';
import { OfficialLetterDocumentComponent } from '../official-letter-document.component';
import {forkJoin} from 'rxjs';

export interface DataDropdown {
  code: string | null;
  name: string;
}

@Component({
  selector: 'kt-create-offical-letter',
  templateUrl: './create-offical-letter.component.html',
  styleUrls: ['./create-offical-letter.component.scss']
})
export class CreateOfficalLetterComponent implements OnInit, AfterViewInit {
  @ViewChild('myInput') myInput : ElementRef<HTMLInputElement>;
  @ViewChild('focusInput',{static: false}) focus : ElementRef<HTMLInputElement>;

  public action: string ;

  formData;
  form1: FormGroup;
  files = [];
  filename;
  listSigner = [];
  datas;
  isCreateNew : boolean;
  listDocumentAdd = [];
  dropDownAdd: DataDropdown = {
    code: '',
    name: 'Lựa chọn'
  };

  isSubmit:boolean = false;

  code = {
    value : null,
    error : null,
    message : ''
  }

  compendia = {
    value: null,
    error: null,
    message: ''
  }

  documentType = {
    value: '',
    error: null,
    message: ''
  }

  releaseDate = {
    value: null,
    error: null,
    message: ''
  }

  effectiveDate = {
    value: null,
    error: null,
    message: ''
  }

  file = {
    error: null,
    message: ''
  };

  constructor(
    public dialogRef: MatDialogRef<CreateOfficalLetterComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private matDialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private commonService: CommonServiceService,
    private documentaryService : DocumentaryService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService
  ) {
    this.isCreateNew = data.isCreateNew;
    this.listDocumentAdd = data.listDocumentAdd;
    this.listSigner = data.listSigner;
    this.datas = data;
    this.buildForm1();
   }

  ngOnInit(): void {
    this.loadForm();
  }

  ngAfterViewInit(){
    console.log(this.focus);
    setTimeout(() => {
      this.focus.nativeElement.focus();
    }, 0);
  }

  loadForm(){
    if(!this.datas.isCreateNew){
      this.filename = this.data.oldData['file'];
      let filename = this.filename.split('|');
      filename.forEach(element => {
      const downloadData = Object.assign({}, this.data.oldData);
      downloadData.file = element;
      this.documentaryService.downloadData(downloadData).subscribe((res)=>{
          const oldFile = new File([res],element.substring(element.lastIndexOf('/')+1));
          console.log(oldFile);
          this.files.push(oldFile);
      })
    });
    setTimeout(() => {
      this.code.value = this.data.oldData.code;
      this.documentType.value = this.data.oldData.documentType,
      this.releaseDate.value = new Date(this.data.oldData.releaseDate).toISOString().split('T')[0],
      this.effectiveDate.value = new Date(this.data.oldData.effectiveDate).toISOString().split('T')[0],
      this.form1.get('signer').setValue(this.data.oldData.signer),
      this.form1.get('id').setValue(this.data.oldData.id);
      this.form1.get('file').setValue(this.data.oldData.file);
      this.compendia.value = this.data.oldData.compendia
    }, 0);
    }
  }

  buildForm1(){
    this.form1 = this.formBuilder.group({
      id: [null],
      file: [null],
      code: [null],
      documentType: [''],
      signer: [this.listSigner[0].code],
      releaseDate: [null],
      effectiveDate: [null],
      compendia: [null]
    });
    setTimeout(() => {
      this.resetData();
    }, 0);
  }


  resetData(){
    this.code.value = null;
    this.documentType.value = '';
    this.releaseDate.value = null;
    this.effectiveDate.value = null;
    this.compendia.value = null;
    setTimeout(() => {
      this.code.error = false;
      this.documentType.error = false;
      this.releaseDate.error = false;
      this.effectiveDate.error = false;
      this.compendia.error = false;
      this.file.error = false;
    }, 100);
  }

  onSelectedFile(event){
    let selectFiles = event.target.files;
    console.log(selectFiles);
    for(let i = 0; i < selectFiles.length; i++){
      if(!selectFiles[i].name.includes('.doc') && !selectFiles[i].name.includes('.docx') && !selectFiles[i].name.includes('.pdf')){
        this.toastr.error("File phải có định dạng word hoặc pdf !");
      }else{
        if(selectFiles[i].size/1024/1024 > 5){
          this.toastr.error("File không được lớn hơn 5MB");
        }else{
          this.files.push(selectFiles[i]);
          this.checkFile();
        }
      }
    }
    this.myInput.nativeElement.value = '';
    console.log(this.files);
  }

  round(datasize:number){
    return Math.round(datasize/1024);
  }

  cutFileName(filename){
    if(filename.length > 35)
      return filename.substring(0,35) + '...';
    else
      return filename;
  }

  deleteFile(index : number){
    this.files.splice(index,1);
    this.checkFile();
  }

  closeModal(){
    // this.files =[];
    // this.form1.reset;
    this.dialogRef.close({event: 'cancel'});
  }

  create(){
    this.isSubmit = true;
    this.checkCode();
    this.checkDocumentType();
    this.checkReleaseDate();
    this.checkEffectiveDate();
    this.checkCompendia();
    this.checkFile();
    if(this.code.error || this.documentType.error || this.releaseDate.error || this.effectiveDate.error || this.compendia.error || this.file.error){
      this.isSubmit = false;
      return;
    }
    let fileSizes = 0;
    this.files.forEach(element => {
      fileSizes += element.size;
    });
    if(fileSizes /1024/1024 >= 20){
      this.toastr.error("Tổng dung lượng các file đính kèm phải nhỏ hơn 20MB");
      this.isSubmit = false;
      return;
    }
    const data = this.form1.value;
    if(new Date(data.releaseDate) >= new Date(data.effectiveDate)){
      this.toastr.error("Ngày hiệu lực phải lớn hơn ngày ban hành");
      this.isSubmit = false;
      return;
    }
    const formData = new FormData();
    this.files.forEach(element => {
      formData.append('files',element);
    });
    this.formData = formData;
    this.documentaryService.create(formData, data).subscribe((res:any)=>{
      if(res.status == "OK"){
        this.toastr.success(res.message);
        this.dialogRef.close({event: 'add'});
        this.isSubmit=false;
      }else{
        this.toastr.error(res.message);
        this.isSubmit=false;
      }
    },
    err => {
      this.toastr.error("Thêm không thành công !");
      this.isSubmit=false;
    })
  }


  update(){
    this.isSubmit = true;
    this.checkCode();
    this.checkDocumentType();
    this.checkReleaseDate();
    this.checkEffectiveDate();
    this.checkCompendia();
    this.checkFile();
    if(this.code.error || this.documentType.error || this.releaseDate.error || this.effectiveDate.error || this.compendia.error || this.file.error){
      this.isSubmit = false;
      return;
    }
    let fileSizes = 0;
    this.files.forEach(element => {
      fileSizes += element.size;
    });
    if(fileSizes /1024/1024 >= 20){
      this.toastr.error("Tổng dung lượng các file đính kèm phải nhỏ hơn 20MB");
      this.isSubmit = false;
      return;
    }
    const data = this.form1.value;
    if(new Date(data.releaseDate) >= new Date(data.effectiveDate)){
      this.toastr.error("Ngày hiệu lực phải lớn hơn ngày ban hành");
      this.isSubmit  = false;
      return;
    }
    const formData = new FormData();
    this.files.forEach(element => {
      formData.append('files',element);
    });
    console.log(formData);
    console.log(data);
    this.documentaryService.update(formData, data).subscribe((res:any)=>{
      if(res.status == "OK"){
        this.toastr.success(res.message);
        this.dialogRef.close({event: 'update'});
        this.isSubmit=false;
      }else{
        this.toastr.error(res.message);
        this.isSubmit=false;
      }
    },
    err => {
      this.toastr.error("Cập nhật không thành công !");
      this.isSubmit=false;
    })
  }

  //===============================Validate Form================
  checkCode(){
    const pattern = /^[0-9A-Za-z{}|\\;:\[\]'"/+=\-~_ )(><?.,!@#$%^&*]{1,50}$/;
    if(this.code.value == null || this.code.value.trim() == "" || this.code.value == undefined){
      this.code.error = true;
      this.code.message = "Số/ ký hiệu không được để trống";
    }else{
      if(this.code.value.trim().includes(" ")){
        this.code.message = "Số/ Ký hiệu không được chứa khoảng trắng";
        this.code.error = true;
      }else{
        if(this.code.value.trim().length > 50){
          this.code.error = true;
          this.code.message = "Số/ ký hiệu không được quá 50 ký tự"
        }else{
          if(!pattern.test(this.code.value.trim())){
            this.code.error = true;
            this.code.message = "Số/ ký hiệu không được có dấu"
          }else{
            this.code.error = false;
            this.code.message = '';
          }
        }
      }
    }
  }

  checkDocumentType(){
    this.documentType.value = this.form1.get('documentType').value;
    if(this.documentType.value == null || this.documentType.value == undefined || this.documentType.value == ''){
      this.documentType.error = true;
      this.documentType.message = 'Hãy lựa chọn loại văn bản';
    }else{
      this.documentType.error = false;
      this.documentType.message = '';
    }
  }

  checkReleaseDate(){
    if(this.releaseDate.value == null || this.releaseDate.value == undefined || this.releaseDate.value == ''){
      this.releaseDate.error = true;
      this.releaseDate.message = 'Ngày ban hành không được để trống';
      this.releaseDate.value = null;
    }else{
      this.releaseDate.error = false;
      this.releaseDate.message = '';
    }
  }

  checkEffectiveDate(){
    if(this.effectiveDate.value == null || this.effectiveDate.value == undefined || this.effectiveDate.value == ''){
      this.effectiveDate.error = true;
      this.effectiveDate.message = 'Ngày hiệu lực không được để trống';
      this.effectiveDate.value = null;
    }else{
      this.effectiveDate.error = false;
      this.effectiveDate.message = '';
    }
  }

  checkCompendia(){
    if(this.compendia.value == null || this.compendia.value == undefined || this.compendia.value.trim() == ''){
      this.compendia.error = true;
      this.compendia.message = 'Trích yếu không được để trống';
    }else{
      if(this.compendia.value.trim().length > 250){
        this.compendia.error = true;
        this.compendia.message = 'Trích yếu không được quá 250 ký tự'
      }else{
        this.compendia.error = false;
        this.compendia.message = '';
      }
    }
  }

  checkFile(){
    if(this.files.length < 1){
      this.file.message = 'File đính kèm không được để trống';
      this.file.error = true;
    }else{
      this.file.error = false;
      this.file.message ='';
    }
  }
}
