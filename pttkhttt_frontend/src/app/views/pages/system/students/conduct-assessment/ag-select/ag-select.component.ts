import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-angular';
import {EvaluateConductService} from '../../../../../../core/service/service-model/evaluate-conduct.service';

// import {IAfterGuiAttachedParams} from 'ag-grid';

// @ts-ignore
@Component({
  selector: 'kt-ag-select',
  templateUrl: './ag-select.component.html',
  styleUrls: ['./ag-select.component.css']
})
export class AgSelectComponent implements AgRendererComponent {

  params: any;
  listCompetition = [];


  constructor( private evaluateConductService : EvaluateConductService,
               private changeDetectorRef: ChangeDetectorRef,
  ) {

  }

  agInit(params: any): void {
    this.params = params;
    console.log('selectparam',params);
    const type = {
      type : 'competition'
    };
    this.evaluateConductService.getCompetition(type).subscribe(res=>{
      this.listCompetition = res;
      this.changeDetectorRef.detectChanges();
    })
  }

  refresh(params: any): boolean {
    console.log('listCompe',this.listCompetition);
    console.log('selectparam',params);
    // const x = params.value;
    // const y : number = +x;
    params.data.competitionCode = params.value;
    params.api.refreshCells(params);
    return false;
  }
}
