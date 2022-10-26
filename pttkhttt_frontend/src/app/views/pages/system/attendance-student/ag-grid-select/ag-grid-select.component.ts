import {Component, OnInit} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-angular';

// import {IAfterGuiAttachedParams} from 'ag-grid';

@Component({
  selector: 'app-ag-grid-selec',
  templateUrl: './ag-grid-select.component.html',
  styleUrls: ['./ag-grid-select.component.css']
})
export class AgGridSelectComponent implements AgRendererComponent {

  params: any;
  checkDate = '';
  constructor() {
  }

  agInit(params: any): void {
    this.params = params;
    for(let i = 0; i< params.data.attendanceDetailDTOs.length; i++){
      if(params.data.attendanceDetailDTOs[i].date === params.column.colId){
        this.checkDate = params.data.attendanceDetailDTOs[i].checkDate;
      }
    }
  }

  // afterGuiAttached(params?: IAfterGuiAttachedParams): void {
  // }

  refresh(params: any): boolean {
    let check = true;
    for(let i = 0; i< params.data.attendanceDetailDTOs.length; i++){
      if(params.data.attendanceDetailDTOs[i].date === params.colDef.field){
        params.data.attendanceDetailDTOs[i].checkDate = this.checkDate;
        check = false;
      }
    }
    if(check){
      params.data.attendanceDetailDTOs.push({
        checkDate: this.checkDate,
        date: params.colDef.field
      })
    }
     params.api.refreshCells(params);
    return false;
  }
}
