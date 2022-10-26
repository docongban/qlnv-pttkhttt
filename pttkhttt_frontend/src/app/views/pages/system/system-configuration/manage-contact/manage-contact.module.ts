import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';
import { ManageContactComponent } from './manage-contact.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import {MatTooltipModule} from "@angular/material/tooltip";

const routers = [
  {
    path: '',
    component: ManageContactComponent,
  },
];

@NgModule({
  declarations: [ManageContactComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routers),
    AgGridModule.withComponents([]),
    MatDialogModule,
    NgSelectModule,
    FormsModule,
    NgbModule,
    NgxDaterangepickerMd.forRoot(),
    MatTooltipModule,
    ReactiveFormsModule
  ],
})
export class ManageContactModule {}
