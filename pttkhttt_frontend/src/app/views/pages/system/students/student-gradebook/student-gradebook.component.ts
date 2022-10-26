import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ClassroomService} from 'src/app/core/service/service-model/classroom.service';
import {StudentsService} from 'src/app/core/service/service-model/students.service';
import {calculateFistLastPageTable, pagination, removeEmptyQuery} from 'src/app/helpers/utils';
import {PAGE_SIZE, TABLE_CELL_STYLE} from 'src/app/helpers/constants';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {InputScoreComponent} from './input-score/input-score.component';
import {InputRankComponent} from './input-rank/input-rank.component';
import {ActionEvaluateComponent} from './action-evaluate/action-evaluate.component';
import {HeaderCheckboxComponent} from './header-checkbox/header-checkbox.component';
import {CheckboxColumnComponent} from './checkbox-column/checkbox-column.component';
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import * as moment from "moment";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'kt-student-gradebook',
  templateUrl: './student-gradebook.component.html',
  styleUrls: ['./student-gradebook.component.scss']
})
export class StudentGradebookComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private classRoomService: ClassroomService,
    private studentService: StudentsService,
    private toaStr: ToastrService,
    private matDialog: MatDialog,
    private datePipe: DatePipe
  ) {
  }

  modalRef: BsModalRef;

  columnDefs = [];
  rowData = [];
  rowDataClone = [];
  semesters = [];
  semesterListDefaiuld;

  classRooms = [];
  subjects = [];
  lockTimes = [];
  checks = [];
  isShowButton = false;

  gridApi;
  gridColumnApi;
  headerHeight = 56;
  rowHeight = 50;
  totalPage;
  currentYear: any;

  currentSchoolYear;

  searchModel = {
    classCode: null,
    schoolYear: null,
    semester: null,
    subjectCode: null
  };

  title = {
    subjectName: null,
    className: null,
    semester: null,
  }

  lastSemester;
  notAllowUpdate;
  currentPage = 1;
  total = 0;
  first = 0;
  last = 0;
  rangeWithDots: number[];

  hide = true;

  KEY_LEFT = 37;
  KEY_UP = 38;
  KEY_RIGHT = 39;
  KEY_DOWN = 40;

  typeSubject;
  update = false;

  ngOnInit(): void {
    this.loadCurrentYear();

    // Save all record when evaluate record not save in database
    this.listenToSaveAllRecord();

    // When evaluate done must call doSearch
    this.listenIsEvaluateDone();

    this.checkBoxAllChange();
  }

  loadCurrentYear(): void {
    this.classRoomService.yearCurrent$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      if (res) {
        this.currentYear = res;
        this.searchModel.schoolYear = res;
        // Load class list
        this.loadClassRoom();
      }
    });
  }

  loadClassRoom(data?): void {
    const query =
      {
        years: this.currentYear
      };
    this.studentService.getAllClassRoom(query).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: res => {
        if (res && res.length > 0) {
          this.classRooms = res;
          this.searchModel.classCode = data ? data.code : res[0].code;
          this.title.className = data ? data.name : res[0].name;
          this.loadSubject();
          this.changeDetectorRef.detectChanges();
        }
      },
      error: res => {
        console.log(res);
      }
    });
  }

  loadSubject(): void {
    const query = {
      years: this.currentYear,
      classCode: this.searchModel.classCode
    };
    this.studentService.getAllSubject(query).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: res => {
        if (res && res.length > 0) {
          this.subjects = res;
          this.searchModel.subjectCode = res[0].code;
          this.title.subjectName = res[0].name;
          this.loadSemester(res[0]);
          this.changeDetectorRef.detectChanges();
        }
      },
      error: res => {
        console.log(res);
      }
    });
  }

  selectSubject(data) {
    console.log(data);
    let subjectSelected = {};
    this.subjects.forEach(item => {
      if (item.code === data.code) {
        subjectSelected = item;
      }
    });
    this.title.subjectName = data.name;
    this.searchModel.subjectCode = data.code;
    this.loadSemester(subjectSelected);
  }

  loadSemester(subject): void {
    let isFullYear = false;
    this.semesters = subject.schoolYears.map(e => {
      if (e.semester === 'Cả năm') {
        isFullYear = true;
        return {
          ...e,
          semesterDisplay: e.semester
        };
      } else {
        return {
          ...e,
          semesterDisplay: this.mapSemester(e.semester)
        };
      }
    });
    if (isFullYear) {
      this.lastSemester = this.semesters[this.semesters.length - 2];
    } else {
      this.lastSemester = this.semesters[this.semesters.length - 1];
    }
    console.log(this.lastSemester)
    this.searchModel.semester = subject.schoolYear.semester;
    this.title.semester = this.mapSemester(this.searchModel.semester);
    this.loadLockTime();
    this.doSearch(1);

    this.currentSchoolYear = subject.schoolYearCurrent;
    console.log(this.currentSchoolYear);
  }

  selectSemester(event) {
    this.searchModel.semester = event.semester;
    this.loadLockTime();
    this.doSearch(1);
  }

  loadLockTime(subject?: any): void {
    const query = this.searchModel.semester === 'Cả năm' ?
      {
        ...this.searchModel,
        semester: this.lastSemester.semester
      }
      :
      this.searchModel;
    this.studentService.getTimeLockPoint(query).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: res => {
        if (res && res.length > 0) {
          this.notAllowUpdate = true;
          this.lockTimes = res;
          res.forEach(lock => {
            if (lock.entryLockDate) {
              console.log(lock);
              const dateLock = this.datePipe.transform(lock.entryLockDate, 'yyyy/MM/dd');
              const today = this.datePipe.transform(new Date(), 'yyyy/MM/dd');
              if (today < dateLock) {
                this.notAllowUpdate = false;
              }
            } else {
              this.notAllowUpdate = false;
            }
          });
          this.changeDetectorRef.detectChanges();
        } else {
          this.notAllowUpdate = true;
          this.lockTimes = [];
        }
      },
      error: res => {
        console.log(res);
      }
    });
  }

  // =================================================TABLE============================================//
  doSearch(page: number): void {
    this.currentPage = page;
    this.hide = false;
    this.isShowButton = false;
    this.update = false;
    this.studentService.changeIsShowUpdateGradeBook(false);
    const search = this.searchModel.semester === 'Cả năm' ?
      {
        ...this.searchModel,
        semester: 0,
        page: this.currentPage,
        pageSize: PAGE_SIZE
      }
      :
      {
        ...this.searchModel,
        page: this.currentPage,
        pageSize: PAGE_SIZE
      };

    removeEmptyQuery(search);

    console.log({search});

    this.gridApi.showLoadingOverlay();

    this.studentService.getAllGradebook(search).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: res => {
        console.log(res);
        this.hide = true;
        this.checks = [];
        if (res.content?.length > 0 && res.content[0]?.listScore?.length > 0) {
          // Type score
          if (res.content[0].listScore[0].type === 0) {
            this.typeSubject = 0;
            res.content.forEach(element => {
              this.setDateLock(element);
              element.semesterNow = this.currentSchoolYear.semester;
              element.semesterSelected = this.searchModel.semester;
              element.checked = element.avgScore ? true : false;
              element.listScore.forEach((e, i) => {
                const score = 'score' + (i + 1);
                element[score] = e.value;
              });
              element.listScoreFormat = this.formatListScoreData(element.listScore)
                .map(o => {
                  return {
                    ...o,
                    scoreCode: o.options[0].scoreCode,
                  };
                });
              element.table = this.generateScores(element.listScoreFormat);
            });
            console.log('scores', res.content);
            this.generateColumn(res.content, 'score');
            this.rowData = res.content;
            this.autoCheckBoxHeader('score');
          }
          // Type rank
          else if(res.content[0].listScore[0].type === 1) {
            this.typeSubject = 1;
            res.content.forEach((element) => {
              this.setDateLock(element);
              element.listScore.forEach((e, i) => {
                const ranks = 'ranks' + i;
                const selected = 'selectList' + i;
                element[ranks] = e.value;
                element[selected] = e.selectedValue;
              });
              element.semesterNow = this.currentSchoolYear.semester;
              element.semesterSelected = this.searchModel.semester;
              element.listScoreFormat = this.formatListScoreData(element.listScore);
              element.table = this.generateRanks(element.listScoreFormat);
            });
            console.log('ranks', res.content);
            this.generateColumn(res.content, 'rank');
            res.content.map(item => {
              if (this.isCheckedRankScore(item)) {
                item.checked = true;
              } else {
                item.checked = false;
              }
            });
            this.rowData = res.content;
            this.autoCheckBoxHeader('rank');
          }
          this.total = res.totalElements;

          this.totalPage = Math.ceil(this.total / PAGE_SIZE);
          this.rangeWithDots = pagination(this.currentPage, this.totalPage);
          this.first = calculateFistLastPageTable(this.rowData, this.total, PAGE_SIZE, this.currentPage).first;
          this.last = calculateFistLastPageTable(this.rowData, this.total, PAGE_SIZE, this.currentPage).last;

          this.changeDetectorRef.detectChanges();
        } else {
          this.columnDefs = [];
          this.rowData = [];
          this.total = 0;
          this.changeDetectorRef.detectChanges();
        }
      },
      error: res => {
        this.hide = true;
        console.log(res);
      }
    });
  }

  formatListScoreData(listScore) {
    const grouped = Object.entries(
      listScore.reduce((acc, {times, scoreName, value, selectedValue, scoreCode}) => {
        if (!acc[scoreName]) {
          acc[scoreName] = [];
        }
        acc[scoreName].push({times, value, selectedValue, scoreCode});
        return acc;
      }, {})
    ).map(([label, options]) => ({label, options}));
    return grouped;
  }

  generateScores(data) {
    if (data && data.length > 0) {
      const result = data.map((element) => {
        return {
          headerName: element.label,
          scoreCode: element.scoreCode,
          children: element.options.map((e) => {
            return {
              headerName: e.times,
              score: e.value,
            };
          })
        };
      });
      return result;
    }
  }

  generateRanks(data) {
    if (data && data.length > 0) {
      const result = data.map((element) => {
        return {
          headerName: element.label,
          ranks: element.options[0].selectedValue || [],
          rankDescription: element.options[0].value
        };
      });
      return result;
    }
  }

  generateColumn(data, type: string) {
    this.columnDefs = [];
    let array1: any[] = [];
    let array2: any[] = [];
    let array3: any[] = [];

    let stt: any = {
      headerName: 'STT',
      headerTooltip: 'STT',
      lockPosition: true,
      initialPinned: 'left',
      valueGetter: param => {
        return param.node.rowIndex + (((this.currentPage - 1) * PAGE_SIZE) + 1);
      },
      minWidth: 60,
      maxWidth: 60,
      cellStyle: {...TABLE_CELL_STYLE, color: '#101840', 'margin-left': '5px'}
    };
    let codeStudent: any = {
      headerName: 'Mã HỌC SINH',
      headerTooltip: 'MÃ HỌC SINH',
      lockPosition: true,
      tooltipField: 'studentCode',
      field: 'studentCode',
      cellClass: 'lock-pinned',
      cellStyle: {...TABLE_CELL_STYLE, color: '#3366FF', display: 'block'},
      minWidth: 150,
    };
    let nameStudent: any = {
      headerName: 'HỌ VÀ TÊN',
      headerTooltip: 'HỌ VÀ TÊN',
      lockPosition: true,
      tooltipField: 'studentName',
      field: 'studentName',
      cellRendererFramework: ActionEvaluateComponent,
      cellClass: 'lock-pinned',
      cellStyle: {
        display: 'flex',
        displayce: 'nowrap',
        padding: '10px',
        height: '100%',
      },
      minWidth: 200,
    };

    if (type === 'score') {
      stt = {...stt, headerClass: 'custom-merge-header-stt'};
      codeStudent = {...codeStudent, headerClass: 'custom-merge-header'};
      nameStudent = {...nameStudent, headerClass: 'custom-merge-header'};
    }

    array1 = [...[stt], ...[codeStudent], ...[nameStudent]];

    if (type === 'score') {
      let i = 0;
      if (data[0] && data[0].table) {
        array2 = data[0]?.table.map(element => {

          let checkHasOneChild = false;
          data[0]?.confScoreDetailsList.forEach(item => {
            if (item.code === element.scoreCode && item.quantity === 1) {
              checkHasOneChild = true;
            }
          });

          return checkHasOneChild ?
            {
              headerName: element.headerName,
              headerTooltip: element.headerName,
              lockPosition: true,
              suppressMovable: true,
              headerClass: 'custom-merge-header',
              children: element.children.map(e => {
                i++;
                return {
                  headerName: 'Đ' + e.headerName,
                  headerTooltip: 'Đ' + e.headerName,
                  suppressMovable: true,
                  tooltipField: 'score' + i,
                  headerClass: 'hide-child-header',
                  cellRendererFramework: InputScoreComponent,
                  cellStyle: {...TABLE_CELL_STYLE, color: '#101840', 'justify-content': 'center'},
                  minWidth: 100,
                };
              }),
              minWidth: 200,
            }
            :
            {
              headerName: element.headerName,
              headerTooltip: element.headerName,
              lockPosition: true,
              suppressMovable: true,
              children: element.children.map(e => {
                i++;
                return {
                  headerName: 'Đ' + e.headerName,
                  headerTooltip: 'Đ' + e.headerName,
                  suppressMovable: true,
                  tooltipField: 'score' + i,
                  cellRendererFramework: InputScoreComponent,
                  cellStyle: {...TABLE_CELL_STYLE, color: '#101840'},
                  minWidth: 100,
                };
              }),
            };
        });
      }
      array3 = [
        {
          headerName: 'ĐIỂM TB',
          headerTooltip: 'ĐIỂM TB',
          lockPosition: true,
          suppressMovable: true,
          tooltipField: 'avgScore',
          pinned: 'right',
          cellRenderer: param => {
            if (param.data.avgScore !== null) {
              return param.data.avgScore;
            } else {
              return '-';
            }
          },
          field: 'avgScore',
          headerClass: 'custom-merge-header-stt',
          minWidth: 100,
          maxWidth: 100,
          cellStyle: {...TABLE_CELL_STYLE, color: '#3366FF'}
        },
        {
          lockPosition: true,
          suppressMovable: true,
          pinned: 'right',
          headerClass: 'custom-merge-header-stt',
          // cellRenderer: (params) => this.renderCheckboxCellScore(params),
          cellRendererFramework: CheckboxColumnComponent,
          headerComponentFramework: HeaderCheckboxComponent,
          maxWidth: 60,
          minWidth: 60,
          cellStyle: {...TABLE_CELL_STYLE, color: '#101840'},
        },
      ];
    } else {
      if (data[0] && data[0].table) {

        array2 = data[0]?.table.map((element, i) => {
          return {
            headerName: element.headerName,
            headerTooltip: element.headerName,
            lockPosition: true,
            suppressMovable: true,
            tooltipField: 'ranks' + i,
            cellRendererFramework: InputRankComponent,
            cellStyle: {...TABLE_CELL_STYLE, color: '#101840'},
            minWidth: 180,
          };
        });
      }
      array3 = [{
        lockPosition: true,
        suppressMovable: true,
        pinned: 'right',
        headerComponentFramework: HeaderCheckboxComponent,
        cellRendererFramework: CheckboxColumnComponent,
        minWidth: 100,
        maxWidth: 100,
        cellStyle: {...TABLE_CELL_STYLE, color: '#101840'}
      },];
    }
    this.columnDefs = array1;
    this.columnDefs.push(...array2);
    this.columnDefs.push(...array3);
  }

  // Set date lock
  setDateLock(row) {
    row.listScore.forEach(score => {
      this.lockTimes.forEach(lock => {
        if (lock.scoreCode === score.scoreCode) {
          score.dateLock = lock.entryLockDate;
        }
      });
    });
  }

  // =================================================END TABLE============================================//

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  gridSizeChanged(params): void {
    params.api.sizeColumnsToFit();
  }

  // paging
  page(page: number): void {
    this.doSearch(page);
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

  // ==================================== Export =============================================
  exportData() {
    this.searchModel = {...this.searchModel};
    removeEmptyQuery(this.searchModel);
    this.studentService.exportGradebooks(this.searchModel).subscribe(
      (responseMessage) => {
        const file = new Blob([responseMessage], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        const fileURL = URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = `DS_Sodiemmonhoc_${moment().format('DDMMYYYY').toString()}`;
        anchor.href = fileURL;
        anchor.click();
    });
  }

  // =================================================SAVE TABLE============================================//
  showUpdate() {
    this.isShowButton = !this.isShowButton;
    this.update = true;
    this.studentService.changeIsShowUpdateGradeBook(true);
  }

  hideButton() {
    this.isShowButton = !this.isShowButton;
    this.studentService.changeIsShowUpdateGradeBook(false);
    this.doSearch(1);
  }

  save(isEvaluate?) {
    this.rowDataClone = this.rowData;
    const body = this.searchModel.semester === 'Cả năm' ?
      {
        classCode: this.searchModel.classCode,
        schoolYear: this.searchModel.schoolYear,
        semester: 0,
        subjectCode: this.searchModel.subjectCode,
        subjectsDetails: this.formatSaveData(this.rowDataClone),
      }
      :
      {
        ...this.searchModel,
        subjectsDetails: this.formatSaveData(this.rowDataClone)
      };
    console.log(body);

    this.studentService.save(body).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: res => {
        if (!(res && isEvaluate)) {
          this.toaStr.success('Lưu thành công');
        }
        this.isShowButton = !this.isShowButton;
        this.doSearch(1);
      },
      error: res => {
        console.log(res);
      }
    });
  }

  // -=====================================Auto fill data anh check box=========================================
  checkBoxAllChange() {
    this.studentService.checkBoxHeader$.subscribe(type => {
      this.autoCheckBoxHeader(type);
    });
  }

  autoCheckBoxHeader(type: string) {
    let isTrueAll = true;
    if (type === 'score') {
      this.rowData.forEach(item => {
        if (item.avgScore === null) {
          isTrueAll = false;
        }
      });
    } else if (type === 'rank') {
      this.rowData.forEach(item => {
        if (!this.isCheckedRankScore(item)) {
          isTrueAll = false;
        }
      });
    }
    if (isTrueAll) {
      this.studentService.changeIsSelectedALl(true);
    } else {
      this.studentService.changeIsSelectedALl(false);
    }
  }

  isCheckedRankScore(item) {
    let checked = true;
    if(item.listScore.length === 0) return false;
    item.listScore.forEach(e => {
      if (e.value === '') {
        checked = false;
      }
    });
    return checked;
  }

  // Format data to save
  formatSaveData(data) {
    let scores = [];
    let avgScores = [];

    let isRankSubject = false;
    let result = data.map(element => {
      if (element.listScore && element.listScore.length > 0 && element.listScore[0].type === 0) {
        return {
          ...element,
          listScore: element.listScore.map((e, i) => {
            const score = 'score' + (i + 1);
            return {
              ...e,
              value: element[score],
              value2: element[score] ? Number(element[score]) * Number(e.coeficient) : null
            };
          })
        };
      } else {
        isRankSubject = true;
        return {
          ...element,
          listScore: element.listScore.map((e, i) => {
            return {
              ...e,
              value: element[`ranks${i}`]
            };
          })
        };
      }
    });

    if (isRankSubject) {
      return result;
    }
    scores = result.map(element => {
      return element.listScore.map(e => {
        return {
          score: e.value2,
          coeficient: e.coeficient
        };
      });
    });

    avgScores = scores.map(element => {
      return this.sum(element, 'score') / this.sum(element, 'coeficient');
    });
    console.log(result);
    result = result.map((element, index) => {
      return (this.checkCalcAvgScore(element)) ? {
        ...element,
        avgScore: Math.round(+avgScores[index] * 100) / 100,
      } : {...element, avgScore: null};
    });

    return result;
  }

  sum(items, key) {
    const arr = items.filter(ele => ele.score !== null);
    return arr.reduce((a, b) => {
      return a + b[key];
    }, 0);
  };

  // Check calc avgScore
  checkCalcAvgScore(element) {
    let calcSum = true;
    element.confScoreDetailsList.forEach(item => {
      let i = 0;
      element.listScore.forEach(e => {
        if (item.code === e.scoreCode && e.value !== null && e.value !== '') {
          i++;
        }
      });
      if (i < item.minimumScore) calcSum = false;
    });
    return calcSum;
  }

  listenToSaveAllRecord() {
    this.studentService.dataRowEvaluate$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      if (data !== null) {
        this.save(true);
      }
    });
  }

  // =================================================SAVE TABLE============================================//

  // ==============================================Tab to next cell ==============================================

  myNavigation(params) {
    console.log('nav');
    console.log(params);
    const previousCell = params.previousCellPosition;
    const suggestedNextCell = params.nextCellDef;
    const lastRowIndex = previousCell.rowIndex;

    // const KEY_UP = 38;
    // const KEY_DOWN = 40;
    // const KEY_LEFT = 37;
    // const KEY_RIGHT = 39;
    // const KEY_TAB = 9;
    //
    // switch (params.key) {
    //   case KEY_DOWN:
    const nextRowIndex = params.backwards ? lastRowIndex - 1 : lastRowIndex + 1;
    return {
      rowIndex: nextRowIndex,
      column: previousCell.column,
      floating: previousCell.floating,
    };
    // case KEY_UP:
    //   previousCell = params.previousCellPosition;
    //   // set selected cell on current cell - 1
    //   this.gridApi.forEachNode((node) => {
    //     if (previousCell.rowIndex - 1 === node.rowIndex) {
    //       node.setSelected(true);
    //     }
    //   });
    //   return suggestedNextCell;
    // case KEY_LEFT:
    // case KEY_RIGHT:
    //   return suggestedNextCell;
    // case KEY_TAB:
    //   return suggestedNextCell;
    // default:
    //   throw new Error('this will never happen, navigation is always one of the 4 keys above');
    // }
  }

  onCellClicked(event) {
    // console.log(event);
  }

  // ======================================Evaluate==============================================
  listenIsEvaluateDone() {
    this.studentService.isEvaluated$.pipe(takeUntil(this.unsubscribe$)).subscribe(val => {
      if (val) {
        this.doSearch(1);
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  mapSemester(value) {
    if (!value) {
      return;
    }
    switch (value) {
      case '1':
        return 'Học kỳ I';
      case '2':
        return 'Học kỳ II';
      case '3':
        return 'Học kỳ III';
      case '4':
        return 'Học kỳ IV';
      case '5':
        return 'Học kỳ V';
      default:
        return value;
    }
  }

  showConfirmDialog() {
    const dataConfirm = {title: 'Xác nhận cập nhật thông tin', message: 'Bạn có chắc chắn muốn lưu thông tin vừa cập nhật?'};
    this.matDialog.open(ConfirmDialogComponent, {
      data: dataConfirm,
      disableClose: true,
      hasBackdrop: true,
      width: '420px'
    }).afterClosed().subscribe(res => {
      if (res.event === 'confirm') {
        this.save();
      }
    });
  }
}
