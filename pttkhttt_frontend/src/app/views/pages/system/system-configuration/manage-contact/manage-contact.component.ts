import {style} from '@angular/animations';
import {template} from 'lodash';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';

import {CommonServiceService} from 'src/app/core/service/utils/common-service.service';
import {GradeLevelService} from 'src/app/core/service/service-model/grade-level.service';
import {ClassroomService} from 'src/app/core/service/service-model/classroom.service';
import {ManageContactService} from 'src/app/core/service/service-model/manage-contact.service';

import {MatDialog} from '@angular/material/dialog';
import {ActionManageContactComponent} from './action-manage-contact/action-manage-contact.component';
import {HistoryContactPackageComponent} from './history-contact-package/history-contact-package.component';

import * as moment from 'moment';
import {formatDate} from '@angular/common';
import {environment} from '../../../../../../environments/environment';
import {SchoolService} from '../../../../../core/service/service-model/school.service';
import {EvaluateConductService} from '../../../../../core/service/service-model/evaluate-conduct.service';

@Component({
  selector: 'kt-manage-contact',
  templateUrl: './manage-contact.component.html',
  styleUrls: ['./manage-contact.component.scss'],
})
export class ManageContactComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private matDialog: MatDialog,
    private modalService: BsModalService,
    private changeDetectorRef: ChangeDetectorRef,
    private commonService: CommonServiceService,
    private gradeLevelService: GradeLevelService,
    private classRoomService: ClassroomService,
    private manageContactService: ManageContactService,
    private schoolService: SchoolService,
    private evaluateConductService: EvaluateConductService,
  ) {
    this.rowData = [];
  }

  unsubscribe$ = new Subject<void>();
  @ViewChild('registerPackageModal')
  public registerPackageModal: TemplateRef<any>;
  modalRef: BsModalRef;

  private SCHOOL_CODE = `${environment.SCHOOL_CODE}`;

  // ag-grid
  gridApi;
  gridColumnApi;
  columnDefs;
  defaultColDef = {
    width: 150,
    lockPosition: true,
    suppressMenu: true,
  };
  rowData;
  ROW_HEIGHT = 50;
  HEADER_HEIGHT = 32;
  rowStyle;
  rowSelection = 'multiple';
  noRowsTemplate = 'Không có bản ghi nào';
  loadingTemplate = 'Đang tìm kiếm';
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

  selectedStudents = [];
  booleanSemester = true;
  setColumn;

  // search form
  dataSearch;
  formSearch: FormGroup;

  subscription: Subscription;

  classRoomName;
  _year;

  // paging
  perPage = 10;
  currentPage = 1;
  first = 0;
  last = 0;
  total = 0;
  totalPage = 0;
  rangeWithDots = [];

  listStatus = [
    {id: 0, name: 'Chưa đăng ký'},
    {id: 1, name: 'Đăng ký'},
    {id: 2, name: 'Đã kích hoạt'},
    {id: 3, name: 'Tạm dừng dịch vụ'},
  ];

  selectedStatusId = null;

  currentYear;
  currentYearObj;
  semesterAmount;
  listSemesters = [];

  semestersInCurrentYear;
  semestersInCurrentYear1;
  semesterValue;

  listGradeLevel = [];
  selectedGradeLevelId = null;

  listClass = [];
  selectedClassId = null;

  mappingRelationships = {
    0: 'Bố',
    1: 'Mẹ',
    2: 'Ông Bà',
    3: 'Anh Chị',
    4: 'Cô chú',
    5: 'Người giám hộ',
  };
  mappingStatus = {
    // 0: 'Chưa đăng ký',
    0: '-',
    1: 'Đăng ký',
    2: 'Đã kích hoạt',
    3: 'Tạm dừng',
  };
  mappingStyleStatus = {
    0: 'unregistered',
    1: 'registered',
    2: 'actived',
    3: 'canceled',
  };
  mappingDurations = {
    0: '-',
    1: 'Học kỳ 1',
    2: 'Học kỳ 2',
    3: 'Học kỳ 3',
    4: 'Học kỳ 4',
    5: 'Cả năm',
  };
  mappingUnits = {
    1: 'VND',
    2: 'USD',
    3: 'KIP'
  }


  errorMessages;

  selectedSemester;

  selectedPackage;
  packageName;
  packageCode;
  packageDescription;
  registerStudendIds= [];
  updateStatus;
  // updateStatus1;
  // updateStatus2;
  // updateStatus3;
  // updateStatus4;
  // updateStatusFullYear;
  fromPackageDate;
  toPackageDate;
  selectedSemesterId;

  schoolInfo = JSON.parse(sessionStorage.getItem('schoolInfo'));

  limitStringCellValue = (params) => {
    const element = document.createElement('span');
    element.className = 'one-line-ellipsis w-100';
    element.appendChild(document.createTextNode(params.value));
    return element;
  };

  onSelectionChanged(event) {
    console.log('event', event);
    const selectedNodes = event.api.getSelectedNodes();
    console.log('selectedNodes', selectedNodes);
    this.selectedStudents = selectedNodes.map((node) => ({
      id: node.data.id,
      code: node.data.studentCode,
      status1: node.data.status1,
      status2: node.data.status2,
      status3: node.data.status3,
      status4: node.data.status4,
      statusFullYear: node.data.statusFullYear,
      // semester: node.data.semester,
    }));
    console.log('this.selectedStudents', this.selectedStudents);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
  }

  ngOnInit(): void {
    this.buildFormSearch();
    this.loadCurrentYear();
  }

  buildFormSearch() {
    this.formSearch = this.fb.group({
      studentName: '',
    });
  }

  loadCurrentYear(): void {
    console.log('loadCurrentYear');
    this.selectedStudents = [];
    this.listSemesters = [];
    // console.log('this.listSemesters', this.listSemesters);
    this.subscription = this.classRoomService.listYears$.subscribe(
      (listYears) => {
        // console.log(`listYear`, listYears);
        this.classRoomService.yearCurrent$.subscribe((currentYear) => {
          console.log('currentYear', currentYear);
          this.currentYear = currentYear;
          this.currentYearObj = listYears.find(
            (_year) => _year.years === this.currentYear
          );

          if (this.currentYearObj) {
            this.semesterAmount = this.currentYearObj.semesterAmount;
            this.loadSemesters();
            this.loadGradeLevel();

            for (let _i = 0; _i < this.semesterAmount; _i++) {
              this.listSemesters.push({
                id: _i + 1,
                name: `Học kỳ ${_i + 1}`,
              });
            }
            this.listSemesters.push({
              id: 5,
              name: 'Cả năm',
            });
            this.changeDetectorRef.detectChanges();
          }
          this.changeDetectorRef.detectChanges();
          // console.log('this.listSemesters2', this.listSemesters);
        });
      }
    );
  }

  initGrid() {
    return [
      {
        headerName: '',
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
        headerTooltip: 'STT',
        // headerClass: 'sy-header-center',
        field: 'index',
        tooltipField: 'index',
        minWidth: 48,
        maxWidth: 48,
        headerClass: 'custom-merge-header1',
        suppressMovable: true,
        cellStyle: {
          ...this.cellStyle,
          'justify-content': 'center',
        },
      },
      {
        headerName: 'Mã học sinh',
        headerClass: 'custom-merge-header1',
        headerTooltip: 'Mã học sinh',
        field: 'studentCode',
        tooltipField: 'studentCode',
        minWidth: 100,
        maxWidth: 100,
        suppressMovable: true,
        cellStyle: {
          ...this.cellStyle,
          color: '#3366FF',
        },
        cellRenderer: (params) => this.limitStringCellValue(params),
      },
      {
        headerName: 'Tên học sinh',
        headerClass: 'custom-merge-header1',
        headerTooltip: 'Tên học sinh',
        field: 'studentName',
        tooltipField: 'studentName',
        minWidth: 120,
        maxWidth: 120,
        suppressMovable: true,
        cellStyle: {
          ...this.cellStyle,
        },
        cellRenderer: (params) => this.limitStringCellValue(params),
      },
      {
        headerName: 'Lớp',
        headerClass: 'custom-merge-header1',
        headerTooltip: 'Lớp',
        field: 'className',
        tooltipField: 'className',
        minWidth: 80,
        maxWidth: 80,
        suppressMovable: true,
        cellStyle: {
          ...this.cellStyle,
        },
        cellRenderer: (params) => this.limitStringCellValue(params),
      },
      //   ],
      // },
      {
        headerName: 'THÔNG TIN ĐĂNG KÝ',
        headerClass: 'header-color',
        children: [
          {
            headerName: 'Tên phụ huynh',
            headerTooltip: 'Tên phụ huynh',
            field: 'parentName',
            tooltipField: 'parentName',
            minWidth: 130,
            maxWidth: 130,
            suppressMovable: true,
            headerClass: 'header-color',
            cellStyle: {
              ...this.cellStyle,
            },
            cellRenderer: (params) => this.limitStringCellValue(params),
          },
          {
            headerName: 'Quan hệ',
            headerTooltip: 'Quan hệ',
            field: 'relationLabel',
            tooltipField: 'relationLabel',
            maxWidth: 80,
            minWidth: 80,
            suppressMovable: true,
            headerClass: 'header-color',
            cellStyle: {
              ...this.cellStyle,
            },
            cellRenderer: (params) => this.limitStringCellValue(params),
          },
          {
            headerName: 'SĐT',
            headerTooltip: 'SĐT',
            field: 'phoneNumber',
            tooltipField: 'phoneNumber',
            maxWidth: 100,
            minWidth: 100,
            suppressMovable: true,
            headerClass: 'header-color',
            cellStyle: {
              ...this.cellStyle,
            },
            cellRenderer: (params) => this.limitStringCellValue(params),
          },
          // {
          //   headerName: 'Gói cước',
          //   headerTooltip: 'Gói cước',
          //   field: 'packageContact',
          //   tooltipField: 'packageContact',
          //   maxWidth: 100,
          //   minWidth: 100,
          //   suppressMovable: true,
          //   headerClass: 'header-color',
          //   cellStyle: {
          //     ...this.cellStyle,
          //   },
          //   cellRenderer: (params) => this.limitStringCellValue(params),
          // },
          // {
          //   headerName: 'Thời hạn',
          //   headerTooltip: 'Thời hạn',
          //   field: 'duration',
          //   tooltipField: 'duration',
          //   maxWidth: 80,
          //   minWidth: 80,
          //   suppressMovable: true,
          //   headerClass: 'header-color',
          //   cellStyle: {
          //     ...this.cellStyle,
          //   },
          //   cellRenderer: (params) => this.limitStringCellValue(params),
          // },
        ],
      },

      // {
      //   headerName: 'Trạng thái',
      //   headerTooltip: 'Trạng thái',
      //   field: 'status',
      //   tooltipField: 'statusLabel',
      //   maxWidth: 140,
      //   minWidth: 140,
      //   headerClass: 'custom-merge-header1',
      //   suppressMovable: true,
      //   cellRenderer: (params) => {
      //     const element = document.createElement('p');
      //     element.className = `package-status ${
      //       this.mappingStyleStatus[params.value]
      //     }`;
      //     const iconElement = document.createElement('span');
      //     iconElement.className = 'fas fa-circle ';
      //     element.appendChild(iconElement);
      //     element.appendChild(
      //       document.createTextNode(this.mappingStatus[params.value])
      //     );
      //     return element;
      //   },
      //   cellStyle: {
      //     ...this.cellStyle,
      //   },
      // },
      // // element.className = 'one-line-ellipsis w-100 ';
      // {
      //   headerName: 'Lịch sử đăng ký',
      //   headerClass: 'custom-merge-header1',
      //   headerTooltip: 'Lịch sử đăng ký',
      //   maxWidth: 130,
      //   minWidth: 130,
      //   suppressMovable: true,
      //   cellStyle: {
      //     ...this.cellStyle,
      //     cursor: 'pointer',
      //   },
      //   cellRendererFramework: HistoryContactPackageComponent,
      // },
      // {
      //   headerName: '',
      //   headerClass: 'custom-merge-header1',
      //   field: '',
      //   cellRendererFramework: ActionManageContactComponent,
      //   minWidth: 48,
      //   maxWidth: 48,
      //   suppressMovable: true,
      //   cellStyle: {
      //     'align-items': 'center',
      //     display: 'flex',
      //   },
      // },

      // {
      //   headerName: 'Trạng thái',
      //   headerTooltip: 'Trạng thái',
      //   field: 'status',
      //   tooltipField: 'statusLabel',
      //   maxWidth: 140,
      //   minWidth: 140,
      //   headerClass: 'custom-merge-header1',
      //   suppressMovable: true,
      //   cellRenderer: (params) => {
      //     const element = document.createElement('p');
      //     element.className = `package-status ${
      //       this.mappingStyleStatus[params.value]
      //     }`;
      //     const iconElement = document.createElement('span');
      //     iconElement.className = 'fas fa-circle ';
      //     element.appendChild(iconElement);
      //     element.appendChild(
      //       document.createTextNode(this.mappingStatus[params.value])
      //     );
      //     return element;
      //   },
      //   cellStyle: {
      //     ...this.cellStyle,
      //   },
      // },
      // // element.className = 'one-line-ellipsis w-100 ';
      // {
      //
      //   //headerName: 'Lịch sử đăng ký',
      //   headerComponentParams:{
      //     template:'<span style="font-size:10px; color:#8f95b2">LỊCH SỬ <br/><br/> ĐĂNG KÝ </span>',
      //
      //   },
      //   headerClass:'custom-merge-header1',
      //   headerName: 'Lịch sử đăng ký',
      //   headerTooltip: 'Lịch sử đăng ký',
      //   maxWidth: 132,
      //   minWidth: 130,
      //   suppressMovable: true,
      //   cellStyle: {
      //     ...this.cellStyle,
      //     cursor: 'pointer',
      //   },
      //   cellRendererFramework: HistoryContactPackageComponent,
      // },
      // {
      //   headerName: '',
      //   headerClass: 'custom-merge-header1',
      //   field: '',
      //   cellRendererFramework: ActionManageContactComponent,
      //   minWidth: 48,
      //   maxWidth: 58,
      //   suppressMovable: true,
      //   cellStyle: {
      //     'align-items': 'center',
      //     display: 'flex',
      //
      //   },
      // },

    ];
  }

  loadSemesters(): void {
    this.setColumn = null;
    console.log('setColumn1', this.setColumn);
    console.log('columnDefs1', this.columnDefs);
    const year = {
      years: this.currentYear
    };

    // const listChildPackage = this.schoolInfo.childPackage;
    // const listDataPackageOfSemester = [];


    this.evaluateConductService.getSemesterByYear(year)
      .subscribe((listSemesters) => {
        this.semestersInCurrentYear1 = listSemesters;
        let i = 0;
        this.setColumn = this.initGrid();
        console.log('columnDefs', this.setColumn);

        // check hoc ky thuoc nam hien tai khong, de gan gia tri mac dinh
        listSemesters.forEach(item => {
          if (item.defaultValue === true) {
            this.semesterValue = item.value;
            i++;
          }
        })
        if (i === 0) {
          this.semesterValue = listSemesters[0].value;
        }

        const listChildPackage = this.schoolInfo.schoolPackage.childPackage;
        const listDataPackageOfSemester = [];
        console.log('listChildPackage',listChildPackage);

        for (let j = 0; j < listSemesters.length-1; j++){
          let count1 =0;
          for(let q = 0 ; q<listChildPackage.length; q++){
              if(listChildPackage[q].typePackage ===0 &&
                listChildPackage[q].primaryPackage === this.schoolInfo.schoolPackage.code &&
                listChildPackage[q].quantitySemesterApply === listSemesters.length-1 &&
                listChildPackage[q].semesterApply === (q+1).toString()
              ){
                count1++;
                listDataPackageOfSemester.push({
                  id:q+1,
                  namePackage : listChildPackage[q].name
                })
              }
          }
          if(count1 ===0){
            for(let q = 0 ; q<listChildPackage.length; q++){
              if(listChildPackage[q].typePackage ===0 &&
                listChildPackage[q].primaryPackage === this.schoolInfo.schoolPackage.code &&
                listChildPackage[q].quantitySemesterApply === listSemesters.length-1 &&
                listChildPackage[q].semesterApply === null
              ){
                listDataPackageOfSemester.push({
                  id:q+1,
                  namePackage : listChildPackage[q].name
                })
                break;
              }
            }
          }
        }



        for (let j = 0; j < listSemesters.length; j++) {
          if (j !== listSemesters.length - 1) {
            this.setColumn[5].children.push({
              headerName: `HỌC KÌ ${j + 1} ( ${listDataPackageOfSemester[j].namePackage} )`,
              headerTooltip: `HỌC KÌ ${j + 1} ( ${listDataPackageOfSemester[j].namePackage} )`,
              field: `status${j + 1}`,
              tooltipField: `statusLabel${j + 1}`,
              maxWidth: 140,
              minWidth: 140,
              headerClass: 'header-color',
              suppressMovable: true,
              cellRenderer: (params) => {
                const element = document.createElement('p');
                element.className = `package-status ${
                  this.mappingStyleStatus[params.value]
                }`;
                if (params.value !== 0) {
                  const iconElement = document.createElement('span');
                  iconElement.className = 'fas fa-circle ';
                  element.appendChild(iconElement);
                  element.appendChild(
                    document.createTextNode(this.mappingStatus[params.value])
                  );
                } else {
                  const iconElement = document.createElement('span');
                  element.appendChild(
                    document.createTextNode(this.mappingStatus[params.value])
                  );
                }
                return element;
              },
              cellStyle: {
                ...this.cellStyle,
              },
            });
            this.gridApi.setColumnDefs(this.setColumn);
          } else {
            this.setColumn[5].children.push({
              headerName: `Cả năm ( ${this.schoolInfo.schoolPackage.name} )`,
              headerTooltip: `Cả năm ( ${this.schoolInfo.schoolPackage.name} )`,
              field: 'statusFullYear',
              tooltipField: 'statusFullYearLabel',
              maxWidth: 140,
              minWidth: 140,
              headerClass: 'header-color',
              suppressMovable: true,
              cellRenderer: (params) => {
                const element = document.createElement('p');
                element.className = `package-status ${
                  this.mappingStyleStatus[params.value]
                }`;
                if (params.value !== 0) {
                  const iconElement = document.createElement('span');
                  iconElement.className = 'fas fa-circle ';
                  element.appendChild(iconElement);
                  element.appendChild(
                    document.createTextNode(this.mappingStatus[params.value])
                  );
                } else {
                  const iconElement = document.createElement('span');
                  element.appendChild(
                    document.createTextNode(this.mappingStatus[params.value])
                  );
                }
                return element;
              },
              cellStyle: {
                ...this.cellStyle,
              },
            });
            this.gridApi.setColumnDefs(this.setColumn);
          }
          // this.gridApi.setColumnDefs(this.setColumn);
        }
        this.setColumn.push({
          headerName: 'Lịch sử đăng ký',
          headerClass: 'custom-merge-header1',
          headerTooltip: 'Lịch sử đăng ký',
          maxWidth: 130,
          minWidth: 130,
          suppressMovable: true,
          cellStyle: {
            ...this.cellStyle,
            cursor: 'pointer',
          },
          cellRendererFramework: HistoryContactPackageComponent,
        });

        // this.setColumn.push({
        //   headerName: '',
        //   headerClass: 'custom-merge-header1',
        //   field: '',
        //   cellRendererFramework: ActionManageContactComponent,
        //   minWidth: 48,
        //   maxWidth: 48,
        //   suppressMovable: true,
        //   cellStyle: {
        //     'align-items': 'center',
        //     display: 'flex',
        //   },
        // });

        this.gridApi.setColumnDefs(this.setColumn);
        console.log('setColumn2', this.setColumn);
        this.changeDetectorRef.detectChanges();
      });


    this.manageContactService
      .getSemesterByYear(this.currentYear)
      .subscribe((listSemesters) => {
        this.semestersInCurrentYear = listSemesters;
        this.changeDetectorRef.detectChanges();
        // console.log('this.semestersInCurrentYear', this.semestersInCurrentYear);
      });
  }

  loadSemestersInNow() {

  }

  loadGradeLevel(): void {
    this.gradeLevelService
      .getGradeLevelOfSubject()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (getGradeLevelResponse) => {
          this.listGradeLevel = getGradeLevelResponse;
          this.selectedGradeLevelId = getGradeLevelResponse[0].id;
          console.log({listGradeLevel: this.listGradeLevel});
          this.changeDetectorRef.detectChanges();
          this.loadClassRoom();
        },
        error: (res) => {
          alert(res);
        },
      });
  }

  onChangeGradeLevel(gradeLevelId) {
    this.selectedGradeLevelId = gradeLevelId;
    this.loadClassRoom();
  }

  loadClassRoom(): void {
    this.rowData = undefined;
    this.selectedClassId = -1;
    this.classRoomName = undefined;
    this._year = undefined;
    this.listClass = [];
    if (Boolean(this.selectedGradeLevelId)) {
      const query: object = {
        gradeLevel: this.selectedGradeLevelId,
        years: this.currentYear,
      };
      console.log('id khoi', this.selectedGradeLevelId)
      this.classRoomService
        .findByGradeLevelAndYear(query)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (getClassesResponse) => {
            if (getClassesResponse.status !== 'OK') {
              // alert(getClassesResponse.message);
              return;
            }

            this.listClass = getClassesResponse.data.map((_class) => ({
              id: _class.id,
              name: `${_class.code} - ${_class.name}`,
              code: _class.code,
            }));
            this.selectedClassId = getClassesResponse.data[0].id;

            if (this.selectedClassId !== -1) {
              this.listClass.forEach(item => {
                if (item.id === this.selectedClassId) {
                  const name = item.name.split('-', 2);
                  this.classRoomName = name[1];
                  this._year = '(Năm học: ' + this.currentYear + ')';
                }
              })
            }


            console.log(`list class`, getClassesResponse);
            this.changeDetectorRef.detectChanges();
            this.findListContacts(1);
          },
          // error: (res) => {
          //   alert(res);
          // },
        });
    }
  }

  onChangeClass(classId) {
    this.selectedClassId = classId;
    this.classRoomName = undefined;
    this._year = undefined;
    if (this.selectedClassId !== -1) {
      this.listClass.forEach(item => {
        if (item.id === this.selectedClassId) {
          const name = item.name.split('-', 2);
          console.log('name', name);
          this.classRoomName = name[1];
          this._year = '(Năm học: ' + this.currentYear + ')';
        }
      })
    }
    this.findListContacts(1);
  }

  findListContacts(page: number) {
    this.selectedStudents = [];
    this.currentPage = page;

    // const dataSearch = {
    //   // semester: this.semesterValue,
    //   gradeLevelId: this.selectedGradeLevelId,
    //   classRoomId: this.selectedClassId,
    //   status: this.selectedStatusId,
    //   student: this.formSearch.get('studentName').value.trim(),
    //   years: this.currentYear,
    // };
    // const dataSearch = {};
    const dataSearch: any = {};
    dataSearch.gradeLevelId = this.selectedGradeLevelId,
      dataSearch.classRoomId = this.selectedClassId,
      dataSearch.status = this.selectedStatusId,
      dataSearch.student = this.formSearch.get('studentName').value.trim(),
      dataSearch.years = this.currentYear;
    dataSearch.page = 1;
    dataSearch.pageSize = this.perPage;

    if (this.selectedStatusId !== null) {
      dataSearch.semester = this.semesterValue;
    }
    ;
    this.dataSearch = dataSearch;

    console.log('dataSearch', dataSearch);
    this.gridApi.showLoadingOverlay();
    this.manageContactService
      .doSearchContact(dataSearch)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (searchContactResponse) => {
          console.log(`searchContactResponse`, searchContactResponse);

          const {contactResultDTOS: contacts, totalRecord: totalElements} =
            searchContactResponse;
          console.log('find teaching assignment', {contacts});

          if (totalElements > 0) {
            this.total = totalElements;
            this.totalPage = Math.ceil(this.total / this.perPage);
            this.rangeWithDots = this.commonService.pagination(
              this.currentPage,
              this.totalPage
            );
            this.first = this.perPage * (this.currentPage - 1) + 1;
            this.last = this.first + contacts.length - 1;

            this.rowData = contacts.map((contact, _index) => {
              const singleRowData = {
                index: this.first + _index,
                id: contact.id,
                studentCode: contact.code,
                studentName: contact.fullName,
                className: contact.className,
                parentName: contact.parents,
                relation: contact.relationship,
                relationLabel: this.mappingRelationships[+contact.relationship],
                phoneNumber: contact.phone,
                packageContact: contact.namePackages || '-',

                status1: contact.status1 || 0,
                statusLabel1: this.mappingStatus[contact.status1 || 0],
                status2: contact.status2 || 0,
                statusLabel2: this.mappingStatus[contact.status2 || 0],
                status3: contact.status3 || 0,
                statusLabel3: this.mappingStatus[contact.status3 || 0],
                status4: contact.status4 || 0,
                statusLabel4: this.mappingStatus[contact.status4 || 0],
                statusFullYear: contact.statusFullYear || 0,
                statusFullYearLabel: this.mappingStatus[contact.statusFullYear || 0],

                currentYear: this.currentYear,

                semester: contact.semester || 0,
                duration: this.mappingDurations[contact.semester || 0],
              };

              return singleRowData;
            });
          } else {
            this.total = 0;
            this.rangeWithDots = [];
            this.first = 0;
            this.last = 0;
            this.rowData = [];
          }

          console.log(`this.rowData`, this.rowData);
          this.gridApi.setRowData(this.rowData);
          this.gridApi.sizeColumnsToFit();
          this.gridApi.hideOverlay();
          this.changeDetectorRef.detectChanges();
        },
        error: (res) => {
          alert(res);
        },
      });
  }

  goToPage(page: number) {
    if (page !== this.currentPage && page >= 1 && page <= this.totalPage) {
      this.currentPage = page;
      this.findListContacts(page);
    }
  }

  exportData() {
    console.log('searchDataExport', this.dataSearch);

    this.manageContactService
      .export(this.dataSearch)
      .subscribe((responseMessage) => {
        const file = new Blob([responseMessage], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const fileURL = URL.createObjectURL(file);
        // window.open(fileURL, '_blank');
        const anchor = document.createElement('a');
        anchor.download = `DS_Solienlac_${moment()
          .format('DDMMYYYY')
          .toString()}`;
        anchor.href = fileURL;
        anchor.click();
      });
  }

  registerMultiPackage() {
    console.log('schoolInfo',this.schoolInfo.code);
    console.log(this.selectedStudents);
    if (
      this.selectedStudents.find(
        (student) => student.statusFullYear !== 0 && student.statusFullYear !== 3
      )
    ) {
      this.toastr.error('Học sinh đã đăng ký gói cước cho cả năm');
      return;
    }
    // const studentIds = this.selectedStudents.map((student) => student.id);
    this.openModalRegisterPackage(this.selectedStudents);
  }

  dataUpdate;

  // openModalRegisterPackage(studenIds, status) {
  openModalRegisterPackage(data: any) {
    this.dataUpdate = data;
    this.packageName = '';
    this.packageDescription = '';
    this.fromPackageDate = '';
    this.toPackageDate = '';

    // console.log('ssStorage', this.schoolInfo.schoolPackage);
    // this.loadCurrentYear();
    this.listSemesters = [];
    if (this.currentYearObj) {
      this.semesterAmount = this.currentYearObj.semesterAmount;
      for (let _i = 0; _i < this.semesterAmount; _i++) {
        this.listSemesters.push({
          id: _i + 1,
          name: `Học kỳ ${_i + 1}`,
        });
      }
      this.listSemesters.push({
        id: 5,
        name: 'Cả năm',
      });
    }

    this.selectedSemester = 5;
    const studentIds = [];
    this.selectedStudents.forEach(item=>{
      studentIds.push(item.id);
    })
    this.registerStudendIds = studentIds;
    // this.updateStatus = data[0].statusFullYear;

    console.log('currentYear', this.currentYear);
    this.packageName = this.schoolInfo.schoolPackage.name;
    this.packageCode = this.schoolInfo.schoolPackage.code;
    this.packageDescription = `Đơn giá: ${new Intl.NumberFormat(
      'de-DE'
    ).format(this.schoolInfo.schoolPackage.prices)} ${this.mappingUnits[this.schoolInfo.schoolPackage.unit]}/ ${
      this.schoolInfo.schoolPackage.quantitySms
    }SMS/ ${this.mappingDurations[this.selectedSemester]}`;
    this.fromPackageDate = moment(this.currentYearObj.fromDate).format(
      'DD/MM/YYYY'
    );
    this.toPackageDate = this.currentYearObj.toDate;
    this.semestersInCurrentYear.forEach(item => {
      if (item.toDate > this.toPackageDate) {
        this.toPackageDate = item.toDate;
      }
    })
    console.log('toDAte', this.toPackageDate);
    this.toPackageDate = moment(this.toPackageDate).format(
      'DD/MM/YYYY'
    );

    this.modalRef = this.modalService.show(
      this.registerPackageModal,
      Object.assign({}, {class: 'action-register-dialog-custom'})
    );
  }

  checkChonHocKy() {
    this.manageContactService.getSemesterByYearNow().subscribe(res => {
      console.log('res', res);
    })
  }

  onChangeSemester(semester) {

    this.packageName = '';
    this.packageDescription = '';
    this.fromPackageDate = '';
    this.toPackageDate = '';

    // this.checkChonHocKy();
    // this.schoolInfo.schoolPackage;

    this.selectedSemester = semester;

    console.log('this.selectedSemester', this.selectedSemester);

    if (this.selectedSemester === 5) {
      this.packageName = this.schoolInfo.schoolPackage.name;
      this.packageCode = this.schoolInfo.schoolPackage.code;
      this.packageDescription = `Đơn giá: ${new Intl.NumberFormat(
        'de-DE'
      ).format(this.schoolInfo.schoolPackage.prices)} ${this.mappingUnits[this.schoolInfo.schoolPackage.unit]}/ ${
        this.schoolInfo.schoolPackage.quantitySms
      }SMS/ ${this.mappingDurations[this.selectedSemester]}`;
      this.fromPackageDate = moment(this.currentYearObj.fromDate).format(
        'DD/MM/YYYY'
      );
      this.toPackageDate = this.currentYearObj.toDate;
      this.semestersInCurrentYear.forEach(item => {
        if (item.toDate > this.toPackageDate) {
          this.toPackageDate = item.toDate;
        }
      })
      console.log('toDAte', this.toPackageDate);
      this.toPackageDate = moment(this.toPackageDate).format(
        'DD/MM/YYYY'
      );
    } else {
      let count = 0;
      if (semester === 1) {
        for (let i = 0; i < this.dataUpdate.length; i++) {
          if (this.dataUpdate[i].status1 === 1 || this.dataUpdate[i].status1 === 2) {
            count++;
          }
        }}
      if (semester === 2) {
          for (let i = 0; i < this.dataUpdate.length; i++) {
            if (this.dataUpdate[i].status2 === 1 || this.dataUpdate[i].status2 === 2) {
              count++;
            }
          }}
      if (semester === 3) {
        for (let i = 0; i < this.dataUpdate.length; i++) {
          if (this.dataUpdate[i].status3 === 1 || this.dataUpdate[i].status3 === 2) {
            count++;
          }
        }}
      if (semester === 4) {
        for (let i = 0; i < this.dataUpdate.length; i++) {
          if (this.dataUpdate[i].status4 === 1 || this.dataUpdate[i].status4 === 2) {
            count++;
          }
        }}
      if(count !==0){
        if(this.dataUpdate.length===1){
          this.toastr.error('Học kỳ đã được đăng ký/kích hoạt');
        }
        else {
          this.toastr.error('Có '+count+ '/'+ this.dataUpdate.length +' học sinh đã đăng ký/kích hoạt cho học kỳ đã chọn');
        }
        this.selectedSemester = 5;
        this.changeDetectorRef.detectChanges();
        return;
      }

          const childPackage = this.schoolInfo.schoolPackage.childPackage;
          let k = 0;
          console.log('childPackage', childPackage);

          for (let i = 0; i < childPackage.length; i++) {
            if (childPackage[i].semesterApply === this.selectedSemester.toString()) {
              k++;
              break;
            }
          }
          console.log('k', k);

          if (k === 0) {
            for (let i = 0; i < childPackage.length; i++) {
              if (childPackage[i].typePackage === 0 && childPackage[i].primaryPackage === this.schoolInfo.schoolPackage.code
                && childPackage[i].quantitySemesterApply === this.currentYearObj.semesterAmount
                && (childPackage[i].semesterApply === null)
              ) {
                this.packageName = childPackage[i].name;
                this.packageCode = childPackage[i].code;
                this.packageDescription = `Đơn giá: ${new Intl.NumberFormat(
                  'de-DE'
                ).format(childPackage[i].prices)} ${this.mappingUnits[childPackage[i].unit]}/ ${
                  childPackage[i].quantitySms
                }SMS/ ${this.mappingDurations[this.selectedSemester]}`;
                this.fromPackageDate = moment(this.currentYearObj.fromDate).format(
                  'DD/MM/YYYY'
                );
                const selectedSemester = this.semestersInCurrentYear.find(
                  (_semester) => +_semester.semester === +this.selectedSemester
                );
                this.fromPackageDate = moment(selectedSemester.fromDate).format(
                  'DD/MM/YYYY'
                );
                this.toPackageDate = moment(selectedSemester.toDate).format(
                  'DD/MM/YYYY'
                );
                break;
              }
            }
          } else {
            for (let i = 0; i < childPackage.length; i++) {
              if (childPackage[i].typePackage === 0 && childPackage[i].primaryPackage === this.schoolInfo.schoolPackage.code
                && childPackage[i].quantitySemesterApply === this.currentYearObj.semesterAmount
                && (childPackage[i].semesterApply === this.selectedSemester.toString())
              ) {
                this.packageName = childPackage[i].name;
                this.packageCode = childPackage[i].code;
                this.packageDescription = `Đơn giá: ${new Intl.NumberFormat(
                  'de-DE'
                ).format(childPackage[i].prices)} ${this.mappingUnits[childPackage[i].unit]}/ ${
                  childPackage[i].quantitySms
                }SMS/ ${this.mappingDurations[this.selectedSemester]}`;
                this.fromPackageDate = moment(this.currentYearObj.fromDate).format(
                  'DD/MM/YYYY'
                );
                const selectedSemester = this.semestersInCurrentYear.find(
                  (_semester) => +_semester.semester === +this.selectedSemester
                );
                this.fromPackageDate = moment(selectedSemester.fromDate).format(
                  'DD/MM/YYYY'
                );
                this.toPackageDate = moment(selectedSemester.toDate).format(
                  'DD/MM/YYYY'
                );
                break;
              }
            }
          }
        }
      }


      updateRegisterPackage()
      {
        const dataUpdate: any = {};
        dataUpdate.dataPackage = this.packageCode;
        dataUpdate.semester = this.selectedSemester;
        dataUpdate.classRoomId = this.selectedClassId;
        dataUpdate.shoolYear = this.currentYear;
        // dataUpdate.schoolCode = this.SCHOOL_CODE;
        dataUpdate.schoolCode = this.schoolInfo.code;
        dataUpdate.listStudentId = this.registerStudendIds;

        console.log('dataUpdate', dataUpdate);
        this.manageContactService
          .registerPackage(dataUpdate)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: (responseAPI: any) => {
              console.log('responseAPI', responseAPI);
              if (responseAPI.status === 'OK') {
                this.toastr.success(responseAPI.message);
                this.modalRef.hide();

                this.findListContacts(this.currentPage);
              } else if (responseAPI.status === 'BAD_REQUEST') {
                console.log(responseAPI.message);
                this.toastr.error(responseAPI.message);
              }
            },
            error: (res) => {
              alert(res);
            },
          });
      }

      changeStatus()
      {
        if (this.selectedStatusId === null) {
          this.booleanSemester = true;
        } else {
          this.booleanSemester = false;
        }

        console.log('selectedStatusId', this.selectedStatusId);
      }

  listSemesterRegistered = [];
  selectedSemesterRegistered;
  openModalDelete(template1: TemplateRef<any>) {

    console.log(this.selectedStudents);

    this.listSemesterRegistered = [];
    if (this.currentYearObj) {
      this.semesterAmount = this.currentYearObj.semesterAmount;

      const listChildPackage = this.schoolInfo.schoolPackage.childPackage;
      const listDataPackageOfSemester = [];
      console.log('listChildPackage',listChildPackage);

      for (let j = 0; j < this.semesterAmount; j++){
        let count1 =0;
        for(let q = 0 ; q<listChildPackage.length; q++){
          if(listChildPackage[q].typePackage ===0 &&
            listChildPackage[q].primaryPackage === this.schoolInfo.schoolPackage.code &&
            listChildPackage[q].quantitySemesterApply === this.semesterAmount &&
            listChildPackage[q].semesterApply === (q+1).toString()
          ){
            count1++;
            listDataPackageOfSemester.push({
              id:q+1,
              namePackage : listChildPackage[q].name
            })
          }
        }
        if(count1 ===0){
          for(let q = 0 ; q<listChildPackage.length; q++){
            if(listChildPackage[q].typePackage ===0 &&
              listChildPackage[q].primaryPackage === this.schoolInfo.schoolPackage.code &&
              listChildPackage[q].quantitySemesterApply === this.semesterAmount &&
              listChildPackage[q].semesterApply === null
            ){
              listDataPackageOfSemester.push({
                id:q+1,
                namePackage : listChildPackage[q].name
              })
              break;
            }
          }
        }
      }

      for (let _i = 0; _i < this.semesterAmount; _i++) {
        if(_i ===0){
          if(this.selectedStudents[0].status1 === 1 || this.selectedStudents[0].status1 ===2)
            this.listSemesterRegistered.push({
              id: _i + 1,
              name: `Học kỳ ${_i + 1} ( ${listDataPackageOfSemester[_i].namePackage} )`,
            });
        }
        if(_i ===1){
          if(this.selectedStudents[0].status2 === 1 || this.selectedStudents[0].status2 ===2)
            this.listSemesterRegistered.push({
              id: _i + 1,
              name: `Học kỳ ${_i + 1} ( ${listDataPackageOfSemester[_i].namePackage} )`,
            });
        }

        if(_i ===2){
          if(this.selectedStudents[0].status3 === 1 || this.selectedStudents[0].status3 ===2)
            this.listSemesterRegistered.push({
              id: _i + 1,
              name: `Học kỳ ${_i + 1} ( ${listDataPackageOfSemester[_i].namePackage} )`,
            });
        }

        if(_i ===3){
          if(this.selectedStudents[0].status4 === 1 || this.selectedStudents[0].status4 ===2)
            this.listSemesterRegistered.push({
              id: _i + 1,
              name: `Học kỳ ${_i + 1} ( ${listDataPackageOfSemester[_i].namePackage} )`,
            });
        }
        }
      if(this.selectedStudents[0].statusFullYear ===1 || this.selectedStudents[0].statusFullYear ===2){
        this.listSemesterRegistered.push({
          id: 5,
          name: `Cả năm ( ${this.schoolInfo.schoolPackage.name} )`,
        });
      }
    }

    this.selectedSemesterRegistered = this.listSemesterRegistered[0].id;

    this.modalRef = this.modalService.show(
      template1,
      Object.assign({}, { class: 'action-contact-dialog-custom' })
    );
  }

  deteleContactPackage() {
    const dataDelete : any={};
    dataDelete.studentId= this.selectedStudents[0].id,
    dataDelete.shoolYear= this.currentYear,
    dataDelete.schoolCode =this.schoolInfo.code,
    dataDelete.semester = this.selectedSemesterRegistered;

    // status :
      console.log('dataDelete', dataDelete);
    this.manageContactService
      .deteleContactPackage(dataDelete)
      .subscribe((responseAPI) => {
        console.log('aaa', responseAPI);
        if (responseAPI.status === 'OK') {
          this.findListContacts(1);
          this.toastr.success(responseAPI.message);
          this.modalRef.hide();
        } else {
          this.toastr.error(responseAPI.message);
          this.modalRef.hide();
        }
      });
  }

}
