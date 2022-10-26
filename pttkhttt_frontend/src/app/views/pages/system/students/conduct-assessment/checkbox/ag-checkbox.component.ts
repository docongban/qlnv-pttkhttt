import {Component, OnInit,ChangeDetectorRef} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-angular';
import {Subscription} from 'rxjs';

// import {IAfterGuiAttachedParams} from 'ag-grid';

@Component({
  selector: 'kt-ag-checkbox',
  templateUrl: './ag-checkbox.component.html',
  styleUrls: ['./ag-checkbox.component.scss']
})
export class AgCheckboxComponent implements AgRendererComponent {

  params: any;
  subscription: Subscription;
  semesterAmount;
  currentYear;

  constructor() {
  }
  agInit(params: any): void {
    this.params = params;

  }

  refresh(params: any): boolean {

    // console.log('param checkbox',params);
    if (params.colDef.field === 'conductExcellent') {
      if (params.value === true) {
        params.data.conductExcellent = true;
        params.data.conductCode = 'excellent';
        params.data.conductGood = false;
        params.data.conductMedium = false;
        params.data.conductWeak = false;
      } else {
        params.data.conductExcellent = false;
        params.data.conductCode = '';
      }
    }

    if (params.colDef.field === 'conductGood') {
      if (params.value === true) {
        params.data.conductExcellent = false;
        params.data.conductGood = true;
        params.data.conductCode = 'good';
        params.data.conductMedium = false;
        params.data.conductWeak = false;
      } else {
        params.data.conductGood = false;
        params.data.conductCode = '';
      }
    }

    if (params.colDef.field === 'conductMedium') {
      if (params.value === true) {
        params.data.conductExcellent = false;
        params.data.conductGood = false;
        params.data.conductMedium = true;
        params.data.conductCode = 'medium';
        params.data.conductWeak = false;
      } else {
        params.data.conductMedium = false;
        params.data.conductCode = '';
      }
    }

    if (params.colDef.field === 'conductWeak') {
      if (params.value === true) {
        params.data.conductExcellent = false;
        params.data.conductGood = false;
        params.data.conductMedium = false;
        params.data.conductWeak = true;
        params.data.conductCode = 'weak';
      } else {
        params.data.conductWeak = false;
        params.data.conductCode = '';
      }
    }
    params.api.refreshCells(params);
    return false;
  }
}
