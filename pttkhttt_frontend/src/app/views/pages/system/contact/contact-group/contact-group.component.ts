import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ContactGroupService} from '../../../../../core/service/service-model/contact-group.service';
import {GroupTeacherModel} from '../../../../../core/service/model/group-teacher.model';
import {CommonServiceService} from '../../../../../core/service/utils/common-service.service';
import {TABLE_CELL_STYLE} from '../../../../../helpers/constants';
import {GroupActionComponent} from './group-action/group-action.component';
import {ViewDetailGroupComponent} from './view-detail-group/view-detail-group.component';
import {CreateGroupComponent} from './create-group/create-group.component';

import {Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {DeleteClassRoomComponent} from '../../class-room/delete-class-room/delete-class-room.component';
import {MatDialog} from '@angular/material/dialog';
import {TreeviewItem} from 'ngx-treeview';
import {Router} from "@angular/router";

@Component({
  selector: 'kt-contact-group',
  templateUrl: './contact-group.component.html',
  styleUrls: ['./contact-group.component.scss']
})
export class ContactGroupComponent implements OnInit {
  @ViewChild('searchContactGroup') private elementRef: ElementRef;
  contactGroupList: GroupTeacherModel[] = [];
  headerHeight = 56;
  rowHeight = 50;
  gridApi;
  gridColumnApi;
  rowCheckedList: any = [];
  columnDefs = [
    {
      headerName: '',
      field: 'refunded',
      aggFunc: 'sum',
      minWidth: 40,
      maxWidth: 40,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      suppressMovable: true,
    },
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
      headerName: 'MÃ NHÓM',
      field: 'code',
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
      minWidth: 300,
      tooltipField: 'code',
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: 'TÊN NHÓM',
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
        'border-right': 'none'
      },
      minWidth: 580,
      tooltipField: 'name',
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: 'DANH SÁCH GIÁO VIÊN',
      minWidth: 200,
      suppressMovable: true,
      cellRendererFramework: ViewDetailGroupComponent,
      cellStyle: {...TABLE_CELL_STYLE, color: '#3366FF'},
      resizable: true
    },
    {
      headerName: '',
      field: '',
      cellRendererFramework: GroupActionComponent,
      minWidth: 40,
      maxWidth: 40,
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#696F8C',
      },
      suppressMovable: true,
      resizable: true
    },
  ];
  noRowsTemplate = 'Không có bản ghi nào';

  totalContactGroup = 0;
  page = 1;
  pageSize = 10;
  first = 0;
  last = 10;
  total = 0;
  totalPage = 0;
  rangeWithDots = [];
  filterText = '';
  regexSpace = /\s(?=\s)/g;
  search: any = {
    page: 0,
    size: 0,
    globalSearch: null,
    sort: null,
  };
  subscription: Subscription;
  items: any = []
  listTreeViewTeacherRaw = [];

  constructor(private contactGroupService: ContactGroupService,
              private matDialog: MatDialog,
              private toastr: ToastrService,
              private router: Router,
              private commonService: CommonServiceService,
              private changeDetectorRef: ChangeDetectorRef,
              private toast: ToastrService,) {
    if (this.router.getCurrentNavigation()?.extras?.state?.openCreateDialog) this.openAddGroupDialog('add');
  }

  ngOnInit(): void {
    this.searchGroupContact();
    this.getListTeacherTreeView();
    this.listeningIsDelete();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngAfterViewInit(): void {
    this.elementRef.nativeElement.focus();
  }

  searchGroupContact() {
    if (this.filterText != null) {
      this.search.globalSearch = this.filterText.replace(this.regexSpace, '').trim();
    }
    this.search.size = this.pageSize;
    this.search.page = this.page;
    this.search.sort = 'name,code,asc';
    this.contactGroupService.doSearch(this.search).subscribe(
      response => {
        // tslint:disable-next-line:no-non-null-assertion
        this.contactGroupList = response.response.content;

        // Paging
        // tslint:disable-next-line:no-non-null-assertion
        this.totalContactGroup = response.response.totalElements;
        // tslint:disable-next-line:no-non-null-assertion
        this.totalPage = response.response.totalPages;
        this.first = ((this.page - 1) * this.pageSize) + 1;
        this.last = this.first + this.contactGroupList.length - 1;
        if (this.totalContactGroup % this.pageSize === 0) {
          this.totalPage = Math.floor(this.totalContactGroup / this.pageSize);
          this.rangeWithDots = this.commonService.pagination(
            this.page,
            this.totalPage
          );
        } else {
          this.totalPage = Math.floor(this.totalContactGroup / this.pageSize) + 1;
          this.rangeWithDots = this.commonService.pagination(
            this.page,
            this.totalPage
          );
        }
        this.gridApi.setRowData(this.contactGroupList);
        this.changeDetectorRef.detectChanges();
      },
      error => {
        console.log(error);
      }
    );
  }

  searchGroupContactWithKeySearch(): any {
    this.pageSize = 10;
    this.page = 1;
    this.searchGroupContact();
  }

  searchGroupContactWithPage(pages: number) {
    if (this.search.globalSearch != null) {
      this.search.globalSearch = this.search.globalSearch.replace(this.regexSpace, '').trim();
    }
    this.search.size = this.pageSize;
    this.search.page = this.page;
    this.search.sort = 'name,code,asc';
    this.contactGroupService.doSearch(this.search).subscribe(
      response => {
        // tslint:disable-next-line:no-non-null-assertion
        this.contactGroupList = response.response.content;

        // Paging
        // tslint:disable-next-line:no-non-null-assertion
        this.totalContactGroup = response.response.totalElements;
        // tslint:disable-next-line:no-non-null-assertion
        this.first = ((pages - 1) * this.pageSize) + 1;
        this.last = this.first + this.contactGroupList.length - 1;
        if (this.totalContactGroup % this.pageSize === 0) {
          this.totalPage = Math.floor(this.totalContactGroup / this.pageSize);
          this.rangeWithDots = this.commonService.pagination(
            this.page,
            this.totalPage
          );
        } else {
          this.totalPage = Math.floor(this.totalContactGroup / this.pageSize) + 1;
          this.rangeWithDots = this.commonService.pagination(
            this.page,
            this.totalPage
          );
        }
        console.log(this.contactGroupList.length);
        this.gridApi.setRowData(this.contactGroupList);
        this.changeDetectorRef.detectChanges();
      },
      error => {
        console.log(error);
      }
    );
  }

  onRowSelected() {
    const listRowSelected = [];
    this.gridApi.forEachNode(row => {
      if (row.isSelected()) {
        listRowSelected.push(row.data);
      }
    });
    this.rowCheckedList = listRowSelected;
  }

  uncheckAll() {
    this.gridApi.forEachNode(row => {
      if (row.isSelected()) {
        row.setSelected(false);
      }
    });
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
    this.searchGroupContactWithPage(page);
  }

  prev(): void {
    this.page = --this.page
    if (this.page < 1) {
      this.page = 1
      return
    }
    this.searchGroupContactWithPage(this.page);
  }

  next(): void {
    this.page = ++this.page
    if (this.page > this.totalPage) {
      this.page = this.totalPage;
      return;
    }
    this.searchGroupContactWithPage(this.page);
  }

  /* PAGING END */

  listeningIsDelete() {
    this.subscription = this.contactGroupService.delete$.subscribe(val => {
      if (val === true) {
        this.searchGroupContactWithPage(this.page);
      }
    });
  }

  deleteAll() {
    const dataConfirm = {title: 'XÓA NHÓM LIÊN LẠC', message: 'Bạn có chắc chắn muốn xoá nhóm liên lạc đã chọn?'};
    this.matDialog.open(DeleteClassRoomComponent, {
      data: dataConfirm,
      disableClose: true,
      hasBackdrop: true,
      width: '420px'
    }).afterClosed().subscribe(res => {
      if (res.event === 'confirm') {
        const listGroupDelete = this.rowCheckedList;
        // Call API
        this.contactGroupService.deleteContactGroup({listGroupDelete}).subscribe(resAPI => {
          if (resAPI.status === 'OK') {
            this.toast.success(resAPI.message);
          } else if (resAPI.status === 'BAD_REQUEST') {
            this.toast.error(resAPI.message);
          }
          this.contactGroupService.changeIsDelete(true);
          this.rowCheckedList = [];
        });
      }
    });
  }

  openAddGroupDialog(action: string): void {
    const dataCLass: any = {};
    dataCLass.action = action;
    dataCLass.listTreeViewTeacherRaw = this.listTreeViewTeacherRaw;
    dataCLass.items = this.items;
    this.matDialog.open(CreateGroupComponent, {
      data: dataCLass,
      disableClose: true,
      hasBackdrop: true,
      autoFocus: false,
    }).afterClosed().subscribe(res => {
    });
  }

  getListTeacherTreeView(): void {
    this.contactGroupService.getListTeacherTreeView().subscribe(res => {
      console.log(res);
      this.listTreeViewTeacherRaw = res.body.response;
      this.items = res.body.response?.departmentsList.map(item => new TreeviewItem(this.transformToTreeViewItems(item,  true)));
      this.changeDetectorRef.detectChanges();
    })
  }

  transformToTreeViewItems(data: any,  isRoot: boolean): any {
    const children = (data.children ?? data.teacherDTOList)?.map(child => this.transformToTreeViewItems(child, false));
    const text = data.title ?? data.fullName ?? '';
    const value = {
      code: data.type ?? data.code ?? '',
      id: data.id,
      deptId: data.deptId,
      deptCode: data.deptCode,
      deptName: data.deptName,
      isRoot,
      isTeacher: data.fullName && data.code,
      totalTeachersOfUnit: isRoot ? data.totalTeachersOfUnit : null,
      text
    };
    return {...data, text , value, children};
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
