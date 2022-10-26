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

@Component({
  selector: 'kt-history-contact-package',
  templateUrl: './history-contact-package.component.html',
  styleUrls: ['./history-contact-package.component.scss'],
})
export class HistoryContactPackageComponent
  implements OnInit, ICellRendererAngularComp
{
  modalRef: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private commonService: CommonServiceService,
    private manageContactService: ManageContactService,
    private toastr: ToastrService
  ) {}

  ManageContactComponent;

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
      headerName: 'Ngày thực hiện',
      headerTooltip: 'Ngày thực hiện',
      field: 'createDate',
      tooltipField: 'createDate',
      minWidth: 120,
      cellStyle: {
        ...this.cellStyle,
      },
    },
    {
      headerName: 'Thao tác',
      headerTooltip: 'Thao tác',
      field: 'action',
      tooltipField: 'action',
      minWidth: 130,
      cellStyle: {
        ...this.cellStyle,
      },
    },
    {
      headerName: 'Gói cước',
      headerTooltip: 'Gói cước',
      field: 'packageName',
      tooltipField: 'packageName',
      minWidth: 100,
      cellStyle: {
        ...this.cellStyle,
      },
    },
    {
      headerName: 'Người thực hiện',
      headerTooltip: 'Người thực hiện',
      field: 'creator',
      tooltipField: 'creator',
      minWidth: 120,
      cellStyle: {
        ...this.cellStyle,
      },
    },
    {
      headerName: 'Ngày kích hoạt',
      headerTooltip: 'Ngày kích hoạt',
      field: 'activeDate',
      tooltipField: 'activeDate',
      minWidth: 120,
      cellStyle: {
        ...this.cellStyle,
      },
    },
  ];
  defaultColDef = {
    lockPosition: true,
    suppressMenu: true,
  };

  noRowsTemplate = 'Không có bản ghi nào';
  rowData = [];

  perPage = 3;
  currentPage = 1;
  first = 1;
  last = 3;
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
  showHistory = true;
  agInit(params): void {
    this.cellValue = params.data;
    if (this.cellValue.status === 0) {
      this.showHistory = false;
    }
  }

  // gets called whenever the cell refreshes
  refresh(params) {
    // set value into cell again
    return true;
  }

  contacts;
  creatorMapping = {
    0: 'Phụ huynh học sinh',
    1: 'Nhà trường',
  };
  actionsMapping = {
    0: 'Huỷ dịch vụ',
    1: 'Đăng ký gói cước',
  };
  openHistoryModal(template: TemplateRef<any>) {
    const dataHistory = {
      studentId: this.cellValue.id,
      shoolYear: this.cellValue.currentYear,
    };

    this.manageContactService
      .getHistoryPackageByStudent(dataHistory)
      .subscribe({
        next: (historyResponse) => {
          console.log('historyResponse', historyResponse);

          const contacts = historyResponse.data;
          const totalElements = historyResponse.data.length;

          if (totalElements > 0) {
            this.total = totalElements;
            this.totalPage = Math.ceil(this.total / this.perPage);
            this.rangeWithDots = this.commonService.pagination(
              this.currentPage,
              this.totalPage
            );
            this.first = this.perPage * (this.currentPage - 1) + 1;

            this.contacts = contacts.map((contact, _index) => {
              const singleRowData = {
                index: this.first + _index,
                createDate: moment(contact.create_date).format('DD/MM/YYYY'),
                action: this.actionsMapping[contact.action],
                packageName: contact.dataPackageName,
                creator: this.creatorMapping[+contact.creator],
                activeDate: moment(contact.activeDate).format('DD/MM/YYYY'),
              };

              return singleRowData;
            });

            this.rowData = this.contacts.slice(this.first - 1, this.last);
            this.last =
                this.rowData.length + this.perPage * (this.currentPage - 1);
            if(this.last - this.first >2){
              this.last = this.first+2;
            }

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

          console.log(`this.rowData`, this.rowData);
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
      this.rangeWithDots = this.commonService.pagination(
        this.currentPage,
        this.totalPage
      );
      this.first = this.perPage * (this.currentPage - 1) + 1;
      this.last = this.first + this.perPage - 1;
      if(this.last > this.total){
        this.last = this.total;
      }
      this.rowData = this.contacts.slice(this.first - 1, this.last);
      console.log(`this.contacts`, this.contacts);
      console.log(`this.rowData`, this.rowData);
      console.log(`this.first`, this.first);
      console.log(`this.last`, this.last);
      console.log(`this.perPage`, this.perPage);

      // this.gridApi.setRowData(this.rowData);
      // this.gridApi.sizeColumnsToFit();
    }
  }
}
