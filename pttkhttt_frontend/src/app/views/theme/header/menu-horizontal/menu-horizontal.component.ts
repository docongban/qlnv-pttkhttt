// Angular
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
// RxJS
import {filter, finalize, takeUntil, tap} from 'rxjs/operators';
// Object-Path
import * as objectPath from 'object-path';
// Layout
import {
  LayoutConfigService,
  MenuConfigService,
  MenuHorizontalService,
  MenuOptions,
  OffcanvasOptions
} from '../../../../core/_base/layout';
// HTML Class
import {HtmlClassService} from '../../html-class.service';
import {AuthService} from '../../../../core/auth/_services';
import {environment} from '../../../../../environments/environment';
import {TeachingTimetableService} from '../../../pages/system/teachers/teaching-timetable/shared/services/teaching-timetable.service';
import {SchoolServices} from "../../../pages/system/school/school.service";
import {BehaviorSubject, Subject} from "rxjs";
import {StorageSessionService} from "../../../../core/auth/_services/storage.session.service";
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'kt-menu-horizontal',
  templateUrl: './menu-horizontal.component.html',
  styleUrls: ['./menu-horizontal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuHorizontalComponent implements OnInit, AfterViewInit {
  unitelName: string = environment.UNITEL_NAME;
  private offcanvas: any;
  private unsubscribe: Subject<any>;
  @ViewChild('headerMenuOffcanvas', {static: true}) headerMenuOffcanvas: ElementRef;

  @Input() headerLogo: string;
  @Input() headerMenuSelfDisplay: boolean;
  @Input() headerMenuClasses: string;
  // Public properties
  currentRouteUrl: any = '';
  asideSelfDisplay = '';
  rootArrowEnabled: boolean;
  curentUser: any;
  abbName: any = 'HA';
  menuOptions: MenuOptions = {
    submenu: {
      desktop: 'dropdown',
      tablet: 'accordion',
      mobile: 'accordion'
    },
    accordion: {
      slideSpeed: 200, // accordion toggle slide speed in milliseconds
      expandAll: false // allow having multiple expanded accordions in the menu
    },
    dropdown: {
      timeout: 50
    }
  };
  storageObserver = new BehaviorSubject(null);
  offcanvasOptions: OffcanvasOptions = {
    overlay: true,
    baseClass: 'header-menu-wrapper',
    closeBy: 'kt_header_menu_mobile_close_btn',
    toggleBy: {
      target: 'kt_header_mobile_toggle',
      state: 'mobile-toggle-active'
    }
  };

  /**
   * Component Conctructor
   *
   * @param el: ElementRef
   * @param htmlClassService: HtmlClassService
   * @param menuHorService: MenuHorService
   * @param menuConfigService: MenuConfigService
   * @param layoutConfigService: LayouConfigService
   * @param router: Router
   * @param render: Renderer2
   * @param cdr: ChangeDetectorRef
   */
  constructor(
    private el: ElementRef,
    public htmlClassService: HtmlClassService,
    public menuHorService: MenuHorizontalService,
    private menuConfigService: MenuConfigService,
    private layoutConfigService: LayoutConfigService,
    private router: Router,
    private render: Renderer2,
    private cdr: ChangeDetectorRef,
    private auth: AuthService,
    private teachingTimetableService: TeachingTimetableService,
    private schoolServices: SchoolServices,
    private storageSessionService: StorageSessionService,
    private translate: TranslateService
  ) {
    this.unsubscribe = new Subject();
    this.unitelName = this.translate.instant('SYSTEM.UNITEL_NAME')
    // this.schoolInfo = this.storageSessionService.getItem(this.storageSessionService.SCHOOL_INFO).subscribe(data => data.value);
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * After view init
   */
  ngAfterViewInit(): void {
  }

  /**
   * On init
   */
  ngOnInit(): void {
    this.curentUser = this.auth.currentUserValue;
    this.getInitials()
    this.rootArrowEnabled = this.layoutConfigService.getConfig('header.menu.self.rootArrow');
    this.currentRouteUrl = this.router.url;
    setTimeout(() => {
      this.offcanvas = new KTOffcanvas(this.headerMenuOffcanvas.nativeElement, this.offcanvasOptions);
    });
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.currentRouteUrl = this.router.url;
        this.mobileMenuClose();
        this.cdr.markForCheck();
      });
    // this.storageSessionService.watch(this.storageSessionService.SCHOOL_INFO).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
    //   this.shoolName = data.name
    //   console.log('ten truong ==>', this.shoolName)
    //   this.cdr.detectChanges();
    // });
  }

  getInitials() {
    const names = this.curentUser.fullName.split(' ');
    this.abbName = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      // this.abbName = names.map((n)=>n[0]).join('')
      this.abbName += names [names.length - 1].substring(0, 1);
    } else if (names.length === 1) {
      this.abbName = names[0].substring(0, 2).toUpperCase();
    }
  }

  /**
   * Return Css Class Name
   * @param item: any
   */
  getItemCssClasses(item) {
    let classes = 'menu-item';

    if (objectPath.get(item, 'submenu')) {
      classes += ' menu-item-submenu';
    }

    if (!item.submenu && this.isMenuItemIsActive(item)) {
      classes += ' menu-item-active menu-item-here';
    }

    if (item.submenu && this.isMenuItemIsActive(item)) {
      classes += ' menu-item-open menu-item-here';
    }

    if (objectPath.get(item, 'resizer')) {
      classes += ' menu-item-resize';
    }

    const menuType = objectPath.get(item, 'submenu.type') || 'classic';
    if ((objectPath.get(item, 'root') && menuType === 'classic')
      || parseInt(objectPath.get(item, 'submenu.width'), 10) > 0) {
      classes += ' menu-item-rel';
    }

    const customClass = objectPath.get(item, 'custom-class');
    if (customClass) {
      classes += ' ' + customClass;
    }

    if (objectPath.get(item, 'icon-only')) {
      classes += ' menu-item-icon-only';
    }

    return classes;
  }

  /**
   * Returns Attribute SubMenu Toggle
   * @param item: any
   */
  getItemAttrSubmenuToggle(item) {
    let toggle = 'hover';
    if (objectPath.get(item, 'toggle') === 'click') {
      toggle = 'click';
    } else if (objectPath.get(item, 'submenu.type') === 'tabs') {
      toggle = 'tabs';
    } else {
      // submenu toggle default to 'hover'
    }

    return toggle;
  }

  /**
   * Returns Submenu CSS Class Name
   * @param item: any
   */
  getItemMenuSubmenuClass(item) {
    let classes = '';

    const alignment = objectPath.get(item, 'alignment') || 'right';

    if (alignment) {
      classes += ' menu-submenu-' + alignment;
    }

    const type = objectPath.get(item, 'type') || 'classic';
    if (type === 'classic') {
      classes += ' menu-submenu-classic';
    }
    if (type === 'tabs') {
      classes += ' menu-submenu-tabs';
    }
    if (type === 'mega') {
      if (objectPath.get(item, 'width')) {
        classes += ' menu-submenu-fixed';
      }
    }

    if (objectPath.get(item, 'pull')) {
      classes += ' menu-submenu-pull';
    }

    return classes;
  }

  /**
   * Check Menu is active
   * @param item: any
   */
  isMenuItemIsActive(item): boolean {
    if (item.submenu) {
      return this.isMenuRootItemIsActive(item);
    }

    if (!item.page) {
      return false;
    }

    return this.currentRouteUrl.indexOf(item.page) !== -1;
  }

  /**
   * Check Menu Root Item is active
   * @param item: any
   */
  isMenuRootItemIsActive(item): boolean {
    if (item.submenu.items) {
      for (const subItem of item.submenu.items) {
        if (this.isMenuItemIsActive(subItem)) {
          return true;
        }
      }
    }

    if (item.submenu.columns) {
      for (const subItem of item.submenu.columns) {
        if (this.isMenuItemIsActive(subItem)) {
          return true;
        }
      }
    }

    if (typeof item.submenu[Symbol.iterator] === 'function') {
      for (const subItem of item.submenu) {
        const active = this.isMenuItemIsActive(subItem);
        if (active) {
          return true;
        }
      }
    }

    return false;
  }

  mobileMenuClose() {
    if (KTUtil.isBreakpointDown('lg') && this.offcanvas) { // Tablet and mobile mode
      this.offcanvas.hide(); // Hide offcanvas after general link click
    }
  }

  goToAccount() {
    this.router.navigateByUrl('system/account/account-management');
  }

  goToChangePass() {
    this.router.navigateByUrl('system/account/change-password');
  }

  logout() {
    this.auth.logout();
    // this.store.dispatch(new Logout());
  }

}
