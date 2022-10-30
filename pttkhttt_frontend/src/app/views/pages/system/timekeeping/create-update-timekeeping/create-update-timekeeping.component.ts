import {ChangeDetectorRef, Component, Inject, OnInit, Optional} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TimekeepingService} from '../../../../../core/service/service-model/timekeeping.service';
import {ToastrService} from 'ngx-toastr';
import * as moment from 'moment';

@Component({
  selector: 'kt-create-update-timekeeping',
  templateUrl: './create-update-timekeeping.component.html',
  styleUrls: ['./create-update-timekeeping.component.scss']
})
export class CreateUpdateTimekeepingComponent implements OnInit {

  form: FormGroup;
  isCreateNew = true;
  timekeeping: any = {}
  employees: any[]

  constructor(
    private formBuilder: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateUpdateTimekeepingComponent>,
    private timekeepingService: TimekeepingService,
    private changeDetectorRef: ChangeDetectorRef,
    private toaStr : ToastrService
  ) {
    if(this.data!=null){
      this.isCreateNew = this.data.isCreateNew;
    }
  }

  ngOnInit(): void {
    this.getAllEmployee()
    this.buildForm()
  }

  buildForm(){
    if(this.isCreateNew){
      this.form = this.formBuilder.group({
        id: [null],
        employeeCode: [null,[Validators.required]],
        timeAt: [null,[Validators.required]]
      })
    }else{
      this.timekeepingService.getById(this.data.oldData).subscribe( res => {
        // tslint:disable-next-line:triple-equals
        this.form = this.formBuilder.group({
          id: [null],
          employeeCode: [null,[Validators.required]],
          timeAt: [null,[Validators.required]]
        })
        res.timeAt = moment(res.timeAt).format('YYYY-MM-DDThh:mm')
        this.timekeeping = res
      })
    }
  }
  get getControl() {
    return this.form.controls;
  }

  getAllEmployee(){
    this.timekeepingService.getAllEmployee().subscribe(res => {
      this.employees = res
      for(let i = 0;i<res.length;i++) {
        if(i === res.length-1){
          this.employees.sort((a, b) => (a.name > b.name) ? 1 : -1).map(employee =>{
            employee.name = employee.code + ' - ' + employee.name
          })
        }
      }
    })
  }

  onSubmit(){
    const recursive = (f: FormGroup | FormArray) => {
      // tslint:disable-next-line:forin
      for (const i in f.controls) {
        if (typeof f.controls[i].value === 'string') {
          if (!Boolean(f.controls[i].value)) {
            f.controls[i].value = null;
          } else {
            f.controls[i].value = f.controls[i].value.trim();
          }
        }
        if (f.controls[i] instanceof FormControl) {
          f.controls[i].markAsDirty();
          f.controls[i].updateValueAndValidity();
        } else {
          recursive(f.controls[i] as any);
        }
      }
    };
    recursive(this.form);
    if (this.form.invalid) {
      return;
    }

    if(this.isCreateNew){
      this.save()
    }else{
      this.update()
    }
  }

  save(){
    this.form.value.timeAt = new Date(this.form.value.timeAt)
    const createData = this.form.value;
    this.timekeepingService.handleCreate(createData).subscribe(res => {
      if(res.status === 'OK'){
        this.toaStr.success(res.message);
        this.dialogRef.close({
          event: 'add success'
        })
        this.changeDetectorRef.detectChanges();
      }else{
        this.toaStr.error(res.message);
        this.changeDetectorRef.detectChanges();
      }
    })
  }

  update(){
    this.form.value.timeAt = new Date(this.form.value.timeAt)
    const updateData = this.form.value;
    this.timekeepingService.handleUpdate(updateData).subscribe(res => {
      if(res.status === 'OK'){
        this.toaStr.success(res.message);
        this.dialogRef.close({
          event: 'add success'
        })
        this.changeDetectorRef.detectChanges();
      }else{
        this.toaStr.error(res.message);
        this.changeDetectorRef.detectChanges();
      }
    })
  }

  closeModal(){
    this.dialogRef.close({event: 'cancel'});
  }
}
