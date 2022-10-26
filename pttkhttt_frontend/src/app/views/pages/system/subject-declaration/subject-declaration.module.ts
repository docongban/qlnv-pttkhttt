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
import {SubjectDeclarationComponent} from "./subject-declaration.component";
import {ConfirmSaveComponent} from "./confirm-save/confirm-save.component";
import {AgGridSelectComponent} from "./ag-grid-select/ag-grid-select.component";
import {AgGridCheckboxComponent} from "./ag-grid-checkbox/ag-grid-checkbox.component";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {AgGridCheckboxHeaderComponent} from "./ag-grid-checkbox-header/ag-grid-checkbox-header.component";

const routes: Routes = [
    {
        path: '',
        component: SubjectDeclarationComponent,
    }
]

@NgModule({
    declarations: [
        AgGridCheckboxComponent,
        AgGridCheckboxHeaderComponent,
        ConfirmSaveComponent,
        AgGridSelectComponent
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
        MatCheckboxModule
    ],

    exports: [
        MatFormFieldModule,
        MatInputModule
    ],
    entryComponents: [
        AgGridCheckboxComponent,
        AgGridCheckboxHeaderComponent,
        ConfirmSaveComponent,
        AgGridSelectComponent
    ],
    providers: [NgbActiveModal,
        {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}}],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SubjectDeclarationModule {
}
