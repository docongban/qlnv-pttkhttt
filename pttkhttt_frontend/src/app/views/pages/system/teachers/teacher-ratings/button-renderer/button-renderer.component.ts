// Author: T4professor

import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'kt-button-renderer',
  template: `
    <a (click)="onClick($event)" *ngIf="params.data.status !== 'Chưa đánh giá'; else no" style="color: #3366FF">{{'TEACHER_RATING.FILE_SELF_ASSESSMENT' | translate}}</a>
    <ng-template #no>
      <span>-</span>
    </ng-template>
    `
})

export class ButtonRendererComponent implements ICellRendererAngularComp {

  params;

  agInit(params): void {
    this.params = params;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event) {
    this.params.onClick(this.params);
  }
}
