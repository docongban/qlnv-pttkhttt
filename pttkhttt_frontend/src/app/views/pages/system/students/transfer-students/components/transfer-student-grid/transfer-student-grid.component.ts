import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AgGridEvent, ICellRendererParams} from 'ag-grid-community';
import {TransferStudentActionComponent} from '../transfer-student-action/transfer-student-action.component';
import {TransferStudent} from '../../shared/models/transfer-student';
import {Page} from '../../shared/models/page';
import {TransferStudentStatusComponent} from '../transfer-student-status/transfer-student-status.component';
import {CommonServiceService} from '../../../../../../../core/service/utils/common-service.service';
import {SchoolYearPairs} from '../../shared/models/school-year-pairs';

@Component({
  selector: 'kt-transfer-student-grid',
  templateUrl: './transfer-student-grid.component.html',
  styleUrls: ['./transfer-student-grid.component.scss']
})
export class TransferStudentGridComponent {
  @Input() schoolYearPairs: SchoolYearPairs;
  @Input() transferStudentPage: Page<TransferStudent>;

  @Output() editClicked = new EventEmitter<any>();
  @Output() transferStudentsSelected = new EventEmitter<TransferStudent[]>();
  @Output() pageChanged = new EventEmitter();

  get items() {
    return this.transferStudentPage.content;
  }

  get page() {
    return this.transferStudentPage.number + 1;
  }

  get size() {
    return this.transferStudentPage.size;
  }

  get totalPages() {
    return this.transferStudentPage.totalPages;
  }

  get totalElements() {
    return this.transferStudentPage.totalElements;
  }

  get from() {
    return (this.page - 1) * this.size + 1;
  }

  get to() {
    return this.page < this.totalPages ? (this.page - 1) * this.size + this.size : this.totalElements;
  }

  get rangeWithDots() {
    return this.commonService.pagination(this.page, this.totalPages);
  }

  translatedText = {
    no: this.translateService.instant('TRANSFER_STUDENTS.NO'),
    studentCode: this.translateService.instant('TRANSFER_STUDENTS.STUDENT_CODE'),
    studentName: this.translateService.instant('TRANSFER_STUDENTS.STUDENT_NAME'),
    className: this.translateService.instant('TRANSFER_STUDENTS.CLASS_NAME'),
    assess: this.translateService.instant('TRANSFER_STUDENTS.ASSESS'),
    status: this.translateService.instant('TRANSFER_STUDENTS.STATUS'),
    promotedClass: this.translateService.instant('TRANSFER_STUDENTS.BE_PROMOTED'),
    repeatedClass: this.translateService.instant('TRANSFER_STUDENTS.REPEAT_CLASS'),
    schoolYear: this.translateService.instant('TRANSFER_STUDENTS.SCHOOL_YEAR'),
  }

  defaultCellStyles = {
    display: 'flex',
    'align-items': 'center',
    'font-weight': '500',
    'font-size': '12px',
    color: '#101840'
  }

  columnDefs = [
    {
      minWidth: 52,
      maxWidth: 52,
      headerClass: 'custom-merge-header1',
      suppressMovable: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
    },
    {
      headerName: 'STT',
      headerClass: 'custom-merge-header1',
      field: 'no',
      tooltipField: 'no',
      minWidth: 48,
      maxWidth: 48,
      suppressMovable: true,
      cellStyle: {
        ...this.defaultCellStyles
      }
    },
    {
      headerValueGetter: () => `${this.translatedText.schoolYear} (${this.schoolYearPairs.current})`,
      headerClass: 'school-year-1',
      suppressMovable: true,
      suppressSizeToFit: true,
      children: [
        {
          headerName: this.translatedText.studentCode,
          headerTooltip: this.translatedText.studentCode,
          field: 'details.studentCode',
          tooltipField: 'details.studentCode',
          suppressMovable: true,
          cellStyle: {
            ...this.defaultCellStyles,
            color: '#3366FF',
          },
          cellRenderer: (params) => this.limitStringCellValue(params),
        },
        {
          headerName: this.translatedText.studentName,
          headerTooltip: this.translatedText.studentName,
          field: 'details.studentName',
          tooltipField: 'details.studentName',
          suppressMovable: true,
          cellStyle: {
            ...this.defaultCellStyles
          },
          cellRenderer: (params) => this.limitStringCellValue(params),
        },
        {
          headerName: this.translatedText.className,
          headerTooltip: this.translatedText.className,
          field: 'classCode',
          tooltipField: 'className',
          minWidth: 100,
          maxWidth: 100,
          suppressMovable: true,
          cellStyle: {
            ...this.defaultCellStyles
          },
          cellRenderer: (params) => this.limitStringCellValue(params),
        },
        {
          headerName: this.translatedText.assess,
          headerTooltip: this.translatedText.assess,
          field: 'competitionTitle',
          tooltipField: 'competitionTitle',
          suppressMovable: true,
          cellStyle: {
            ...this.defaultCellStyles
          },
          cellRenderer: (params) => this.limitStringCellValue(params),
        },
        {
          headerName: this.translatedText.status,
          headerTooltip: this.translatedText.status,
          minWidth: 180,
          maxWidth: 180,
          field: 'details.status',
          tooltipField: 'details.status',
          suppressMovable: true,
          cellStyle: {
            ...this.defaultCellStyles
          },
          cellRendererFramework: TransferStudentStatusComponent,
        },
      ],
    },
    {
      headerValueGetter: () => `${this.translatedText.schoolYear} (${this.schoolYearPairs.next})`,
      headerClass: 'school-year-2',
      suppressMovable: true,
      children: [
        {
          headerName: this.translatedText.promotedClass,
          headerTooltip: this.translatedText.promotedClass,
          field: 'details.newClassCode',
          tooltipField: 'details.newClassCode',
          suppressMovable: true,
          minWidth: 130,
          maxWidth: 130,
          cellStyle: {
            ...this.defaultCellStyles
          },
          cellRenderer: (params) => {
            if (params.data.details.status === 1) {
              return params.value;
            }

            return '-';
          }
        },
        {
          headerName: this.translatedText.repeatedClass,
          headerTooltip: this.translatedText.repeatedClass,
          field: 'details.newClassCode',
          tooltipField: 'details.newClassCode',
          suppressMovable: true,
          minWidth: 120,
          maxWidth: 120,
          cellStyle: {
            ...this.defaultCellStyles
          },
          cellRenderer: (params: ICellRendererParams) => {
            if (params.data.details.status === 0) {
              return params.value;
            }

            return '-';
          },
        },
        {
          minWidth: 48,
          maxWidth: 48,
          suppressMovable: true,
          cellRendererFramework: TransferStudentActionComponent,
          cellStyle: {
            ...this.defaultCellStyles,
            padding: 0,
            'justify-content': 'center'
          },
          onEditClicked: (data) => this.editClicked.emit(data)
        }
      ]
    },
  ];

  noRowsTemplate = 'Không có bản ghi nào';

  constructor(private translateService: TranslateService,
              private commonService: CommonServiceService) {
  }

  limitStringCellValue(params) {
    const element = document.createElement('span');
    element.className = 'one-line-ellipsis w-100';
    element.appendChild(document.createTextNode(params.value));
    return element;
  };

  onGridReady(event: AgGridEvent) {
    const api = event.api;
    api.setGroupHeaderHeight(24);
    api.sizeColumnsToFit();
  }

  gridSizeChanged(event: AgGridEvent) {
    event.api.sizeColumnsToFit();
  }

  onSelectionChanged(event: AgGridEvent) {
    const selectedStudents = event.api.getSelectedNodes().map(node => node.data);
    this.transferStudentsSelected.emit(selectedStudents);
  }

  onPageChanged(value: number) {
    this.pageChanged.emit(value - 1);
  }
}
