import {ChangeDetectorRef, Component, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TreeviewItem} from 'ngx-treeview';
import {BtnCellRendererComponent} from './btn-cell-renderer.component';
import {GroupTeacherModel} from '../../../../../../core/service/model/group-teacher.model';
import {ToastrService} from 'ngx-toastr';
import {GroupTeacherDetailsModel} from '../../../../../../core/service/model/group-teacher-details.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ContactGroupService} from '../../../../../../core/service/service-model/contact-group.service';
import {CommonServiceService} from '../../../../../../core/service/utils/common-service.service';

@Component({
  selector: 'kt-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {
  @ViewChild('tableAction') tableAction: any;
  groupTeacherDetailsDTO: GroupTeacherDetailsModel;
  groupTeacherAddForm: FormGroup;
  code: string;
  name: string;
  checkCode: boolean;
  checkName: boolean;
  groupTeacherDetailsDTOList: GroupTeacherDetailsModel[];
  gridApi;
  gridColumnApi;
  pattern = '^(\\d|\\w)+$';
  noRowsTemplate = 'Không có bản ghi nào';
  public action: string;
  totalGroupDetails = 0;
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
    parentGroupCode: null
  };
  resultChange = [];
  items: any = []
  config1 = {
    hasAllCheckBox: false,
    hasFilter: true,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 300,
    hasSelectByGroup: false,
    selectByGroupValue: false,
    checkboxEnabled: true,
  }
  listTreeViewTeacherRaw = [];
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
      field: 'teacherCode',
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#3366FF',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden'
      },
      minWidth: 120,
      tooltipField: 'teacherCode',
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: 'TÊN GIÁO VIÊN',
      field: 'fullName',
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
      minWidth: 200,
      tooltipField: 'fullName',
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: 'ĐƠN VỊ',
      field: 'departmentName',
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
      minWidth: 200,
      tooltipField: 'departmentName',
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: '',
      field: '',
      cellRendererFramework: BtnCellRendererComponent,
      cellRendererParams: {
        clicked(field: any) {
          console.log('delete Item', field);
        }
      },
      minWidth: 40,
      suppressMovable: true,
    },
  ];

  constructor(public ref: MatDialogRef<CreateGroupComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              private toast: ToastrService,
              private fb: FormBuilder,
              private contactGroupService: ContactGroupService,
              private commonService: CommonServiceService,
              private changeDetectorRef: ChangeDetectorRef) {
    this.action = data.action;
    this.listTreeViewTeacherRaw = data.listTreeViewTeacherRaw;
    this.items = data.items;
    this.buildForm();
  }

  ngOnInit(): void {
    this.groupTeacherAddForm = this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]]
    });
    if (this.action === 'edit') {
      this.searchGroupContactDetails();
    }
    this.loadForm();
    // this.getListTeacherTreeView();
  }

  // =============== Form edit ========================
  loadForm() {
    if (this.action === 'edit') {
      this.groupTeacherAddForm.get('code').setValue(this.data.code);
      this.groupTeacherAddForm.get('name').setValue(this.data.name);
      this.groupTeacherDetailsDTOList = this.data.groupTeacherDetailsDTOList;
    }
    this.groupTeacherDetailsDTOList = [];
  }

  treeViewValueChange(e: any) {
    console.log(e);
    this.resultChange = e;
  }

  pushTreeDataToTable() {
    if (this.action === 'add') {
      this.groupTeacherDetailsDTOList = [];
    }
    this.first = 1;
    this.last = 10;
    this.page = 1;
    this.pageSize = 10;
    this.resultChange.filter(r => r.isTeacher).map(r => {
      const groupTeacherDetailsDTO: GroupTeacherDetailsModel = {};
      groupTeacherDetailsDTO.teacherId = r.id;
      groupTeacherDetailsDTO.teacherCode = r.code;
      groupTeacherDetailsDTO.fullName = r.text;
      groupTeacherDetailsDTO.departmentName = r.deptName;
      this.groupTeacherDetailsDTOList.push(groupTeacherDetailsDTO);
    })
    // Paging
    // tslint:disable-next-line:no-non-null-assertion
    this.totalGroupDetails = this.groupTeacherDetailsDTOList.length;
    // tslint:disable-next-line:no-non-null-assertion
    this.first = ((this.page - 1) * this.pageSize) + 1;
    this.pagingData();
  }

  onRowSelected(event) {
    const listRowSelected = [];
    this.gridApi.forEachNode(row => {
      if (row.isSelected()) {
        listRowSelected.push(row.data);
      }
    });
  }

  onDelete(api): void {
    console.log(api);
  }

  buildForm() {
    this.groupTeacherAddForm = this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]]
    });
  }

  // ===================== validate code======================
  listenCode(control: string) {
    const keyword = this.groupTeacherAddForm.controls[control].value;
    this.groupTeacherAddForm.controls[control].setValue(keyword.trim());
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

  goToPage(page: number): void {
    this.page = page
    this.searchGroupContactDetailsWithPage(this.page);
  }

  prev(): void {
    this.page--
    if (this.page < 1) {
      this.page = 1
      return
    }
    this.searchGroupContactDetailsWithPage(this.page);
  }

  next(): void {
    this.page++
    if (this.page > this.totalPage) {
      this.page = this.totalPage;
      return;
    }
    this.searchGroupContactDetailsWithPage(this.page);
  }

  private searchGroupContactDetails() {
    if (this.filterText != null) {
      this.search.globalSearch = this.filterText.replace(this.regexSpace, '').trim();
    }
    this.search.page = this.page;
    this.search.sort = 'name,code,asc';
    if (this.action === 'edit') {
      this.search.parentGroupCode = this.data.code;
    } else {
      this.search.parentGroupCode = this.code;
      this.search.size = this.pageSize;
    }
    this.contactGroupService.doSearchDetails(this.search).subscribe(
      response => {
        // tslint:disable-next-line:no-non-null-assertion
        this.groupTeacherDetailsDTOList = response.response.content;

        // Paging
        // tslint:disable-next-line:no-non-null-assertion
        this.totalGroupDetails = response.response.totalElements;
        // tslint:disable-next-line:no-non-null-assertion
        this.totalPage = response.response.totalPages;
        this.first = ((this.page - 1) * this.pageSize) + 1;
        this.last = this.first + this.groupTeacherDetailsDTOList.length - 1;
        if (this.totalGroupDetails % this.pageSize === 0) {
          this.totalPage = Math.floor(this.totalGroupDetails / this.pageSize);
          this.rangeWithDots = this.commonService.pagination(
            this.page,
            this.totalPage
          );
        } else {
          this.totalPage = Math.floor(this.totalGroupDetails / this.pageSize) + 1;
          this.rangeWithDots = this.commonService.pagination(
            this.page,
            this.totalPage
          );
        }
        this.gridApi.setRowData(this.groupTeacherDetailsDTOList);
        setTimeout(() => {
          this.gridApi.sizeColumnsToFit()
        }, 50);
      },
      error => {
        console.log(error);
      }
    );
  }

  searchGroupContactDetailsWithKeySearch() {
    this.pageSize = 10;
    this.page = 1;
    this.searchGroupContactDetails();
  }

  searchGroupContactDetailsWithPage(pages: number) {
    if (this.search.globalSearch != null) {
      this.search.globalSearch = this.search.globalSearch.replace(this.regexSpace, '').trim();
    }
    this.search.size = this.pageSize;
    this.search.page = this.page;
    this.search.sort = 'name,code,asc';
    if (this.action === 'edit') {
      this.search.parentGroupCode = this.data.code;
    } else {
      this.search.parentGroupCode = this.code;
    }
    this.contactGroupService.doSearchDetails(this.search).subscribe(
      response => {
        // tslint:disable-next-line:no-non-null-assertion
        this.groupTeacherDetailsDTOList = response.response.content;

        // Paging
        // tslint:disable-next-line:no-non-null-assertion
        this.totalGroupDetails = response.response.totalElements;
        // tslint:disable-next-line:no-non-null-assertion
        this.first = ((pages - 1) * this.pageSize) + 1;
        this.pagingData();
      },
      error => {
        console.log(error);
      }
    );
  }

  // ============================================ Add new ==================================
  add() {
    const addData: any = {};
    // tslint:disable-next-line:forin
    for (const controlName in this.groupTeacherAddForm.controls) {
      addData[controlName] = this.groupTeacherAddForm.get(controlName).value;
    }
    addData.code = addData.code.trim();
    addData.name = addData.name.trim();
    addData.groupTeacherDetailsDTOList = this.groupTeacherDetailsDTOList;
    if (this.action === 'edit') {
      addData.id = this.data.id;
    }
    console.log(addData)
    // Call API
    this.contactGroupService.add(addData).subscribe(responseAPI => {
      if (responseAPI.status === 'OK') {
        this.ref.close({event: this.action, data: responseAPI});
        this.toast.success(responseAPI.message);
        this.contactGroupService.changeIsDelete(true);
      } else if (responseAPI.status === 'BAD_REQUEST') {
        this.toast.error(responseAPI.message);
      }
    });
  }

  getListTreeView() {
    if (this.filterText != null) {
      this.search.keySearch = this.filterText.replace(this.regexSpace, '').trim();
    }
    this.contactGroupService.getListTreeView(this.search).subscribe(
      response => {
        // tslint:disable-next-line:no-non-null-assertion
        this.items = response.body.response;
      },
      error => {
        console.log(error);
      }
    );
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

  pagingData(): void {
    this.last = this.first + this.groupTeacherDetailsDTOList.length - 1;
    if (this.totalGroupDetails % this.pageSize === 0) {
      this.totalPage = Math.floor(this.totalGroupDetails / this.pageSize);
      this.rangeWithDots = this.commonService.pagination(
        this.page,
        this.totalPage
      );
    } else {
      this.totalPage = Math.floor(this.totalGroupDetails / this.pageSize) + 1;
      this.rangeWithDots = this.commonService.pagination(
        this.page,
        this.totalPage
      );
    }
    console.log(this.groupTeacherDetailsDTOList.length);
    this.gridApi.setRowData(this.groupTeacherDetailsDTOList);
    this.changeDetectorRef.detectChanges();
  }

}
