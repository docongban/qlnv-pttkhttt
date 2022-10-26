import {Component, Inject, OnInit, Optional} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ConfigPointLockService} from '../../../../../core/service/service-model/config-point-lock.service';
import {SelectActionComponent} from "../../class-room/select-action/select-action.component";
import {DateLockPointComponent} from "../date-lock-point/date-lock-point.component";
import {ToastrService} from "ngx-toastr";
import {CellPosition} from "ag-grid-community";

interface TabToNextCellParams {
  // true if the Shift key is also down
  backwards: boolean;

  // true if the current cell is editing (you may want to skip cells that are not editable,
  // as the grid will enter the next cell in editing mode also if tabbing)
  editing: boolean;

  // the cell that currently has focus
  previousCellPosition: CellPosition;

  // the cell the grid would normally pick as the next cell for this navigation
  nextCellPosition: CellPosition;
}

@Component({
  selector: 'kt-add-config',
  templateUrl: './add-config.component.html',
  styleUrls: ['./add-config.component.scss']
})
export class AddConfigComponent implements OnInit {
  rowData;
  gridApi;
  gridColumnApi;
  headerHeight = 0;
  rowHeight=70;

  columnDefs = [
    {   headerName: 'STT',
      field: 'make',
      valueGetter:'node.rowIndex + 1',
      minWidth:60,
      maxWidth:60,
      cellStyle:{
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        top: '18px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
      },
      suppressMovable: true,
    },
    {   headerName: 'KIỂU MÔN',
      field: 'typeSubjectName',
      cellStyle:{
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        top: '18px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden'
      },
      minWidth:250,
      maxWidth: 250,
      tooltipField: 'typeSubjectName',
      suppressMovable: true,
    },
    { headerName: 'CỘT ĐIỂM',field:'scoreName',
      cellStyle:{
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        top: '18px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden'
      },
      minWidth:220,
      maxWidth: 220,
      tooltipField: 'scoreName',
      suppressMovable: true,
    },
    { headerName: 'NGÀY KHÓA NHẬP (*)',field:'entryLockDate',
      cellRendererFramework: DateLockPointComponent,
      cellStyle:{
        'font-weight': '500',
        'font-size': '12px',
        color: '#101840',
        top: '2px',
        display: 'flex',
        'justify-content': 'space-around',
        'flex-direction': 'column'
      },
      maxWidth: 240,
      minWidth: 240,
      suppressMovable: true,
    }
  ]

  formAddConfig: FormGroup;

  applyAll = false;

  years: any;
  gradeList: any;
  semesterList: any;
  gradeCurrent: any;
  semesterCurrent: any;

  constructor(private fb: FormBuilder,
              public dialogRef: MatDialogRef<AddConfigComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              private configLockPintService: ConfigPointLockService,
              private toast :ToastrService) {
    this.years = data.years;
    this.semesterList = data.semesterList;
    this.gradeCurrent = data.gradeCurrent;
    this.semesterCurrent = data.semesterCurrent;
    console.log(data);
  }

  ngOnInit(): void {
    this.formAddConfig = this.fb.group({
      semester: [{value: ''}, Validators.required],
      years: [{value: '', disabled: true}, Validators.required],
      gradeLevel: [null, Validators.required]
    })
    this.formAddConfig.get('gradeLevel').valueChanges.subscribe(val => this.selectGradeLevel(val));
    this.loadFormOption();
    this.loadGridViewAdd();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  getGradeList(semester, years) {
    this.configLockPintService.getGradeListUnconfiguredList(semester, years).subscribe(resAPI => {
      this.gradeList = resAPI;
      if (this.gradeList.length === 0) {
        this.toast.warning('Tất cả các khối học kỳ '+ this.semesterCurrent+' đã được cấu hình khoá nhập điểm');
      }
    });
  }

  loadFormOption() {
    this.formAddConfig.get('semester').setValue(this.semesterCurrent);
    this.formAddConfig.get('years').setValue(this.years);

    this.formAddConfig.get('semester').valueChanges.subscribe(val => this.selectSemester(val));
    this.getGradeList(this.semesterCurrent, this.years);
  }

  applyAllGrade(event) {
    console.log(event);
    if (event.target.checked) {
      this.applyAll = true;
    }else{
      this.applyAll = false;
    }
    console.log(this.applyAll);
  }

  loadGridViewAdd() {
    const semester = this.formAddConfig.get('semester').value;
    const years = this.formAddConfig.get('years').value;
    const gradeCode = this.formAddConfig.get('gradeLevel').value;
    this.configLockPintService.loadGridViewPopupCreateConfigLockPoint(semester, years, gradeCode).subscribe(resAPI => {
      let listData: any = [];
      resAPI.forEach(item => {
        if (item.typeSubject === 0) {
          item.typeSubjectName = 'Nhập điểm';
          item.semester = this.formAddConfig.get('semester').value;
        }else if (item.typeSubject === 1) {
          item.typeSubjectName = 'Xếp loại';
          item.semester = this.formAddConfig.get('semester').value;
        }
        listData = [...listData, item];
      });
      this.rowData = listData;
    });
  }

  selectSemester(val) {
    this.getGradeList(val, this.years);
    this.formAddConfig.get('gradeLevel').setValue(null);
    this.loadGridViewAdd();
  }

  selectGradeLevel(event) {
    this.loadGridViewAdd();
  }

  createConfig() {
    if (this.formAddConfig.get('gradeLevel').value === 0) {
      this.toast.error('Vui lòng chọn khối muốn cấu hình');
      return;
    }
    if (this.rowData.length === 0) {
      this.toast.error('Chưa không có dữ liệu để tạo mới');
      return;
    }
    let checkValid = true;
    let check = true;
    let message;
    const messageList = [];
    this.rowData.forEach((item, index) => {
      console.log(item);
      if (item?.valid === false) {
        checkValid = false;
        message = item.message;
        messageList.push(message);
        return;
      }
      if (item.entryLockDate === undefined || item.entryLockDate === null ) {
        check = false;
        return;
      }
    });
    if(!checkValid) {
      this.toast.error(messageList[0]);
      return;
    }
    if(!check) {
      this.toast.error('Vui lòng nhập đầy đủ các ngày khóa nhập');
      return;
    }
    const gradeCodeValue = this.formAddConfig.get('gradeLevel').value;
    const semesterValue = this.formAddConfig.get('semester').value;
    let listData = [];
    this.rowData.forEach(item => {
      const item1={...item, gradeCode: gradeCodeValue, semester: semesterValue, years: this.years}
      listData = [...listData, item1];
    });
    console.log(listData);
    this.configLockPintService.createConfigLock(listData, this.applyAll).subscribe(resAPI => {
      console.log(resAPI);
      if (resAPI.status === 'OK') {
        this.dialogRef.close({event: 'add', data: resAPI});
      }else{
        this.toast.error(resAPI.message);
      }
    });
  }

  // tabToNextCell() {
  //   var previousCell = params.previousCellPosition,
  //     lastRowIndex = previousCell.rowIndex,
  //     nextRowIndex = params.backwards ? lastRowIndex - 1 : lastRowIndex + 1,
  //     renderedRowCount = gridOptions.api.getModel().getRowCount(),
  //     result;
  //
  //   if (nextRowIndex < 0) {
  //     nextRowIndex = -1;
  //   }
  //   if (nextRowIndex >= renderedRowCount) {
  //     nextRowIndex = renderedRowCount - 1;
  //   }
  //
  //   result = {
  //     rowIndex: nextRowIndex,
  //     column: previousCell.column,
  //     floating: previousCell.floating,
  //   };
  //
  //   return result;
  // }

  onDismiss() {
    this.dialogRef.close({event: 'cancel'});
  }
}
