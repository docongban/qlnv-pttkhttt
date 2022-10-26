// Angular
import {ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';
// Layout
import {LayoutConfigService, SplashScreenService, TranslationService} from '../../../core/_base/layout';
// Auth
import {AuthNoticeService} from '../../../core/auth';
import {NotiService} from "../../../core/service/service-model/notification.service";
import {Subject} from "rxjs";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'kt-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthComponent implements OnInit {
  // Public properties
  today: number = Date.now();
  headerLogo: string;
  schoolInfo: any;
  private unsubscribe: Subject<any>;

  /**
   * Component constructor
   *
   * @param el
   * @param render
   * @param layoutConfigService: LayoutConfigService
   * @param authNoticeService: authNoticeService
   * @param translationService: TranslationService
   * @param splashScreenService: SplashScreenService
   */
  constructor(
    private el: ElementRef,
    private render: Renderer2,
    private layoutConfigService: LayoutConfigService,
    public authNoticeService: AuthNoticeService,
    private translationService: TranslationService,
    private translate: TranslateService,
    private notiService: NotiService,
    private cdr: ChangeDetectorRef,
    private splashScreenService: SplashScreenService,
  ) {
    this.unsubscribe = new Subject();
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit(): void {
    this.headerLogo = this.layoutConfigService.getLogo();
    this.splashScreenService.hide();
  }

  /**
   * Load CSS for this specific page only, and destroy when navigate away
   * @param styleUrl
   */
  private loadCSS(styleUrl: string) {
    return new Promise((resolve, reject) => {
      const styleElement = document.createElement('link');
      styleElement.href = styleUrl;
      styleElement.type = 'text/css';
      styleElement.rel = 'stylesheet';
      styleElement.onload = resolve;
      this.render.appendChild(this.el.nativeElement, styleElement);
    });
  }
}
