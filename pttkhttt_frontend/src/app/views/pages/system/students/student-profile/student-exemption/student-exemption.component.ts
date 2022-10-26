import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { StudentsService } from 'src/app/core/service/service-model/students.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TABLE_CELL_STYLE, NO_ROW_GRID_TEMPLATE } from 'src/app/helpers/constants';
import { ClassroomService } from 'src/app/core/service/service-model/classroom.service';
import { TranslateService } from '@ngx-translate/core'; 
@Component({
  selector: 'kt-student-exemption',
  templateUrl: './student-exemption.component.html',
  styleUrls: ['./student-exemption.component.scss']
})
export class StudentExemptionComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();

  columnExemption = [];
  rowData = [];
  classes = [];

  gridApi;
  gridColumnApi;
  headerHeight = 56;
  rowHeight = 50;
  overlayNoRowsTemplate
  noRow: string

  @Input() studentCode: any;

  constructor(
    private classRoomService: ClassroomService,
    private studentService: StudentsService,
    private toaStr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef,
    private translate : TranslateService
  ) {
    TABLE_CELL_STYLE.display = 'block'
    this.columnExemption = [
      {
        headerName: this.translate.instant('STUDENT.INFO.NO'),
        field: 'index',
        valueGetter: 'node.rowIndex + 1',
        minWidth: 60,
        maxWidth: 60,
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#101840' }
      },
      {
        headerName: this.translate.instant('STUDENT.EXEMPTION.SUBJECT_NAME'),
        field: 'subjectName',
        minWidth: 200,
        maxWidth: 200,
        tooltipField: 'subjectName',
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#3366FF' }
      },
      {
        headerName: this.translate.instant('STUDENT.SEMESTER'),
        field: 'semesterName',
        minWidth: 180,
        maxWidth: 180,
        tooltipField: 'semesterName',
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#101840' }
      },
      {
        headerName: this.translate.instant('STUDENT.EXEMPTION.FORMALITY'),
        field: 'typeSemester',
        minWidth: 250,
        maxWidth: 250,
        tooltipField: 'typeSemester',
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#101840' }
      },
      {
        headerName: this.translate.instant('STUDENT.EXEMPTION.REASON'),
        field: 'exemptionObject',
        tooltipField: 'exemptionObject',
        cellStyle: { ...TABLE_CELL_STYLE, 'color': '#101840' }
      },
    ];
    this.overlayNoRowsTemplate = NO_ROW_GRID_TEMPLATE
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  gridSizeChanged(params): void {
    params.api.sizeColumnsToFit();
  }

  ngOnInit() {
    this.loadClassRoomByStudentCode();
  }

  loadClassRoomByStudentCode() {
    
    this.studentService.getAllClassRoomByStudentCode(this.studentCode).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: res => {
        if (res) {
          this.classes = res
          this.loadExemption(this.classes[0].years);
          this.changeDetectorRef.detectChanges();
        }
      },
      error: res => {
        console.log(res)
      }
    })
  }

  currentYear
  loadExemption(year) {
    this.currentYear = year
    this.studentService.getAllExemption(this.studentCode, year).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: res => {
        if (res) {
          this.rowData = res;
          this.changeDetectorRef.detectChanges();
        }
      },
      error: res => {
        console.log(res)
      }
    })
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}