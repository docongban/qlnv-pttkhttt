import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {DeleteClassRoomComponent} from "../../class-room/delete-class-room/delete-class-room.component";
import {ConfigPointLockService} from "../../../../../core/service/service-model/config-point-lock.service";
import {ToastrService} from "ngx-toastr";
import {UpdateConfLockComponent} from "../update-conf-lock/update-conf-lock.component";
import date from "../../../../../../assets/plugins/formvalidation/src/js/validators/date";
import {ClassroomService} from "../../../../../core/service/service-model/classroom.service";
import {DatePipe} from "@angular/common";
import {formatDate} from '@angular/common';
import {Overlay} from "@angular/cdk/overlay";

@Component({
  selector: 'kt-action-conf-lock-point',
  templateUrl: './action-conf-lock-point.component.html',
  styleUrls: ['./action-conf-lock-point.component.scss']
})
export class ActionConfLockPointComponent implements OnInit {
  rowSelect: any = {};
  display = false;
  status;
  showUpdate = true;
  years;
  currentYear:Date;
  message;
  isNotConfig = false;

  gradeIsConfig = false;

  rowIndex;
  constructor(private dialog:MatDialog,
              private confLockService: ConfigPointLockService,
              private classroomService: ClassroomService,
              private toastr: ToastrService,
              private datePipe: DatePipe,
              private overlay: Overlay) { }

  ngOnInit(): void {
    this.confLockService.isConfigLock$.subscribe(isConfig => {
      this.gradeIsConfig = isConfig;
    });
  }

  agInit(params ): void {
    this.rowSelect = params.data;
    this.rowIndex = +params.rowIndex + 1;
    this.status = this.rowSelect.status;
    if (this.rowSelect.id === null) {
      this.isNotConfig = true;
      return;
    }
    this.confLockService.getEndDateConfigLock(this.rowSelect.id).subscribe(resAPI => {
      const endDate = new Date(resAPI.toDate);
      const today = new Date();
      const dateLock = new Date(this.rowSelect.entryLockDate);
      if ( (+today >= (+dateLock)) ) {
        this.showUpdate = false;
        this.message = 'Ngày khóa nhập đã qua';
      }
      if ( +today>=(+endDate) ) {
        this.showUpdate = false;
        this.message = 'Năm học của cấu hình này đã qua';
      }
    });
  }

  // gets called whenever the cell refreshes
  refresh(params) {
    // set value into cell again
    return true
  }

  unLock() {
    const dataConfirm = {title: 'XÁC NHẬN MỞ KHÓA', message: 'Bạn có chắc chắn muốn mở khoá nhập điểm cho cột điểm đã chọn?'};
    this.dialog.open(ConfirmDialogComponent, {
      data: dataConfirm,
      disableClose: true,
      hasBackdrop: true,
      width: '418px',
      scrollStrategy: this.overlay.scrollStrategies.noop()
    }).afterClosed().subscribe(res => {
      if (res.event === 'confirm') {
        this.confLockService.unlock(this.rowSelect).subscribe(resAPI => {
          if (resAPI.status === 'OK') {
            this.toastr.success(resAPI.message);
            this.confLockService.changeIsUnlock(true);
          }else if (resAPI.status === 'BAD_REQUEST') {
            this.toastr.error(resAPI.message);
          }
        });
      }
    });
  }

  lock() {
    // check day lock
    const entryLockDate = formatDate(new Date(this.rowSelect.entryLockDate),'yyyy/MM/dd', 'en');
    const today = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    console.log(entryLockDate);
    if (today < entryLockDate) {
      this.toastr.error('Khoá không thành công , Ngày hiện tại nhỏ hơn Ngày khoá nhập');
      return;
    }

    const dataConfirm = {title: 'XÁC NHẬN KHÓA', message: 'Bạn có chắc chắn muốn khoá nhập điểm cho cột điểm đã chọn?'};
    this.dialog.open(ConfirmDialogComponent, {
      data: dataConfirm,
      disableClose: true,
      hasBackdrop: true,
      width: '420px',
      scrollStrategy: this.overlay.scrollStrategies.noop()
    }).afterClosed().subscribe(res => {
      if (res.event === 'confirm') {
        this.confLockService.lock(this.rowSelect).subscribe(resAPI => {
          console.log(resAPI);
          if (resAPI.status === 'OK') {
            this.toastr.success(resAPI.message);
            this.confLockService.changeIsLock(true);
          }
          if (resAPI.status === 'BAD_REQUEST') {
            this.toastr.error(resAPI.message);
          }
        });
      }
    });
  }

  update() {
    if (!this.gradeIsConfig) {
      this.toastr.error('Khối trong học kỳ này chưa được cấu hình');
      return;
    }
    if (!this.showUpdate) {
      this.toastr.error(this.message);
      return;
    }
    this.dialog.open(UpdateConfLockComponent, {
      data: this.rowSelect,
      disableClose: true,
      hasBackdrop: true,
      width: '466px',
      scrollStrategy: this.overlay.scrollStrategies.noop()
    }).afterClosed().subscribe(res => {
      console.log(res);
      if (res.event === 'update') {
        this.confLockService.changeIsUpdate(true);
      }
    });
  }
}
