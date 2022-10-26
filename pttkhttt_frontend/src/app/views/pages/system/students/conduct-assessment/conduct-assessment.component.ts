import { DownloadButtonRenderComponent } from './../../official-letter-document/download-button-render/download-button-render.component';
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
import {ActionManageContactComponent} from '../../system-configuration/manage-contact/action-manage-contact/action-manage-contact.component';
import {HistoryContactPackageComponent} from '../../system-configuration/manage-contact/history-contact-package/history-contact-package.component';

import * as moment from 'moment';
import {EvaluateConductService} from '../../../../../core/service/service-model/evaluate-conduct.service';
import {EvaluationOfSubjectTeachersComponent} from './evaluation-of-subject-teachers/evaluation-of-subject-teachers.component';
import {AgCheckboxComponent} from './checkbox/ag-checkbox.component';
import {AgGridSelectComponent} from '../../subject-declaration/ag-grid-select/ag-grid-select.component';
import {AgSelectComponent} from './ag-select/ag-select.component';
import {AuthService} from '../../../../../core/auth/_services';
import {CheckboxHeaderComponent} from './checkbox-header/checkbox-header.component';
import {ConfirmSaveComponent} from '../../subject-declaration/confirm-save/confirm-save.component';

@Component({
  selector: 'kt-conduct-assessment',
  templateUrl: './conduct-assessment.component.html',
  styleUrls: ['./conduct-assessment.component.scss'],
})
export class ConductAssessmentComponent implements OnInit {
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
    private evaluateConductService: EvaluateConductService,
    private toast: ToastrService,
    private auth: AuthService,
    // private checkboxHeaderComponent : CheckboxHeaderComponent,
  ) {
    this.columnDefs = [
      {
        headerName: 'STT',
        headerTooltip: 'STT',
        valueGetter: param => {
          return param.node.rowIndex + (((this.currentPage - 1) * this.perPage) + 1)
        },
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
        resizable :true,
        cellStyle: {
          ...this.cellStyle,
          color: '#3366FF',
        },
        // cellRenderer: (params) => this.limitStringCellValue(params),
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
        resizable :true,
        cellStyle: {
          ...this.cellStyle,
          // 'text-align':'center',
        },
        // cellRenderer: (params) => this.limitStringCellValue(params),
      },
      {
        // headerName: 'Số ngày nghỉ phép',
        headerComponentParams:{
          template:'<span style="font-size:10px; color:#8f95b2">SỐ NGÀY NGHỈ <br/><br/> KHÔNG PHÉP</span>',
        },
        headerClass: 'custom-merge-header1',
        headerTooltip: 'Số ngày nghỉ không phép',
        field: 'totalRestNoReason',
        tooltipField: 'totalRestNoReason',
        minWidth: 90,
        maxWidth: 100,
        suppressMovable: true,
        resizable :true,
        cellStyle: {
          ...this.cellStyle,
          'text-align':'center',
        },
        // cellRenderer: (params) => this.limitStringCellValue(params),
      },
      {
        // headerName: 'Số ngày nghỉ có phép',
        headerComponentParams:{
               template:'<span style="font-size:10px; color:#8f95b2">SỐ NGÀY NGHỈ<br/><br/>CÓ PHÉP</span>',

             },
        headerClass: 'custom-merge-header1',
        headerTooltip: 'Số ngày nghỉ có phép',
        field: 'totalRestByReason',
        tooltipField: 'totalRestByReason',
        minWidth: 90,
        maxWidth: 100,
        suppressMovable: true,
        resizable :true,
        cellStyle: {
          ...this.cellStyle,
          'text-align':'center',
        },
        // cellRenderer: (params) => this.limitStringCellValue(params),
      },
      {
        headerName: 'Học lực',
        headerClass: 'custom-merge-header1',
        headerTooltip: 'Học lực',
        field: 'abilityName',
        tooltipField: 'abilityName',
        minWidth: 80,
        maxWidth: 80,
        suppressMovable: true,
        resizable :true,
        cellStyle: {
          ...this.cellStyle,
        },
        // cellRenderer: (params) => this.limitStringCellValue(params),
      },
      {
        headerComponentParams:{
          template:'<span style="font-size:10px; color:#8f95b2;">ĐÁNH GIÁ CỦA <br/><br/>GV BỘ MÔN</span>',
        },
        headerClass: 'custom-merge-header1',
        headerTooltip: 'Đánh giá của giáo viên bộ môn',
        maxWidth: 140,
        minWidth: 100,
        suppressMovable: true,
        resizable :true,
        cellStyle: {
          ...this.cellStyle,
          cursor: 'pointer',
        },
        cellRendererFramework: EvaluationOfSubjectTeachersComponent,
      },
      {
        headerName: 'HẠNH KIỂM',
        headerClass: 'header-color',
        children: [
          {
            headerName: 'Tốt',
            headerComponentFramework: CheckboxHeaderComponent,
            // headerCheckboxSelection: params => {
            //   const checkBox = document.createElement('input');
            //   checkBox.setAttribute('type', 'checkbox');
            //   checkBox.addEventListener('change', e => {
            //     if ((e.target as HTMLInputElement).value) {
            //       this.gridApi.selectAll();
            //     } else {
            //       this.gridApi.deselectAll();
            //     }
            //   });
            //   return checkBox;
            // },
            // headerComponentFramework : AgCheckboxComponent,
            // headerTooltip: 'Tốt',
            field: 'conductExcellent',
            minWidth: 85,
            maxWidth: 80,
            suppressMovable: true,
            headerClass: 'header-color',
            // headerClass:params =>
            //   (this.disableSelect === true)?{
            //       'pointer-events': 'auto',
            //       'background-color': '#EDEFF5',
            //     }:{
            //     'pointer-events': 'none',
            //     'background-color': '#EDEFF5',
            // },
            cellRendererFramework: AgCheckboxComponent,
            cellStyle: params =>
              (params.column.colId === 'conductExcellent' && this.disableSelect !== true) ?
                {
                  top: '12px',
                  'align-items': 'center',
                  'pointer-events': 'auto',
                  'margin-left': '25px'
                }
                : {
                  top: '12px',
                  'align-items': 'center',
                  'pointer-events': 'none',
                  'margin-left': '25px'
                }
          },
          {
            headerName: 'Khá',
            headerComponentFramework: CheckboxHeaderComponent,
            headerTooltip: 'Khá',
            field: 'conductGood',
            tooltipField: 'conductGood',
            maxWidth: 85,
            minWidth: 80,
            suppressMovable: true,
            headerClass: 'header-color',
            cellRendererFramework: AgCheckboxComponent,
            cellStyle: params =>
              params.column.colId === 'conductGood' && this.disableSelect !== true ?
                {
                  top: '12px',
                  'align-items': 'center',
                  'pointer-events': 'auto',
                  'margin-left': '25px'
                }
                : {
                  top: '12px',
                  'align-items': 'center',
                  'pointer-events': 'none',
                  'margin-left': '25px'
                }
          },
          {
            headerName: 'TB',
            headerComponentFramework: CheckboxHeaderComponent,
            headerTooltip: 'Trung bình',
            field: 'conductMedium',
            tooltipField: 'conductMedium',
            maxWidth: 85,
            minWidth: 80,
            suppressMovable: true,
            headerClass: 'header-color',
            cellRendererFramework: AgCheckboxComponent,
            cellStyle: params =>
              params.column.colId === 'conductMedium' && this.disableSelect !== true ?
                {
                  top: '12px',
                  'align-items': 'center',
                  'pointer-events': 'auto',
                  'margin-left': '25px'
                }
                : {
                  top: '12px',
                  'align-items': 'center',
                  'pointer-events': 'none',
                  'margin-left': '25px'
                }
          },
          {
            headerName: 'Yếu',
            headerComponentFramework: CheckboxHeaderComponent,
            headerTooltip: 'Yếu',
            field: 'conductWeak',
            tooltipField: 'conductWeak',
            maxWidth: 85,
            minWidth: 80,
            suppressMovable: true,
            resizable :true,
            headerClass: 'header-color',
            cellRendererFramework: AgCheckboxComponent,
            cellStyle: params =>
              params.column.colId === 'conductWeak' && this.disableSelect !== true ?
                {
                  top: '12px',
                  'align-items': 'center',
                  'pointer-events': 'auto',
                  'margin-left': '25px'
                }
                : {
                  top: '12px',
                  'align-items': 'center',
                  'pointer-events': 'none',
                  'margin-left': '25px'
                }
          },
        ],
      },
      {
        headerName: 'Danh hiệu thi đua',
        headerClass: 'custom-merge-header1',
        headerTooltip: 'Danh hiệu thi đua',
        maxWidth: 233,
        minWidth: 200,
        resizable :true,
        field: 'competitionCode',
        suppressMovable: true,

        cellRendererFramework: AgSelectComponent,
        cellStyle: params =>
          params.column.colId === 'competitionCode' && this.disableSelect !== true ?
            {
              'align-items': 'center',
              'pointer-events': 'auto',
            } :
            {
              'align-items': 'center',
              'pointer-events': 'none',
            }
      },
    ];
    this.rowData1 = [];
    this.frameworkComponents = {
      buttonRenderer: DownloadButtonRenderComponent,
    };
  }

  disableSelect = true;
  unsubscribe$ = new Subject<void>();
  @ViewChild('registerPackageModal')
  public registerPackageModal: TemplateRef<any>;
  modalRef: BsModalRef;

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
  rowData1;
  ROW_HEIGHT = 60;
  HEADER_HEIGHT = 32;
  rowStyle;
  rowSelection = 'multiple';
  noRowsTemplate = 'Không có bản ghi nào';
  loadingTemplate = 'Đang tìm kiếm';
  frameworkComponents;
  cellStyle = {
    'font-weight': '500',
    'font-size': '12px',
    'align-items': 'center',

    color: '#101840',
    display: 'flex',
    top: '12px',
    'white-space': 'nowrap',
    'text-overflow': 'ellipsis',
    overflow: 'hidden',
  };

  mapSemester(value) {
    switch (value) {
      case '1':
        return 'Học kỳ I';
      case '2':
        return 'Học kỳ II';
      case '3':
        return 'Học kỳ III';
      case '4':
        return 'Học kỳ IV';
      case '0':
        return 'Cả năm';
      default:
        return value;
    }
  }
  selectedStudents = [];

  // search form
  dataSearch;
  formSearch: FormGroup;

  subscription: Subscription;

  classRoomName;
  _semester;
  _year;
  temporaryData = [];

  showPagination = true;
  // paging
  perPage = 10;
  currentPage = 1;
  first = 0;
  last = 0;
  total = 0;
  totalPage = 0;
  rangeWithDots = [];

  currentUser;

  showUpdate = true;
  showSave = false;
  showCancel = false;
  semesterValue;
  listClassRoom;
  classRoomId;

  currentYear;
  currentYearObj;
  semesterAmount;
  listSemesters = [];

  semestersInCurrentYear;

  listGradeLevel = [];

  listClass;
  selectedClassCode;

  errorMessages;
  packageName;


  // Custom 50 character
  // Custom tooltip for select


  limitStringCellValue = (params) => {
    const element = document.createElement('span');
    element.className = 'one-line-ellipsis w-100';
    element.appendChild(document.createTextNode(params.value));
    return element;
  };

  onSelectionChanged(event) {
    // console.log(event);
    const selectedNodes = event.api.getSelectedNodes();
    this.selectedStudents = selectedNodes.map((node) => ({
      id: node.data.id,
      status: node.data.status,
      semester: node.data.semester,
    }));
    // console.log('this.selectedStudents', this.selectedStudents);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    setTimeout(()=>{this.gridApi.sizeColumnsToFit()}, 50);
  }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
  }

  ngOnInit(): void {
    this.loadCurrentYear();
    this.changeDetectorRef.detectChanges();
    this.currentUser = this.auth.currentUserValue;
  }

  loadCurrentYear() {
    // console.log('year123111', this.currentYear);
    this.classRoomService.yearCurrent$.subscribe((currentYear) => {
      this.currentYear = currentYear;
      if (currentYear) {
        this.loadSemesters();
        // this.getClassroomByUserIdAndYears();
      }
    });
    this.changeDetectorRef.detectChanges();
  }

  loadSemesters() {
    const year = {
      years: this.currentYear
    };
    this.evaluateConductService
      .getSemesterByYear(year)
      .subscribe((listSemesters) => {
        // console.log('listSemeester',listSemesters);
        this.semestersInCurrentYear = listSemesters;
        listSemesters.forEach(item => {
          if (item.defaultValue === true) {
           this.semesterValue = item.value;
           console.log("Current Value"+ item.value);
          }
          item.name = this.mapSemester(item.value);
        })

        // this.loadClassRoom();
        this.getClassroomByUserIdAndYears();
        this.changeDetectorRef.detectChanges();
      });
    this.changeDetectorRef.detectChanges();
  }


  // get class room follow years and userid
  getClassroomByUserIdAndYears() {
    const obj: any = {
      userId: this.currentUser.id,
      years: this.currentYear
    }
    this.evaluateConductService.getClassroomFollowUserIdAndYears(obj).subscribe((res) => {
      console.log('resClass',res);
      this.listClass = res;
      this.selectedClassCode = res[0].value;
      this.loadData(1);
      for(let i=0; i<this.listClass.length; i++){
        if(this.selectedClassCode === this.listClass[i].value){
          this.classRoomName = this.listClass[i].name;
          for(let j = 0; j< this.semestersInCurrentYear.length; j++){
            if(this.semesterValue === this.semestersInCurrentYear[j].value){
              this._semester = this.semestersInCurrentYear[j].name;
             // this._semester = this.mapSemester(this.semesterValue);
              //console.log("Name of Semester"+this.mapSemester(this.semesterValue));
              break;
            }
          }
          break;
        }
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  loadClassRoom() {
    // this.selectedClassCode=-1;
    const query: object = {
      gradeLevel: 6,
      years: this.currentYear,
    };
    this.classRoomService.findByGradeLevelAndYear(query).subscribe(res => {
      if (res.status !== 'OK') {
        return;
      }

      this.listClass = res.data.map((_class) => ({
        id: _class.id,
        name: `${_class.code} - ${_class.name}`,
        code: _class.code,
      }));
      this.selectedClassCode = res.data[0].code;
      this.loadData(1);
      this.changeDetectorRef.detectChanges();
    })
  }

  loadData(page: number) {
      this.rowData1= undefined;
    this.currentPage = page;
      const query: object = {
        years: this.currentYear,
        semester: this.semesterValue,
        classCode: this.selectedClassCode,
        currentPage: page,
        pageSize: this.perPage,
      };
      console.log('querySearch', query);
      this.gridApi.showLoadingOverlay();
      this.evaluateConductService.searchEvaluate(query).pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (res) => {
            if(res !== null){
              console.log('resSearch', res);
              const {lstData: data, totalRecord: totalElements} = res;
              this.rowData1 = data.map((dt, _index)=>{

                const singleRowData = {
                  abilityCode: dt.abilityCode,
                  abilityName: dt.abilityName?dt.abilityName:'-',
                  academicAbility: dt.academicAbility,
                  assessStudentConductDetailsId: dt.assessStudentConductDetailsId,
                  className: dt.className,
                  competitionCode: dt.competitionCode,
                  competitionName: dt.competitionName,
                  conductCode: dt.conductCode,
                  conductExcellent: dt.conductExcellent,
                  conductGood: dt.conductGood,
                  conductMedium: dt.conductMedium,
                  conductName: dt.conductName,
                  conductWeak: dt.conductWeak,
                  evaluate: dt.evaluate,
                  // fieldErr: dt.fieldErr,
                  // messageErr: dt.messageErr,
                  // messageStr: dt.messageStr,
                  // recordNo: dt.recordNo,
                  studentCode: dt.studentCode,
                  studentName: dt.studentName,
                  titleCompete: dt.titleCompete,
                  totalRestByReason: dt.totalRestByReason,
                  totalRestNoReason: dt.totalRestNoReason,
                  currentYear: this.currentYear,
                  semester: this.semesterValue,
                  classCode: this.selectedClassCode,
                };
                return singleRowData;
              });

              if (totalElements > 0) {
                this.total = totalElements;
                this.totalPage = Math.ceil(this.total / this.perPage);
                this.rangeWithDots = this.commonService.pagination(
                  this.currentPage,
                  this.totalPage
                );
                this.first = this.perPage * (this.currentPage - 1) + 1;
                this.last = this.first + data.length - 1;

                // this.rowData1 = data;
                console.log('data',data);
                console.log('datagrid', this.rowData1);
              } else {
                this.total = 0;
                this.rangeWithDots = [];
                this.first = 0;
                this.last = 0;
                this.rowData1 = [];
              }
              this.gridApi.setRowData(this.rowData1);
              this.gridApi.sizeColumnsToFit();
              this.gridApi.hideOverlay();
              this.changeDetectorRef.detectChanges();
            }

          },
        });
  }

  clickUpdate() {
    // console.log('semester', this.semestersInCurrentYear);

    // this.temporaryData = [...this.rowData1];
    // Array.prototype.push.apply(this.temporaryData, this.rowData1);

    this.disableSelect = false;
    this.showUpdate = false;
    this.showSave = true;
    this.showCancel = true;

    // this.checkboxHeaderComponent.checkEnable();

    this.gridApi.setColumnDefs(this.columnDefs);
    this.gridApi.setRowData(this.rowData1);

    // this.checkboxHeaderComponent.checkEnable();

    // console.log('lan',this.rowData1);
    // console.log('lan',this.temporaryData);
  }

  clickCancel() {
    // this.rowData1 = this.temporaryData;
    // for(let i =0; i< this.rowData1.length; i++){
    //   this.rowData1[i].conductExcellent = this.temporaryData[i].conductExcellent;
    //   this.rowData1[i].conductGood = this.temporaryData[i].conductGood;
    //   this.rowData1[i].conductMedium = this.temporaryData[i].conductMedium;
    //   this.rowData1[i].conductWeak = this.temporaryData[i].conductWeak;
    // }

    this.showUpdate = true;
    this.disableSelect = true;
    this.showSave = false;
    this.showCancel = false;
    // this.changeDetectorRef.detectChanges();
    this.loadData(this.currentPage);
    // console.log('lan1',this.rowData1);
    // console.log('lan1',this.temporaryData);
    this.gridApi.setRowData(this.rowData1);
  }

  updateData() {
    // const lst = this.rowData1;
    const list = {
      years : this.currentYear,
      semester : this.semesterValue,
      classCode : this.selectedClassCode,
      evaluateConductDataDTOs: this.rowData1,
    }
    console.log('dataUpdate',list);
    const confirm = {
      title: 'XÁC NHẬN CẬP NHẬT THÔNG TIN',
      message: 'Bạn có chắc chắn muốn lưu thông tin vừa cập nhật?'
    };
    this.matDialog.open(ConfirmSaveComponent, {
      data: confirm,
      disableClose: true,
      hasBackdrop: true,
      width: '420px'
    }).afterClosed().subscribe(res => {
      if (res.event === 'confirm') {
        console.log('dataUpdate1',list);
        this.evaluateConductService.updateData(list).subscribe(rs => {
          console.log('rs',rs);
            if (rs.status === 'OK') {
              this.toast.success(rs.message);
              this.loadData(this.currentPage);
              this.showSave = false;
              this.showCancel = false;
              this.showUpdate = true;
              this.disableSelect = true;
              this.gridApi.setRowData(this.rowData1);
            } else {
              this.toast.error(rs.message);
            }
        })


        // alert('Đã hoạt động');
      }
    })
  }

  onChangeClass(classCode) {

    this.classRoomName = undefined;
    this._semester = undefined;

    for(let i=0; i<this.listClass.length; i++){
      if(this.selectedClassCode === this.listClass[i].value){
        this.classRoomName = this.listClass[i].name;
        for(let j = 0; j< this.semestersInCurrentYear.length; j++){
          if(this.semesterValue === this.semestersInCurrentYear[j].value){
            this._semester = this.semestersInCurrentYear[j].name;
            break;
          }
        }
        break;
      }
    }



    // this.selectedClassCode = classCode;
    // this.classRoomName = undefined;
    // this._year = undefined;
    // if(this.selectedClassId !== -1){
    //   this.listClass.forEach(item=>{
    //     if(item.id === this.selectedClassId){
    //       const name = item.name.split('-',2);
    //       console.log('name', name);
    //       this.classRoomName = name[1];
    //       this._year = '(Năm học: '+this.currentYear+')';
    //     }
    //   })
    // }
    this.loadData(1);
  }

  onChangeSemester(semesterValue){
    this.classRoomName = undefined;
    this._semester = undefined;

    for(let i=0; i<this.listClass.length; i++){
      if(this.selectedClassCode === this.listClass[i].value){
        this.classRoomName = this.listClass[i].name;
        for(let j = 0; j< this.semestersInCurrentYear.length; j++){
          if(this.semesterValue === this.semestersInCurrentYear[j].value){
            //this._semester = this.semestersInCurrentYear[j].name;
            this._semester = this.mapSemester(this.semesterValue);
            break;
          }
        }
        break;
      }
    }
    this.loadData(1);
  }

  goToPage(page: number) {
    if (page !== this.currentPage && page >= 1 && page <= this.totalPage) {
      this.currentPage = page;
      this.loadData(page);
    }
  }

  selectAll(params){
    // console.log('gridData',this.gridApi);
    // console.log('rowdata',this.rowData1);
    // console.log('params',params);
    // console.log('col')
    this.rowData1.forEach(item=>{
      if (params.column.colDef.field === 'conductExcellent') {
        if (params.value === true) {
          item.conductExcellent = true;
          item.conductCode = 'excellent';
          item.conductGood = false;
          item.conductMedium = false;
          item.conductWeak = false;
        } else {
          item.conductExcellent = false;
          item.conductCode = '';
        }
      }

      if (params.column.colDef.field === 'conductGood') {
        if (params.value === true) {
          item.conductExcellent = false;
          item.conductGood = true;
          item.conductCode = 'good';
          item.conductMedium = false;
          item.conductWeak = false;
        } else {
          item.conductGood = false;
          item.conductCode = '';
        }
      }

      if (params.column.colDef.field === 'conductMedium') {
        if (params.value === true) {
          item.conductExcellent = false;
          item.conductGood = false;
          item.conductMedium = true;
          item.conductCode = 'medium';
          item.conductWeak = false;
        } else {
          item.conductMedium = false;
          item.conductCode = '';
        }
      }

      if (params.column.colDef.field === 'conductWeak') {
        if (params.value === true) {
          item.conductExcellent = false;
          item.conductGood = false;
          item.conductMedium = false;
          item.conductWeak = true;
          item.conductCode = 'weak';
        } else {
          item.conductWeak = false;
          item.conductCode = '';
        }
      }
    })
    // this.gridApi.setRowData(this.rowData1);
    // this.gridApi.setHeader(this.columnDefs);
  }

  dataGrid1(){
    return this.rowData1;
  }


}
