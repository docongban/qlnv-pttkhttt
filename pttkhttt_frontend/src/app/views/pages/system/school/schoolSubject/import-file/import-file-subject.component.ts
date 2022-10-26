import {Component, ElementRef, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {SubjectService} from '../../../../../../core/service/service-model/subject.service';
// import * as fileSaver from 'file-saver';

@Component({
  selector: 'kt-import-file',
  templateUrl: './import-file-subject.component.html',
  styleUrls: ['./import-file-subject.component.scss']
})
export class ImportFileSubjectComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  years = 2021;
  formImportSubject: FormGroup;
  fileImport: File;
  errorUpload = false;
  errorUploadMsg: any;
  totalSuccess: number;
  totalRecord: number;
  totalError: number;
  isImported = false;
  subjectDTOSaveInfoError: any;
  disableImport = true;
  nameFile: any;
  uploaded = false;
  sizeFile: any;
  hide = true;

  constructor(private fb: FormBuilder,
              public dialogRef: MatDialogRef<ImportFileSubjectComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              private subjectService: SubjectService,
              private toastr: ToastrService) {
    this.years = data.years;
  }

  ngOnInit(): void {
    this.formImportSubject = this.fb.group({
      years: [{value: '', disabled: true}, Validators.required],
      isAddNew: ['', Validators.required]
    })
    // this.formImportSubject.get('years').setValue(this.years);
    this.formImportSubject.get('isAddNew').setValue(0);
  }

  onDismiss() {
    this.dialogRef.close({event: 'cancel'});
  }

  onFileInput(event) {
    console.log(event);
    if (event.target.files[0] === undefined) {
      return;
    }
    console.log(event);
    const file: File = event.target.files[0];
    console.log('size', file.size);
    console.log('type', file.type);
    if (!(file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel')) {
      console.log('dinh dang file ko cho phep');
      this.toastr.error('File phải có định dạng xlsx, xls!');
      this.uploaded = false;
      this.disableImport = true;
      return;
    }
    if (file.size > 5242880) {
      console.log('size to qua');
      this.toastr.error('File phải có dung lượng nhỏ hơn 5Mb');
      this.uploaded = false;
      this.disableImport = true;
      return;
    }
    this.fileImport = file;

    this.uploaded = true;
    this.disableImport = false;
    this.nameFile = event.target.files[0].name;
    this.sizeFile = event.target.files[0].size;
    this.myInputVariable.nativeElement.value = '';
  }

  deleteFile() {
    this.uploaded = false;
    this.disableImport = true;
    this.isImported = false;
  }


  importFile() {
    // this.disableImport = false;
    this.hide = false;
    const isAddNew = this.formImportSubject.get('isAddNew').value;
    console.log(isAddNew);
    this.subjectService.importFile(this.fileImport, isAddNew).subscribe(resAPI => {
      this.hide = true;
      console.log(resAPI);
      const dataRes:any = resAPI.body;
      if (dataRes.status === 'OK') {
        this.subjectDTOSaveInfoError = dataRes.data.pop();
        this.totalSuccess = this.subjectDTOSaveInfoError.totalSuccess;
        this.totalError = this.subjectDTOSaveInfoError.totalFail;
        this.totalRecord = this.totalError + this.totalSuccess;
        this.isImported = true;
        this.toastr.success(dataRes.message);
      }else if (dataRes.status === 'BAD_REQUEST') {
        if (dataRes.data !== null) {
          this.subjectDTOSaveInfoError = dataRes.data.pop();
          this.totalSuccess = this.subjectDTOSaveInfoError.totalSuccess;
          this.totalError = this.subjectDTOSaveInfoError.totalFail;
          this.totalRecord = this.totalError + this.totalSuccess;
          this.isImported = true;
        }
        this.toastr.error(dataRes.message);
      }
    }, err =>{
      this.toastr.error('Import lỗi!');
    });

    this.disableImport = true;
  }




  downloadErrorFile() {
    this.subjectService.downloadErrorFile(this.subjectDTOSaveInfoError).subscribe((responseMessage) => {
      const file = new Blob([responseMessage], {type: 'application/vnd.ms-excel'});
      const fileURL = URL.createObjectURL(file);
      // window.open(fileURL, '_blank');
      const anchor = document.createElement('a');
      anchor.download = 'ds-import-loi.xls';
      anchor.href = fileURL;
      anchor.click();
    });
  }


    downloadSampleFile() {
    this.subjectService.downloadSampleFile().subscribe((responseMessage) => {
      // @ts-ignore
      const file = new Blob([responseMessage], {type: 'application/vnd.ms-excel'});
      const fileURL = URL.createObjectURL(file);
      // window.open(fileURL, '_blank');
      const anchor = document.createElement('a');
      anchor.download = 'DS_monhocthuoctruong.xls';
      // anchor.download = 'DS_hocsinh.xls';
      anchor.href = fileURL;
      anchor.click();
    });
  }


}
