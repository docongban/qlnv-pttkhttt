import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {NgbActiveModal, NgbCollapseModule, NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {DropDownListModule} from '@progress/kendo-angular-dropdowns';
import {MatExpansionModule} from '@angular/material/expansion';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {ButtonModule} from '@progress/kendo-angular-buttons';
import {ModalModule} from 'ngx-bootstrap/modal';
import {NgSelectModule} from '@ng-select/ng-select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ConductAssessmentComponent} from './conduct-assessment.component';
import {EvaluationOfSubjectTeachersComponent} from './evaluation-of-subject-teachers/evaluation-of-subject-teachers.component';
import {AgGridModule} from 'ag-grid-angular';
import {AgCheckboxComponent} from './checkbox/ag-checkbox.component';
import {AgSelectComponent} from './ag-select/ag-select.component';
import {CheckboxHeaderComponent} from "./checkbox-header/checkbox-header.component";

const routes: Routes = [
  {
    path: '',
    component: ConductAssessmentComponent,
  }
]

@NgModule({
  declarations: [EvaluationOfSubjectTeachersComponent,AgCheckboxComponent,AgSelectComponent,
    CheckboxHeaderComponent

  ],
  imports: [
    CommonModule,
    NgbModalModule,
    RouterModule.forChild(routes),
    DropDownListModule,
    MatExpansionModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    NgbCollapseModule,
    ButtonModule,
    ModalModule,
    NgSelectModule,
    MatCheckboxModule,
    AgGridModule,
  ],

  exports: [
    MatFormFieldModule,
    MatInputModule
  ],
  entryComponents: [
    EvaluationOfSubjectTeachersComponent,
    AgCheckboxComponent,
    AgSelectComponent,
    CheckboxHeaderComponent
  ],
  providers:[NgbActiveModal,
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}}],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ConductAssessmentModule {
}
