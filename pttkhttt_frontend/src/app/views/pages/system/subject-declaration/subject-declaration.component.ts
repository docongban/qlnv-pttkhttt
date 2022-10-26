import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ClassroomService} from '../../../../core/service/service-model/classroom.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {CheckboxColumnComponent, SelectableSettings} from '@progress/kendo-angular-grid';
import {MatDialog} from '@angular/material/dialog';
import {ActionShoolComponent} from '../school/action-shool/action-shool.component';
import {SubjectDeclarationService} from "./subject-declaration.service";
import {AgGridCheckboxComponent} from "./ag-grid-checkbox/ag-grid-checkbox.component";
import {ConfirmSaveComponent} from "./confirm-save/confirm-save.component";
import {ToastrService} from "ngx-toastr";
import {AgGridSelectComponent} from "./ag-grid-select/ag-grid-select.component";
import {placeholdersToParams} from "@angular/compiler/src/render3/view/i18n/util";
import {CommonServiceService} from "../../../../core/service/utils/common-service.service";
import {Subscription} from "rxjs";
import {SchoolYearService} from "../school-year/school-year.service";
import {Location} from "@angular/common";
import {AgGridCheckboxHeaderComponent} from "./ag-grid-checkbox-header/ag-grid-checkbox-header.component";
import row from "ag-grid-enterprise/dist/lib/excelExport/files/xml/row";

@Component({
    selector: 'subject-declaration',
    templateUrl: './subject-declaration.component.html',
    styleUrls: ['./subject-declaration.component.scss']
})
export class SubjectDeclarationComponent implements OnInit, AfterViewInit {
    rowData;
    gradeData;
    departmentData;
    classRoomData
    deptId;
    subject = '';
    className;
    idClass;
    showSave = false;
    showCancel = false;
    disableStatus = true;
    disableSearch = false;
    showUpdate = true;
    gradeLevel;
    classRoom;
    gridApi;
    firstSearch = true;
    saveAllGrade = 0;
    saveAllDept = 0;
    gridColumnApi;
    checkboxStatus;
    headerHeight = 56;
    rowHeight = 50;
    subscription: Subscription;
    formSearch: any = {};
    noRowsTemplate = 'Không có bản ghi nào';
    schoolYear;
    paginationPageSize = 10;
    cacheBlockSize = 10;
    name;
    perPage = 10;
    currentPage = 1;
    semesterAmount;
    first = 1;
    last = 10;
    total = 0;
    totalPage = 0;
    countPage = [];
    setColumn;
    setColumn1;
    rowDataChange = [];
    rangeWithDots = [];
    loading = false;
    dataFromClassroom;
    loadingTemplate = 'Đang cập nhật';
    hide= true;
    beforData =[];
    constructor(private subjectDeService: SubjectDeclarationService,
                private fb: FormBuilder,
                private matDialog: MatDialog,
                private toast: ToastrService,
                private commonService: CommonServiceService,
                private classRoomService: ClassroomService,
                private changeDetectorRef: ChangeDetectorRef,
                private getYear: SchoolYearService,
                private location: Location) {

    }

    ngOnInit(): void {
        this.dataFromClassroom = this.location.getState();
        console.log(this.dataFromClassroom);
        this.loadCurrentYear();
        this.getGrade();
    }
    loadCurrentYear(): void {
        this.subscription = this.classRoomService.yearCurrent$.subscribe(
            (currentYear) => {
                this.schoolYear = currentYear;
                if (this.schoolYear !== '' && this.schoolYear != null) {
                    this.getYear.getInfoYear(this.schoolYear).subscribe(res => {
                        this.semesterAmount = res[0].semesterAmount;
                        this.setColumn = null;
                        this.setColumn = [...this.columnDefs];
                        for (let i = 0; i < this.semesterAmount; i++) {

                            this.setColumn.push({
                                headerName: `HỌC KÌ ${i + 1}`, field: `flgSemester${i + 1}`,
                                minWidth: 150,
                                maxWidth: 150,
                                cellRendererFramework: AgGridCheckboxComponent,
                                headerComponentFramework: AgGridCheckboxHeaderComponent,
                                cellStyle: params =>
                                    params.column.colId === `flgSemester${i + 1}` && this.disableStatus !== true ?
                                        {
                                            top: '12px',
                                            'align-items': 'center',
                                            'pointer-events': 'auto',
                                            'margin-left': '37px'
                                        } :
                                        {
                                            top: '12px',
                                            'align-items': 'center',
                                            'pointer-events': 'none',
                                            'margin-left': '37px'
                                        }
                            });
                            this.gridApi.setColumnDefs(this.setColumn);
                        }
                        for (let i = 0; i < this.semesterAmount; i++) {

                            this.setColumn.push({
                                headerName: `GIÁO VIÊN DẠY HỌC KÌ ${i + 1}`, field: `nameTeacherSemester${i + 1}`,
                                minWidth: 230,
                                maxWidth: 230,
                                cellStyle: {
                                    'font-weight': '500',
                                    'font-size': '12px',
                                    'align-items': 'center',
                                    color: '#101840',
                                    // display: 'flex',
                                    top: '12px',
                                    'white-space': 'nowrap',
                                    'text-overflow': 'ellipsis',
                                    'overflow': 'hidden',
                                    'margin-left': '30px'
                                },
                                tooltipField: `nameTeacherSemester${i + 1}`

                            });
                            this.gridApi.setRowData(this.rowData);
                        }
                    });

                }
                this.classRoom = null;
                this.className = null;

                this.getClassRoom(this.gradeLevel, this.deptId);
            }
        );

    }

    ngAfterViewInit() {

    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridApi.setRowData(this.rowData);

    }
    checkRowChange(obj: any){
        if(this.rowDataChange.length>0) {
            for (let i = 0; i < this.rowDataChange.length; i++) {
                if (obj.subjectCode == this.rowDataChange[i].subjectCode) {
                    this.rowDataChange.splice(i,1);
                    this.rowDataChange.push(...obj);
                }
                if(i == this.rowDataChange.length-1 && obj.subjectCode !== this.rowDataChange[i].subjectCode)
                    this.rowDataChange.push(...obj);
            }
        }
        else{
            this.rowDataChange.push(...obj);
        }
    }

    goToPage(page: number) {
        for(let i = 0;i< this.beforData.length;i++){
            for(let j = 0; j< this.rowData.length;j++){
                if(this.rowData[i].subjectCode === this.beforData[j].subjectCode){
                    if(this.rowData[i].status !== this.beforData[j].status || this.rowData[i].coefficient !== this.beforData[j].coefficient
                        || this.rowData[i].flgSemester1 !== this.beforData[j].flgSemester1 || this.rowData[i].flgSemester2 !== this.beforData[j].flgSemester2
                        || this.rowData[i].flgSemester3 !== this.beforData[j].flgSemester3 || this.rowData[i].flgSemester4 !== this.beforData[j].flgSemester4){
                        this.checkRowChange(this.rowData[i]);
                    }
                }
            }
        }
        if (page !== this.currentPage && page >= 1 && page <= this.totalPage) {
            this.currentPage = page;
            this.search(page);
        }
    }

    gridSizeChanged(params) {
        params.api.sizeColumnsToFit();
    }

    search(page: number) {
        this.currentPage = page;
        this.formSearch.deptId = this.deptId;
        this.formSearch.gradeLevel = this.gradeLevel;
        this.formSearch.classId = this.classRoom;
        this.formSearch.subjectName = this.subject;
        this.formSearch.years = this.schoolYear;
        this.subjectDeService.getData(this.formSearch, this.currentPage, this.perPage).subscribe(res => {
            this.rowData = res.content;
            for (let i = 0; i < this.rowDataChange.length; i++) {
                for (let j = 0; j < this.rowData.length; j++) {
                    if (this.rowDataChange[i].subjectName === this.rowData[j].subjectName) {
                        this.rowData[j] = this.rowDataChange[i];
                    }
                }
            }
            if (res.totalElements > 0) {
                this.total = res.totalElements;
                this.totalPage = Math.ceil(this.total / this.perPage);
                this.rangeWithDots = this.commonService.pagination(
                    this.currentPage,
                    this.totalPage
                );
                this.first = this.perPage * (this.currentPage - 1) + 1;
                this.last = this.first + res.content.length - 1;
                // this.gridApi.setRowData(this.rowData);

            } else {
                this.total = 0;
                this.rangeWithDots = [];
                this.first = 0;
                this.last = 0;
            }

            this.idClass = this.classRoom;
            this.gridApi.setColumnDefs(this.setColumn);
            this.gridApi.setRowData(this.rowData);
            this.changeDetectorRef.detectChanges();
            this.firstSearch = false;
        })
        this.subjectDeService.getData(this.formSearch, this.currentPage, this.perPage).subscribe(res => {
            this.beforData = res.content;
        });
    }


    clickUpdate() {
        // this.beforData = this.rowData;
        this.showUpdate = false;
        this.showSave = true;
        this.showCancel = true;
        this.disableStatus = false;
        this.disableSearch = true;
        this.gridApi.setRowData(this.rowData);
    }

    clickCancel() {
        this.showSave = false;
        this.showCancel = false;
        this.showUpdate = true;
        this.disableStatus = true;
        this.disableSearch = false;
        this.saveAllGrade = 0;
        this.saveAllDept = 0;
        this.rowDataChange = [];
        this.search(1);
        this.gridApi.setRowData(this.rowData);
    }
    updateData() {
        for(let i = 0;i< this.beforData.length;i++){
            for(let j = 0; j< this.rowData.length;j++){
                if(this.rowData[i].subjectCode === this.beforData[j].subjectCode){
                    if(this.rowData[i].status !== this.beforData[j].status || this.rowData[i].coefficient !== this.beforData[j].coefficient
                        || this.rowData[i].flgSemester1 !== this.beforData[j].flgSemester1 || this.rowData[i].flgSemester2 !== this.beforData[j].flgSemester2
                        || this.rowData[i].flgSemester3 !== this.beforData[j].flgSemester3 || this.rowData[i].flgSemester4 !== this.beforData[j].flgSemester4){
                        this.checkRowChange(this.rowData[i]);
                    }
                }
            }
        }
        const lst = this.rowDataChange;
        for (let i = 0; i < lst.length; i++) {
            this.rowDataChange[i].classId = this.idClass;
        }
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
                this.hide = false;
                if(this.classRoom == null){
                    this.toast.error('Chưa chọn lớp học');
                    return;
                }
                this.subjectDeService.updateData(this.rowDataChange, this.saveAllGrade, this.saveAllDept, this.gradeLevel, this.deptId).subscribe(rs => {
                    this.hide = true;
                    if (rs.status == 'OK') {
                        this.toast.success('Lưu thông tin thành công');

                    } else if (rs.status == 'BAD_REQUEST') {
                        this.toast.error(rs.message,null,{timeOut: 3000});
                    } else {
                        this.toast.error('Lưu thông tin thất bại');
                    }
                    this.search(1);
                    this.saveAllDept = 0;
                    this.saveAllGrade = 0;
                    this.rowDataChange = [];
                });
                this.showSave = false;
                this.showCancel = false;
                this.showUpdate = true;
                this.disableStatus = true;
                this.disableSearch = false;
            }

        })

    }

    getGrade() {
        this.subjectDeService.getGrade().subscribe(res => {
            this.gradeData = res;
            if (this.dataFromClassroom.id !== null && this.dataFromClassroom.id !== undefined) {
                this.gradeLevel = this.dataFromClassroom.gradeLevel;
                console.log(this.dataFromClassroom);
                this.getDept(this.gradeLevel);
            } else {
                this.gradeLevel = res[0].id;
                this.getDept(this.gradeLevel);
            }
        });
    }

    getAllGrade(event) {
        this.saveAllGrade = 0;
        if (event) {
            this.saveAllGrade = 1;
        }
    }

    getAllDept(event) {
        this.saveAllDept = 0;
        if (event) {
            this.saveAllDept = 1;
        }

    }

    getDept(grade) {
        this.subjectDeService.getDepartment().subscribe(res => {
            this.departmentData = res;
            if (this.dataFromClassroom.id !== null && this.dataFromClassroom.id !== undefined) {
                this.deptId = this.dataFromClassroom.deptId;
            } else {
                this.deptId = res[0].id;
            }
            console.log(this.deptId)
            this.getClassRoom(grade, this.deptId);
            this.changeDetectorRef.detectChanges();
        });
    }

    exportFile() {
        this.formSearch.classId = this.classRoom;
        this.formSearch.subjectName = this.subject;
        this.formSearch.className = this.name;
        this.subjectDeService.exportFile(this.formSearch).subscribe((responseMessage) => {
            const file = new Blob([responseMessage], {type: 'application/vnd.ms-excel'});
            const fileURL = URL.createObjectURL(file);
            // window.open(fileURL, '_blank');
            const anchor = document.createElement('a');
            anchor.download = 'DS_monhoc_[' + this.className + ']';
            anchor.href = fileURL;
            anchor.click();
        });

    }

    public getClassRoom(grade, dept) {
        this.subjectDeService.getClassRoom(this.deptId, this.gradeLevel, this.schoolYear).subscribe(res => {
            this.classRoomData = res;
            if (res.length > 0) {
                this.classRoom = res[0].id;
                if (res[0].name != null && res[0].name != '') {
                    this.className = 'Lớp ' + res[0].name + ' (Năm học ' + this.schoolYear + ')';
                    this.name = res[0].name;
                    this.search(1);
                }
            }

            // // Check data from class
            // if (this.dataFromClassroom.id !== null && this.dataFromClassroom.id !== undefined) {
            //     this.classRoom = this.dataFromClassroom.id;
            //     this.name = this.dataFromClassroom.name;
            //     this.className = 'Lớp ' + this.name + ' (Năm học ' + this.schoolYear + ')';
            //     this.search(1);
            //     return;
            // }

            this.changeDetectorRef.detectChanges();
            if (this.firstSearch) {
                this.search(1);
            }
        });
    }

    // onRowSelected(event) {
    //     const listRowSelected = [];
    //     this.gridApi.forEachNode(row => {
    //         if (row.isSelected()) {
    //             listRowSelected.push(row.data);
    //         }
    //     });
    // }

    selectGrade(event) {
        this.classRoom = null;
        this.gradeLevel = event.id;
        this.getClassRoom(this.gradeLevel, this.deptId);
    }

    selectDept(event) {
        this.classRoom = null;
        this.deptId = event.id;
        this.getClassRoom(this.gradeLevel, this.deptId);
    }


    selectClass(event) {
        this.classRoom = event.id;
        this.className = 'Lớp ' + event.name;
        this.name = event.name;
    }

    columnDefs = [
        {
            headerName: 'STT',
            field: 'no',
            valueGetter: param => {
                param.api.dataAll = [];
                param.api.dataAll = this.rowData;
                param.api.semesterAmount = this.semesterAmount;
                param.api.stas = this.disableStatus;
                return param.node.rowIndex + (((this.currentPage - 1) * this.perPage) + 1)
            },
            minWidth: 90,
            maxWidth: 90,
            cellStyle: {
                'font-weight': '500',
                'font-size': '12px',
                'align-items': 'center',
                color: '#101840',
                display: 'flex',
                'margin-left': '28px'
            },
            suppressMovable: true,
            pinned: 'left',
            lockPosition: true,

        },
        {
            headerName: 'TÊN MÔN HỌC',
            field: 'subjectName',
            minWidth: 230,
            maxWidth: 230,
            cellStyle: {
                'font-weight': '500',
                'font-size': '12px',
                'align-items': 'center',
                color: '#101840',
                // display: 'flex',
                top: '12px',
                'white-space': 'nowrap',
                overflow: 'hidden',
                'border-right': 'none',
                'text-overflow': 'ellipsis',
                'margin-left': '30px'
            },
            tooltipField: 'subjectName',
            suppressMovable: true,
            lockPosition: true,
            pinned: 'left',
            lockPinned: true
        },
        {
            headerName: 'HỌC', field: 'status',
            cellRendererFramework: AgGridCheckboxComponent,
            minWidth: 150,
            maxWidth: 150,
            cellStyle: params =>
                params.column.colId === 'status' && this.disableStatus != true ?
                    {
                        top: '12px',
                        'align-items': 'center',
                        'pointer-events': 'auto',
                        'margin-left': '25px',
                        'white-space': 'nowrap',
                    }
                    : {
                        top: '12px',
                        'align-items': 'center',
                        'pointer-events': 'none',
                        'margin-left': '25px',
                        'white-space': 'nowrap',
                    },
            suppressMovable: true,
        },
        {
            headerName: 'HỆ SỐ', field: 'coefficient',
            minWidth: 150,
            maxWidth: 150,
            cellRendererFramework: AgGridSelectComponent,
            cellStyle: params =>
                params.column.colId === 'coefficient' && this.disableStatus !== true ?
                    {
                        'align-items': 'center',
                        'pointer-events': 'auto',
                    } :
                    {
                        'align-items': 'center',
                        'pointer-events': 'none',
                    }
        },
        {
            headerName: 'CẢ NĂM',
            field: 'allYear',
            minWidth: 150,
            maxWidth: 150,
            cellRendererFramework: AgGridCheckboxComponent,
            headerComponentFramework: AgGridCheckboxHeaderComponent,
            cellStyle: params =>
                params.column.colId === 'allYear' && this.disableStatus !== true ?
                    {
                        'align-items': 'center',
                        'pointer-events': 'auto',
                        'display': 'flex',
                        'margin-left': '37px'
                    } :
                    {
                        'align-items': 'center',
                        'pointer-events': 'none',
                        'display': 'flex',
                        'margin-left': '37px'
                    }
        }
    ];

}
