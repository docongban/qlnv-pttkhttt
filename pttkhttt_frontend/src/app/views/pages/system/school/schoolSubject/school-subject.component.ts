import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { ActionSchoolSubjectComponent } from './action-school-subject/action-school-subject.component';
import {
  BsModalRef,
  BsModalService,
  ModalDirective,
} from 'ngx-bootstrap/modal';
import { SubjectService } from '../../../../../core/service/service-model/subject.service';
import { GradeLevelService } from '../../../../../core/service/service-model/grade-level.service';
import { SubjectDeptServiceService } from '../../../../../core/service/service-model/subject-dept.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ImportFileSubjectComponent } from './import-file/import-file-subject.component';
import * as moment from 'moment';
import { equals } from '@ngx-translate/core/lib/util';
import { DepartmentService } from 'src/app/core/service/service-model/unit.service';
import { forEach } from 'ag-grid-community/dist/lib/utils/array';
import { CommonServiceService } from 'src/app/core/service/utils/common-service.service';


@Component({
  selector: 'kt-schoolsubject',
  templateUrl: './school-subject.component.html',
  styleUrls: ['./school-subject.component.scss'],
})
export class SchoolSubjectComponent implements OnInit, AfterViewInit {
  constructor(
    private gradeLevelService: GradeLevelService,
    private subjectService: SubjectService,
    private departmentService: DepartmentService,
    private modalService: BsModalService,
    private subjectDeptService: SubjectDeptServiceService,
    private toastr: ToastrService,
    private matDialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private commonService: CommonServiceService
  ) {
    this.columnDefs = [
      {
        headerName: 'STT',
        lockPosition: true,
        suppressMovable: true,
        field: 'id',
        minWidth: 60,
        maxWidth: 60,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          // display: 'flex',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        valueGetter: (param) => {
          return (
            param.node.rowIndex + ((this.currentPage - 1) * this.pageSize + 1)
          );
        },
      },
      {
        headerName: 'Mã môn học',
        field: 'code',
        suppressMovable: true,
        minWidth: 120,
        maxWidth: 120,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#3366FF',
          // display: 'flex',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        tooltipField: 'code',
      },
      {
        headerName: 'Tên môn học',
        field: 'name',
        suppressMovable: true,
        width: 120,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          // display: 'flex',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        tooltipField: 'name',
      },
      {
        headerName: 'Khối',
        field: 'nameGradeLevel',
        suppressMovable: true,
        sort: 'asc',
        width: 80,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          // display: 'flex',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        tooltipField: 'nameGradeLevel',
      },
      {
        headerName: 'Khoa/Ban',
        field: 'nameDept',
        suppressMovable: true,
        width: 100,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          // display: 'flex',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        tooltipField: 'nameDept',
      },
      {
        headerName: 'Loại môn',
        field: 'customFieldType',
        // filter: 'Bắt buộc',
        suppressMovable: true,
        minWidth: 120,
        maxWidth: 120,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          // display: 'flex',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        tooltipField: 'customFieldType',
      },
      {
        headerName: 'Kiểu môn',
        field: 'customerSupType',
        suppressMovable: true,
        width: 80,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          // display: 'flex',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        tooltipField: 'customerSupType',
      },
      {
        headerName: 'Mô tả môn học',
        field: 'description',
        suppressMovable: true,
        width: 200,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          // display: 'flex',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        tooltipField: 'description',
      },
      {
        headerName: '',
        field: 'undefined',
        suppressMovable: true,
        cellRendererFramework: ActionSchoolSubjectComponent,
        minWidth: 50,
        maxWidth: 50,
      },
    ];
  }

  @ViewChild('templateNewSubject') public newSubject: TemplateRef<any>;
  @ViewChild('templateNewSubject') public newSubject1: ModalDirective;
  @ViewChild('importSubject') public importSubjects: ModalDirective;
  @ViewChild(ActionSchoolSubjectComponent) actionSchoolSubjectComponent;
  modalRef: BsModalRef;
  columnDefs;
  rowData;
  noRowsTemplate = 'Không có bản ghi nào';
  gridApi;
  gridColumnApi;
  headerHeight = 56;
  rowHeight = 56;
  afuConfig = {
    multiple: false,
    formatsAllowed: '.xlsx, .xls',
    maxSize: '5000',
    uploadAPI: {
      // url: 'http://localhost:8080/api/class-rooms/fileUpload',
      method: 'POST',
      params: {
        page: '1',
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
      sizeLimit: 'Size Limit',
    },
  };

  kieuMon = [
    {
      id: 0,
      name: 'Tính điểm',
    },
    {
      id: 1,
      name: 'Xếp loại',
    },
  ];

  loaiMon = [
    {
      id: 0,
      name: 'Môn tự chọn',
    },
    {
      id: 1,
      name: 'Môn bắt buộc',
    },
  ];

  maMonHocThem;
  tenMonHocThem;
  khoiThem;
  khoaThem;
  loaiMonThem;
  kieuMonThem;
  moTaThem;
  maMonSua;

  valueSearch = '';
  public idKhoi;
  public idKhoa;
  public idLoaiMon;
  openAdd = false;
  public opened = false;

  gridData;
  public _pageSize = 5;
  public pageSizes: Array<number> = [10, 20];
  selectTableSetting: SelectableSettings = {
    checkboxOnly: true,
  };

  khoi: any[];
  khoa: any[];
  // loaiMon: any[];
  luaChon = '--Lựa chọn--';

  messageMaMonHoc = {
    message: '',
    status: 'false',
    exists: 'false',
  };

  messageTenMonHoc = {
    message: '',
    status: 'false',
  };

  messageKhoi = {
    message: '',
    status: 'false',
  };

  messageKhoa = {
    message: '',
    status: 'false',
  };
  messageDescription = {
    message: '',
    status: 'false',
  };
  messageLoaiMonHoc = {
    message: '',
    status: 'false',
  };
  messageKieuMon = {
    message: '',
    status: 'false',
  };

  message: string;

  dataRow: any = {};
  boolean = 'true';

  dataBeforeupdate: any;
  searchDataExport: any;
  Za: any;
  private pattern: string;

  pageSize = 10;

  first;
  last;
  total = 0;
  currentPage = 1;
  pages: number[];
  rangeWithDots: any[];

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    this.gridApi.setRowData(this.rowData);
  }

  async getGradeLevel() {
    this.gradeLevelService.getGradeLevelOfSubject().subscribe((res) => {
      this.khoi = res;
      console.log('lan0', res[0].id);
      this.idKhoi = res[0].id;
      this.findSubject();
    });
    await console.log('lan1', this.idKhoi);
    this.changeDetectorRef.detectChanges();
  }

  onChangeKhoi(event) {
    this.idKhoi = event;
    // this.getGradeLevel();
  }

  onChangeKhoa(event) {
    this.getDeptIdOfSubject();
    this.idKhoa = event;
  }

  onChangeLoaiMon(event) {
    this.idLoaiMon = event;
  }

  onChangeMoTa(event) {
    this.valueSearch = event;
  }

  getDeptIdOfSubject() {
    this.departmentService.getDepartmentByCondition().subscribe((res) => {
      this.khoa = res;
    });
    console.log('làn2');
  }

  async ngOnInit(): Promise<void> {
    await this.getGradeLevel();
    await this.getDeptIdOfSubject();
    await this.changeDetectorRef.detectChanges();
  }

  findSubject() {
    this.currentPage = 1;
    this.loadData();
  }

  loadData() {
    const searchData: any = {};
    if (this.idKhoi === undefined || this.idKhoi === null) {
      searchData.gradeLevel = -1;
    } else {
      searchData.gradeLevel = this.idKhoi;
    }

    if (this.idKhoa === undefined || this.idKhoa === null) {
      searchData.deptId = -1;
    } else {
      searchData.deptId = this.idKhoa;
    }

    if (this.idLoaiMon === undefined || this.idLoaiMon === null) {
      searchData.type = -1;
    } else {
      searchData.type = this.idLoaiMon;
    }
    searchData.searchString = this.valueSearch.trim();

    this.searchDataExport = searchData;

    // console.log('searchData', searchData);
    this.subjectService
      .searchSubject(searchData, this.currentPage, this.pageSize)
      .subscribe((res) => {
        // console.log('res', res);

        let listData: any = [];
        let item1: any = {};
        // cot loai mon
        res.forEach((item) => {
          if (item.type === 0) {
            item1 = { ...item, customFieldType: 'Môn tự chọn' };
          } else {
            if (item.type === 1) {
              item1 = { ...item, customFieldType: 'Môn bắt buộc' };
            } else {
              item1 = { ...item, customFieldType: '' };
            }
          }
          listData = [...listData, item1];
        });

        listData.forEach((item) => {
          if (item.supType === 0) {
            item.customerSupType = 'Tính điểm';
          } else {
            if (item.supType === 1) {
              item.customerSupType = 'Xếp loại';
            } else {
              item.customerSupType = '';
            }
          }
        });

        // console.log('listData', listData.length);
        if (listData.length !== 0) {
          this.total = res[0].total;
          this.rowData = listData;
          const totalPage = Math.ceil(this.total / this.pageSize);
          this.rangeWithDots = this.commonService.pagination(
            this.currentPage,
            totalPage
          );
          this.pages = Array(totalPage)
            .fill(0)
            .map((value, index) => index + 1);
          this.first = this.pageSize * (this.currentPage - 1) + 1;
          this.last =
            this.rowData.length + this.pageSize * (this.currentPage - 1);
        } else {
          this.rowData = listData;
          this.total = 0;
          this.pages = [];
          this.rangeWithDots = [];
          this.first = 0;
          this.last = 0;
        }

        // this.rowData = listData;
        // console.log('listData', listData);
        this.gridApi.setRowData(this.rowData);
        this.changeDetectorRef.detectChanges();

        // this.total =
      });
  }

  openModalNewSubject(template: TemplateRef<any>) {
    this.messageMaMonHoc.status = 'false';
    this.messageTenMonHoc.status = 'false';
    this.messageKhoi.status = 'false';
    this.messageKhoa.status = 'false';
    this.messageMaMonHoc.exists = 'false';
    this.messageKieuMon.status = 'false';
    this.messageLoaiMonHoc.status = 'false';

    this.boolean = 'true';
    this.maMonHocThem = '';
    this.tenMonHocThem = '';
    this.khoiThem = undefined;
    this.khoaThem = undefined;
    this.loaiMonThem = 1;
    this.kieuMonThem = 0;
    this.moTaThem = undefined;

    console.log('loaiMonThem', this.loaiMonThem);
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'action-subject-dialog-custom' })
    );
  }

  openModalImportSubjects(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'addnew-unit-md modal-dialog-custom' })
    );
  }

  openImportDialog() {
    const dataImport: any = {};
    dataImport.years = 2000;
    this.matDialog
      .open(ImportFileSubjectComponent, {
        data: dataImport,
        disableClose: true,
        hasBackdrop: true,
        width: '446px',
      })
      .afterClosed()
      .subscribe((res) => {
        console.log('dong import');
      });
  }

  openModalUpdateSubject(data: any) {
    this.messageMaMonHoc.status = 'false';
    this.messageTenMonHoc.status = 'false';
    this.messageKhoi.status = 'false';
    this.messageKhoa.status = 'false';
    this.messageMaMonHoc.exists = 'false';
    this.messageKieuMon.status = 'false';
    this.messageLoaiMonHoc.status = 'false';

    this.dataBeforeupdate = data;

    let listData: any = [];
    console.log('res', data.code);
    this.subjectService.getDetailSubject(data.code).subscribe((res) => {
      // let listData: any = [];
      // cot loai mon
      console.log('res', res);
      res.forEach((item) => {
        if (this.khoa.length !== 0) {
          this.khoa.forEach((khoa) => {
            if (khoa.id === item.deptId) {
              listData = [...listData, item.deptId];
            }
          });
        }
      });
      this.khoaThem = listData;
    });

    this.boolean = 'false';
    this.maMonSua = data.code;
    this.maMonHocThem = data.code;
    this.tenMonHocThem = data.name;
    this.khoiThem = data.gradeLevel;

    this.moTaThem = data.description;

    if (data.type === -1) {
      this.loaiMonThem = undefined;
    } else {
      this.loaiMonThem = data.type;
    }

    if (data.supType === -1) {
      this.kieuMonThem = undefined;
    } else {
      this.kieuMonThem = data.supType;
    }

    // console.log(this.kieuMonThem);

    this.modalRef = this.modalService.show(
      this.newSubject,
      Object.assign({}, { class: 'action-subject-dialog-custom' })
    );
  }

  checkMaMonHoc() {
    if (this.boolean === 'false') {
      if (this.maMonSua !== this.maMonHocThem) {
        this.messageMaMonHoc.message = 'Không được thay đổi mã môn học';
        this.messageMaMonHoc.status = 'true';
        return;
      }
    }

    const pattern = /^[0-9A-Za-z{}|\\;:\[\]'"/+=\-~_ )(><?.,!@#$%^&*]{1,50}$/;
    const pattern1 =
      /^[0-9A-Za-z ()<>?.,!@#$%^&*aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ]{1,50}$/;
    this.messageMaMonHoc.status = 'false';
    if (
      this.maMonHocThem.trim() == null ||
      this.maMonHocThem.trim() === '' ||
      this.maMonHocThem.trim() === undefined
    ) {
      this.messageMaMonHoc.message = 'Không được để trống';
      this.messageMaMonHoc.status = 'true';
    } else {
      if (this.maMonHocThem.trim().length > 50) {
        this.messageMaMonHoc.message = 'Không nhập quá 50 kí tự';
        this.messageMaMonHoc.status = 'true';
      } else {
        const code = this.maMonHocThem.trim().split(' ');
        if (code.length > 1) {
          this.messageMaMonHoc.message = 'Mã môn học không được có dấu cách';
          this.messageMaMonHoc.status = 'true';
        }else {
              this.messageMaMonHoc.message = '';
              this.messageMaMonHoc.status = 'false';
        }

        // else {
        //   if (!pattern1.test(this.maMonHocThem.trim())) {
        //     this.messageMaMonHoc.message = 'Không được chứa dấu';
        //     this.messageMaMonHoc.status = 'true';
        //   } else {
        //     this.messageMaMonHoc.message = '';
        //     this.messageMaMonHoc.status = 'false';
        //   }
        // }
      }
    }
  }

  checkTenMonHoc() {
    const pattern =
      /^[0-9A-Za-z{}|\\;:\[\]'"/+=\-~_ )(><?.,!@#$%^&*aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ]{1,250}$/;
    console.log('trim: ', this.tenMonHocThem.trim());
    console.log('trim: ', this.tenMonHocThem.trim().length);
    // tslint:disable-next-line:max-line-length
    if (
      this.tenMonHocThem.trim().length === 0 ||
      this.tenMonHocThem.trim() == null ||
      this.tenMonHocThem === '' ||
      this.tenMonHocThem === undefined
    ) {
      this.messageTenMonHoc.message = 'Không được để trống';
      this.messageTenMonHoc.status = 'true';
    } else {
      if (!pattern.test(this.tenMonHocThem)) {
        this.messageTenMonHoc.message = 'Không được nhập quá 250 kí tự';
        this.messageTenMonHoc.status = 'true';
      } else {
        this.messageTenMonHoc.message = '';
        this.messageTenMonHoc.status = 'false';
      }
    }
  }

  checkKhoi() {
    console.log('khoiThem', this.khoiThem);
    if (
      this.khoiThem == null ||
      this.khoiThem === '' ||
      this.khoiThem === undefined
    ) {
      this.messageKhoi.message = 'Không được để trống';
      this.messageKhoi.status = 'true';
    } else {
      this.messageKhoi.message = '';
      this.messageKhoi.status = 'false';
    }
  }

  checkKhoa() {
    console.log('khoaThem', this.khoaThem);
    if (
      this.khoaThem == null ||
      this.khoaThem === '' ||
      this.khoaThem === undefined ||
      this.khoaThem.length === 0
    ) {
      // if (this.khoaThem.length === 0) {
      this.messageKhoa.message = 'Không được để trống';
      this.messageKhoa.status = 'true';
    } else {
      this.messageKhoa.message = '';
      this.messageKhoa.status = 'false';
    }
  }

  checkLoaiMonHoc() {
    if (
      this.loaiMonThem == null ||
      this.loaiMonThem === '' ||
      this.loaiMonThem === undefined
    ) {
      this.messageLoaiMonHoc.message = 'Không được để trống';
      this.messageLoaiMonHoc.status = 'true';
    } else {
      this.messageLoaiMonHoc.message = '';
      this.messageLoaiMonHoc.status = 'false';
    }
  }

  checkKieuMon() {
    if (
      this.kieuMonThem == null ||
      this.kieuMonThem === '' ||
      this.kieuMonThem === undefined
    ) {
      this.messageKieuMon.message = 'Không được để trống';
      this.messageKieuMon.status = 'true';
    } else {
      this.messageKieuMon.message = '';
      this.messageKieuMon.status = 'false';
    }
  }

  checkDescription() {
    const pattern =
      /^[0-9A-Za-z{}|\\;:\[\]'"/+=\-~_ )(><?.,!@#$%^&*aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ]{0,500}$/;
    if (!pattern.test(this.moTaThem)) {
      this.messageDescription.message = 'Không được quá 500 kí tự';
      this.messageDescription.status = 'true';
    } else {
      this.messageDescription.message = '';
      this.messageDescription.status = 'false';
    }
  }

  create() {
    this.checkMaMonHoc();
    this.checkTenMonHoc();
    this.checkKhoa();
    this.checkKhoi();

    // tslint:disable-next-line:max-line-length
    if (
      this.messageMaMonHoc.status === 'false' &&
      this.messageTenMonHoc.status === 'false' &&
      this.messageKhoi.status === 'false' &&
      this.messageKhoa.status === 'false' &&
      this.messageDescription.status === 'false' &&
      this.messageLoaiMonHoc.status === 'false' &&
      this.messageKieuMon.status === 'false'
    ) {
      const addData: any = {};
      addData.createdName = 'kbt';
      addData.name = this.tenMonHocThem.trim();
      console.log('name', this.tenMonHocThem.trim());
      addData.code = this.maMonHocThem.trim();
      addData.deptId = this.khoaThem;
      addData.gradeLevel = this.khoiThem;
      if (this.moTaThem !== undefined) {
        addData.description = this.moTaThem.trim();
      } else {
        addData.description = this.moTaThem;
      }

      addData.supType = this.kieuMonThem;
      if (this.loaiMonThem === '' || this.loaiMonThem === undefined) {
        addData.type = -1;
      } else {
        addData.type = this.loaiMonThem;
      }

      this.subjectService.addSubject(addData).subscribe((responseAPI) => {
        console.log('responseAPI', responseAPI);
        if (responseAPI.status === 'OK') {
          this.loadData();
          this.toastr.success(responseAPI.message);
          this.modalRef.hide();
        } else {
          if (responseAPI.message === 'Đã tồn tại mã môn học này') {
            this.messageMaMonHoc.exists = 'true';
            this.messageMaMonHoc.message = responseAPI.message;
          } else {
            this.toastr.error(responseAPI.message);
          }
        }
      });
    }
  }

  update() {
    this.checkMaMonHoc();
    this.checkTenMonHoc();
    this.checkKhoa();
    this.checkKhoi();
    // tslint:disable-next-line:max-line-length
    if (
      this.messageMaMonHoc.status === 'false' &&
      this.messageTenMonHoc.status === 'false' &&
      this.messageKhoi.status === 'false' &&
      this.messageKhoa.status === 'false' &&
      this.messageDescription.status === 'false' &&
      this.messageLoaiMonHoc.status === 'false' &&
      this.messageKieuMon.status === 'false'
    ) {
      const updateData: any = {};

      updateData.id = this.dataBeforeupdate.id;
      updateData.updateName = 'kbt';
      updateData.name = this.tenMonHocThem.trim();
      updateData.code = this.maMonHocThem.trim();
      updateData.deptId = this.khoaThem;
      updateData.gradeLevel = this.khoiThem;
      if (this.moTaThem !== undefined) {
        updateData.description = this.moTaThem.trim();
      } else {
        updateData.description = this.moTaThem;
      }
      updateData.supType = this.kieuMonThem;
      updateData.type = this.loaiMonThem;

      console.log('loaiMonThem', this.loaiMonThem);
      console.log('updateData', updateData);

      this.subjectService.updateSubject(updateData).subscribe((responseAPI) => {
        console.log('responseAPI', responseAPI);
        if (responseAPI.status === 'OK') {
          this.loadData();
          this.toastr.success(responseAPI.message);
          this.modalRef.hide();
        } else if (responseAPI.status === 'BAD_REQUEST') {
          if (responseAPI.message === 'Đã tồn tại mã môn học này') {
            this.messageMaMonHoc.exists = 'true';
            this.messageMaMonHoc.message = 'Mã môn học đã tồn tại';
          } else {
            this.toastr.error(responseAPI.message);
          }
        }
      });
      // console.log(updateData);
    }
  }

  ngAfterViewInit() {
    this.message = this.actionSchoolSubjectComponent.message;
  }

  onRowClick(event: any) {
    this.dataRow = event.data;
  }

  export() {
    const data = {
      // classRoomId:909,
      years: '2021-2022'
    }
    // test học sinh
    // .export(data)
    // test sổ liên lạc
    // @ts-ignore
    console.log('searchDataExport', this.searchDataExport);
    this.subjectService
      .export(this.searchDataExport)
      // .export(data)
      .subscribe((responseMessage) => {
        const file = new Blob([responseMessage], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const fileURL = URL.createObjectURL(file);
        // window.open(fileURL, '_blank');
        const anchor = document.createElement('a');
        anchor.download = `DS_monhocthuoctruong_${moment()
          .format('DDMMYYYY')
          .toString()}`;
        anchor.href = fileURL;
        anchor.click();
      });
  }

  downloadSampleFile() {
    this.subjectService.downloadSampleFile().subscribe((responseMessage) => {
      // @ts-ignore
      const file = new Blob([responseMessage], {
        type: 'application/vnd.ms-excel',
      });
      const fileURL = URL.createObjectURL(file);
      // window.open(fileURL, '_blank');
      const anchor = document.createElement('a');
      anchor.download = 'DS_monhocthuoctruong_ddmmyy.xls';
      anchor.href = fileURL;
      anchor.click();
    });
  }

  fileUpload(event) {
    console.log(event);
  }

  page(page: number): void {
    if (page === this.currentPage) {
      return;
    }
    // this.rowData = undefined;
    this.currentPage = page;
    this.loadData();
  }

  prev() {
    // this.rowData = undefined;
    console.log('rowData', this.rowData);
    this.currentPage--;
    if (this.currentPage < 1) {
      this.currentPage = 1;
      return;
    }
    this.loadData();
    // this.page(this.currentPage);
  }

  next(): void {
    // this.rowData = undefined;
    console.log('rowData', this.rowData);
    console.log('currentPage before ', this.currentPage);
    this.currentPage++;
    if (this.currentPage > this.pages.length) {
      this.currentPage = this.pages.length;
      console.log('currentPage after 1 ', this.currentPage);
      return;
    }
    console.log('currentPage after 2 ', this.currentPage);
    this.loadData();
  }
}
