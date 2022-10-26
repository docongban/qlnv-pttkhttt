import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UpdateScoreboardComponent} from './update-scoreboard/update-scoreboard.component';
import {MatDialog} from '@angular/material/dialog';
import {CreateScoreboardComponent} from './create-scoreboard/create-scoreboard.component';
import {SubjectService} from '../../../../../core/service/service-model/subject.service';
import {ConfScoreDetailsService} from '../../../../../core/service/service-model/conf-score-details.service';
import {ScoreBoardService} from 'src/app/core/service/service-model/score-board.service';
import {ToastrService} from 'ngx-toastr';
import {ClassroomService} from '../../../../../core/service/service-model/classroom.service';
import {GradeLevelService} from '../../../../../core/service/service-model/grade-level.service';
import {DatePipe, formatDate} from '@angular/common';
import {SchoolYearService} from '../../school-year/school-year.service';
import {AgGridCheckboxComponent} from '../../subject-declaration/ag-grid-checkbox/ag-grid-checkbox.component';
import {StudentsService} from "../../../../../core/service/service-model/students.service";
import {TooltipComponent} from "./tooltip/tooltip.component";

@Component({
  selector: 'kt-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit {
  disableStatus = true;
  gridApiLeft;
  gridApiRight;
  gridColumnApiLeft;
  gridColumnApiRight;
  rowData;
  headerHeight = 56;
  rowHeight = 50;
  opened = false;
  year;
  defaultDate = new Date().toISOString().slice(0,10);
  // tslint:disable-next-line:variable-name
  applyDate_ScoreSubject: any;
  listSubject: any = [];
  listGradeLevel: any = [];
  listSubjectLeft: any = [];
  listSubjectRight: any = [];
  defaultColDef;

  cellStyle = {
    'font-weight': '500',
    'line-height':'16px',
    'align-items': 'center',
    color: '#101840',
    'letter-spacing': '0.06em',
    display: 'flex',
    'font-family': 'Inter',
    'font-style': 'normal',
    'font-size': '12px',
    'white-space': 'nowrap',
    'text-overflow': 'ellipsis',
    overflow: 'hidden'
  }
  // Header tính theo điểm
  columnCalcuScore = [
    {
      headerName: 'STT',
      field: 'index',
      minWidth: 60,
      maxWidth: 60,
      height: 56,
      lockPosition: true,
      suppressMovable: true,
      cellStyle: {
        ...this.cellStyle,
        'text-align':'center',
        'padding-left': '15px'
      },
      valueGetter: 'node.rowIndex + 1'
    },
    {
      headerName: 'CỘT ĐIỂM',
      field: 'name',
      minWidth: 120,
      maxWidth: 120,
      height: 56,
      lockPosition: true,
      suppressMovable: true,
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
      },
      cellRendererFramework: TooltipComponent,
    },
    {
      headerName: 'HỆ SỐ',
      field: 'coefficient',
      minWidth: 80,
      maxWidth: 80,
      height: 56,
      lockPosition: true,
      suppressMovable: true,
      cellStyle: {
        ...this.cellStyle,
        'text-align':'center',
        padding: '16px 30px'
      }
    },
    {
      headerName: 'SỐ LƯỢNG',
      field: 'quantity',
      minWidth: 110,
      maxWidth: 110,
      height: 56,
      lockPosition: true,
      suppressMovable: true,
      cellStyle: {
        ...this.cellStyle,
        'text-align':'center',
        'padding-left': '33px'
      },
      editable: true},
    {
      headerName: 'SỐ ĐIỂM NHẬP TỐI THIỂU',
      field: 'minimumScore',
      minWidth: 186,
      maxWidth: 290,
      height: 56,
      lockPosition: true,
      suppressMovable: true,
      cellStyle: {
        ...this.cellStyle,
        'text-align':'center',
        'padding-left': '77px'
      }
    }
  ];
  // Header tính theo xếp loại
  columnLevelSubject = [
    {
      headerName: 'STT',
      minWidth: 60,
      maxWidth: 60,
      height: 56,
      field: 'index',
      lockPosition: true,
      suppressMovable: true,
      cellStyle: {
        ...this.cellStyle,
        'text-align':'center',
        'padding-left': '15px'
      },
      valueGetter: 'node.rowIndex + 1'
    },
    {
      headerName: 'CỘT XẾP LOẠI',
      minWidth: 150,
      maxWidth: 150,
      height: 56,
      field: 'name',
      lockPosition: true,
      suppressMovable: true,
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
      },
      cellRendererFramework: TooltipComponent,
    },
    {
      headerName: 'KIỂU CHỌN',
      minWidth: 110,
      maxWidth: 110,
      height: 56,
      field: 'typeChoose',
      lockPosition: true,
      suppressMovable: true,
      cellRendererFramework: AgGridCheckboxComponent,
      cellStyle: params =>
        params.column.colId === 'typeChoose' && this.disableStatus !== true ?{
          ...this.cellStyle,
          'pointer-events': 'none',
          'text-align':'center',
          'padding-left': '35px',
        }:{
          ...this.cellStyle,
          'pointer-events': 'none',
          'text-align':'center',
          'padding-left': '35px'
        }
    },
    {
      headerName: 'GIÁ TRỊ LỰA CHỌN',
      field: 'selectedValue',
      minWidth: 150,
      maxWidth: 360,
      height: 56,
      lockPosition: true,
      suppressMovable: true,
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
        display: 'webkit-box',
        'webkit-line-clamp': 1,
        'webkit-box-orient': 'vertical'
      },
      cellRendererFramework: TooltipComponent,
    }
  ];
  listConfGradingDetails: any[] = [];
  listConfScoreDetails: any[] = [];

  gradeLevel: any;
  subjectId: any;
  dateApply;
  subjectLeft: any;
  subjectRight: any;
  subjectIdLeft: any;
  subjectIdRight: any;
  showErr = false;
  messageErr;
  fromDate;
  toDate;
  KEYCODE_0 = 48
  KEYCODE_9 = 57

  quaCh;

  formDateSemesterByYear;

  semester;

  constructor(private dialog: MatDialog,
              private changeDetectorRef : ChangeDetectorRef,
              private subjectService: SubjectService,
              private scoreBoardService: ScoreBoardService,
              private confScoreDetailSerice: ConfScoreDetailsService,
              private toastr: ToastrService,
              private classromService: ClassroomService,
              private gradeLevelService: GradeLevelService,
              private schoolYearService: SchoolYearService,
              private datePipe: DatePipe,
              private studentService: StudentsService) {
  }

  ngOnInit(): void {
    this.getYear();
  }

  getYear(){
    this.classromService.yearCurrent$.subscribe(res=>{
      this.year = res;
      console.log(this.year);
      const today = new Date();
      this.dateApply = this.datePipe.transform(today, 'yyyy-MM-dd');
      this.getGradeLevel();

      this.changeDetectorRef.detectChanges();
      const toYear = res.slice(0,4);
      const formYear = res.slice(5,9);
      const yearNow = this.dateApply.slice(0,4);
      const todayNow = new Date();

      if(+yearNow >= +toYear && +yearNow <= +formYear){
        this.getDateToFrom(this.year);
        this.studentService.getAllSemester().subscribe(resSchool => {
          this.semester = resSchool.semesterCurrent.semester;
          this.dateApply = this.datePipe.transform(todayNow, 'yyyy-MM-dd');
        });
      } else{
        this.confScoreDetailSerice.getYear(res).subscribe(re=>{
          if(re.length === 0) return;
          this.dateApply = this.datePipe.transform(re[0].fromDate, 'yyyy-MM-dd');
          this.semester = re[0].semester;
          this.formDateSemesterByYear = this.datePipe.transform(re[0].fromDate, 'yyyy-MM-dd');
        })
      }
      this.showErr = false;
      this.messageErr = '';
    });
  }

  onSearch(){
    this.getGradeLevel();
  }
  onGridReadyLeft(params) {
    this.gridApiLeft = params.api;
    this.gridColumnApiLeft = params.columnApi;
    params.api.sizeColumnsToFit();
  }
  onGridReadyRight(params) {
    this.gridApiRight = params.api;
    this.gridColumnApiRight = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  getDateToFrom(year: any){
    let length;
    this.confScoreDetailSerice.getYear(year).subscribe(re=>{
      length = re.length;
      console.log(re)
      this.fromDate = this.datePipe.transform(re[0].fromDate, 'yyyy-MM-dd');
      this.toDate = this.datePipe.transform(re[length-1].toDate, 'yyyy-MM-dd');
    })
  }
  // Lấy dữ liệu khối
  getGradeLevel() {
    this.gradeLevelService.getGradeLevelOrderByName().subscribe(res => {
      this.listGradeLevel = res;
      this.gradeLevel = res[0].id;
      this.getListSubjectLeft(res[0].id);
      this.getListSubjectRight(res[0].id);
      this.changeDetectorRef.detectChanges();
    })
  }
  // List subject left
  getListSubjectLeft(gradeLevel: any){
    const subtype = 0;
    this.scoreBoardService.searchSubject(this.gradeLevel, subtype).subscribe(res => {
      this.subjectIdLeft = res[0]?.id;
      let list = [];
      res.forEach(item => {
        let customItem = {};
        customItem = {...item, name: item.code + ' - ' + item.name};
        list = [...list, customItem];
      });
      this.listSubjectLeft = list;
      if (this.subjectIdLeft !== undefined) {
        this.getDataGridLeft(this.gradeLevel, this.subjectIdLeft, this.dateApply, this.year);
      } else {
        this.listConfScoreDetails = [];
        this.gridApiLeft.setRowData(this.listConfScoreDetails);
      }
      this.changeDetectorRef.markForCheck();
    })
  }
  // List subject right
  getListSubjectRight(gradeLevel: any){
    const subtype = 1;
    this.scoreBoardService.searchSubject(this.gradeLevel, subtype).subscribe(res => {
      this.subjectIdRight = res[0]?.id;
      console.log(this.listSubject)
      let list = [];
      res.forEach(item => {
        let customItem = {};
        customItem = {...item, name: item.code + ' - ' + item.name};
        list = [...list, customItem];
      });
      this.listSubjectRight = list;
      if (this.subjectIdRight !== undefined) {
        this.getDataGridRight(this.gradeLevel, this.subjectIdRight, this.dateApply, this.year);
      } else {
        this.listConfGradingDetails = [];
        this.gridApiRight.setRowData(this.listConfGradingDetails);
      }
      this.changeDetectorRef.detectChanges();
    })
  }
  // Mở popup cập nhât
  openAddDialog(action: string) {
    const dataCLass: any = {};
    dataCLass.action = action;
    dataCLass.gradeLevel = this.gradeLevel;
    dataCLass.year = this.year;
    if(action === 'score'){
      this.confScoreDetailSerice.getConfScoreSubjectByIdAndYear(this.subjectIdLeft, this.year)
        .subscribe(re => {
        this.applyDate_ScoreSubject = re.applySate;
        dataCLass.subjectCode = re.subjectCode;
        console.log(this.applyDate_ScoreSubject);
      })
        dataCLass.listData = this.listConfScoreDetails;
        dataCLass.subjectId = this.subjectIdLeft;
    }else {
	    this.confScoreDetailSerice.getConfScoreSubjectByIdAndYear(this.subjectIdRight, this.year)
        .subscribe(re => {
        this.applyDate_ScoreSubject = re.applySate;
        dataCLass.subjectCode = re.subjectCode;
      })
      dataCLass.listData = this.listConfGradingDetails;
	    dataCLass.subjectId = this.subjectIdRight;
      // }
    }
    if(dataCLass !== null) {
      dataCLass.toDate = this.toDate;
      dataCLass.fromDate = this.fromDate;
      dataCLass.toDate = this.toDate;
      const toDate = new Date(this.toDate);
      dataCLass.semester = this.semester;
      this.dialog.open(UpdateScoreboardComponent, {
        data: dataCLass,
        disableClose: true,
        hasBackdrop: true,
        width: '778px',
        height: '669px',
      }).afterClosed().subscribe(res => {
        if (res.data === 'Thành công') {
          this.toastr.success('Cập nhật cấu hình thành công!');
          this.schoolYearService.getListSchoolYearHeader().subscribe(resAPI => {
            const yearNow = resAPI?.yearCurrent;
            if (yearNow === this.year) {
              const today = new Date();
              this.dateApply = this.datePipe.transform(today, 'yyyy-MM-dd');
            }else{
              this.dateApply = this.formDateSemesterByYear;
            }
            this.onSearch();
          });
        }
      });
    }
  }
  // Mở popup thêm mới
  createScore(): void {
    const dataCLass: any = {};
    dataCLass.year = this.year;
    dataCLass.toDate = this.toDate;
    this.dialog.open(CreateScoreboardComponent, {
      data: dataCLass,
      width: '770px',
      height: '669px',
      panelClass:'school-year'
    }).afterClosed().subscribe(res=>{
      if(res.data === 'Thành công'){
        this.toastr.success('Tạo mới cấu hình thành công!');
        this.schoolYearService.getListSchoolYearHeader().subscribe(resAPI => {
          const yearNow = resAPI?.yearCurrent;
          if (yearNow === this.year) {
            const today = new Date();
            this.dateApply = this.datePipe.transform(today, 'yyyy-MM-dd');
          }else{
            this.dateApply = this.formDateSemesterByYear;
          }
          this.onSearch();
        });
      }
    })
  }


  selectGrade($event) {
    console.log(this.gradeLevel);
    const data: any = {};
    data.grade_level = this.gradeLevel;
    data.id = this.subjectId;
    data.applyDate = this.dateApply;

    this.getListSubjectLeft(this.gradeLevel);
    this.getListSubjectRight(this.gradeLevel);
  }

  selectSubjectLeft() {
    this.getDataGridLeft(this.gradeLevel, this.subjectIdLeft, this.dateApply, this.year);
  }

  selectSubjectRight(){
    this.getDataGridRight(this.gradeLevel, this.subjectIdRight, this.dateApply, this.year);
  }
  getDataGridLeft(gradelevel: any, subjectId: any, dateApply: Date, year: any){
    this.scoreBoardService.loadGridViewLeft(this.gradeLevel, this.subjectIdLeft, this.dateApply, this.year).subscribe(resAPI => {
      console.log(resAPI);
      this.listConfScoreDetails = resAPI;
      this.gridApiLeft.setRowData(this.listConfScoreDetails);
      this.changeDetectorRef.detectChanges();
    });
  }
  getDataGridRight(gradelevel: any, subjectId: any, dateApply: Date, year: any){
    this.scoreBoardService.loadGridViewRight(this.gradeLevel, this.subjectIdRight, this.dateApply,this.year).subscribe(resAPI => {
      console.log(resAPI);
      this.listConfGradingDetails = resAPI;
      this.gridApiRight.setRowData(this.listConfGradingDetails);
      this.changeDetectorRef.detectChanges();
    });
  }

  // ============================Validate dateApply==========================================
  changeApplyDate($event) {
    this.quaCh = true;
    console.log(this.dateApply);
    if (this.dateApply === '') {
      this.showErr = true;
      this.messageErr = 'Vui lòng nhập ngày áp dụng!';
      this.quaCh = false;
      return;
    }
    // check them endDate
    const dateValue = new Date(this.dateApply);
    const fromDate = new Date(this.fromDate);
    const toDate = new Date(this.toDate);
    if (dateValue < fromDate || dateValue > toDate) {
      this.showErr = true;
      this.messageErr = 'Ngày áp dụng phải thuộc khoảng thời gian năm học đang cấu hình!';
      return;
    }
    this.showErr = false;
    this.getDataGridLeft(this.gradeLevel, this.subjectLeft, this.dateApply, this.year);
    this.getDataGridRight(this.gradeLevel, this.subjectRight, this.dateApply, this.year);
  }
  close(): void {
    this.opened = false;
  }

  checkApplyDate($event) {
    if (this.quaCh) {
      return;
    }
    console.log($event)
    if ($event.keyCode >= this.KEYCODE_0 && $event.keyCode <= this.KEYCODE_9) {
      console.log($event.keyCode)
      if (this.isEmpty(this.dateApply)) {
        this.showErr= true
        this.messageErr = 'Ngày áp dụng không hợp lệ'
        return
      }
      this.showErr = false;
    }
    if ($event.keyCode === 8) {
      this.showErr= true
      this.messageErr = 'Vui lòng nhập ngày áp dụng'
      return
    }
  }

  checkButtonUpdateLeft(): boolean{
    if(this.listConfScoreDetails.length === 0 || this.listConfScoreDetails === undefined){
      return false;
    }else{
      return true;
    }
  }
  checkButtonUpdateRight(): boolean{
    if(this.listConfGradingDetails.length === 0 || this.listConfGradingDetails === undefined){
      return false;
    }else
      return true;
  }

  isEmpty(data: any): boolean {
    return data === null || data === undefined || data === ''
  }


}
