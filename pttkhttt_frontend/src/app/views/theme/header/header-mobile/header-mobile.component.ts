// Angular
import { Component, OnInit } from '@angular/core';
// Layout
import { HtmlClassService } from '../../html-class.service';
import { LayoutConfigService, ToggleOptions } from '../../../../core/_base/layout';
import { AuthService } from 'src/app/core/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'kt-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.scss'],
})
export class HeaderMobileComponent implements OnInit {
  // Public properties
  headerLogo = '';
  asideSelfDisplay = true;
  headerMenuSelfDisplay = true;
  headerMobileClasses = '';

  toggleOptions: ToggleOptions = {
    target: KTUtil.getBody(),
    targetState: 'topbar-mobile-on',
    toggleState: 'active'
  };

  /**
   * Component constructor
   *
   * @param layoutConfigService: LayoutConfigService
   */
  constructor(private layoutConfigService: LayoutConfigService, private uiService: HtmlClassService,
    public auth: AuthService,
    private router: Router,
    ) {
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    this.headerMobileClasses = this.uiService.getClasses('header_mobile', true).toString();
    this.headerLogo = this.getLogoUrl();
    this.asideSelfDisplay = this.layoutConfigService.getConfig('aside.self.display');
    this.headerMenuSelfDisplay = this.layoutConfigService.getConfig('header.menu.self.display');
  }

  getLogoUrl() {
    const headerSelfTheme = this.layoutConfigService.getConfig('header.self.theme') || '';
    const brandSelfTheme = this.layoutConfigService.getConfig('brand.self.theme') || '';
    let result = 'logo_laoedu.png';
    if (!this.asideSelfDisplay) {
      if (headerSelfTheme === 'light') {
        result = 'logo-dark.png';
      }
    } else {
      if (brandSelfTheme === 'light') {
        result = 'logo-dark.png';
      }
    }
    return `./assets/media/logos/${result}`;
  }

  goToChangePass() {
    this.router.navigateByUrl('system/account/change-password');
  }

  logout() {
    this.auth.logout();
  }
}
