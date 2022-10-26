import {Component, OnInit} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-angular';
import {AcademicAbilitiesService} from "../academic-abilities.service";

// import {IAfterGuiAttachedParams} from 'ag-grid';

@Component({
  selector: 'app-ag-grid-selec',
  templateUrl: './ag-grid-select.component.html',
  styleUrls: ['./ag-grid-select.component.css']
})
export class AgGridSelectComponent implements AgRendererComponent {

  params: any;
  checkDate;
  dataSelect;
  ability
  constructor(private academicAbilitiesService: AcademicAbilitiesService) {
  }
  agInit(params: any): void {
    this.params = params;
    this.dataSelect = params.api.dataAbility;
    this.ability = params.data.abilityName
    if (params.value === null) params.value = ''
  }

  refresh(params: any): boolean {
    params.data.academicAbility = params.value;
    this.ability = params.data.abilityName
    return false;
  }
}
