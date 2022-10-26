import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import {
  BsModalRef,
  BsModalService,
  ModalDirective,
} from 'ngx-bootstrap/modal';
import { ManageContactService } from 'src/app/core/service/service-model/manage-contact.service';
import { CommonServiceService } from 'src/app/core/service/utils/common-service.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import {EvaluateConductService} from "../../../../../../core/service/service-model/evaluate-conduct.service";

@Component({
  selector: 'kt-evaluation-of-subject-teacher',
  templateUrl: './evaluation-of-subject-teachers.component.html',
  styleUrls: ['./evaluation-of-subject-teachers.component.scss'],
})
export class EvaluationOfSubjectTeachersComponent
  implements OnInit, ICellRendererAngularComp
{
  modalRef: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private commonService: CommonServiceService,
    private manageContactService: ManageContactService,
    private toastr: ToastrService,
    private evaluateConductService: EvaluateConductService,
  ) {}


  cellValue;
  ROW_HEIGHT = 50;
  HEADER_HEIGHT = 56;
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

  columnDefs = [
    {
      headerName: 'STT',
      headerTooltip: 'STT',
      headerClass: 'sy-header-center',
      valueGetter: param => {
        return param.node.rowIndex + (((this.currentPage - 1) * this.perPage) + 1)
      },
      // field: 'index',
      // tooltipField: 'index',
      minWidth: 40,
      maxWidth: 48,
      cellStyle: {
        ...this.cellStyle,
        //'justify-content': 'center',
        'text-align':'center',
        'left':'9px !important'
      },
    },
    {
      headerName: 'Môn học',
      headerTooltip: 'Môn học',
      // headerClass: 'sy-header-center',
      field: 'subjectName',
      tooltipField: 'subjectName',
      minWidth: 140,
      maxWidth:150,
      cellStyle: {
        ...this.cellStyle,
      },
    },
    {
      headerName: 'Học kỳ',
      headerTooltip: 'Học kỳ',
      // headerClass: 'sy-header-center',
      field: 'semester',
      tooltipField: 'semester',
      minWidth: 90,
      maxWidth:100,
      cellStyle: {
        ...this.cellStyle,
        'text-align':'center',
        'left':'216px !important'
      },
    },
    {
      headerName: 'Giáo viên giảng dạy',
      headerTooltip: 'Giáo viên giảng dạy',
      // headerClass: 'sy-header-center',
      field: 'teacherName',
      tooltipField: 'teacherName',
      minWidth: 140,
      maxWidth:150,
      cellStyle: {
        ...this.cellStyle,
      },
    },
    {
      headerName: 'Đánh giá của giáo viên',
      headerTooltip: 'Đánh giá của giáo viên',
      // headerClass: 'sy-header-center',
      field: 'evaluateContent',
      cellRenderer: params =>{
          return `${(this.getLength(params.value) < 40)?params.value:(params.value.substring(0,40)+"...")}`
      },
      tooltipField: 'evaluateContent',
      minWidth: 260,
      maxWidth:270,
      cellStyle: {
        ...this.cellStyle,
        //'text-align': 'center',
      },
    },
  ];
  defaultColDef = {
    lockPosition: true,
    suppressMenu: true,
  };

  noRowsTemplate = 'Không có bản ghi nào';
  rowData = [];

  perPage = 10;
  currentPage = 1;
  first = 1;
  last = 10;
  total = 0;
  totalPage = 0;
  rangeWithDots = [];

  gridApi;
  gridColumnApi;
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  ngOnInit() {}

  // gets called once before the renderer is used
  // showEvaluation = true;
  agInit(params): void {
    // console.log('param teacher',params);
    this.cellValue = params.data;
    // if (this.cellValue.evaluate.toString().trim() === '') {
    //   this.showEvaluation = false;
    // }
  }

  // gets called whenever the cell refreshes
  refresh(params) {
    // set value into cell again
    return true;
  }
  // get length of unicode string
  getLength(str){
    return [...str].length;
  }

  loadData(page: number){
    this.currentPage = page;
    const dataGetEvaluate = {
      years:this.cellValue.currentYear,
      semester: this.cellValue.semester,
      classCode: this.cellValue.classCode,
      studentCode: this.cellValue.studentCode,
      pageSize:this.perPage,
      currentPage:this.currentPage,
    };
    this.evaluateConductService
      .getTeacherEvaluate(dataGetEvaluate)
      .subscribe({
        next: (teacherEvaluateResponse) => {
          console.log('teacherEvaluateResponse', teacherEvaluateResponse);

          this.rowData = teacherEvaluateResponse.lstData;
          // this.rowData.forEach((item) =>{
          //   if(item.evaluateContent.length == 50){
          //       // Add class text overflow
          //   }
          // })
          const totalElements = teacherEvaluateResponse.totalRecord;

          if (totalElements > 0) {
            this.total = totalElements;
            this.totalPage = Math.ceil(this.total / this.perPage);
            this.rangeWithDots = this.commonService.pagination(
              this.currentPage,
              this.totalPage
            );
            this.first = this.perPage * (this.currentPage - 1) + 1;

            this.last =
              this.rowData.length + this.perPage * (this.currentPage - 1);
            if (this.last > this.total) {
              this.last = this.total;
            }
          } else {
            this.total = 0;
            this.rangeWithDots = [];
            this.first = 0;
            this.last = 0;
            this.rowData = [];
          }
        }
      });
  }

  openEvaluationModal(template: TemplateRef<any>) {
    const dataGetEvaluate = {
      years:this.cellValue.currentYear,
      semester: this.cellValue.semester,
      classCode: this.cellValue.classCode,
      studentCode: this.cellValue.studentCode,
      pageSize:this.perPage,
      currentPage:this.currentPage,
    };

    console.log('dataGetEvaluate',dataGetEvaluate);

    this.evaluateConductService
      .getTeacherEvaluate(dataGetEvaluate)
      .subscribe({
        next: (teacherEvaluateResponse) => {
          console.log('teacherEvaluateResponse', teacherEvaluateResponse);

          this.rowData = teacherEvaluateResponse.lstData;
          const totalElements = teacherEvaluateResponse.totalRecord;

          if (totalElements > 0) {
            this.total = totalElements;
            this.totalPage = Math.ceil(this.total / this.perPage);
            this.rangeWithDots = this.commonService.pagination(
              this.currentPage,
              this.totalPage
            );
            this.first = this.perPage * (this.currentPage - 1) + 1;

            this.last =
              this.rowData.length + this.perPage * (this.currentPage - 1);
            if(this.last > this.total){
              this.last = this.total;
            }
          } else {
            this.total = 0;
            this.rangeWithDots = [];
            this.first = 0;
            this.last = 0;
            this.rowData = [];
          }

          // console.log(`this.rowData`, this.rowData);
          // this.gridApi.setRowData(this.rowData);
          // this.gridApi.sizeColumnsToFit();

          this.modalRef = this.modalService.show(
            template,
            Object.assign(
              {},
              {
                class:
                  'addnew-unit-md modal-dialog-custom history-package-contact',
              }
            )
          );
        },
        error: (res) => {
          alert(res);
        },
      });
  }

  goToPage(page: number) {
    if (page !== this.currentPage && page >= 1 && page <= this.totalPage) {
      this.currentPage = page;
      this.loadData(page);
    }
  }

  // goToPage(page: number) {
  //   if (page !== this.currentPage && page >= 1 && page <= this.totalPage) {
  //     this.currentPage = page;
  //     this.rangeWithDots = this.commonService.pagination(
  //       this.currentPage,
  //       this.totalPage
  //     );
  //     this.first = this.perPage * (this.currentPage - 1) + 1;
  //     this.last = this.first + this.perPage - 1;
  //     if(this.last > this.total){
  //       this.last = this.total;
  //     }
  //     // this.rowData = this.contacts.slice(this.first - 1, this.last);
  //     // console.log(`this.contacts`, this.contacts);
  //     // console.log(`this.rowData`, this.rowData);
  //     // console.log(`this.first`, this.first);
  //     // console.log(`this.last`, this.last);
  //     // console.log(`this.perPage`, this.perPage);
  //
  //     // this.gridApi.setRowData(this.rowData);
  //     // this.gridApi.sizeColumnsToFit();
  //   }
  // }
}
