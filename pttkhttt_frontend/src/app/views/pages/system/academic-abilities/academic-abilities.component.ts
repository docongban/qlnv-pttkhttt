import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ClassroomService} from '../../../../core/service/service-model/classroom.service';
import {FormBuilder} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {AcademicAbilitiesService} from "./academic-abilities.service";
import {ConfirmSaveComponent} from "./confirm-save/confirm-save.component";
import {ToastrService} from "ngx-toastr";
import {AgGridSelectComponent} from "./ag-grid-select/ag-grid-select.component";
import {CommonServiceService} from "../../../../core/service/utils/common-service.service";
import {Subscription} from "rxjs";
import {AuthService} from "../../../../core/auth/_services";
import { environment } from "../../../../../environments/environment"
@Component({
  selector: 'attendance-student',
  templateUrl: './academic-abilities.component.html',
  styleUrls: ['./academic-abilities.component.scss']
})
export class AcademicAbilitiesComponent implements OnInit, AfterViewInit {

  scoreText = [
    {value: 'CT', color: '#D14343;'},
    {value: 'MG', color: '#52BD94;'},
    {value: 'Đạt', color: '#52BD94;'},
    {value: 'Không đạt', color: '#D14343;'},
  ]
  defaultColDef;
  subscription: Subscription;
  semester;
  semesterName = 'a';
  dataSemester;
  month;
  dataClassRoom;
  classRoom;
  schoolYear;
  rowSelect;
  currentUser;
  formSearch: any = {};
  rowData = [];
  headerData;
  data;
  currentPage = 1;
  pageSize = 10;
  gridApi;
  headerHeight = 50;
  rowHeight = 56;
  gridColumnApi;
  cacheBlockSize = 10;
  setColumn;
  noRowsTemplate = 'Không có bản ghi nào';
  showSave = false;
  showCancel = false;
  disableStatus = true;
  disableSearch = false;
  showUpdate = true;
  first = 1;
  last = 10;
  total = 0;
  totalPage = 0;
  rangeWithDots = [];
  dataAbility;
  columnDefs: any
  ROLE_PARAM = environment.ROLE
  isDisabled: boolean = false
  hasAuth: boolean = true
  currentSemester

  constructor(private attendanceStudentService: AcademicAbilitiesService,
              private fb: FormBuilder,
              private matDialog: MatDialog,
              private toast: ToastrService,
              private commonService: CommonServiceService,
              private changeDetectorRef: ChangeDetectorRef,
              private classRoomService: ClassroomService,
              private academicAbilitiesService: AcademicAbilitiesService,
              private auth: AuthService) {
  }

  ngOnInit(): void {
    this.currentUser = this.auth.currentUserValue;
    this.checkAuthorities()
    this.validateButtonUpdate()
    this.loadCurrentYear();
    this.getAbility();
  }

  loadCurrentYear(): void {
    this.subscription = this.classRoomService.yearCurrent$.subscribe(
      (currentYear) => {
        this.schoolYear = currentYear;
        if (currentYear !== '') {
          if (this.hasAuth) {
            this.getClassRoom();
          }
          this.getSemester();
        }
      }
    );

  }

  goToPage(page: number) {
    if (page !== this.currentPage && page >= 1 && page <= this.totalPage) {
      this.currentPage = page;
      this.changeDetectorRef.detectChanges();
      this.search(page);
    }
  }

  createHeaderStart() {
    this.columnDefs = [
      {
        headerName: 'STT',
        headerClass:'custom-merge-header-as',
        field: 'no',
        valueGetter: param => {
          return param.node.rowIndex + (((this.currentPage - 1) * this.pageSize) + 1)
        },
        minWidth: 48,
        maxWidth: 48,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          top: '15px',
          color: '#101840',
        },
        suppressMovable: true,
        pinned: 'left'
  
      },
      {
        headerName: 'MÃ HỌC SINH',
        headerClass:'custom-merge-header-as',
        field: 'code',
        suppressNavigable: true,
        minWidth: 100,
        maxWidth: 100,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#3366FF',
          // display: 'flex',
          top: '15px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          'overflow': 'hidden',
        },
        tooltipField: 'code',
        suppressMovable: true,
        pinned: 'left'
      },
      {
        headerName: 'TÊN HỌC SINH',
        headerClass:'custom-merge-header-as',
        field: 'fullName',
        suppressNavigable: true,
        minWidth: 140,
        maxWidth: 140,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'line-height': '20px',
          'align-items': 'center',
          color: '#101840',
          // display: 'flex',
          top: '15px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          'overflow': 'hidden',
        },
        tooltipField: 'fullName',
        suppressMovable: true,
        pinned: 'left'
      },
    ];
  }

  createHeaderCenter() {
    for(let i = 0; i < this.data.header.length; i++){
      this.rowSelect= {
        headerName: `${this.data.header[i].name}`,
        field: `${this.data.header[i].name}`,
        headerTooltip: `${this.data.header[i].name}`,
        children: [{
          headerName: `${this.data.header[i].coefficient == 'NX'? 'N.XÉT' : this.data.header[i].coefficient}`,
          headerClass: 'custom-merge-header-academic',
          headerTooltip: `${this.data.header[i].coefficient == 'NX'? 'N.XÉT' : this.data.header[i].coefficient}`,
          valueGetter: params => {
            params.api.dataAbility = this.dataAbility;
            const dto = params.data.gradebookSubjectsDetailsDTOS[i]
            const score = dto != undefined ? dto.avgScore : ''
            return this.formatScore(score)
          },
          minWidth: 110,
          cellStyle: params => {
            const baseCss = {
              'font-weight': '600',
              'font-size': '12px',
              'line-height': '20px',
              'align-items': 'center',
              'white-space': 'nowrap',
              'text-overflow': 'ellipsis',
              'overflow': 'hidden',
              'display': 'flex',
              'justify-content': 'center'
            }
            const dto = params.data.gradebookSubjectsDetailsDTOS[i]
            const score = dto != undefined ? dto.avgScore : ''
            const [obj] = this.scoreText.filter(elm => elm.value == score)
            const color = { color: obj != undefined ? obj.color : '#101840;'}
            return {...baseCss, ...color}
          },
          suppressMovable: true
        }],
      }
      this.columnDefs.push(this.rowSelect)
    };

  }

  createHeaderEnd() {
    const diemTb = {
      headerName: 'ĐIỂM TB',
      headerTooltip: 'ĐIỂM TB',
      children: [{
        headerName: `${this.semesterName}`,
        headerClass:'custom-merge-header-academic1',
        headerTooltip: `${this.semesterName}`,
        field: 'avgScoreYear',
        suppressNavigable: true,
        valueGetter: params => {
          return params.data.avgScoreYear != null ? params.data.avgScoreYear : '-'
        },
        minWidth: 100,
        maxWidth: 100,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'line-height': '20px',
          'align-items': 'center',
          color: '#101840',
          top: '15px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          'overflow': 'hidden',
          'text-align': 'center',
          'margin-left': '-10px'
        },
        tooltipField: 'avgScoreYear',
        suppressMovable: true,
        pinned: 'right'
      }]
    }

    const hocLuc = {
      headerName: 'HỌC LỰC',
      headerTooltip: 'HỌC LỰC',
      children: [{
        headerName: `${this.semesterName}`,
        headerClass:'custom-merge-header-academic1',
        headerTooltip: `${this.semesterName}`,
        field: 'academicAbility',
        minWidth: 150,
        maxWidth: 150,
        cellRendererFramework: AgGridSelectComponent,
        cellStyle: params => {
          const css = {
            'font-weight': '500',
            'font-size': '12px',
            'line-height': '20px',
            'align-items': 'center',
            'color': '#101840',
            'top': '15px',
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis',
            'overflow': 'hidden',
          }
          return params.data.avgScoreYear !== null &&  this.disableStatus !== true 
          ? {...css ,'pointer-events': 'auto'} 
          : { ...css, 'pointer-events': 'none', }
        },
        tooltipField: 'academicAbility',
        suppressMovable: true,
        pinned: 'right'
      }]
    }

    this.columnDefs.push(diemTb)
    this.columnDefs.push(hocLuc)
  }

  getGrid(){
    this.createHeaderStart()
    this.createHeaderCenter()
    this.createHeaderEnd()
  }

  search(page: number) {
    this.currentPage = page;
    const form = {
      data: {
        schoolYear: this.schoolYear,
        semester: this.semester,
        classRoomCode: this.classRoom
      },
      page: this.currentPage,
      pageSize : this.pageSize
    };
    this.academicAbilitiesService.search(form).subscribe(res => {
      this.data = res.data;
      this.rowData = res.data.body;
      this.headerData = res.data.header;
      this.first = 0
      this.last = 0
      this.total = 0
      if (res.total > 0) {
        this.total = res.total;
        this.totalPage = Math.ceil(this.total / this.pageSize);
        this.rangeWithDots = this.commonService.pagination(
          this.currentPage,
          this.totalPage
        );
        this.first = this.pageSize * (this.currentPage - 1) + 1;
        this.last = this.first + res.data.body.length - 1;
      }
      this.getGrid();
      this.changeDetectorRef.detectChanges();
      this.gridApi.sizeColumnsToFit();
    });
  }
  getAbility(){
    this.academicAbilitiesService.getAbility().subscribe(res => {
      this.dataAbility = res;
    });
  }
  getSemester() {
    const obj: any = {};
    obj.years = this.schoolYear;
    this.academicAbilitiesService.getSemesterByYear(this.schoolYear).subscribe(res => {
      if(res.length >0){

      this.dataSemester = res;
      // set default value semester
      res.forEach(item => {
        if (item.defaultValue) {
          this.currentSemester = item.value
          this.semester = item.value;
          this.semesterName = item.name;
        }
      })
      if (this.semester == null) {
        this.semester = res[0].value;
        this.semesterName= res[0].name;
      }

      }
      
      if (this.hasAuth) {
        this.search(1);
      }

      this.changeDetectorRef.detectChanges();
    });
  }

  updateData() {
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
      if (res.event == 'confirm') {
        this.academicAbilitiesService.updateData(this.rowData).subscribe(rs => {
          if (rs.status == 'OK') {
            this.toast.success('Cập nhật thành công');

          } else {
            this.toast.error('Cập nhật thất bại');
          }
          this.search(1);
        });
        this.showSave = false;
        this.showCancel = false;
        this.showUpdate = true;
        this.disableStatus = true;
        this.disableSearch = false;
      }

    });
  }
  clickUpdate() {
    this.showUpdate = false;
    this.showSave = true;
    this.showCancel = true;
    this.disableStatus = false;
    this.disableSearch = true;
    this.gridApi.setRowData(this.rowData);
    this.changeDetectorRef.detectChanges();
  }
  clickCancel() {
    this.showSave = false;
    this.showCancel = false;
    this.showUpdate = true;
    this.disableStatus = true;
    this.disableSearch = false;
    this.search(1);
    this.gridApi.setRowData(this.rowData);
    this.changeDetectorRef.detectChanges();
  }
  getClassRoom() {
    const obj: any = {};
    obj.userId = this.currentUser.id;
    obj.years = this.schoolYear;
    this.academicAbilitiesService.getClassroomByUserAndYear(obj).subscribe(res => {
      if(res.length > 0){
        this.dataClassRoom = res;
        this.classRoom = res[0].value;
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  selectMonth(event) {
    this.month = event.value;
    this.changeDetectorRef.detectChanges();
  }

  selectSemester(event) {
    this.semester = event.value;
    this.semesterName = event.value == 0 ? 'Cả năm' : event.name;
    this.search(1);
    this.validateButtonUpdate()
  }

  selectClass(event) {
    this.classRoom = event.value;
    this.search(1);
  }

  ngAfterViewInit() {
  }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
  }

  formatScore(score): string {
    if (isNaN(score)) {
      return score;
    }
    if ((score+'').length == 1) {
      return (score+'.00').substring(0,3)  
    }
    return (score+'.00').substring(0,4)
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.setRowData(this.rowData);
    params.api.sizeColumnsToFit();
  }

  checkAuthorities(): void {
    
    if (this.currentUser.authorities.includes(this.ROLE_PARAM.HT) ||
    this.currentUser.authorities.includes(this.ROLE_PARAM.ADMIN) ) {

      if (!this.currentUser.authorities.includes(this.ROLE_PARAM.GV_CN)) 
        this.hasAuth = false
    }

  }

  validateButtonUpdate(): void {
    if (this.semester  === this.currentSemester ||
      (this.semester === 0 && this.currentSemester === this.dataSemester[this.dataSemester - 2].value) 
      ) {this.isDisabled = false; return}
    
    this.isDisabled = true
  }


}
