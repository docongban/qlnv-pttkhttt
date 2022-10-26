import { Component, OnInit } from '@angular/core';
import {StudentsService} from "../../../../../../core/service/service-model/students.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'kt-input-rank',
  templateUrl: './input-rank.component.html',
  styleUrls: ['./input-rank.component.scss']
})
export class InputRankComponent implements OnInit {
  rankValue;
  listSelect;

  rowSelect;
  rowIndex;
  scoreName;
  isUpdate;
  showDropDown;
  params;
  disableScore
  constructor(private studentService: StudentsService,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.listenUpdate();
  }

  // gets called once before the renderer is used
  agInit(params ): void {
    this.params = params;
    this.rowSelect = params.data;
    this.scoreName = params.colDef.tooltipField;
    this.rankValue = this.rowSelect[this.scoreName];
    this.rowIndex = +params.rowIndex + 1;

    const listScoreName = 'selectList' + this.scoreName.replace('ranks', '');
    this.listSelect = this.rowSelect[listScoreName];
    if (this.listSelect !== null) {
      this.showDropDown = true;
    } else {
      this.showDropDown = false;
    }

    // Check date lock
    console.log(params)
    const today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const scoreIndex = this.scoreName.replace('ranks', '');
    const dateLock = this.rowSelect.listScore[scoreIndex].dateLock;
    if (dateLock !== undefined && dateLock !== null) {
      if (today >= dateLock) {
        this.disableScore = true;
      } else {
        this.disableScore = false;
      }
    } else {
      this.disableScore = false;
    }
  }

  changeValue() {
    this.rowSelect[this.scoreName] = this.rankValue?.trim();
    this.studentService.changeCheckStatusBox('rank');
    this.refresh(this.params);
  }

  refresh(params: any): boolean {
    this.formatRow(params.data);
    console.log(params.data);
    this.studentService.changeCheckStatusBox('rank');
    params.api.redrawRows();
    return false;
  }

  listenUpdate() {
    this.studentService.changeIsShowUpdate$.subscribe(value => {
      this.isUpdate = value;
    })
  }
  // this.

  formatRow(element) {
    const newList = element.listScore.map((e, i) => {
      return {
        ...e,
        value: element[`ranks${i}`]
      };
    })
    element.listScore = newList;
    if (this.isCheckedRankScore(element)) {
      element.checked = true;
    } else {
      element.checked = false;
    }
  }

  isCheckedRankScore(item) {
    let checked = true;
    item.listScore.forEach(e => {
      if (e.value === '') {
        checked = false;
      }
    });
    return checked;
  }
}
