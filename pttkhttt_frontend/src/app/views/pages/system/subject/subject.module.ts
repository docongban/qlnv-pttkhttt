import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SubjectComponent} from './subject.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {SearchComponent} from '../search/search.component';
import {DropDownsModule} from '@progress/kendo-angular-dropdowns';
import {FormsModule} from '@angular/forms';
import {GridModule} from '@progress/kendo-angular-grid';
import {ButtonsModule} from '@progress/kendo-angular-buttons';

@NgModule({
    declarations: [
        SubjectComponent,
        SearchComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        MatSelectModule,
        MatTableModule,
        MatCheckboxModule,
        MatIconModule,
        DropDownsModule,
        FormsModule,
        CommonModule,
        GridModule,
        ButtonsModule
    ],
    exports: [
        SearchComponent
    ],
    entryComponents: []
})
export class SubjectModule { }
