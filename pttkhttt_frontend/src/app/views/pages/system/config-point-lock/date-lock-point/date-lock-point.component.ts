import { Component, OnInit } from '@angular/core';
import row from "ag-grid-enterprise/dist/lib/excelExport/files/xml/row";
import {DatePipe} from "@angular/common";
import {formatDate} from "@angular/common";

@Component({
  selector: 'kt-date-lock-point',
  templateUrl: './date-lock-point.component.html',
  styleUrls: ['./date-lock-point.component.scss']
})
export class DateLockPointComponent implements OnInit {
  rowSelect: any = {};
  formDate: any;
  endDate: any;
  invalid = false;
  message;

  fromDateSemester;
  semester;

  empty = true;
  delete = false;
  constructor(private datePipe: DatePipe) { }

  ngOnInit(): void {
  }

  // gets called once before the renderer is used
  agInit(params ): void {
    this.rowSelect = params.data;
    this.endDate = params.data.endDate;

    this.semester = params.data.semester;
    this.fromDateSemester = params.data.formDate;

    const todayDate = new Date();
    todayDate.setDate(todayDate.getDate() + 1);
    this.formDate = this.datePipe.transform(todayDate,'yyyy-MM-dd');
    console.log(this.fromDateSemester);
    console.log(this.endDate);
    console.log(params.data);
  }

  test() {
    console.log(this.rowSelect);
  }

  checkValid() {

    if (this.rowSelect.entryLockDate === '' || this.rowSelect.entryLockDate === undefined) {
      if (this.empty || this.delete) {
        this.invalid = true;
        this.rowSelect.valid = false;
        this.message = 'Ngày khoá nhập không được để trống';
        this.rowSelect.message = this.message;
        return;
      }
      this.empty = false;

      this.invalid = true;
      this.rowSelect.valid = false;
      this.message = 'Ngày khóa nhập không hợp lệ';
      this.rowSelect.message = this.message;
      return;
    }

    const valueDate = new Date(this.rowSelect.entryLockDate);

    const endDate = new Date(this.endDate);
    const fromDate = new Date(this.fromDateSemester);
    if (valueDate < fromDate) {
      this.invalid = true;
      this.rowSelect.valid = false;
      this.message = 'Ngày khoá nhập phải nằm trong học kỳ '+ this.semester;
      this.rowSelect.message = this.message;
      return;
    }

    const today = new Date();
    const todayFormat = formatDate(today,'yyyy/MM/dd', 'en');
    const selectDate = formatDate(valueDate,'yyyy/MM/dd', 'en');

    if (todayFormat > selectDate || todayFormat === selectDate) {
      this.invalid = true;
      this.rowSelect.valid = false;
      this.message = 'Ngày khoá nhập phải lớn hơn ngày hiện tại';
      this.rowSelect.message = this.message;
      return;
    }
    if (valueDate > endDate) {
      this.invalid = true;
      this.rowSelect.valid = false;
      this.message = 'Ngày khóa nhập phải nhỏ hơn ngày kết thúc học kỳ';
      this.rowSelect.message = this.message;
      return;
    }
    this.rowSelect.valid = true;
    this.invalid = false;
  }

  validateKeyUp(event) {
    if (event.keyCode >= 48 && event.keyCode <= 57) {
      this.empty = false;
      this.delete = false;
    }
    if (event.keyCode === 8) {
      this.delete = true;
    }
  }
}
