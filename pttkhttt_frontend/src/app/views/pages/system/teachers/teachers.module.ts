import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { TeachersComponent } from './teachers.component';
import { ActionTeacherComponent } from './action-teacher/action-teacher.component';
import { CreateUpdateTeachersComponent } from './create-update-teachers/create-update-teachers.component';


const routes: Routes = [
  {
    path: '',
    component: TeachersComponent,
  },
  {path: '', redirectTo: 'teacher', pathMatch: 'full'},
  {path: '**', redirectTo: 'teacher', pathMatch: 'full'},
]

@NgModule({
  declarations: [ActionTeacherComponent, CreateUpdateTeachersComponent],
  imports: [
    CommonModule,
    CommonModule,
    NgModule,
    RouterModule.forChild(routes),
    NgSelectModule,
    FormsModule,
    AngularFileUploaderModule,
    AgGridModule.withComponents([]),
    ModalModule.forRoot(),
    AgGridModule.withComponents([]),
  ],
  entryComponents:
  [
    ActionTeacherComponent
 ]
})
export class TeachersModule { }
