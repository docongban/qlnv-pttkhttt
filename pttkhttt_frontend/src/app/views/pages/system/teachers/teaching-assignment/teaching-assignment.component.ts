import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {BsModalRef, BsModalService, ModalDirective} from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { CommonServiceService } from 'src/app/core/service/utils/common-service.service';
import { ClassroomService } from 'src/app/core/service/service-model/classroom.service';
import { GradeLevelService } from 'src/app/core/service/service-model/grade-level.service';
import { TeachingAssignmentService } from 'src/app/core/service/service-model/teaching-assignment.service';

import { MatDialog } from '@angular/material/dialog';
import { AgGridCheckboxComponent } from 'src/app/views/pages/system/subject-declaration/ag-grid-checkbox/ag-grid-checkbox.component';
import { ActionTeachingAssignmentComponent } from './action-teaching-assignment/action-teaching-assignment.component';
import { ImportTeachingAssignmentComponent } from './import-teaching-assignment/import-teaching-assignment.component';

import * as moment from 'moment';
import {SchoolYearService} from "../../school-year/school-year.service";
@Component({
  selector: 'kt-teaching-assignment',
  templateUrl: './teaching-assignment.component.html',
  styleUrls: ['./teaching-assignment.component.scss'],
})
export class TeachingAssignmentComponent implements OnInit {
  unsubscribe$ = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private matDialog: MatDialog,
    private modalService: BsModalService,
    private changeDetectorRef: ChangeDetectorRef,
    private commonService: CommonServiceService,
    private classRoomService: ClassroomService,
    private teachingAssignmentService: TeachingAssignmentService,
    private gradeLevelService: GradeLevelService,
    private getYear: SchoolYearService
  ) {
    this.columnDefs = this.defaultCols;
    this.rowData = [];
  }
  @ViewChild('modalUpdateTeachingAssignment') public selectedTeachingAssignment: TemplateRef<any>;
  modalRef: BsModalRef;

  // ag-grid
  gridApi;
  gridColumnApi;
  columnDefs;
  defaultColDef = {
    width: 150,
    lockPosition: true,
    suppressMenu: true,
  };
  rowData;
  ROW_HEIGHT = 50;
  HEADER_HEIGHT = 56;
  rowStyle;
  context;
  subjectName = '';
  teacherName = '';
  limitStringCellValue = (params) => {
    const element = document.createElement('span');
    element.className = 'one-line-ellipsis w-100';
    element.appendChild(document.createTextNode(params.value));
    return element;
  };
  renderCheckboxCell = (params) => {
    const element = document.createElement('span');
    if (params.value) {
      element.className = 'sy-ic ic-svg-checkbox-check';
    } else {
      element.className = 'sy-ic ic-svg-checkbox-uncheck';
    }
    return element;
  };
  cellStyle = {
    'font-style': 'normal',
    'font-size': '12px',
    'line-height': '20px',
    color: '#101840',
    'align-items': 'center',
    display: 'flex',
    'font-weight': '500',
    'font-family': 'Inter',
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
    'white-space': 'nowrap',
  };
  defaultCols = [
    {
      headerName: 'STT',
      headerTooltip: 'STT',
      headerClass: 'sy-header-center',
      field: 'index',
      tooltipField: 'index',
      minWidth: 50,
      maxWidth: 50,
      cellStyle: {
        ...this.cellStyle,
        'justify-content': 'center',
      },
    },
    {
      headerName: 'Khối',
      headerTooltip: 'Khối',
      field: 'gradeLevelName',
      tooltipField: 'gradeLevelName',
      minWidth: 120,
      cellStyle: {
        ...this.cellStyle,
      },
      cellRenderer: (params) => this.limitStringCellValue(params),
    },
    {
      headerName: 'Tên lớp',
      headerTooltip: 'Tên lớp',
      field: 'className',
      tooltipField: 'className',
      minWidth: 100,
      cellStyle: {
        ...this.cellStyle,
      },
      cellRenderer: (params) => this.limitStringCellValue(params),
    },
    {
      headerName: 'Môn học',
      headerTooltip: 'Môn học',
      field: 'subjectName',
      tooltipField: 'subjectName',
      minWidth: 200,
      cellStyle: {
        ...this.cellStyle,
      },
      cellRenderer: (params) => this.limitStringCellValue(params),
    },
    {
      headerName: 'Giáo viên phân công',
      headerTooltip: 'Giáo viên phân công',
      field: 'teacher',
      tooltipField: 'teacher',
      minWidth: 280,
      cellStyle: {
        ...this.cellStyle,
      },
      cellRenderer: (params) => this.limitStringCellValue(params),
    },
  ];
  lastCols = [
    {
      headerName: `Cả năm`,
      headerTooltip: `Cả năm`,
      headerClass: 'sy-header-center',
      field: `applyAllSemester`,
      cellRenderer: (params) => this.renderCheckboxCell(params),
      minWidth: 120,
      maxWidth: 120,
      cellStyle: {
        ...this.cellStyle,
        'justify-content': 'center',
      },
    },
    {
      headerName: '',
      headerTooltip: '',
      field: '',
      cellRendererFramework: ActionTeachingAssignmentComponent,
      minWidth: 50,
      maxWidth: 50,
      cellStyle:{
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#696F8C',
      },
      suppressMovable: true,
    },
  ];
  // search form
  dataSearch;
  formSearch: FormGroup;
  subscription: Subscription;
  // paging
  perPage = 10;
  currentPage = 1;
  first = 1;
  last = 10;
  total = 0;
  totalPage = 0;
  rangeWithDots = [];
  noRowsTemplate = 'Không có bản ghi nào';
  loadingTemplate = 'Đang tìm kiếm';

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
  }

  ngOnInit(): void {
    this.loadCurrentYear();
    this.buildFormSearch();
  }

  buildFormSearch() {
    this.formSearch = this.fb.group({
      subjectName: '',
      teacherName: '',
    });
  }

  currentYear;
  years;
  semesterAmount;
  loadCurrentYear(): void {
    this.subscription = this.classRoomService.yearCurrent$.subscribe(
      (currentYear) => {
        this.currentYear = currentYear;
        if(currentYear !== ''){
        this.getYear.getInfoYear(this.currentYear).subscribe(res => {
          // const year = listYears.find(
          //           //   (_year) => _year.years === this.currentYear
          //           // );
          this.semesterAmount = res[0].semesterAmount;
          this.getColumn();
          this.loadGradeLevel();
        });

        }
      }
    );
  }

  getColumn(){
    this.columnDefs = null;
    this.columnDefs = [...this.defaultCols];
    for (let _i = 0; _i < this.semesterAmount; _i++) {
      this.columnDefs.push({
        headerName: `Học kỳ ${_i + 1}`,
        headerTooltip: `Học kỳ ${_i + 1}`,
        headerClass: 'sy-header-center',
        field: `semester${_i + 1}`,
        cellRenderer: (params) => this.renderCheckboxCell(params),
        minWidth: 120,
        maxWidth: 120,
        cellStyle: {
          ...this.cellStyle,
          'justify-content': 'center',
          textAlign: 'center',
        },
      });
      this.gridApi.setColumnDefs(this.columnDefs);
      if(_i === this.semesterAmount - 1){
        this.columnDefs.push(...this.lastCols);
        this.gridApi.setColumnDefs(this.columnDefs);
        this.gridApi.setRowData(this.rowData);
      }
    }
  }
  listGradeLevel = [];
  selectedGradeLevel = null;
  loadGradeLevel(): void {
    this.gradeLevelService
      .getGradeLevelOfSubject()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.listGradeLevel = res;
          this.selectedGradeLevel = res[0].id;
          console.log({ listGradeLevel: this.listGradeLevel });
          this.changeDetectorRef.detectChanges();
          this.loadClassRoom();
        },
      });
  }

  onChangeGradeLevel(gradeLevelId) {
    this.selectedGradeLevel = gradeLevelId;
    this.loadClassRoom();
  }

  listClass = [];
  selectedClassId = null;
  loadClassRoom(): void {
    if (Boolean(this.selectedGradeLevel)) {
      let query: object = {
        gradeLevel: this.selectedGradeLevel,
        years: this.currentYear,
      };
      this.classRoomService
        .findByGradeLevelAndYear(query)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (res) => {
            this.changeDetectorRef.detectChanges();
            if(res.data == null){
              this.selectedClassId = null;
              this.listClass = null;
              this.findTeachingAssignment(1);
            }
            else{
              this.listClass = res.data.map((_class) => ({
                id: _class.id,
                name: `${_class.code} - ${_class.name}`,
                code: _class.code,
              }));
              this.selectedClassId = res.data[0].id
            }
            this.findTeachingAssignment(1);
          },
        });
    }
  }

  onChangeClass(classId) {
    this.selectedClassId = classId;
    this.findTeachingAssignment(1);
  }

  findTeachingAssignment(page: number) {
    this.currentPage = page;
    const dataSearch = {
      gradeLevel: this.selectedGradeLevel,
      classRoom: this.selectedClassId,
      subject: this.subjectName.trim(),
      teacher: this.teacherName.trim(),
      year: this.currentYear,
    };
    this.dataSearch = dataSearch;
    this.gridApi.showLoadingOverlay();
    this.teachingAssignmentService
      .doSearch(dataSearch, page, this.perPage)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          const { content: teachingAssignments, totalElements } = response;
          console.log('find teaching assignment', { teachingAssignments });
          if (totalElements > 0) {
            this.total = totalElements;
            this.totalPage = Math.ceil(this.total / this.perPage);
            this.rangeWithDots = this.commonService.pagination(
              this.currentPage,
              this.totalPage
            );
            this.first = this.perPage * (this.currentPage - 1) + 1;
            this.last = this.first + teachingAssignments.length - 1;

            this.rowData = teachingAssignments.map(
              (teachingAssignment, _index) => {
                const singleRowData = {
                  index: this.first + _index,
                  id: teachingAssignment.id,
                  gradeLevel: teachingAssignment.gradeLevel,
                  gradeLevelName: teachingAssignment.gradeLevelName,
                  classCode: teachingAssignment.classCode,
                  className: teachingAssignment.className,
                  subjectId: teachingAssignment.subjectId,
                  subjectCode: teachingAssignment.subjectCode,
                  subjectName: teachingAssignment.subjectName,
                  teacherId: teachingAssignment.teacherId,
                  teacherCode: teachingAssignment.teacherCode,
                  teacher: teachingAssignment.teacher,
                  applyAllSemester: teachingAssignment.applyAllSemester,
                };

                for (let _i = 0; _i < this.semesterAmount; _i++) {
                  singleRowData[`semester${_i + 1}`] =
                    teachingAssignment[`semester${_i + 1}`];
                }

                return singleRowData;
              }
            );
          } else {
            this.total = 0;
            this.rangeWithDots = [];
            this.first = 0;
            this.last = 0;
            this.rowData = [];
            if(this.listClass !== null){
              const selectedClass = this.listClass.find(
                (_class) => _class.id === this.selectedClassId
              );
              if (selectedClass) {
                // this.noRowsTemplate = `${selectedClass.name} chưa được phân công giảng dạy`;
                this.toastr.warning(`${selectedClass.name} chưa được phân công giảng dạy`);
              }
            }
          }

          console.log(`this.rowData`, this.rowData);
          this.gridApi.setRowData(this.rowData);
          this.changeDetectorRef.detectChanges();
          this.gridApi.sizeColumnsToFit();
          // this.gridApi.hideOverlay();
        },
      });
  }

  goToPage(page: number) {
    if (page !== this.currentPage && page >= 1 && page <= this.totalPage) {
      this.currentPage = page;
      this.findTeachingAssignment(page);
    }
  }

  openImportDialog() {
    const dataImport: any = {
      currentYear: this.currentYear,
    };
    this.matDialog
      .open(ImportTeachingAssignmentComponent, {
        data: dataImport,
        disableClose: true,
        hasBackdrop: true,
        width: '446px',
      })
      .afterClosed()
      .subscribe((res) => {
        console.log('dong import');
      });
  }

  exportData() {
    console.log('searchDataExport', this.dataSearch);
    this.teachingAssignmentService
      .export(this.dataSearch, this.currentYear)
      .subscribe((responseMessage) => {
        const file = new Blob([responseMessage], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const fileURL = URL.createObjectURL(file);
        // window.open(fileURL, '_blank');
        const anchor = document.createElement('a');
        anchor.download = `DS_Phanconggiangday_${moment()
          .format('DDMMYYYY')
          .toString()}`;
        anchor.href = fileURL;
        anchor.click();
      });
  }

  errorMessages = {};

  listEditingSubjects;
  editingSubjectCode;

  listEditingTeachers;
  editingTeacherCode;

  listEditingSemesters;
  editingSemesters;
  openModalUpdateTeachingAssignment(data: any) {
    this.changeDetectorRef.detectChanges();

    this.listEditingSemesters = [];
    this.editingSemesters = [];
    for (let _i = 0; _i < this.semesterAmount; _i++) {
      this.listEditingSemesters.push({
        id: `semester${_i + 1}`,
        name: `Học kỳ ${_i + 1}`,
      });
      if (data[`semester${_i + 1}`]) {
        this.editingSemesters.push(`semester${_i + 1}`);
      }
    }
    this.listEditingSemesters.push({
      id: `applyAllSemester`,
      name: 'Cả năm',
    });
    this.editingSemesters = data.applyAllSemester
      ? ['applyAllSemester']
      : this.editingSemesters;

    this.teachingAssignmentService
      .getAllSubjects(this.selectedClassId, this.currentYear)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (getAllSubjectsResponse: any[]) => {
          console.log({ getAllSubjectsResponse });
          this.listEditingSubjects = getAllSubjectsResponse.map((_subject) => ({
            id: _subject.code,
            name: _subject.name,
          }));
          this.editingSubjectCode = data.subjectCode;
        },
      });
          this.teachingAssignmentService
            .getAllTeachers()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
              next: (getAllTeachersResponse: any[]) => {
                console.log({ getAllTeachersResponse });
                this.listEditingTeachers = getAllTeachersResponse.map(
                  (_teacher) => ({
                    id: _teacher.code,
                    name: _teacher.code + ' - ' + _teacher.fullName,
                  })
                );
                this.editingTeacherCode = data.teacherCode;
                this.changeDetectorRef.detectChanges();
              },
            });
    this.modalRef = this.modalService.show(
        this.selectedTeachingAssignment,
        Object.assign(
            {},
            { class: 'addnew-unit-md modal-dialog-custom' }
        )
    );
  }
  cancel(){
    this.modalRef.hide();
    this.errorMessages['editingSemesters']  = '';
  }
  onAddEditingSemesters(semester) {
    console.log({ current: this.editingSemesters, semester });
    if (semester.id === 'applyAllSemester') {
      this.editingSemesters = ['applyAllSemester'];
    } else {
      this.editingSemesters = this.editingSemesters.filter(
        (_semester) => _semester !== 'applyAllSemester'
      );
    }
  }

  updateTeachingAssignment() {
    const dataUpdate = {
      teacherCode: this.editingTeacherCode,
      subjectCode: this.editingSubjectCode,
      classCode: this.listClass.find(
        (_class) => _class.id === this.selectedClassId
      ).code,
      gradeCode: this.listGradeLevel.find(
        (_grade) => _grade.id === this.selectedGradeLevel
      ).code,
      year: this.currentYear,
      applyAllSemester: this.editingSemesters.includes('applyAllSemester')
        ? 1
        : 0,
    };
    let isValidSelectSemester = false;
    for (let _i = 0; _i < 4; _i++) {
      dataUpdate[`semester${_i + 1}`] =
        this.editingSemesters.includes(`semester${_i + 1}`) ||
        dataUpdate.applyAllSemester
          ? 1
          : 0;

      if (dataUpdate[`semester${_i + 1}`] === 1) {
        isValidSelectSemester = true;
      }
    }

    if (!isValidSelectSemester) {
      this.toastr.error('Phân công giảng dạy không được để trống');
      this.errorMessages['editingSemesters'] =
        'Phân công giảng dạy không được để trống';
      return;
    }

    this.errorMessages['editingSemesters'] = '';

    this.teachingAssignmentService
      .updateTeachingAssignment(dataUpdate)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (responseAPI: any) => {
          console.log('responseAPI', responseAPI);
          if (responseAPI.status === 'OK') {
            this.toastr.success(responseAPI.message);
            this.modalRef.hide();
            this.findTeachingAssignment(this.currentPage);
          } else if (responseAPI.status === 'BAD_REQUEST') {
            console.log(responseAPI.message);
            this.toastr.error(responseAPI.message);
          }
        },
        error: (res) => {
          alert(res);
        },
      });
  }

  // this.manageContactService
  //     .getPackagesInYear(this.selectedSemester, this.currentYear)
  //     .pipe(takeUntil(this.unsubscribe$))
  //     .subscribe({
  //       next: (getPackagesInYearResponse) => {},
  //       error: (res) => {
  //         alert(res);
  //       },
  //     });
}
