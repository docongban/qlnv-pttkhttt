import {ChangeDetectorRef, Component, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ClassroomService} from '../../../../../core/service/service-model/classroom.service';
import {ToastrService} from 'ngx-toastr';
import {NotiService} from '../../../../../core/service/service-model/notification.service';

@Component({
  selector: 'kt-update-class',
  templateUrl: './update-class.component.html',
  styleUrls: ['./update-class.component.scss']
})
export class UpdateClassComponent implements OnInit {
  public action: string ;

  listYears;

  deptId:any = 0;
  subjectId:any;
  teacherId:any;

  gradeList: any = [];
  departmentList: any = [];
  subjectList: any = [];
  teacherList: any = [];
  pattern = /^\S{0,50}$/;
  classroomAddForm: FormGroup;
  //
  listDemo =[
    {
      id:1,
      name:'Demo'
    }
  ];
  selectDemo;
  years;
  gradeId;

  constructor(public dialogRef: MatDialogRef<UpdateClassComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private toastr: ToastrService,
              private classroomService: ClassroomService,
              private changeDetectorRef: ChangeDetectorRef,) {
    this.action = data.action;
    this.data = data;
    this.gradeList = data.gradeList;
    this.years = data.years;
    this.listYears = [{years: this.years}];
    this.buildForm();
    console.log(data, 'data update');
  }

  ngOnInit(): void {
    this.getAllTeacher();
    this.loadForm();
    this.getAllDept();
  }

  buildForm() {
    this.classroomAddForm = this.fb.group({
      years: [''],
      gradeLevel: [null, Validators.required],
      deptId: [null, Validators.required],
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      specialize: [null],
      teacherId: [null, Validators.required]
    });
    this.classroomAddForm.get('years').setValue(this.years);
    this.classroomAddForm.get('deptId').valueChanges.subscribe(val => {
      this.classroomAddForm.get('specialize').setValue(null);
      this.getAllSubjectByDeptId(val)
    });
  }

  getAllDept() {
    const dept: any = {};
    dept.name = '';
    this.classroomService.autoSearchDept(dept).subscribe(res => {
      this.departmentList = res.map(item => {
        return {
          ...item,
          deptIdName: item.code + ' - ' + item.name
        }
      });
      this.changeDetectorRef.detectChanges();
    });
  }

  getAllTeacher() {
    this.classroomService.autoSearchTeacher().subscribe(res => {
      this.teacherList = res.map(item => {
        return {...item, teacherNameCode: item.code + ' - ' + item.fullName};
      });
      this.changeDetectorRef.detectChanges();
    });
  }

  getAllSubjectByDeptId(deptId) {
    if (deptId === 0 || deptId === null) {
      console.log('chua chon dept')
      return;
    }
    const subject: any = {};
    subject.name = '';
    this.classroomService.autoSearchSubject(subject, deptId).subscribe(res => {
      this.subjectList = res.map(item => {
        return {
          ...item,
          subjectNameCode: item.code + ' - ' + item.name
        }
      });
      console.log(this.subjectList);
    });
  }

  // =============== Form edit ========================
  loadForm() {
    if (this.action === 'edit') {
      // tslint:disable-next-line:forin
      for (const controlName in this.classroomAddForm.controls) {
        this.classroomAddForm.get(controlName).setValue(this.data[controlName]);
      }
      this.classroomAddForm.get('code').disable();
    }
  }

  // ============================================ Add new ==================================
  add() {
    const addData: any = {};
    // tslint:disable-next-line:forin
    for (const controlName in this.classroomAddForm.controls) {
      addData[controlName] = this.classroomAddForm.get(controlName).value;
    }
    addData.code = addData.code.trim();
    addData.name = addData.name.trim();
    console.log(addData)
    // Call API
    this.classroomService.addClassroom(addData).subscribe(responseAPI => {
      if (responseAPI.status === 'OK') {
        this.dialogRef.close({event: this.action, data:responseAPI});
      } else if(responseAPI.status === 'BAD_REQUEST'){
        this.toastr.error(responseAPI.message);
      }
    });
  }

  // ========================================= Update ===========================================
  edit() {
    const eidtData: any = {};
    // tslint:disable-next-line:forin
    for (const controlName in this.classroomAddForm.controls) {
      eidtData[controlName] = this.classroomAddForm.get(controlName).value;
    }
    eidtData.id = this.data.id;
    eidtData.code = eidtData.code.trim();
    eidtData.name = eidtData.name.trim();

    console.log(eidtData)
    // Call API
    this.classroomService.updateClassroom(eidtData).subscribe(responseAPI => {
      if (responseAPI.status === 'OK') {
        this.dialogRef.close({event: this.action,
          data: responseAPI
        });
      }else if (responseAPI.status === 'BAD_REQUEST') {
        console.log(responseAPI);
        this.toastr.error(responseAPI.message);
      }
    });
  }

  onDismiss() {
    this.dialogRef.close({event: 'cancel'});
  }

  // ===================== validate code======================
  listenCode(control:string) {
    const keyword = this.classroomAddForm.controls[control].value;
    this.classroomAddForm.controls[control].setValue(keyword.trim());
  }

  // tooltip

  getToolTipDEata(data:any):string{
    if(data && data.length){
      return data;
    }else{
      return 'Lựa chọn';
    }
  }
}

