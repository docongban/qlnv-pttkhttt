import {Component, OnInit} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-angular';
import {Subscription} from "rxjs";
import {ClassroomService} from "../../../../../core/service/service-model/classroom.service";
import {SchoolYearService} from "../../school-year/school-year.service";

// import {IAfterGuiAttachedParams} from 'ag-grid';

@Component({
    selector: 'app-ag-grid-checkbox-header',
    templateUrl: './ag-grid-checkbox-header.component.html',
    styleUrls: ['./ag-grid-checkbox-header.component.css']
})
export class AgGridCheckboxHeaderComponent implements AgRendererComponent {

    params: any;
    subscription: Subscription;
    semesterAmount;
    currentYear;

    constructor() {
    }

    agInit(params: any): void {
        //
        // if(params.column.colId == 'allYear') {
        //      let checkAllYear = 0;
        //     for (let i = 0; i < params.api.dataAll.length; i++) {
        //         if (params.api.dataAll[i].status == 1 && params.api.dataAll[i].allYear == 1) {
        //             checkAllYear++;
        //         }
        //         if (checkAllYear == params.api.dataAll.length) {
        //             params.value = 1;
        //         }
        //     }
        // }
        // if(params.column.colId == 'flgSemester1') {
        //     let checkS1 = 0;
        //     for (let i = 0; i < params.api.dataAll.length; i++) {
        //         if (params.api.dataAll[i].status == 1 && params.api.dataAll[i].flgSemester1 == 1) {
        //             checkS1++;
        //         }
        //         if (checkS1 == params.api.dataAll.length) {
        //             params.value = 1;
        //         }
        //     }
        // }
        // if(params.column.colId == 'flgSemester2') {
        //     let checkS2 = 0;
        //     for (let i = 0; i < params.api.dataAll.length; i++) {
        //         if (params.api.dataAll[i].status == 1 && params.api.dataAll[i].flgSemester2 == 1) {
        //             checkS2++;
        //         }
        //         if (checkS2 == params.api.dataAll.length) {
        //             params.value = 1;
        //         }
        //     }
        //     }
        // if(params.column.colId == 'flgSemester3') {
        //     let checkS3 = 0;
        //     for (let i = 0; i < params.api.dataAll.length; i++) {
        //         if (params.api.dataAll[i].status == 1 && params.api.dataAll[i].flgSemester3 == 1) {
        //             checkS3++;
        //         }
        //         if (checkS3 == params.api.dataAll.length) {
        //             params.value = 1;
        //         }
        //     }
        // }
        // if(params.column.colId == 'flgSemester4') {
        //     let checkS4 = 0;
        //     for (let i = 0; i < params.api.dataAll.length; i++) {
        //         if (params.api.dataAll[i].status == 1 && params.api.dataAll[i].flgSemester4 == 1) {
        //             checkS4++;
        //         }
        //         if (checkS4 == params.api.dataAll.length) {
        //             params.value = 1;
        //         }
        //     }
        // }
        this.params = params;
    }

    // afterGuiAttached(params?: IAfterGuiAttachedParams): void {
    // }

    refresh(params: any): boolean {
        debugger;

        if(params.api.dataAll == undefined){
            return false;
        }
        if(params.column.colId == 'allYear') {
            if (params.value === true) {
                for (let i = 0; i < params.api.dataAll.length; i++) {
                    if (params.api.dataAll[i].status == 1) {
                        params.api.dataAll[i].allYear = 1;
                    }
                }
            }
            if (params.value === false) {
                for (let i = 0; i < params.api.dataAll.length; i++) {
                    if (params.api.dataAll[i].status == 1) {
                        params.api.dataAll[i].allYear = 0;
                    }
                }
            }
        }
        if(params.column.colId == 'flgSemester1') {
            if (params.value === true) {
                for (let i = 0; i < params.api.dataAll.length; i++) {
                    if (params.api.dataAll[i].status == 1) {
                        params.api.dataAll[i].flgSemester1 = 1;
                    }
                }
            }
            if (params.value === false) {
                for (let i = 0; i < params.api.dataAll.length; i++) {
                    if (params.api.dataAll[i].status == 1) {
                        params.api.dataAll[i].flgSemester1 = 0;
                    }
                }
            }
        }
        if(params.column.colId == 'flgSemester2') {
            if (params.value === true) {
                for (let i = 0; i < params.api.dataAll.length; i++) {
                    if (params.api.dataAll[i].status == 1) {
                        params.api.dataAll[i].flgSemester2 = 1;
                    }
                }
            }
            if (params.value === false) {
                for (let i = 0; i < params.api.dataAll.length; i++) {
                    if (params.api.dataAll[i].status == 1) {
                        params.api.dataAll[i].flgSemester2 = 0;
                    }
                }
            }
        }
        if(params.column.colId == 'flgSemester3') {
            if (params.value === true) {
                for (let i = 0; i < params.api.dataAll.length; i++) {
                    if (params.api.dataAll[i].status == 1) {
                        params.api.dataAll[i].flgSemester3 = 1;
                    }
                }
            }
            if (params.value === false) {
                for (let i = 0; i < params.api.dataAll.length; i++) {
                    if (params.api.dataAll[i].status == 1) {
                        params.api.dataAll[i].flgSemester3 = 0;
                    }
                }
            }
        }
        if(params.column.colId == 'flgSemester4') {
            for (let i = 0; i < params.api.dataAll.length; i++) {

            }
            if (params.value === true) {
                for (let i = 0; i < params.api.dataAll.length; i++) {
                    if (params.api.dataAll[i].status == 1) {
                        params.api.dataAll[i].flgSemester4 = 1;
                    }
                }
            }
            if (params.value === false) {
                for (let i = 0; i < params.api.dataAll.length; i++) {
                    if (params.api.dataAll[i].status == 1) {
                        params.api.dataAll[i].flgSemester4 = 0;
                    }
                }
            }
        }
        params.api.refreshCells(params);
        return false;
    }
}
