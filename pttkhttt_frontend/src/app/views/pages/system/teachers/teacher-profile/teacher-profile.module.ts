import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';
import { TeacherProfileComponent } from './teacher-profile.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ViewFileComponent } from './view-file/view-file.component';

const routers = [
  {
      path: '',
      component: TeacherProfileComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routers),
    AgGridModule.withComponents([]),
    MatDialogModule,
    NgSelectModule,
    FormsModule,
    NgbModule

  ],
  entryComponents: []
})
export class TeacherProfileModule { }
