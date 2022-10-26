
export class MenuConfig {
  public defaults: any = {
    aside: {
      self: {},
      items: [
        {
          title: 'Trang chủ',
          page: '/system/dashboard',
          iconSvg: 'home.svg',
          translate: 'MENU.DASHBOARD',
        },
        {
          title: 'Quản lý trường học',
          page: '/system/school/manages-school',
          iconSvg: 'mng-school.svg',
          translate: 'MENU.MANAGER_SCHOOL.TITLE',
        },
        {
          title: 'Quản lý đăng ký',
          // root: true,
          icon: 'flaticon-dashboard',
          iconSvg: 'Paper.svg',
          page: '/system/package-management',
          // translate: 'MENU.SCHOOL.MANAGER_REGISTER',
          translate: 'MENU.MANAGER_REGISTER.TITLE'
        },
        {
          title: 'Thống kê báo cáo',
          // root: true,
          // icon: 'flaticon-dashboard',
          translate: 'MENU.STATISTIC.TITLE',
          iconSvg: 'dashboard-report.svg',
          submenu: [
            {
              title: 'Theo gói cước',
              page: '/system/statistic',
              translate: 'MENU.STATISTIC.PACKAGE_TRACKING',
            },
            {
              title: 'Theo doanh thu',
              page: '/system/statistic/revenue',
              translate: 'MENU.STATISTIC.REVENUE',
            }]
        },
        {
          title: 'Quản lý gói cước',
          // root: true,
          // icon: 'flaticon-dashboard',
          translate: 'MENU.DATA_PACKAGE.TITLE',
          iconSvg: 'goicuoc.svg',
          page: '/system/data-package',
        },
      ],
    },
  };

  public get configs(): any {
    return this.defaults;
  }
}
