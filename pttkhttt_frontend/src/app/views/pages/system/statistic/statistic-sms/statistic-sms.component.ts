import {ChangeDetectorRef, Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DataPackageService} from '../../../../../core/service/service-model/data-package.service';
import {SearchReport} from '../../../../../core/service/model/searchReport';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'kt-statistic-sms',
  templateUrl: './statistic-sms.component.html',
  styleUrls: ['./statistic-sms.component.scss']
})
export class StatisticSmsComponent implements OnInit {

  searchReport: SearchReport = new SearchReport();
  listData = [];
  list= [];
  max = 0;
  valueAxes: any[];
  viewSMS = {
    year: null,
    schoolCode: null,
    packageCode: null,
    schoolName: null,
  }
  constructor(private dialogRef: MatDialogRef<StatisticSmsComponent>,
              private dataPackageService: DataPackageService,
              private translate: TranslateService,
              private changeDetectorRef : ChangeDetectorRef,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.viewSMS = data;
    this.searchReport.schoolSearch = this.viewSMS.schoolCode;
    this.searchReport.packageSearch = this.viewSMS.packageCode;
    this.searchReport.year = this.viewSMS.year;
  }

  // public valueAxes: any[] = [{
  //   name: 'sms',
  //   title: 'Số lượng SMS',
  //   min: 0,
  //   max: 2500,
  //   majorUnit: 500,
  //   color: '#101840',
  // }];

  public categories: string[] = ['01', '02', '03', '04', '05','06', '07', '08', '09', '10','11', '12', 'Tháng'];

  public crossingValues: number[] = [0,100];

  labels = {
    color: '#101840',
    font: 'bold 9px Inter',
  }

  series: any[];

  ngOnInit(): void {
    console.log(this.searchReport);
    this.loadData();
  }

  cancel(){
    this.dialogRef.close();
  }

  loadData(){
    console.log(this.searchReport)
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
        this.max = this.max + 500;
      this.valueAxes = [{
        name: 'sms',
        title: this.translate.instant(`STATISTIC_PACKAGE.NUMBER_OF_SMS`),
        min: 0,
        max: this.max,
        majorUnit: 500,
        color: '#101840',
      }];
      this.changeDetectorRef.detectChanges();
    })
  }
}
