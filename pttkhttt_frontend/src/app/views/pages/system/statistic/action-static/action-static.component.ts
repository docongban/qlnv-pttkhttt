import {ChangeDetectorRef, Component, OnInit, TemplateRef} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {StatisticSmsComponent} from '../statistic-sms/statistic-sms.component';
import {MatDialog} from '@angular/material/dialog';
import {SearchReport} from '../../../../../core/service/model/searchReport';
import {DataPackageService} from '../../../../../core/service/service-model/data-package.service';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'kt-action-static',
  templateUrl: './action-static.component.html',
  styleUrls: ['./action-static.component.scss']
})
export class ActionStaticComponent implements OnInit , ICellRendererAngularComp {

  rowIndex;
  modalRef: BsModalRef;
  cellValue;
  searchReport: SearchReport = new SearchReport();
  report: any;
  max;
  listData = [];
  list = [];
  valueAxes: any[];
  schoolName;
  viewSMS = {
    year: null,
    schoolCode: null,
    packageCode: null,
    schoolName: null,
  }
  public majorTicks = {
    size: 50,
    color: 'rgb(216, 218, 229)',
    width: 1
  }

  public categoryMajorTicks = {
    size : 0,
    width: 0,
  }

  public categories: string[] = ['01', '02', '03', '04', '05','06', '07', '08', '09', '10','11', '12'];

  public crossingValues: number[] = [0,100];

  labels = {
    color: '#101840',
    font: 'bold 9px Inter',
  }

  series: any[];
  constructor(private dialog: MatDialog,
              private dataPackageService: DataPackageService,
              private modalService: BsModalService,
              private translate: TranslateService,
              private changeDetectorRef : ChangeDetectorRef) { }

  ngOnInit(): void {
  }
  agInit(params ): void {
    this.rowIndex = +params.rowIndex + 1;
    this.cellValue = params;
    this.report = params.data;
    this.getYear();
    this.viewSMS.schoolCode = this.report.schoolCode;
    this.viewSMS.schoolName = this.report.schoolName;
    this.viewSMS.packageCode = this.report.packageCode;
    this.schoolName = this.report.schoolCode + ' - ' + this.report.schoolName;
  }

  getYear(){
    this.dataPackageService.yearCurrent$.subscribe(res=>{
      this.viewSMS.year = res;
    })
  }

  refresh(params) {
    return true;
  }

  viewStaticSMS(){
    this.dialog.open(StatisticSmsComponent, {data: this.viewSMS});
  }

  openModal(template: TemplateRef<any>){
    const flexRootDOM = document.querySelector('.flex-root') as HTMLElement;
        flexRootDOM.classList.add('overflow-hidden')
    this.modalRef = this.modalService.show(
      template,
      { class: 'view-sms modal-dialog-custom' }
    );
    this.modalRef.onHidden.subscribe(() => {
      const flexRootDOM = document.querySelector('.flex-root') as HTMLElement;
      flexRootDOM.classList.remove('overflow-hidden')
    })
    this.list = [];
    this.loadData();
  }

  loadData(){
    console.log(this.searchReport)
    this.searchReport.schoolSearch = this.viewSMS.schoolCode;
    this.searchReport.packageSearch = this.viewSMS.packageCode;
    this.searchReport.year = this.viewSMS.year;
    this.dataPackageService.dashboardSMS(this.searchReport).subscribe(res=>{
      this.listData = res.data;
      console.log(this.listData)
      let t1 = this.listData[0].january;
      this.list.push(t1)
      this.max = t1;
      let t2 = this.listData[0].february;
      this.list.push(t2)
      if(this.max < t2)
        this.max = t2;
      let t3 = this.listData[0].march;
      this.list.push(t3)
      if(this.max < t3)
        this.max = t3;
      let t4 = this.listData[0].april;
      this.list.push(t4)
      if(this.max < t4)
        this.max = t4;
      let t5 = this.listData[0].may;
      this.list.push(t5)
      if(this.max < t5)
        this.max = t5;
      let t6 = this.listData[0].june;
      this.list.push(t6)
      if(this.max < t6)
        this.max = t6;
      let t7 = this.listData[0].july;
      this.list.push(t7)
      if(this.max < t7)
        this.max = t7;
      let t8 = this.listData[0].august;
      this.list.push(t8)
      if(this.max < t8)
        this.max = t8;
      let t9 = this.listData[0].september;
      this.list.push(t9)
      if(this.max < t9)
        this.max = t9;
      let t10 = this.listData[0].october;
      this.list.push(t10)
      if(this.max < t10)
        this.max = t10;
      let t11 = this.listData[0].november;
      this.list.push(t11)
      if(this.max < t11)
        this.max = t11;
      let t12 = this.listData[0].december;
      this.list.push(t12)
      if(this.max < t12)
        this.max = t12;
      this.series = [{
        type: 'column',
        data1: this.list,
        stack: true,
        name: 'on battery',
        color: '#F26522'
      }];
      // ------
      if(this.max < 2500)
        this.max = 2500;
      else
        this.max = this.max + 500+200;
      this.valueAxes = [{
        name: 'sms',
        title: this.translate.instant(`STATISTIC_PACKAGE.NUMBER_OF_SMS`),
        min: 0,
        max: this.max,
        majorUnit: 500,
        // color: '#101840',
        color: 'rgb(216, 218, 229)',
        majorGridLine:{
          width: 0
        },
        labels: {
          color: '#101840',
          font:'600 10px Inter',
          margin: {
            bottom: 20,
            right: -40,
          }
        }
      }];
      this.changeDetectorRef.detectChanges();
    })
  }
}
