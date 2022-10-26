import {RouterModule, Routes} from '@angular/router';
import {TeachersComponent} from '../teachers/teachers.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {AngularFileUploaderModule} from 'angular-file-uploader';
import {AgGridModule} from 'ag-grid-angular';
import {ModalModule} from 'ngx-bootstrap/modal';
import {ActionManagesSchoolComponent} from './action-manages-school/action-manages-school.component';
import {ManagesSchoolComponent} from './manages-school.component';
import {TranslateModule} from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: ManagesSchoolComponent,
  },
]

@NgModule({
  declarations: [ActionManagesSchoolComponent],
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
        TranslateModule,
    ],
  entryComponents:
    [
      ActionManagesSchoolComponent
    ]
})
export class ManagesSchoolModule { }
