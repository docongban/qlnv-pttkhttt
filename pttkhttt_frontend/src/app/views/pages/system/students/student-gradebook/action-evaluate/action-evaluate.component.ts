import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {PopupEvaluateComponent} from "../popup-evaluate/popup-evaluate.component";

@Component({
  selector: 'kt-action-evaluate',
  templateUrl: './action-evaluate.component.html',
  styleUrls: ['./action-evaluate.component.scss']
})
export class ActionEvaluateComponent implements OnInit {

  rowSelect;
  studentName;
  showButton;
  rowIndex;
  constructor(private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.showButton = false;
  }

  agInit(params ): void {
    this.rowSelect = params.data;
    this.studentName = this.rowSelect.studentName;
    this.rowIndex = +params.rowIndex + 1;
  }

  showPopup() {
    this.matDialog.open(PopupEvaluateComponent, {
      data: this.rowSelect,
      disableClose: true,
      hasBackdrop: true,
      width: '466px'
    }).afterClosed().subscribe(res => {
      console.log(res);
    });
  }
}
