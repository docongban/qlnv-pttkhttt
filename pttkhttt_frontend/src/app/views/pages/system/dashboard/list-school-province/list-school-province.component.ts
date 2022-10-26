import { ChangeDetectorRef, Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NO_ROW_GRID_TEMPLATE } from 'src/app/helpers/constants';
import {CommonServiceService} from "../../../../../core/service/utils/common-service.service";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'kt-list-school-province',
  templateUrl: './list-school-province.component.html',
  styleUrls: ['./list-school-province.component.scss']
})
export class ListSchoolProvinceComponent implements OnInit {

  gridApi: any;
  gridColumnApi: any;
  rows = [];
  rowsToDisplay = [];
  page = 1;
  pageSize = 10;
  removeItems = [];
  noRowTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}',this.translate.instant('DASHBOARD.POPUP.NO_INFOR'));
  first = 1;
  last = 10;
  totalPage = 0;
  rangeWithDots: any = [];
  provinceName;
  columnDefs = [
    {
      headerName: this.trans('COMMON.NO'),
      field: 'make',
      valueGetter: param => {
        return param.node.rowIndex + (((this.page - 1) * this.pageSize) + 1)
      },
      minWidth: 48,
      maxWidth: 48,
      headerClass: 'stt-header',
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        'justify-content': 'center',
        color: '#101840',
        display: 'flex',
      },
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: this.trans('DASHBOARD.POPUP.GRID.SCHOOL_CODE'),
      field: 'code',
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#3366FF',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
      },
      minWidth: 120,
      tooltipField: 'code',
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: this.trans('DASHBOARD.POPUP.GRID.SCHOOL_NAME'),
      field: 'name',
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
        'border-right': 'none',
      },
      minWidth: 200,
      tooltipField: 'name',
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: this.trans('DASHBOARD.POPUP.GRID.LEVEL_SCHOOL'),
      field: 'levelSchoolName',
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
        'border-right': 'none',
      },
      minWidth: 100,
      tooltipField: 'levelSchoolName',
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: this.trans('DASHBOARD.POPUP.GRID.DISTRICT'),
      field: 'address',
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
        'border-right': 'none',
      },
      minWidth: 244,
      tooltipField: 'address',
      suppressMovable: true,
      resizable: true
    }
  ];

  constructor(
    public ref: MatDialogRef<ListSchoolProvinceComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              private matDialog: MatDialog,
              private changeDetectorRef: ChangeDetectorRef,
              private commonService : CommonServiceService,
              private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.rows = JSON.parse(JSON.stringify(this.data.display));
    this.provinceName = this.data.provinceName;
    console.log(this.data);
    this.setRowToDisplay();
  }

  setRowToDisplay() {
    this.rowsToDisplay = this.rows.slice((this.page - 1) * this.pageSize,this.page * this.pageSize);
    if (this.rowsToDisplay.length === 0 && this.page > 1) {
      this.page--;
      this.setRowToDisplay();
    } else {
      this.first = ((this.page - 1) * this.pageSize) + 1;
      this.last = this.first + this.rowsToDisplay?.length - 1;
      this.totalPage = Math.ceil(this.rows?.length / this.pageSize);
      this.rangeWithDots = this.commonService.pagination(
        this.page,
        this.totalPage
      );
      this.changeDetectorRef.detectChanges();
    }
  }

  trans(key): string {
    return this.translate.instant(key)
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
    setTimeout( () => {
      params.api.sizeColumnsToFit()
    }, 100)
  }

  goToPage(page: number): void {
    this.page = page;
    this.setRowToDisplay()
  }

  prev(): void {
    this.page = --this.page;
    if (this.page < 1) {
      this.page = 1
    }
    this.setRowToDisplay()
  }

  next(): void {
    this.page = ++this.page
    if (this.page > this.totalPage) {
      this.page = this.totalPage;
    }
    this.setRowToDisplay()
  }

}
