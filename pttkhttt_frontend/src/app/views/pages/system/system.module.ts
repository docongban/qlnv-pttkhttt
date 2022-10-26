import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { SystemComponent } from './system.component';
import { CommonModule } from '@angular/common';
import { ClassRoomComponent } from './class-room/class-room.component';
import { SubjectComponent } from './subject/subject.component';
import { PanelBarModule, TabStripModule } from '@progress/kendo-angular-layout';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbCollapseModule, NgbDateParserFormatter, NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import { DialogModule } from '@progress/kendo-angular-dialog';
import {
  DropDownListModule,
  DropDownsModule,
} from '@progress/kendo-angular-dropdowns';
import {
  FormFieldModule,
  InputsModule,
  TextBoxModule,
} from '@progress/kendo-angular-inputs';
import { SubjectModule } from './subject/subject.module';
// import {SchoolInfoModule} from './school-information/school-info.module';
import { LayoutModule } from '@angular/cdk/layout';
import { LabelModule } from '@progress/kendo-angular-label';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { environment } from '../../../../environments/environment';
import {
  BodyModule,
  ColumnResizingService,
  FilterMenuModule,
  GridModule,
  PagerModule,
  SharedModule,
} from '@progress/kendo-angular-grid';
import { SubjectDeclarationComponent } from './subject-declaration/subject-declaration.component';
import { ScoreboardComponent } from './system-configuration/scoreboard/scoreboard.component';
import { MatSelectModule } from '@angular/material/select';
import { ActionShoolComponent } from './school/action-shool/action-shool.component';
import { SchoolComponent } from './school/school.component';
import { SystemConfigurationComponent } from './system-configuration/system-configuration.component';
import { TeachersComponent } from './teachers/teachers.component';
import { StudentsComponent } from './students/students.component';
import { ContactComponent } from './contact/contact.component';
import { OfficialLetterDocumentComponent } from './official-letter-document/official-letter-document.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import { AgGridModule } from 'ag-grid-angular';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SchoolSubjectComponent } from './school/schoolSubject/school-subject.component';
import { ModalAddEditSchoolSubjectComponent } from './school/schoolSubject/modal-add-edit-school-subject/modal-add-edit-school-subject.component';
import { ActionSchoolSubjectComponent } from './school/schoolSubject/action-school-subject/action-school-subject.component';
import { ScoreboardModule } from './system-configuration/scoreboard/scoreboard.module';
import { ActionTeacherComponent } from './teachers/action-teacher/action-teacher.component';
import { TeacherProfileComponent } from './teachers/teacher-profile/teacher-profile.component';
import { TeachingAssignmentComponent } from './teachers/teaching-assignment/teaching-assignment.component';
import { ManageContactComponent } from './system-configuration/manage-contact/manage-contact.component';
import { ActionManageContactComponent } from './system-configuration/manage-contact/action-manage-contact/action-manage-contact.component';
import { HistoryContactPackageComponent } from './system-configuration/manage-contact/history-contact-package/history-contact-package.component';
import { ActionTeachingAssignmentComponent } from './teachers/teaching-assignment/action-teaching-assignment/action-teaching-assignment.component';
import { ImportTeachingAssignmentComponent } from './teachers/teaching-assignment/import-teaching-assignment/import-teaching-assignment.component';
import { SchoolYearComponent } from './school-year/school-year.component';
import { ConfigPointLockComponent } from './config-point-lock/config-point-lock.component';
import { SchoolYearModule } from './school-year/school-year.module';
import {MAT_DATE_LOCALE, MatOptionModule} from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { ImportFileSubjectComponent } from './school/schoolSubject/import-file/import-file-subject.component';
import { StudentsModule } from './students/students.module';
import { ActionStudentComponent } from './students/action-student/action-student.component';
import 'ag-grid-enterprise';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SubjectDeclarationModule } from './subject-declaration/subject-declaration.module';
import { StudentProfileComponent } from './students/student-profile/student-profile.component';
import { TooltipComponent } from './class-room/tooltip/tooltip.component';
import { CreateUpdateTeachersComponent } from './teachers/create-update-teachers/create-update-teachers.component';
import { CreateUpdateStudentComponent } from './students/create-update-students/create-update-student.component';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { TranslateModule } from '@ngx-translate/core';
import { TeacherRatingsComponent } from './teachers/teacher-ratings/teacher-ratings.component';
import { ButtonRendererComponent } from './teachers/teacher-ratings/button-renderer/button-renderer.component';
import { ScheduleTimetableComponent } from './school/schedule-timetable/schedule-timetable.component';
import { ModalImportComponent } from './school/schedule-timetable/modal-import/modal-import.component';
// tslint:disable-next-line:max-line-length
import { SelectScheduleTimetableComponent } from './school/schedule-timetable/select-schedule-timetable/select-schedule-timetable.component';
import { SystemsDirective } from './systems.directive';
import { StudentGradebookComponent } from './students/student-gradebook/student-gradebook.component';
import {AttendanceStudentComponent} from './attendance-student/attendance-student.component';
import {AttendanceStudentModule} from './attendance-student/attendance-student.module';
import {CoreModule} from '../../../core/core.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {SendMailComponent} from './contact/send-mail/send-mail.component';
import {TreeviewModule} from 'ngx-treeview';
import {EditorModule} from '@progress/kendo-angular-editor';
import { TreeViewComponent } from './contact/tree-view/tree-view.component';
import { ContactGroupComponent } from './contact/contact-group/contact-group.component';
import { GroupActionComponent } from './contact/contact-group/group-action/group-action.component';
import { ViewDetailGroupComponent } from './contact/contact-group/view-detail-group/view-detail-group.component';
import { CreateGroupComponent} from './contact/contact-group/create-group/create-group.component';
import {BtnCellRendererComponent} from './contact/contact-group/create-group/btn-cell-renderer.component';
import {ViewFileComponent} from './teachers/teacher-profile/view-file/view-file.component';
import {AccountManagementComponent} from './account-management/account-management.component';
import {ConductAssessmentComponent} from './students/conduct-assessment/conduct-assessment.component';
import {ConductAssessmentModule} from './students/conduct-assessment/conduct-assessment.module';
import { DownloadButtonRenderComponent } from './official-letter-document/download-button-render/download-button-render.component';
import { ActionOfficalLetterDocumentComponent } from './official-letter-document/action-offical-letter-document/action-offical-letter-document.component';
import {AccountManagementModule} from './account-management/account-management.module';
import {ChangePasswordComponent} from '../auth/change-password/change-password.component';
import {AcademicAbilitiesComponent} from './academic-abilities/academic-abilities.component';
import {AcademicAbilitiesModule} from './academic-abilities/academic-abilities.module';
import { CreateOfficalLetterComponent } from './official-letter-document/create-offical-letter/create-offical-letter.component';
import {ListTeacherSendMailComponent} from './contact/send-mail/list-teacher-send-mail/list-teacher-send-mail.component';
import { ManagesSchoolComponent } from './manages-school/manages-school.component';
import { ActionManagesSchoolComponent } from './manages-school/action-manages-school/action-manages-school.component';
import { ViewSchoolComponent } from './manages-school/view-school/view-school.component';
import { DataPackageComponent } from './data-package/data-package.component';
import { ActionDataPackageComponent } from './data-package/action-data-package/action-data-package.component';
import { CreateDataPackageComponent } from './data-package/create-data-package/create-data-package.component';

import {PackageManagementComponent} from './package-management/package-management.component';

import { StatisticComponent } from './statistic/statistic.component';
import {ChartModule} from '@progress/kendo-angular-charts';
import { StatisticSmsComponent } from './statistic/statistic-sms/statistic-sms.component';
import {CustomDateFormat1, DashboardComponent} from './dashboard/dashboard.component';
import { StatisticalChartComponent } from './dashboard/statistical-chart/statistical-chart.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import { StatisticRevenueComponent } from './statistic-revenue/statistic-revenue.component';
import { StatisticDetailComponent } from './statistic-revenue/statistic-detail/statistic-detail.component';
import { ListSchoolProvinceComponent } from './dashboard/list-school-province/list-school-province.component';
import { ActionStaticComponent } from './statistic/action-static/action-static.component';
import { PriceDirective } from './data-package/create-data-package/PriceDirective';
import {NgbDateMomentParserFormatter} from './package-management/datePickerFormat';
import {NumbericDirective} from './package-management/numberic.directive';


const routes: Routes = [
  {
    path: '',
    component: SystemComponent,
  },
  // {
  //   path: 'subject',
  //   component: SubjectComponent,
  // },
  // {
  //   path: 'school/subject-declaration',
  //   component: SubjectDeclarationComponent,
  // },
  // {
  //   path: 'school/class-room',
  //   component: ClassRoomComponent,
  // },
  // {
  //   path: 'school/configuration',
  //   component: SchoolComponent,
  // },
  // {
  //   path: 'system-configuration',
  //   component: SystemConfigurationComponent,
  // },
  // {
  //   path: 'teacher/teacher-management',
  //   component: TeachersComponent,
  // },
  // {
  //   path: 'student/student-management',
  //   component: StudentsComponent,
  // },
  // {
  //   path: 'student/student-profile/:id/:year',
  //   component: StudentProfileComponent,
  // },
  // {
  //   path: 'student/create-update-student',
  //   component: CreateUpdateStudentComponent,
  // },
  // {
  //   path: 'student/create-update-student/:id',
  //   component: CreateUpdateStudentComponent,
  // },
  // {
  //   path: 'student/students-gradebook',
  //   component: StudentGradebookComponent,
  // },
  // {
  //   path: 'student/attendance-student',
  //   component: AttendanceStudentComponent,
  // },
  // {
  //   path: 'official-letter-document',
  //   component: OfficialLetterDocumentComponent,
  // },
  // {
  //   path: 'contact',
  //   component: ContactComponent,
  // },
  // {
  //   path: 'school/school-subject',
  //   component: SchoolSubjectComponent,
  // },
  // {
  //   path: 'modal-add-edit-school-subject',
  //   component: ModalAddEditSchoolSubjectComponent,
  // },
  // {
  //   path: 'modal-add-edit-school-subject',
  //   component: ModalAddEditSchoolSubjectComponent,
  // },
  // {
  //   path: 'school/school-year',
  //   component: SchoolYearComponent,
  // },
  // {
  //   path: 'system-configuration/scoreboard',
  //   component: ScoreboardComponent,
  // },
  // {
  //   path: 'system-configuration/manage-contact',
  //   component: ManageContactComponent,
  // },
  // {
  //   path: 'teacher/teacher-profile/:id',
  //   component: TeacherProfileComponent,
  // },
  // {
  //   path: 'teacher/teaching-assignment',
  //   component: TeachingAssignmentComponent,
  // },
  // {
  //   path: 'teacher/create-update-teacher',
  //   component: CreateUpdateTeachersComponent,
  // },
  // {
  //   path: 'system-configuration/config-point-lock',
  //   component: ConfigPointLockComponent,
  // },
  // {
  //   path: 'teacher/teacher-ratings',
  //   component: TeacherRatingsComponent,
  // },
  // {
  //   path: 'school/schedule-timetable',
  //   component: ScheduleTimetableComponent,
  // },
  // {
  //   path: 'contact/send-mail',
  //   component: SendMailComponent,
  // },
  // {
  //   path: 'contact/contact-group',
  //   component: ContactGroupComponent,
  // },
  // {
  //   path: 'account/account-management',
  //   component: AccountManagementComponent,
  // },
  // {
  //   path: 'student/conduct-assessment',
  //   component: ConductAssessmentComponent,
  // },
  {
    path: 'account/change-password',
    component: ChangePasswordComponent,
  },
  // {
  //   path: 'student/academic-abilities',
  //   component: AcademicAbilitiesComponent,
  // },
  {
    path: 'school/manages-school',
    component: ManagesSchoolComponent,
  },
  {
    path: 'data-package',
    component: DataPackageComponent,
  },
  {

    path: 'package-management',
    component: PackageManagementComponent,
  },
  {
    path: 'statistic',
    component: StatisticComponent,

  },
  {
    path: 'statistic/revenue',
    component: StatisticRevenueComponent,

  },
  {
    path: 'dashboard',
    component: DashboardComponent,

  },
  // {
  //   path: 'teacher',
  //   children: [
  //     {
  //       path: 'teaching-timetable',
  //       loadChildren: () => import('./teachers/teaching-timetable/teaching-timetable.module')
  //         .then(m => m.TeachingTimetableModule),
  //     }
  //   ]
  // },
  // {
  //   path: 'student',
  //   children: [
  //     {
  //       path: 'transfer-students',
  //       loadChildren: () => import('./students/transfer-students/transfer-students.module')
  //         .then(m => m.TransferStudentsModule),
  //     }
  //   ]
  // },
  { path: '', redirectTo: 'system', pathMatch: 'full' },
  { path: '**', redirectTo: 'system', pathMatch: 'full' },
];

// @ts-ignore
// @ts-ignore
@NgModule({
  providers: [ColumnResizingService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    {
      provide: NgbDateParserFormatter,
      useFactory: () => { return new NgbDateMomentParserFormatter('DD/MM/YYYY') }
    }
    ],
  declarations: [
    PackageManagementComponent,
    SelectScheduleTimetableComponent,
    ScheduleTimetableComponent,
    SystemComponent,
    SubjectDeclarationComponent,
    SchoolComponent,
    SystemConfigurationComponent,
    SchoolComponent,
    SystemConfigurationComponent,
    TeacherRatingsComponent,
    ButtonRendererComponent,
    TeachersComponent,
    StudentsComponent,
    OfficialLetterDocumentComponent,
    SchoolSubjectComponent,
    ModalAddEditSchoolSubjectComponent,
    ContactComponent,
    ActionShoolComponent,
    ActionSchoolSubjectComponent,
    ScoreboardComponent,
    ActionTeacherComponent,
    ActionStudentComponent,
    TeacherProfileComponent,
    TeachingAssignmentComponent,
    ManageContactComponent,
    ActionTeachingAssignmentComponent,
    ImportTeachingAssignmentComponent,
    ActionManageContactComponent,
    HistoryContactPackageComponent,
    ImportFileSubjectComponent,
    ConfigPointLockComponent,
    SystemConfigurationComponent,
    SubjectDeclarationComponent,
    SchoolComponent,
    CreateUpdateTeachersComponent,
    CreateUpdateStudentComponent,
    SystemsDirective,
    ModalImportComponent,
    AttendanceStudentComponent,
    SendMailComponent,
    TreeViewComponent,
    ContactGroupComponent,
    GroupActionComponent,
    ViewDetailGroupComponent,
    CreateGroupComponent,
    BtnCellRendererComponent,
    AttendanceStudentComponent,
    ViewFileComponent,
    AccountManagementComponent,
    ConductAssessmentComponent,
    DownloadButtonRenderComponent,
    ActionOfficalLetterDocumentComponent,
    ChangePasswordComponent,
    AcademicAbilitiesComponent,
    ManagesSchoolComponent,
    ActionManagesSchoolComponent,
    CreateOfficalLetterComponent,
    ViewSchoolComponent,
    ListTeacherSendMailComponent,
    DataPackageComponent,
    ActionDataPackageComponent,
    CreateDataPackageComponent,
    StatisticComponent,
    StatisticSmsComponent,
    DashboardComponent,
    StatisticalChartComponent,
    ListSchoolProvinceComponent,
    ActionStaticComponent,
    StatisticRevenueComponent,
    StatisticDetailComponent,
    PriceDirective,
    NumbericDirective,
    CustomDateFormat1
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ScoreboardModule,
    SchoolYearModule,
    InputsModule,
    LabelModule,
    FilterMenuModule,
    NgbModule,
    InputsModule,
    LabelModule,
    FilterMenuModule,
    HttpClientModule,
    NgSelectModule,
    NzTreeSelectModule,
    AngularFileUploaderModule,
    AgGridModule.withComponents([TooltipComponent, BtnCellRendererComponent]),
    ModalModule.forRoot(),
    NgxsModule.forRoot([], {
      developmentMode: !environment.production,
    }),
    FormsModule,
    NgbModalModule,
    NgbCollapseModule,
    TabStripModule,
    PanelBarModule,
    LayoutModule,
    GridModule,
    ButtonsModule,
    DropDownsModule,
    DateInputsModule,
    SharedModule,
    DialogModule,
    DropDownListModule,
    SubjectModule,
    FormFieldModule,
    ReactiveFormsModule,
    TextBoxModule,
    BodyModule,
    PagerModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatRadioModule,
    SubjectDeclarationModule,
    StudentsModule,
    TranslateModule,
    AttendanceStudentModule,
    CoreModule,
    MatTooltipModule,
    EditorModule,
    AngularFileUploaderModule,
    TreeviewModule.forRoot(),
    MatTooltipModule,
    ConductAssessmentModule,
    AccountManagementModule,
    AcademicAbilitiesModule,
    ChartModule,
    MatDatepickerModule,
    MatIconModule
  ],
  entryComponents: [
    SelectScheduleTimetableComponent,
    ModalImportComponent,
    ButtonRendererComponent,
    ActionShoolComponent,
    ActionSchoolSubjectComponent,
    ActionTeachingAssignmentComponent,
    ActionManageContactComponent,
    HistoryContactPackageComponent,
    ActionTeacherComponent,
    ActionStudentComponent,
    ImportFileSubjectComponent,
    ImportTeachingAssignmentComponent,
    GroupActionComponent,
    ViewDetailGroupComponent,
    CreateGroupComponent,
    ViewFileComponent,
    DownloadButtonRenderComponent,
    ActionOfficalLetterDocumentComponent,
    AccountManagementComponent,
    ChangePasswordComponent,
    CreateOfficalLetterComponent,
    ListTeacherSendMailComponent,
    ActionManagesSchoolComponent,
    ViewSchoolComponent,
    ActionDataPackageComponent,
    CreateDataPackageComponent,
    StatisticSmsComponent,
    ActionStaticComponent,
    ListSchoolProvinceComponent,
    StatisticRevenueComponent,
    StatisticDetailComponent],
})

export class SystemModule {}
