import {ChangeDetectorRef, Component, Inject, OnChanges, OnInit, Optional, SimpleChanges} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {BtnCellRendererComponent} from "../../contact-group/create-group/btn-cell-renderer.component";
import {CommonServiceService} from "../../../../../../core/service/utils/common-service.service";

@Component({
  selector: 'kt-list-teacher-send-mail',
  templateUrl: './list-teacher-send-mail.component.html',
  styleUrls: ['./list-teacher-send-mail.component.scss']
})
export class ListTeacherSendMailComponent implements OnInit {
  gridApi: any;
  gridColumnApi: any;
  rows = [];
  page = 1;
  pageSize = 10;
  removeItems = [];
  columnDefs = [
    {
      headerName: 'STT',
      field: 'make',
      valueGetter: param => {
        return param.node.rowIndex + (((this.page - 1) * this.pageSize) + 1)
      },
      minWidth: 50,
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        justify: 'space-between',
        color: '#101840',
        display: 'flex',
      },
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: 'MÃ GIÁO VIÊN',
      field: 'isTeacher',
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden'
      },
      minWidth: 120,
      tooltipField: 'isTeacher',
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: 'TÊN GIÁO VIÊN',
      field: 'text',
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
        'border-right': 'none'
      },
      minWidth: 300,
      tooltipField: 'text',
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: 'NHÓM/ĐƠN VỊ THUỘC',
      field: 'groupName',
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
        'border-right': 'none'
      },
      minWidth: 300,
      tooltipField: 'groupName',
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: '',
      field: '',
      cellRendererFramework: BtnCellRendererComponent,
      cellRendererParams: {
        clicked: this.removeItem.bind(this)
      },
      minWidth: 40,
      maxWidth: 80,
      suppressMovable: true,
    },
  ];
  first = 1;
  last = 10;
  totalPage = 0;
  rangeWithDots: any = [];

  constructor(public ref: MatDialogRef<ListTeacherSendMailComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any = [],
              private toast: ToastrService,
              private matDialog: MatDialog,
              private changeDetectorRef: ChangeDetectorRef,
              private commonService: CommonServiceService
  ) { }

  ngOnInit(): void {
    this.rows = JSON.parse(JSON.stringify(this.data));
    this.first = ((this.page - 1) * this.pageSize) + 1;
    this.last = this.first + this.rows?.length - 1;
    this.totalPage = Math.ceil(this.rows?.length / this.pageSize);
    this.rangeWithDots = this.commonService.pagination(
      this.page,
      this.totalPage
    );
  }
  onGridReady(params) {
    console.log(params);
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    setTimeout(() => {
      this.gridApi.sizeColumnsToFit()
    }, 50);
  }
  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
  }
  /* PAGING START */
  goToPage(page: number): void {
    this.page = page
  }

  prev(): void {
    this.page = --this.page
    if (this.page < 1) {
      this.page = 1
      return
    }
  }

  next(): void {
    this.page = ++this.page
    if (this.page > this.totalPage) {
      this.page = this.totalPage;
      return;
    }
  }

  /* PAGING END */
  removeItem(api: any): void {
    this.removeItems.push(api.data.isTeacher);
    this.gridApi.updateRowData({ remove: [api.data] });  }
}
