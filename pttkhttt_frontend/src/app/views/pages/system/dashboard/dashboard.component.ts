import {
  ChangeDetectorRef,
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2,
  ViewContainerRef,
  OnDestroy,
  Directive
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import * as moment from 'moment';
import { Moment } from 'moment';
import { DashboardService } from 'src/app/core/service/service-model/dashboard.service';
import { ListSchoolProvinceComponent } from './list-school-province/list-school-province.component';
import {MatDialog} from '@angular/material/dialog';
import { ChartComponent } from '@progress/kendo-angular-charts';
import { TranslationService } from 'src/app/core/_base/layout';
import { Path } from '@progress/kendo-drawing';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const MY_FORMATS1 = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MMMM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[dateFormat1]',
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS1},
  ],
})
// tslint:disable-next-line:directive-class-suffix
export class CustomDateFormat1 {
}


@Component({
  selector: 'kt-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'vn'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},

  ],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy{

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private dashboardService: DashboardService,
    private renderer: Renderer2,
    private matDialog: MatDialog,
    private _adapter: DateAdapter<any>,
    private translationService: TranslationService
  ) {
  }

  @ViewChild('dp') dp : MatDatepicker<null>;
  @ViewChild('dp1') dp1 : MatDatepicker<null>;

  @ViewChild('container', { read: ViewContainerRef, static: true })
  public popupContainer: ViewContainerRef;
  @ViewChild('chart') chart : ChartComponent;
  @ViewChild('SLTP') SLTP : ElementRef;

  la = localStorage.getItem('language')
  maps : any = [];
  enableTooltip = true;
  showToolTip: boolean;
  provinceName:string;
  proviceID;
  school;
  numberOfDataPackage;
  numberOfSchoolOnSystem;
  numberOfUser;
  revenue : string;
  dateSearch;
  maxDate;
  hide = true;
  image = {
    image1: '',
    image2: '',
    image3: '',
  }
  minWidth1 = 15;
  minWidth2 = 15;
  minWidth3 = 15;

  public state = {
    show: true,
    popupValue: '',
    anchor: null
  };

  // =======Data for kendo chart=========
  colMax = 100000;
  colMajorUnit = 10000;
  lineMax = 100000;
  lineMajorUnit = 10000;
  majorTickColSize = 50;
  majorTickLineSize = 50;
  marginLabelCol = -40;
  marginLabelLine = -40;

  chartData;

  background = {
    equal : 'url(\'../../../../../assets/media/img/equal.png\')',
    up : 'url(\'../../../../../assets/media/img/up.png\')',
    down: 'url(\'../../../../../assets/media/img/down.png\')',
    smallUp: 'url(\'../../../../../assets/media/img/smallUp.png\')',
    smallDown: 'url(\'../../../../../assets/media/img/smallDown.png\')',
  }

  schoolGrowthRate;
  userGrowthRate;
  revenueGrowthRate;

  dataForSearch ={
    monthForStatistic: null,
  }

  colors:any = {
    notExist: '#FBCDB9',
    hover: '#F9A886',
    exist: '#F26522',
  }

  date = new FormControl(moment());
  dateView;

  // =====================Chart====================================
  public seriesLine = {
    type: 'line',
    data: [],
    stack: true,
    name: 'numberPeople',
    color: '#25CBD6',
    axis: 'numberPeople'
  }

  public seriesCol = {
      type: 'column',
      data: [],
      name: 'revenue',
      color:'#F26522',
      axis: 'revenue',
      width: 3,
  }

public valueAxesCol =
  {
    name: 'revenue',
    title: 'Doanh thu ($)',
    color: 'rgb(216, 218, 229)',
    min: 0,
    max: this.colMax,
    majorUnit: this.colMajorUnit,
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
  };
  public valueAxesLine =
  {
      name: 'numberPeople',
      title: 'Số lượng người dùng',
      min: 0,
      max: this.lineMax,
      majorUnit: this.lineMajorUnit,
      color: 'rgb(216, 218, 229)',
      majorGridLine:{
        width: 0
      },
      labels: {
        color: '#101840',
        font:'600 10px Inter',
        margin: {
          bottom: 20,
          left : -40,
        }
      }
  };

  public borderOptions = {
    // width: 5,
    // color: '#F26522',
    // borderRadius: 5
  };

  public markers = {
    visible: false,
  }


  highlightLine = {
    markers: {
      color: '#25CBD6',
      size: 8,
      border: {
        width: 4
      }
    }
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

  categories: string[] = [];
  viewEn = false;

  labels = {

    rotation: {
      angle: -45,
      align: 'center'
    },
    color: '#101840',
    font: 'bold 9px Inter',
  }
// Align the first two value axes to the left
// and the last two to the right.
//
// Right alignment is done by specifying a
// crossing value greater than or equal to
// the number of categories.
public crossingValues: number[] = [0,100];

  ngAfterViewInit(){
    if(this.translationService.getSelectedLanguage() == 'vn'){
      this._adapter.setLocale('vi')
      this.viewEn = false;
    }else if(this.translationService.getSelectedLanguage() == 'la'){
      this._adapter.setLocale('lo')
      this.viewEn = false;
    }else{
      this._adapter.setLocale('en');
      this.viewEn = true;
    }
    setTimeout(() => {
    console.log(this.chart.surface);
    this.chart.surface.bind('mouseenter', this.handleMouseEnter);
    this.chart.surface.bind('mouseleave', this.handleMouseLeave);
    this.setBorderBottom('1','1');
    this.changeDetectorRef.detectChanges();
    }, 1000);
  }

  ngOnInit(): void {
    this.maxDate = new Date();

    const maxDate1 = new Date();
    this.dateView = maxDate1.getMonth() + '/' + maxDate1.getFullYear();

    this.dateSearch = this.maxDate.getFullYear().toString() + '-';
    if(this.maxDate.getMonth() + 1 < 10){
      this.dateSearch += ('0' + (this.maxDate.getMonth() + 1).toString());
    }else{
      this.dateSearch += (this.maxDate.getMonth() + 1).toString();
    }
    this.dataForSearch.monthForStatistic = this.dateSearch;
    this.search();
  }

  ngOnDestroy(){
    this.setBorderBottom('0','0');
  }

  setBorderBottom(x,y){
    const vuong = (document.querySelector('.vuong-wrapper') as HTMLElement);
    const inVuong = (document.querySelector('.in-vuong') as HTMLElement);
    vuong.style.zIndex = x;
    inVuong.style.zIndex = y;
  }

  openPopup(){
    console.log(this.dp)
    this.dp.open();
  }
  openPopup1(){
    console.log(this.dp)
    this.dp1.open();
  }


  handleMouseEnter = (e) => {
    if (e.element.parent.tooltip == undefined) {
      return;
    }
    this.state.show = true;
    this.state.popupValue = e.element.parent.tooltip;
    this.state.anchor = e.originalEvent.target;
    this.changeDetectorRef.detectChanges();
  }


  handleMouseLeave = (e) => {
    if (e.element.parent.tooltip == undefined) {
      return;
    }
    this.state.show = false;
    this.state.popupValue = '';
    this.state.anchor = null;
    this.changeDetectorRef.detectChanges();
  }

  searchData(){

  }

  format(nbStr){
    if(nbStr.length > 7){
      return nbStr.substring(0,7)+'...';
    }else{
      return nbStr;
    }
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker) {
    const ctrlValue = this.date.value;
    console.log('aaaaaa1', normalizedMonth)
    console.log('aaaaaa2', ctrlValue)
    console.log('aaaaaa2', ctrlValue.month)
    ctrlValue.month(normalizedMonth.month());
    console.log('aaaaaa', ctrlValue)
    this.date.setValue(ctrlValue);

    datepicker.close();
  }

  mouseEnter(ttid, e, id){
        const ele = document.getElementById(id);
        ele.style.fill= this.colors.hover;
        if(this.enableTooltip){
          this.createToolTipData(event, id);
          this.positionToolTip(ele, ttid);
        }
    }
  mouseLeave(ttid, e, id){
    if(this.maps.find(x => x.id == id).numberOfSchoolPerProvince > 0){
      document.getElementById(id).style.fill= this.colors.exist;
    }else{
      document.getElementById(id).style.fill= this.colors.notExist;
    }
      if(this.enableTooltip){
        this.showToolTip = false;
      }
  }

  search(){
    this.setBorderBottom('0','0');
    this.hide = false;
    this.dashboardService.getAll(this.dataForSearch).subscribe((res) => {
      this.hide = true;
      this.setBorderBottom('1','1');
      this.maps = res.provinces;
      this.numberOfDataPackage = res.numberOfDataPackageApply;
      this.numberOfSchoolOnSystem = res.numberOfSchoolOnSystemAndIsActive;
      this.numberOfUser = res.numberOfUser;
      this.chartData = res.chartList;
      if(res.revenue == null || res.revenue == ''){
        this.revenue = '0';
      }else{
        this.revenue = res.revenue;
      }
      this.revenue = this.formatMoney(this.revenue);
      this.userGrowthRate = res.userGrowthRate;
      this.schoolGrowthRate = res.schoolGrowthRate;
      this.revenueGrowthRate = res.revenueGrowthRate;
      this.setMinWidth();
      setTimeout(() => {
        this.changeDetectorRef.detectChanges();
        this.maps.forEach(element => {
          if(element.numberOfSchoolPerProvince == 0 || element.numberOfSchoolPerProvince == null || element.numberOfSchoolPerProvince == undefined){
            document.getElementById(element.id).style.fill= this.colors.notExist;
          }else{
            document.getElementById(element.id).style.fill= this.colors.exist;
          }
          this.setBackground();
          this.changeDetectorRef.detectChanges();
        });
        const cate = [];
        const dataCol = [];
        const dataLine = [];
        this.chartData.sort(this.compare);
        this.chartData.forEach(element => {
          cate.push(element.code);
          dataCol.push(element.revenue == null? 0 : element.revenue);
          dataLine.push(element.countPeople == null? 0 : element.countPeople);
        });
        let maxCol = dataCol.reduce((a,b) => a > b ? a: b);
        let maxLine = dataLine.reduce((a,b) => a > b? a : b);
        maxCol = Math.floor(maxCol);
        maxLine = Math.floor(maxLine);
        let colMajorUnit = 1;
        for(let i = 0; i < maxCol.toString().length - 1; i++){
          colMajorUnit = colMajorUnit * 10;
        }
        colMajorUnit = Math.ceil(maxCol / colMajorUnit) * colMajorUnit / 10;
        colMajorUnit = colMajorUnit < 1 ? 1 : colMajorUnit;
        this.majorTickColSize = maxCol.toString().length * 8;
        if(this.majorTickColSize < 50){
          this.majorTickColSize = 50;
        }
        this.marginLabelCol = 0 - (this.majorTickColSize - 10);
        this.majorTickLineSize = maxLine.toString().length * 8;
        if(this.majorTickLineSize < 50){
          this.majorTickLineSize = 50;
        }
        this.marginLabelLine = 0 - (this.majorTickLineSize - 10);
        let lineMajorUnit = 1;
        for(let i = 0; i < maxLine.toString().length - 1; i++){
          lineMajorUnit = lineMajorUnit * 10;
        }
        lineMajorUnit = Math.ceil(maxLine / lineMajorUnit) * lineMajorUnit /10;
        lineMajorUnit = lineMajorUnit < 1 ? 1 : lineMajorUnit;
        // console.log('1',colMajorUnit, '2', lineMajorUnit);
        this.colMajorUnit = colMajorUnit;
        this.lineMajorUnit = lineMajorUnit;
        this.colMax = colMajorUnit * 10 + colMajorUnit / 2;
        this.lineMax = lineMajorUnit * 10 + lineMajorUnit / 2;
        this.categories = cate;
        this.seriesCol.data = dataCol;
        this.seriesLine.data = dataLine;
        if(dataCol.every(x => x == 0) && dataLine.every(y => y == 0)){
          this.colMax = 85000;
          this.lineMax = 17000;
          this.colMajorUnit = 10000;
          this.lineMajorUnit = 2000;
        }
        this.changeDetectorRef.detectChanges();
        // console.log(this.colMajorUnit);
      }, 0);
    })
    errr=>{
      this.setBorderBottom('1','1');
      this.hide = true;
    }
  }


  setMinWidth(){
    if(parseFloat(this.userGrowthRate).toFixed(2).toString().replace('.','').length > 5){
      if(this.numberOfUser.toString().length == 4){
        this.minWidth1 = 35;
      }else if(this.numberOfUser.toString().length > 4){
        this.minWidth1 = 38;
      }
    }
    if(parseFloat(this.schoolGrowthRate).toFixed(2).toString().replace('.','').length > 5){
      if(this.numberOfSchoolOnSystem.toString().length == 4){
        this.minWidth2 = 35;
      }else if(this.numberOfSchoolOnSystem.toString().length > 4){
        this.minWidth2 = 38;
      }
    }
    if(parseFloat(this.revenueGrowthRate).toFixed(2).toString().replace('.','').length > 5){
      if(this.revenue.toString().length > 4){
        if(this.revenue.toString().length == 6){
          this.minWidth3 = 50;
        }else{
          this.minWidth3 = 35;
        }
      }
    }
  }

  seriesHover(e){
    console.log(e);
  }

  setBackground(){
    if(this.userGrowthRate == null || this.userGrowthRate == 0 || this.userGrowthRate == '-'){
      this.image.image1 = this.background.equal;
    }else{
      if(this.userGrowthRate > 0){
        if(this.userGrowthRate > 20){
          this.image.image1 = this.background.up;
        }else{
          this.image.image1 = this.background.smallUp;
        }
      }else{
        if(this.userGrowthRate < -20){
          this.image.image1 = this.background.down
        }else{
          this.image.image1 = this.background.smallDown;
        }
      }
    }

    if(this.schoolGrowthRate == null || this.schoolGrowthRate == 0 || this.schoolGrowthRate == '-'){
      this.image.image2 = this.background.equal;
    }else{
      if(this.schoolGrowthRate > 0){
        if(this.schoolGrowthRate > 20){
          this.image.image2 = this.background.up;
        }else{
          this.image.image2 = this.background.smallUp;
        }
      }else{
        if(this.schoolGrowthRate < -20){
          this.image.image2 = this.background.down
        }else{
          this.image.image2 = this.background.smallDown;
        }
      }
    }

    if(this.revenueGrowthRate == null || this.revenueGrowthRate == 0 || this.revenueGrowthRate == '-'){
      this.image.image3 = this.background.equal;
    }else{
      if(this.revenueGrowthRate > 0){
        if(this.revenueGrowthRate > 20){
          this.image.image3 = this.background.up;
        }else{
          this.image.image3 = this.background.smallUp;
        }
      }else{
        if(this.revenueGrowthRate < -20){
          this.image.image3 = this.background.down
        }else{
          this.image.image3 = this.background.smallDown;
        }
      }
    }
  }

  margin(e){
    console.log(e);
    if(e.length <= 10){
      return -95;
    }else{
      return -95 - (5 * (e.length - 10));
    }
  }

  compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const codeA = a.code.toUpperCase();
    const codeB = b.code.toUpperCase();

    let comparison = 0;
    if (codeA > codeB) {
      comparison = 1;
    } else if (codeA < codeB) {
      comparison = -1;
    }
    return comparison;
  }

  formatMoney(value) {
    value = Math.round(value);
    const newValue = value;
    if (value >= 1000000000000) {
        return Math.round(value / 1000000000000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'T';
    }
    if(value >= 10000000000){
      return Math.round(value / 1000000000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'B';
    }
    if(value >= 10000000){
      return Math.round(value / 1000000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'M';
    }
    if(value >= 10000){
      return Math.round(value / 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'K';
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // if(INVALID.includes(money.toString().split(".")[1])){
    //   return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // }
    // if(money.toString().split(".")[1] == '00'){
    //   return money.toString().split(".")[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // }
    // if((money.toString().split(".")[1])[1] == '0'){
    //   return money.toString().split(".")[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    //     + "." + (money.toString().split(".")[1])[0];
    // }
    // // params.data.responsePrice = params.data.responsePrice.toString().replace('.',",");
    // return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  onClosed(e){
    let ds = (new Date(e._validSelected._d).getFullYear().toString() + '-');
    if(new Date(e._validSelected._d).getMonth() + 1 < 10){
      ds += ('0' + (new Date(e._validSelected._d).getMonth() + 1).toString());
    }else{
      ds += (new Date(e._validSelected._d).getMonth() + 1).toString();
    }
    if(this.dataForSearch.monthForStatistic != ds){
      this.dataForSearch.monthForStatistic = ds;
      this.search();
    }
  }

  createToolTipData(event,id){
    this.showToolTip = true;
    const data = this.maps.find(x => x.id == id);
    this.provinceName = this.la === 'la' ? data.prName : data.prNameEn;
    this.school = data.numberOfSchoolPerProvince;
    this.proviceID = data.id;
  }

  toolTipCanClick(){
    this.showToolTip = true;
  }

  toolTipCanNotClick(){
    this.showToolTip = false;
  }


  positionToolTip(ele, ttid){
    const position = ele.getBoundingClientRect();
    const position1 = document.getElementById('position-cal').getBoundingClientRect();
    // let toolTip = document.getElementById(ttid);
    this.renderer.setStyle(this.SLTP.nativeElement,'position','absolute');
    this.renderer.setStyle(this.SLTP.nativeElement,'left',`${position.left - position1.left - 10}px`);
    this.renderer.setStyle(this.SLTP.nativeElement,'top',`${position.top - position1.top - 40}px`);
    // this.SLTP.nativeElement.style.position = 'fixed';
    // this.SLTP.nativeElement.style.style.left = `${position.x}px`;
    // this.SLTP.nativeElement.style.style.top = `${position.y-50}px`;
    this.changeDetectorRef.detectChanges();
  }


  openDialog(id, name){
    const data = {
      display: [],
      provinceName: name
    };
    this.dashboardService.getListSchoolByProvince(id).subscribe((res)=>{
      data.display = res.map(obj => {
        let objRes: any = {}
        objRes = obj
        objRes.levelSchoolName = this.la === 'la' ? obj.levelSchoolNameLA : (this.la === 'en' ? obj.levelSchoolNameEN : obj.levelSchoolName)
        return objRes
      });
      this.matDialog.open(ListSchoolProvinceComponent, {
        data,
        disableClose: false,
        hasBackdrop: true,
        width: '760px'
      })
    },
    err => {})
  }

  visualCol = (e) => {
    const origin = e.rect.origin;
          const bottomRight = e.rect.bottomRight();
          const topRight = e.rect.topRight();
          const topLeft = e.rect.topLeft();

          const path = new Path({
            fill: {
              color:  '#F9A886',
              opacity: 1,
            },
            stroke: {
              color: '#F9A886',
              opacity:  1,
              width: 0,
            }
          })
          .moveTo(origin.x, bottomRight.y)
          .lineTo(bottomRight.x, bottomRight.y)
          .lineTo(topRight.x, topRight.y)
          .lineTo(topLeft.x, topLeft.y)
          .close();


          return path;
  }

  visual3 = (e) => {

    const labelVisual = e.createVisual();
    labelVisual.tooltip = e.value;
    return labelVisual;
  }

  onAxisLabelClick(e){
    console.log(e);
  }

  content1 = (e) => {
    // console.log(e);
    if(e.value.length >= 9){
      return e.value.substring(0,7) + '...';
    }else{
      return e.value;
    }
  }
}
