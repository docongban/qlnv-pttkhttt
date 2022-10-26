// Angular
import {AfterViewInit, Component, Input, OnDestroy, OnInit,} from '@angular/core';
// RxJS
import {Subscription} from 'rxjs';
// Layout
import {SubheaderService} from '../../../../../core/_base/layout';
import {Breadcrumb} from '../../../../../core/_base/layout/services/subheader.service';
import {ClassroomService} from '../../../../../core/service/service-model/classroom.service';
import {SearchReport} from '../../../../../core/service/model/searchReport';
import {DataPackageService} from '../../../../../core/service/service-model/data-package.service';
import { QUARTERS } from 'src/app/helpers/constants';
import { SUB_HEADER } from '../../../../../helpers/constants';

@Component({
  selector: 'kt-subheader1',
  templateUrl: './subheader1.component.html',
  styleUrls: ['./subheader1.component.scss'],
})
export class Subheader1Component implements OnInit, OnDestroy, AfterViewInit {
  // Public properties
  @Input() fixed = true;
  @Input() clear = false;
  @Input() width = 'fluid';
  @Input() subheaderClasses = '';
  @Input() subheaderContainerClasses = '';
  @Input() displayDesc = false;
  @Input() displayDaterangepicker = true;

  // today: number = Date.now();
  title = '';
  desc = '';
  breadcrumbs: Breadcrumb[] = [];
  notSchoolYear;
  disableYears = false;
  disableStaticDataPackage;
  schoolYearList: any;
  years;
  quy;
  thang;
  thang2;
  yearNow;
  monthNow;
  quarterNow
  type;
  searchReport: SearchReport = new SearchReport();
  listType = SUB_HEADER.LIST_TYPE;

  listYear = []

  // listQ = QUARTERS;
  listQ;

  // listT = SUB_HEADER.LIST_MONTH
  listT;

  showHeaderTeacherProfile;
  showDashboard

  // Private properties
  private subscriptions: Subscription[] = [];

  /**
   * Component constructor
   *
   * @param subheaderService: SubheaderService
   */
  constructor(
    public subheaderService: SubheaderService,
    public classroomService: ClassroomService,
    public dataPackageService: DataPackageService,
  ) {
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    // this.getYearNow();
    const now = new Date();
    this.yearNow = now.getFullYear()
    this.monthNow = now.getMonth() + 1
    this.quarterNow = QUARTERS.find(v => v.months.includes(this.monthNow))?.id

    this.getListSchoolYear();
    this.type = SUB_HEADER.TYPE_MONTH;
    this.thang = now.getMonth() + 1;
    this.years = now.getFullYear();
    if(this.years === this.yearNow){
      this.listT = [];
      this.listQ = [];
      // Xử lý tháng
      for (let i = 1; i <= this.monthNow; i++) {
        this.listT.push({id: i, name: i.toString()})
      }
      this.thang = this.monthNow;
      // Xử lý quý
      for (let i = 0; i < this.quarterNow; i++) {
        this.listQ.push(QUARTERS[i]);
      }
    }else{
      this.listT = SUB_HEADER.LIST_MONTH;
      this.listQ = QUARTERS;
    }
    this.quy = this.quarterNow;

    this.dataPackageService.changeYearCurrent(this.years);
    this.dataPackageService.changeQuartersCurrent(this.quy);
    this.dataPackageService.changeMonthCurrent(this.thang);

    this.dataPackageService.changeSubheader({
      type: this.type,
      year: this.years,
      month: this.thang,
      quarter: this.quy,
      months: [this.thang]
    })
  }

  /**
   * After view init
   */
  getListSchoolYear() {
    // this.schoolYearService.getListSchoolYearHeader().subscribe((resAPI) => {
    //   this.schoolYearList = resAPI.listSchoolYear;
    //   this.years = resAPI?.yearCurrent;
    //   this.changeDetectorRef.detectChanges();
    //   this.classroomService.changeYearCurrent(this.years);
    //   this.classroomService.changeListYears(resAPI.listSchoolYear);
    // });

    for (let i = 0; i < 10; i++) {
      this.listYear.push({name: this.yearNow - i})
    }
  }

  selectYears(event) {
    this.classroomService.changeYearCurrent(this.years);
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.subheaderService.title$.subscribe((bt) => {
        // breadcrumbs title sometimes can be undefined
        if (bt) {
          this.title = bt.title;
          this.desc = bt.desc;
        }
      })
    );

    this.subscriptions.push(
      this.subheaderService.breadcrumbs$.subscribe((bc: any) => {

        if (bc && bc.length > 0) {
          console.log(bc[bc.length - 1])
          if (bc[bc.length - 1].page
            && (bc[bc.length - 1].page.indexOf('/system/school/schedule-timetable') > -1
              || bc[bc.length - 1].page.indexOf('/system/teacher/teaching-timetable') > -1
              || bc[bc.length - 1].page.indexOf('/system/student/transfer-students') > -1
              || bc[bc.length - 1].page.indexOf('system/student/students-gradebook') > -1
              || bc[bc.length - 1].page.indexOf('/system/student/attendance-student') > -1
              || bc[bc.length - 1].page.indexOf('/system/student/academic-abilities') > -1
              || bc[bc.length - 1].page.indexOf('/system/student/conduct-assessment') > -1
              || bc[bc.length - 1].page.indexOf('/system/dashboard') > -1
            )
          ) {
            this.disableYears = true;
          } else {
            this.disableYears = false;
          }
        }

        this.breadcrumbs = bc;
        if (location.href.includes('/school-year') ||
          location.href.includes('/teacher-management') ||
          location.href.includes('/student-profile/') ||
          location.href.includes('/create-update-student') ||
          location.href.includes('/teacher-profile/') ||
          location.href.includes('/create-update-teacher') ||
          location.href.includes('/account-management') ||
          location.href.includes('/system/official-letter-document') ||
          location.href.includes('/change-password') ||
          location.href.includes('/contact-group') ||
          location.href.includes('/contact/send-mail')||
          location.href.includes('system/data-package') ||
          location.href.includes('/system/school/manages-school') ||
          location.href.includes('/system/dashboard') ||
          location.href.includes('/system/package-management') ||
          location.href.includes('/system/statistic')
        ) {
          this.notSchoolYear = false;
        } else {
          this.notSchoolYear = true;
        }
        // Thông kê các gói cước
        if(location.href.includes('/system/statistic')){
          this.disableStaticDataPackage = true;
        }else{
          this.disableStaticDataPackage = false;
        }

        this.showDashboard = !location.href.includes('system/dashboard')

        let bre: Breadcrumb[] = [];
        if (location.href.includes('/teacher-profile/')) {
          bre = [{
            page: '/system/teacher/teacher-management',
            title: 'Giáo viên'
          }, {
            page: '/system/teacher/teacher-profile/:id',
            title: 'Hồ sơ cán bộ giáo viên'
          }];
          this.breadcrumbs = bre;
        }
        if (location.href.includes('/create-update-teacher')) {
          bre = [{
            page: '/system/teacher/teacher-management',
            title: 'Giáo viên'
          }, {
            page: '/system/teacher/create-update-teacher',
            title: 'Thêm mới/Cập nhật'
          }];
          this.breadcrumbs = bre;
        }

        if (location.href.includes('/student-profile/')) {
          bre = [{
            page: '/system/student/student-management',
            title: 'Học sinh'
          }, {
            page: '/system/student/student-profile/:id/:year',
            title: 'Hồ sơ học sinh'
          }];
          this.breadcrumbs = bre;
        }

        if (location.href.includes('/create-update-student')) {
          bre = [{
            page: '/system/student/student-management',
            title: 'Học sinh'
          }, {
            page: '/system/student/create-update-student',
            title: 'Thêm mới'
          }];
          this.breadcrumbs = bre;
        }

        if (location.href.includes('/create-update-student/')) {
          bre = [{
            page: '/system/student/student-management',
            title: 'Học sinh'
          }, {
            page: '/system/student/create-update-student/:id',
            title: 'Cập nhật'
          }];
          this.breadcrumbs = bre;
        }

        if (location.href.includes('/account-management')) {
          bre = [{
            page: '/system/account/account-management',
            title: 'Quản lý tài khoản'
          }];
          this.breadcrumbs = bre;
        }

        // if (location.href.includes('/change-password')) {
        //   bre = [{
        //     page: '/system/account/change-password',
        //     title: 'Đổi mật khẩu'
        //   }];
        //   this.breadcrumbs = bre;
        // }

        if (location.href.includes('/contact/send-mail')) {
          bre = [{
            page: '/system/contact/send-mail',
            title: 'Liên lạc cán bộ giáo viên'
          }, {
            page: '/system/contact/send-mail',
            title: 'Gửi tin nhắn mới'
          }];
          this.breadcrumbs = bre;
        }

        if (location.href.includes('/contact/contact-group')) {
          bre = [{
            page: '/system/contact/contact-group',
            title: 'Liên lạc cán bộ giáo viên'
          }, {
            page: '/system/contact/contact-group',
            title: 'Danh sách nhóm liên lạc'
          }];
          this.breadcrumbs = bre;
        }

        if (location.href.includes('/system/dashboard')) {
          bre = [];
          this.breadcrumbs = bre;
        }
      })
    );
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  selectType(event){
    const now = new Date()
    this.years = now.getFullYear()
    let months = [1,2,3,4,5,6,7,8,9,10,11,12]
    if(this.type === SUB_HEADER.TYPE_MONTH){
      this.thang = now.getMonth() + 1;
      months = [this.monthNow]
    }

    if(this.type === SUB_HEADER.TYPE_QUARTER){
      debugger
      const foundQuarter = QUARTERS.find(quarter => quarter.months.includes(now.getMonth() + 1))
      debugger
      console.log(foundQuarter)
      this.quy = foundQuarter.id
      this.quy = this.quarterNow;
      months = [this.monthNow]
    }

    this.dataPackageService.changeSubheader({
      type: this.type,
      year: this.years,
      month: this.thang,
      quarter: this.quy,
      months: months
    })
  }

  // Lấy năm
  changeYear(event){
    // List tháng theo năm
    this.listT = SUB_HEADER.LIST_MONTH
    this.listQ = QUARTERS

    if(this.years == this.yearNow){
      this.listT = SUB_HEADER.LIST_MONTH.filter( month => month.id <= this.monthNow)
      this.listQ = QUARTERS.filter(quarter => quarter.id <= this.quarterNow)
      this.thang = this.monthNow
      this.quy = this.quarterNow
    }
    this.searchReport.year = this.years;
    this.dataPackageService.changeYearCurrent(this.years);

    let months = this.handleMonths()

    this.dataPackageService.changeSubheader({
      type: this.type,
      year: this.years,
      month: this.thang,
      quarter: this.quy,
      months: months
    })
  }

  // Quý
  changeQuy($event){
    this.searchReport.quarters = this.quy;
    this.thang = null;
    this.dataPackageService.changeQuartersCurrent(this.quy);
    const foundQuarter = QUARTERS.find(quarter => quarter.id == this.quy)

    let months = this.handleMonths()
    this.dataPackageService.changeSubheader({
      type: this.type,
      year: this.years,
      month: this.thang,
      quarter: this.quy,
      months: months
    })
  }
  // Tháng
  changeMonth($event){
    this.searchReport.month = this.thang;
    this.quy = null;
    this.dataPackageService.changeMonthCurrent(this.thang);

    let months = this.handleMonths()

    this.dataPackageService.changeSubheader({
      type: this.type,
      year: this.years,
      month: this.thang,
      quarter: this.quy,
      months: months
    })
  }

  handleMonths(): any[] {
    let months = [1,2,3,4,5,6,7,8,9,10,11,12]
    if (this.years == this.yearNow) {
      months = [this.monthNow]
    }
    return months
  }
}
