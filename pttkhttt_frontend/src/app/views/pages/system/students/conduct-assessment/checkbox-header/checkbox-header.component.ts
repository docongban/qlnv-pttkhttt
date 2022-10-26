import {Component, OnInit} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-angular';
import {Subscription} from 'rxjs';
import {ConductAssessmentComponent} from '../conduct-assessment.component';

// import {IAfterGuiAttachedParams} from 'ag-grid';

@Component({
  selector: 'kt-checkbox-header',
  templateUrl: './checkbox-header.component.html',
  styleUrls: ['./checkbox-header.component.scss']
})
export class CheckboxHeaderComponent implements AgRendererComponent {

  params: any;
  subscription: Subscription;
  semesterAmount;
  currentYear;

  constructor(private conductAssessmentComponent:ConductAssessmentComponent) {
  }

  dataGrid;
  checkbox = true;
  agInit(params: any): void {
    this.params = params;
    console.log()
    this.checkEnable();
  }

  // afterGuiAttached(params?: IAfterGuiAttachedParams): void {
  // }

  refresh(params: any): boolean {
    // console.log('param',params);
    // console.log('paramField',params.column.colDef.field);
    // console.log('paramHeader',params.displayName);
    // console.log('test',params.columnApi.columnController.columnDefs[7].children[0].cellRendererFramework);

    // params.columnApi.columnController.columnDefs[7].children[0].cellRendererFramework.prototype.agInit(sdsd){
    //   params.value = false;
    // }
    this.conductAssessmentComponent.selectAll(params);

    // if(params.api.dataAll === undefined){
    //   return false;
    // }
    params.api.refreshCells(params);
    return false;
  }

  checkEnable(){
    this.dataGrid = this.conductAssessmentComponent.dataGrid1();
    console.log('this.dataGrid',this.dataGrid);
    let q = 0;
    this.dataGrid.forEach(item=>{
      if(item.abilityName === null || item.abilityName.toString().trim().length === 0){
        q++;
      }
    })
    if(q===0 && this.dataGrid.length !==0){
      this.checkbox = false;
    }
    else {
      this.checkbox = true;
    }
  }
}
