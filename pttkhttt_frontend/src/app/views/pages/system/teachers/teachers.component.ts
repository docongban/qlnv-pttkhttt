import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'
import { ToastrService } from 'ngx-toastr';
import { Teacher } from 'src/app/core/service/model/teacher.model';
import { TeacherService } from 'src/app/core/service/service-model/teacher.service';
import { ActionTeacherComponent } from './action-teacher/action-teacher.component';
import { TeacherProfileComponent } from './teacher-profile/teacher-profile.component';
import {PAGE_SIZE, ROLES_STUDENT_MANAGEMENT, ROLES_TEACHER_MANAGEMENT, TEACHER} from '../../../../helpers/constants';
import { calculateFistLastPageTable, next, pagination, prev } from 'src/app/helpers/utils';
import {environment} from '../../../../../environments/environment';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LeaveJobService} from "../../../../core/service/service-model/leave-job.service";
import {DepartmentService} from '../../../../core/service/service-model/unit.service';
@Component({
  selector: 'kt-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss']
})
export class TeachersComponent implements OnInit {

  @ViewChild('newUnit') public newUnit: ModalDirective;
  @ViewChild('importUnit') public importUnit: ModalDirective;
  modalRef: BsModalRef;
  hide = true;
  columnDefs;
  rowData;
  gridApi;
  gridColumnApi;
  headerHeight = 56;
  rowHeight = 50;
  defaultColDef;
  selectDemo;
  teacher = new Teacher();
  resultImport;
  listDemo = [
    {
      id: 1,
      name: 'Demo'
    }
  ];
  listDeptParent = [];
  listDeptChild = [];
  listPostion = [];
  listStatus = [
    {
      id: 0,
      name: 'Đang làm việc'
    },
    {
      id: 1,
      name: 'Đã nghỉ việc'
    },
    {
      id: 2,
      name: 'Đã nghỉ hưu'
    },
    {
      id: 3,
      name: 'Tạm nghỉ'
    }
  ];
  searchObj = {
    deptIdParent: null,
    deptId: null,
    position: null,
    nameCodeSearch: '',
    status: null,
    page: 0,
    pageSize: PAGE_SIZE,
    role: ''
  }

  currentPage = 1;
  total = 0;
  first = 0;
  last = 0;
  totalPage;
  rangeWithDots: number[];
  fileName;
  fileSize;
  isShowImport = false;
  typeUnit;
  typeImportInsert;
  typeImportUpdate;
  selectedFiles;
  formDatas;
  afuConfig = {
    multiple: false,
    formatsAllowed: '.jpg,.png,.pdf,.docx, .txt,.gif,.jpeg',
    maxSize: '5',
    uploadAPI: {
      url: 'https://example-file-upload-api',
      method: 'POST',
      params: {
        page: '1'
      },
      responseType: 'blob',
    },
    theme: 'dragNDrop',
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    fileNameIndex: true,
    replaceTexts: {
      selectFileBtn: 'Tải file',
      resetBtn: 'Reset',
      uploadBtn: 'Upload',
      dragNDropBox: 'File có định dạng xlsx, xls, có dung lượng nhỏ hơn 5Mb',
      attachPinBtn: 'Attach Files...',
      afterUploadMsg_success: 'Successfully Uploaded !',
      afterUploadMsg_error: 'Upload Failed !',
      sizeLimit: 'Size Limit'
    }
  };
  currentRoles = [];
  isRole: boolean;
  // Role Admin, HT
  ADMIN = `${environment.ROLE.ADMIN}`;
  HT = `${environment.ROLE.HT}`;

  formImport: FormGroup;
  firstLoad;
  listStatusTeacher = TEACHER.STATUS;
  noRowsTemplate = 'Không có bản ghi nào';
  listDepartment: [];
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private teacherService: TeacherService,
    private changeDetectorRef: ChangeDetectorRef,
    private toaStr: ToastrService,
    private leaveJobService: LeaveJobService,
    private departmentService: DepartmentService) {
    this.columnDefs = [
      {
        headerName: 'STT',
        valueGetter: param => {
          return param.node.rowIndex + (((this.currentPage - 1) * PAGE_SIZE) + 1)
        },
        minWidth: 60,
        maxWidth: 60,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          left: '3px'
        },
      },
      {
        headerName: 'Mã CÁN BỘ',
        field: 'code',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          color: '#3366FF',
          top: '13px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        minWidth: 126,
        maxWidth: 126,
        tooltipField: 'code',
      },
      {
        headerName: 'họ và tên',
        field: 'fullName',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '13px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        tooltipField: 'fullName',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        headerName: 'giới tính',
        field: 'sexStr',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
        },
        tooltipField: 'sexStr',
        minWidth: 100,
        maxWidth: 100,
      },
      {
        headerName: 'khoa/ban',
        field: 'deptName',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          top: '13px',
        },
        tooltipField: 'deptName',
        minWidth: 150,
        maxWidth: 150,
      },
      {
        headerName: 'Chức vụ',
        field: 'positionName',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          top: '13px',
        },
        tooltipField: 'positionName',
        minWidth: 140,
      },
      {
        headerName: 'loại hợp đồng',
        field: 'contractTypeStr',
        cellStyle: {
          color: '#696F8C',
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          top: '13px',
        },
        tooltipField: 'contractTypeStr',
        minWidth: 140,
      },
      {
        headerName: 'trạng thái',
        field: 'statusStr',
        cellStyle: param=>{
          // const color = this.listStatusTeacher[param.data.status].color;
          let color = '';
          if(param.data.status === 0)
            color = '#52BD94';
          else if(param.data.status === 1)
            color = '#D14343';
          else if(param.data.status === 1)
            color = '#474D66';
          else
            color = '#F26522'
          return {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          top: '13px',
          color: color,
          }
        },
        tooltipField: 'statusStr',
        minWidth: 140,
      },
      {
        headerName: 'HỒ SƠ',
        field: 'make',
        cellRenderer: param => {
          return `<a style='color: #3366FF' href='/#/system/teacher/teacher-profile/${param.data.id}'>Xem hồ sơ</a>`
        },
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#3366FF',
          display: 'flex',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden'
        },
        minWidth: 130,
      },
      {
        headerName: '',
        field: '',
        cellRendererFramework: ActionTeacherComponent,
        minWidth: 50,
        maxWidth: 50,
      },
    ];
    this.typeImportInsert = 0;
    // Check role
    this.currentRoles = JSON.parse(localStorage.getItem('currentUser')).authorities;
    if (this.currentRoles && this.currentRoles.length > 0) {
      // TODO: this.isRole = true không cho chỉnh sửa
      this.currentRoles.forEach(e=>{
        if(e === this.ADMIN || e === this.HT){
          this.isRole = false;
          return;
        }
      })
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    this.gridApi.setRowData(this.rowData);
  }

  ngOnInit(): void {
    this.isShowImport = true;
    this.formImport = this.fb.group({
      fileImport: ''
    })
    this.currentPage = 1;
    this.firstLoad = true;
    this.getListParent();

    this.listenReload();
  }
  openModalNewUnit() {
    this.newUnit.show();
  }
  openModalImportUnit() {
    this.importUnit.show();
  }

  openModal(template: TemplateRef<any>) {
    this.resultImport = null;
    this.removeFile();
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'addnew-unit-md modal-dialog-custom' })
    );
  }

  searchData(page?) {
    this.rowData = []
    this.currentPage = page;
    this.searchObj.page = page;
    // if(this.currentRoles.includes('ROLE_TK')){
    //   this.searchObj.role = 'ROLE_TK';
    // }
    // if(this.currentRoles.includes('ROLE_HT') || this.currentRoles.includes('ROLE_HP') || this.currentRoles.includes('ROLE_ADMIN')){
    //   this.searchObj.role = null;
    // }
    // Role tk
    this.searchObj.role = null;
    if (this.currentRoles && this.currentRoles.length > 0) {
      this.currentRoles.forEach(e=>{
        if(e === 'ROLE_TK'){
          this.searchObj.role = 'ROLE_TK';
          this.searchObj.deptIdParent = null;
          return;
        }
      })
    }
    console.log(this.searchObj);
    this.teacherService.searchData(this.searchObj).subscribe((res: any) => {
      // const positionArr = res.positionName.split(',').filter(word => word !== '');
      res.data.map(item => {
        if(item.positionName === null ) return item;
        const positionArr = item.positionName.split(',').filter(word => word !== '');
        item.positionName =  positionArr.length === 1 ? positionArr[0] : positionArr.concat([]);
        return item;
      });
      this.rowData = res.data;
      this.total = res.total;
      console.log(res);
      this.gridApi.setRowData(this.rowData);
      this.totalPage = Math.ceil(this.total / PAGE_SIZE);
      this.rangeWithDots = pagination(this.currentPage, this.totalPage);
      this.first = calculateFistLastPageTable(this.rowData, this.total, PAGE_SIZE, this.currentPage).first;
      this.last = calculateFistLastPageTable(this.rowData, this.total, PAGE_SIZE, this.currentPage).last;
      this.changeDetectorRef.detectChanges();
    })
    console.log(this.rowData);
  }

  getListParent() {
    this.listDeptParent = []
    this.teacherService.getParentDeptNull().then((res: []) => {
      if (res.length > 0) {
        this.listDeptParent = res;
        this.searchObj.deptIdParent = this.listDeptParent[0].id;
        this.getListChild();
      }
    })
  }

  getListChild() {
    this.listDeptChild = []
    this.teacherService.getDeptByParent(this.searchObj.deptIdParent).then((res: []) => {
      if (res.length > 0) {
        this.listDeptChild = res;
      }
      this.getListPosition();
    })
  }

  getListPosition() {
    this.listPostion = []
    this.teacherService.getAllPosition().then((res: []) => {
      this.listPostion = res;
      console.log(this.searchObj)
      if (this.firstLoad) {
        this.searchData(this.currentPage);
        this.firstLoad = false;
      }
    })
  }

  exportTemplate() {
    this.teacherService.exportTemplate();
  }

  exportData() {
    this.teacherService.exportData(this.searchObj);
  }

  exportDataErrors() {
    if (this.resultImport === undefined) {
      this.toaStr.error('Chưa có file data lỗi, cần import trước')
      return;
    }
    if (this.resultImport.listErrors.length > 0) {
      this.teacherService.exportDataErrors(this.resultImport.listErrors);
    } else {
      this.toaStr.warning('Không có data lỗi!')
    }
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(file) {
    this.fileName = file[0].name;
    this.fileSize = file[0].size;

    if (file.length === 0) {
      this.toaStr.error('File import không để trống!')
      this.isShowImport = true;
      return;
    }
    if (!(file[0].name.includes('.xlsx') || file[0].name.includes('.xls'))) {
      this.toaStr.error('File không đúng định dạng');
      this.isShowImport = true;
      return;
    }else if(file[0].size > 5242880){
      this.toaStr.error('File không vượt quá 5Mb');
      this.isShowImport = true;
      return;
    }

    const formData = new FormData();

    formData.append('file', file[0]);
    this.formDatas = formData;
    this.isShowImport = false;
  }

  importFile() {
    this.hide = false;
    this.teacherService.upload(this.formDatas, this.typeImportInsert).subscribe((res: any) => {
      this.hide = true;
      if (res.data != null) {
        this.resultImport = res.data;
        if (this.resultImport.numberSuccess > 0) {
          this.toaStr.success('Thành công ' + this.resultImport.numberSuccess + '/' + this.resultImport.total + ' bản ghi')
          this.searchData(1);
        } else if (this.resultImport.numberErrors === this.resultImport.total) {
          // this.toaStr.error('Thất bại ' + this.resultImport.numberErrors + '/' + this.resultImport.total + ' bản ghi')
          this.toaStr.error('Thất bại ');
          return;
        }
      } else {
        this.toaStr.error(res.message);
      }
    }, err => {
      console.log(err);
      this.toaStr.error('File import lỗi!');
    })
  }

  removeFile() {
    this.formImport.get('fileImport').reset();
    this.resultImport = null;
    this.fileName = null;
    this.fileSize = null;
  }

  cancelImport() {
    this.modalRef.hide()
  }

  // paging
  page(page: number): void {
    console.log(page);
    this.currentPage = page;
    this.searchData(page);
  }
  prev(): void {
    this.currentPage--;

    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
    this.page(this.currentPage);
  }

  next(): void {
    this.currentPage++;

    if (this.currentPage > this.totalPage) {
      this.currentPage = this.totalPage;
    }
    this.page(this.currentPage);
  }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
  }

  // reload when change status
  listenReload() {
    this.leaveJobService.isReload$.subscribe(val => {
      if (val) {
        this.page(this.currentPage);
      }
    });
  }
}
