import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CreateUpdateTimekeepingComponent} from './create-update-timekeeping/create-update-timekeeping.component';
import {MatDialog} from '@angular/material/dialog';
import {NO_ROW_GRID_TEMPLATE} from '../../../../helpers/constants';
import {TimekeepingService} from '../../../../core/service/service-model/timekeeping.service';
import {CommonServiceService} from '../../../../core/service/utils/common-service.service';
import * as moment from 'moment';
import {ActionTimekeepingComponent} from './action-timekeeping/action-timekeeping.component';
import {SchoolService} from '../../../../core/service/service-model/school.service';
import {SearchSchoolModel} from '../../../../core/service/model/search-school.model';

@Component({
  selector: 'kt-timekeeping',
  templateUrl: './timekeeping.component.html',
  styleUrls: ['./timekeeping.component.scss']
})
export class TimekeepingComponent implements OnInit {

  spinner: boolean
  fromDate: string
  toDate: string
  valueSearch = ''

  rowData = []
  columnDefs = [];
  headerHeight = 56;
  rowHeight = 56;
  rowStyle
  getRowStyle
  noRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', 'KHÔNG CÓ THÔNG TIN');

  totalRecord = 0;
  first = 1;
  last = 10;
  total = 0;
  totalPage = 0;
  pageSize = 10;
  page;
  rangeWithDots: any[];
  searchSchool: SearchSchoolModel = new SearchSchoolModel();

  constructor(
    private matDialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private timekeepingService: TimekeepingService,
    private commonService: CommonServiceService,
    private schoolService: SchoolService,
  ) {
    this.buildColumnDefs()
  }

  ngOnInit(): void {
    this.search(1)
  }

  buildColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'STT',
        headerTooltip: 'STT',
        headerClass: 'fontTitle',
        lockPosition: true,
        suppressMovable: true,
        field: '',
        minWidth: 48,
        maxWidth: 48,
        // headerClass:'center unPadding',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'justify-content': 'center',
        },
        valueGetter: (param) => {
          return (
            param.node.rowIndex + ((this.page - 1) * this.pageSize + 1)
          );
        },
      },
      {
        headerName: 'MÃ NHÂN VIÊN',
        headerTooltip: 'MÃ NHÂN VIÊN',
        headerClass: 'fontTitle',
        field: 'employeeCode',
        suppressMovable: true,
        // headerClass: 'minimum-score',
        minWidth: 124,
        maxWidth: 124,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          display: 'flex',
          'align-items': 'center',
          color: '#3366FF',
          top: '0px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'text-align': 'center',
        },
        tooltipField: 'employeeCode',
      },
      {
        headerName: 'TÊN NHÂN VIÊN',
        headerTooltip: 'TÊN NHÂN VIÊN',
        headerClass: 'fontTitle',
        field: 'employeeName',
        suppressMovable: true,
        maxWidth: 150,
        minWidth: 150,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          display: 'flex',
          'align-items': 'center',
          color: '#101840',
          top: '0px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        tooltipField: 'employeeName',
      },
      {
        headerName: 'GIỚI TÍNH',
        headerTooltip: 'GIỚI TÍNH',
        headerClass: 'fontTitle',
        field: 'employeeSex',
        suppressMovable: true,
        minWidth: 100,
        maxWidth: 100,
        // cellClass: "grid-cell-centered",
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          display: 'flex',
          'align-items': 'center',
          color: '#101840',
          // display: 'flex',
          top: '0px',
          'margin-left': '5px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        tooltipField: 'employeeSex',
      },
      {
        headerName: 'SỐ ĐIỆN THOẠI',
        headerTooltip: 'SỐ ĐIỆN THOẠI',
        headerClass: 'fontTitle',
        field: 'employeePhoneNumber',
        // filter: 'Bắt buộc',
        suppressMovable: true,
        minWidth: 120,
        maxWidth: 120,
        // maxWidth: 200,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          display: 'flex',
          'align-items': 'center',
          color: '#101840',
          top: '0px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        tooltipField: 'employeePhoneNumber',
      },
      {
        headerName: 'EMAIL',
        headerTooltip: 'EMAIL',
        headerClass: 'fontTitle',
        field: 'employeeEmail',
        suppressMovable: true,
        minWidth: 120,
        maxWidth: 120,
        // width: 256,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          display: 'flex',
          'align-items': 'center',
          color: '#101840',
          top: '0px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        tooltipField: 'employeeEmail',
      },
      {
        headerName: 'ĐỊA CHỈ',
        headerTooltip: 'ĐỊA CHỈ',
        headerClass: 'fontTitle',
        field: 'employeeAddress',
        // filter: 'Bắt buộc',
        suppressMovable: true,
        minWidth: 120,
        // maxWidth: 200,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          display: 'flex',
          'align-items': 'center',
          color: '#101840',
          top: '0px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        tooltipField: 'employeeAddress',
      },
      {
        headerName: 'THỜI GIAN CHẤM CÔNG',
        headerTooltip: 'THỜI GIAN CHẤM CÔNG',
        headerClass: 'fontTitle',
        field: 'timeAt',
        cellRenderer: param => {
          return `${moment(param.data.timeAt).format('DD/MM/YYYY h:mm:ss A')}`
        },
        tooltipValueGetter: param => {
          return `${moment(param.data.timeAt).format('DD/MM/YYYY h:mm:ss A')}`
        },
        minWidth: 180,
        maxWidth: 180,
        // filter: 'Bắt buộc',
        // suppressMovable: true,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          display: 'flex',
          'align-items': 'center',
          color: '#101840',
          top: '0px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        }
      },
      {
        headerName: '',
        field: 'undefined',
        pinned: 'right',
        suppressMovable: true,
        displayce: 'nowrap',
        cellClass: 'cell-action',
        cellRendererFramework: ActionTimekeepingComponent,
        minWidth: 48,
        maxWidth: 48,
        // hide: this.checkNotEdit(),
        cellStyle: {
          transform: 'translateX(10px)',
          display: 'flex',
          'align-items': 'center',
          'border-left':'0'
        },
      },
    ];
    this.rowStyle = { background: '#fff' };

    this.getRowStyle = params => {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#F9FAFC' };
      }
    };
  }

  search(page){
    this.spinner = false;
    this.page = page;
    const data = {
      fromDate: new Date(this.fromDate),
      toDate: new Date(this.toDate),
      employeeCode: this.valueSearch.trim(),
    }

    this.timekeepingService.handleSearch(data, this.page - 1, this.pageSize).subscribe(res => {
        this.spinner = true;
        this.rowData = res.content;
        this.totalRecord = res.totalElements;
        this.first = ((page -1 ) * this.pageSize) + 1;
        this.last = this.first + this.rowData.length - 1;
        if (this.totalRecord % this.pageSize === 0) {
          this.totalPage = Math.floor(this.totalRecord / this.pageSize);
          this.rangeWithDots = this.commonService.pagination(
            this.page,
            this.totalPage
          );
        } else {
          this.totalPage = Math.floor(this.totalRecord / this.pageSize) + 1;
          this.rangeWithDots = this.commonService.pagination(
            this.page,
            this.totalPage
          );
        }
        // this.spinner = true;
        this.changeDetectorRef.detectChanges();
      },
      err => {
        this.spinner = true;
        this.rowData = [];
        this.changeDetectorRef.detectChanges();
      })
  }

  openModalCreateUpdate(){
    this.matDialog.open(
      CreateUpdateTimekeepingComponent, {
        maxHeight: window.innerHeight + 'px',
        disableClose: true,
        hasBackdrop: true,
        width: '550px',
        autoFocus: false,
      }
    ).afterClosed().subscribe((res) => {
      console.log(res);
      if(res.event !== 'cancel'){
        this.search(1);
      }
    });
  }

  async export() {
    const data = {
      fromDate: new Date(this.fromDate),
      toDate: new Date(this.toDate),
      employeeCode: this.valueSearch.trim(),
    }

    // this.hide= false;
    console.log('searchDataExport', data);
    await this.timekeepingService.handleExport(data).subscribe((responseMessage) => {
      const file = new Blob([responseMessage], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const fileURL = URL.createObjectURL(file);
      // window.open(fileURL, '_blank');
      const anchor = document.createElement('a');
      // anchor.download = `DS_monhocthuoctruong_${moment()
      anchor.download = 'BangChamCong' + `_${moment().format('DDMMYYYY').toString()}`;
      anchor.href = fileURL;
      anchor.click();
    });
  }

  // ===============================Paging=============
  paging(pageSearch: number): void {
    // tslint:disable-next-line:triple-equals
    if (this.page == pageSearch) {
      return;
    }
    this.page = pageSearch;
    this.search(pageSearch);
    console.log(this.page);
  }

  prev(): void {
    this.page--;
    if (this.page < 1) {
      this.page = 1;
      return;
    }
    this.search(this.page);
  }

  next(): void {
    this.page++;
    if (this.page > this.totalPage) {
      this.page = this.totalPage;
      return;
    }
    this.search(this.page);
  }
}
