import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StudentsService} from '../../../../../../core/service/service-model/students.service';
import {ToastrService} from 'ngx-toastr';
import {Subscription} from 'rxjs';

@Component({
  selector: 'kt-popup-evaluate',
  templateUrl: './popup-evaluate.component.html',
  styleUrls: ['./popup-evaluate.component.scss']
})
export class PopupEvaluateComponent implements OnInit {
  subscription: Subscription;

  infoStudent: any;

  evaluate;
  constructor(public dialogRef: MatDialogRef<PopupEvaluateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private studentService: StudentsService,
              private toast: ToastrService) {
    this.infoStudent = data;
    this.evaluate = data.evaluate;
    console.log(this.infoStudent);
  }

  ngOnInit(): void {
  }

  onConfirm(): void {
    // API
    this.data.evaluate = this.evaluate?.trim();
    console.log(this.data);
    if (this.data.id === null) {
      this.studentService.saveAllRecord(this.data);
      this.toast.success('Thêm đánh giá thành công');
      this.dialogRef.close({event: 'confirm'});
    } else {
      this.studentService.evaluateStudent(this.data)
        .subscribe(
          resAPI => {
            if (resAPI.status === 'OK') {
              this.toast.success(resAPI.message);
              this.studentService.isEvaluatedDone(true);
              this.dialogRef.close({event: 'confirm'});
            } else {
              this.toast.error(resAPI.message);
            }
          }
        );
    }
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close({event: 'cancel'});
  }
}
