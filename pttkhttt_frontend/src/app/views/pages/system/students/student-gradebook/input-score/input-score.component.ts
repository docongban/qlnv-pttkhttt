import { Component, OnInit } from '@angular/core';
import {StudentsService} from '../../../../../../core/service/service-model/students.service';
import {DatePipe} from "@angular/common";

@Component({
  selector: 'kt-input-score',
  templateUrl: './input-score.component.html',
  styleUrls: ['./input-score.component.scss']
})
export class InputScoreComponent implements OnInit {
  params;
  scoreValue;
  rowSelect;
  scoreName;
  isUpdate;
  decimals = 2;
  disableScore;
  rowIndex;
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
    this.scoreValue = this.rowSelect[this.scoreName];
    this.rowIndex = +params.rowIndex + 1;

    // Check date lock
    const today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const scoreIndex = params.colDef.tooltipField.replace('score', '');
    const dateLock = this.rowSelect.listScore[scoreIndex - 1].dateLock;
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

  setScore(event) {
    const oldValue = +event.target.value;
    console.log(event.target.value);
    setTimeout(() => {
      const currentValue: string = event.target.value;
      console.log(currentValue)
      console.log(currentValue.indexOf('0'))
      if (this.check(currentValue) &&
        +currentValue < 10 &&
        currentValue.length === 2 &&
        currentValue.indexOf('.') === -1 &&
        currentValue.indexOf('0') === 0
      ) {
        event.target.value = currentValue.replace('0','');
      }else {
        if (currentValue !== '' && !this.check(currentValue) ||
          ( this.check(currentValue) && +currentValue > 10) ||
          (this.check(currentValue) && +this.check(currentValue).input === 0)
        ) {
          if ( currentValue !== '0.' && +this.check(currentValue)?.input === 0) {
            event.target.value = '0';
          } else if(currentValue === `0.`) {
            event.target.value = currentValue;
          } else {
            event.target.value = oldValue;
          }
        }
      }
    });
  }

  changeAvgScore() {
    if (this.scoreValue?.trim() !== '' && !this.check(this.scoreValue?.trim()) ||
      (this.check(this.scoreValue?.trim()) && +this.scoreValue > 10)) {
      this.scoreValue = this.scoreValue?.trim()?.substring(0, this.scoreValue.length - 1);
    }
    this.rowSelect[this.scoreName] = this.scoreValue?.trim();
    this.params.data = this.rowSelect;
    this.refresh(this.params);
  }

  listenUpdate() {
    this.studentService.changeIsShowUpdate$.subscribe(value => {
      this.isUpdate = value;
    })
  }

  refresh(params: any): boolean {
    this.formatRow(params.data);
    console.log(params.data);
    this.studentService.changeCheckStatusBox('score');
    params.api.redrawRows();
    return false;
  }

  // Validate input score
  private check(value: string) {
    if (this.decimals <= 0) {
      return String(value).match(new RegExp(/^\d+$/));
    }else {
      const regExpString =
        '^\\s*((\\d+(\\.\\d{0,' +
        this.decimals +
        '})?)|((\\d*(\\.\\d{1,' +
        this.decimals +
        '}))))\\s*$';
      return String(value).match(new RegExp(regExpString));
    }
  }

  formatRow(row) {
    const newRow = row.listScore.map((e, i) => {
      const score = 'score' + (i + 1);
      return {
        ...e,
        value: row[score],
        value2: row[score] ? Number(row[score]) * Number(e.coeficient) : null,
      };
    })
    const scores = newRow.map(e => {
      return {
        score: e.value2,
        coeficient: e.coeficient
      };
    });
    const avgScores = this.sum(scores, 'score') / this.sum(scores, 'coeficient');
    console.log(avgScores)
    row.listScore = newRow;
    const avg = this.checkCalcAvgScore(row) ? Math.round(avgScores * 100) / 100 : null;
    row.avgScore = avg;
    if (avg !== null) {
      row.checked = true;
    } else {
      row.checked = false;
    }
  }

  sum(items, key) {
    const arr = items.filter(ele => ele.score !== null);
    return arr.reduce((a, b) => {
      return a + b[key];
    }, 0);
  };

  // Check calc avgScore
  checkCalcAvgScore(element) {
    let calcSum = true;
    element.confScoreDetailsList.forEach(item => {
      let i = 0;
      element.listScore.forEach(e => {
        if (item.code === e.scoreCode && e.value !== null && e.value !== '') {
          i++;
        }
      });
      if (i < item.minimumScore) calcSum = false;
    });
    return calcSum;
  }

  roundNumber(num, scale) {
    if(!('' + num).includes('e')) {
      return +(Math.round(Number(num + 'e+' + scale))  + 'e-' + scale);
    } else {
      const arr = ('' + num).split('e');
      let sig = ''
      if(+arr[1] + scale > 0) {
        sig = '+';
      }
      return +(Math.round(Number(+arr[0] + 'e' + sig + (+arr[1] + scale))) + 'e-' + scale);
    }
  }
}
