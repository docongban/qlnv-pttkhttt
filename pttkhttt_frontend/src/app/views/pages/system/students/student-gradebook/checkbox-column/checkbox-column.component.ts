import { Component, OnInit } from '@angular/core';
import {StudentsService} from "../../../../../../core/service/service-model/students.service";

@Component({
  selector: 'kt-checkbox-column',
  templateUrl: './checkbox-column.component.html',
  styleUrls: ['./checkbox-column.component.scss']
})
export class CheckboxColumnComponent implements OnInit {
  checked = false;
  rowSelect;
  params;
  constructor(private studentService: StudentsService) { }

  ngOnInit(): void {
  }

  agInit(params ): void {
    this.params = params;
    this.rowSelect = params.data;
    // console.log(this.rowSelect);
    this.checked = this.rowSelect.checked;
  }

  refresh(params: any): boolean {
    params.api.refreshCells(params);
    return false;
  }
}
