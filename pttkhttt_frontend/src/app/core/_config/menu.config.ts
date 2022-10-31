
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
          title: 'Quản lý công',
          iconSvg: 'mng-school.svg',
          translate: 'Quản lý công',
          submenu: [
            {
              title: 'Quản lý bảng chấm công',
              page: '/system/timekeeping',
              translate: 'Quản lý bảng chấm công',
            },
            {
              title: 'Quản lý ca làm việc',
              translate: 'Quản lý ca làm việc',
            },
          ]
        },
        {
          title: 'Quản lý lương',
          iconSvg: 'goicuoc.svg',
          translate: 'Quản lý lương',
          submenu: [
              {
                title: 'Tính lương',
                translate: 'Tính lương',
              },
              {
                title: 'Xem bảng lương',
                translate: 'Xem bảng lương',
              }]
        },
        {
          title: 'Thống kê báo cáo',
          iconSvg: 'dashboard-report.svg',
          translate: 'Thống kê báo cáo',
          submenu: [
            {
              title: 'Quản lý doanh số',
              translate: 'Quản lý doanh số',
            },
            {
              title: 'Quản lý doanh thu',
              translate: 'Quản lý doanh thu',
            },
          ]
        },
        {
          title: 'Quản lý tài khoản',
          iconSvg: 'mng-school.svg',
          translate: 'Quản lý tài khoản',
        },
        {
          title: 'Kiến nghị, đề xuất',
          iconSvg: 'Paper.svg',
          translate: 'Kiến nghị, đề xuất',
        },
        // {
        //   title: 'Quản lý trường học',
        //   page: '/system/school/manages-school',
        //   iconSvg: 'mng-school.svg',
        //   translate: 'MENU.MANAGER_SCHOOL.TITLE',
        // },
        // {
        //   title: 'Quản lý đăng ký',
        //   // root: true,
        //   icon: 'flaticon-dashboard',
        //   iconSvg: 'Paper.svg',
        //   page: '/system/package-management',
        //   // translate: 'MENU.SCHOOL.MANAGER_REGISTER',
        //   translate: 'MENU.MANAGER_REGISTER.TITLE'
        // },
        // {
        //   title: 'Thống kê báo cáo',
        //   // root: true,
        //   // icon: 'flaticon-dashboard',
        //   translate: 'MENU.STATISTIC.TITLE',
        //   iconSvg: 'dashboard-report.svg',
        //   submenu: [
        //     {
        //       title: 'Theo gói cước',
        //       page: '/system/statistic',
        //       translate: 'MENU.STATISTIC.PACKAGE_TRACKING',
        //     },
        //     {
        //       title: 'Theo doanh thu',
        //       page: '/system/statistic/revenue',
        //       translate: 'MENU.STATISTIC.REVENUE',
        //     }]
        // },
        // {
        //   title: 'Quản lý gói cước',
        //   // root: true,
        //   // icon: 'flaticon-dashboard',
        //   translate: 'MENU.DATA_PACKAGE.TITLE',
        //   iconSvg: 'goicuoc.svg',
        //   page: '/system/data-package',
        // },
      ],
    },
  };

  public get configs(): any {
    return this.defaults;
  }
}
