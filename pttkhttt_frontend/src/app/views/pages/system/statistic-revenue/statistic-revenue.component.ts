import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { StatisticDetailComponent } from "./statistic-detail/statistic-detail.component";
import { DataPackageService } from '../../../../core/service/service-model/data-package.service';
import { Subscription, forkJoin } from 'rxjs';
import { StatisticRevenueService } from "./statistic-revenue.service";
import { take } from 'rxjs/operators';
import { QUARTERS, SUB_HEADER } from 'src/app/helpers/constants';
import * as moment from 'moment';
import { CommonServiceService } from "src/app/core/service/utils/common-service.service";
import { SubheaderService } from "src/app/core/_base/layout";
import { Breadcrumb } from "src/app/core/_base/layout/services/subheader.service";
@Component({
  selector: 'kt-statistic-revenue',
  templateUrl: 'statistic-revenue.component.html',
  styleUrls: ['grid.scss', 'statistic-revenue.component.scss']
})
export class StatisticRevenueComponent implements OnInit, OnDestroy {

  subscription: Subscription

  FORMAT_DATE = 'YYYY-MM-DD'
  PAGE_SIZE = 10

  currentLang: string = localStorage.getItem('language');

  headerHeight = 65
  grid
  gridApi
  columnDefsStatisticUser
  rowDataStatisticUser = []

  columnDefsStatisticRevenue
  rowDataStatisticRevenue = []

  columnDefsStatisticDetail
  rowDataStatisticDetail = []

  overlayNoRowsTemplate = 'no row'

  BASE_CSS = {
    'border-left': '1px solid #E6E8F0',
    'border-bottom': '1px solid #E6E8F0',
    'font-family': 'Inter',
    'font-style': 'normal',
    'font-weight': '600',
    'font-size': '12px',
    'line-height': '20px',
    'color': '#101840',
    'display': 'flex',
    'justify-content': 'center',
    'align-items': 'center',
    'top': '-1px',
    'text-align': 'center'
  }

  subheader
  isLoading
  searchObj
  first; last; totalRecord; currentPage; totalPage; rangeWithDots

  breadCrumbs: Breadcrumb[] = [
    {
      title: this.translate.instant('MENU.STATISTIC.TITLE'),
      page: '/system/statistic/revenue',
    },
    {
      title: this.translate.instant('MENU.STATISTIC.REVENUE'),
      page: '/system/statistic/revenue'
    }
  ]

  constructor(
    private translate: TranslateService,
    private dataPackageService: DataPackageService,
    private statisticRevenueService: StatisticRevenueService,
    private changeDetectorRef: ChangeDetectorRef,
    private commonService: CommonServiceService,
    private subheaderService: SubheaderService
  ) {}

  ngOnInit(): void {
    this.currentPage = 1
    this.generateColumnStatisticDetail()
    this.generateColumnStatisticUser()
    this.generateColumnStatisticRevenue()

    this.subheaderService.setBreadcrumbs(this.breadCrumbs)

    this.subscription = this.dataPackageService.currentSubheader$.subscribe( {
      next: subheader => {
        this.changeLoading(true)
        this.subheader = subheader
        this.handleSearchObj(subheader)
        this.searchObj.page = this.currentPage
        this.searchObj.pageSize = this.PAGE_SIZE

        forkJoin([
          this.statisticRevenueService.getDataStatistic(this.searchObj),
          this.statisticRevenueService.getDataStatisticDetail(this.searchObj)
        ]).subscribe({
          next: ([resp, respDetail]) => {

            if (resp) {
              this.rowDataStatisticUser = [
                {
                  countBeginRegister: this.formatMoney(resp.countBeginRegister),
                  countBeginCancel: this.formatMoney(resp.countBeginCancel),
                  countCurrentRegister: this.formatMoney(resp.countCurrentRegister),
                  countCurrentCancel: this.formatMoney(resp.countCurrentCancel),
                  countActiveEnd: this.formatMoney(resp.countActiveEnd),
                  ratioGrowthUser: this.formatRatio(resp.ratioGrowthUser)
                }
              ]
              this.rowDataStatisticRevenue = [
                {
                  sumBeginPrice: this.formatMoney(resp.sumBeginPrice),
                  sumCurrentPrice: this.formatMoney(resp.sumCurrentPrice),
                  sumPriceEnd: this.formatMoney(resp.sumPriceEnd),
                  ratioGrowthPrice: this.formatRatio(resp.ratioGrowthPrice)
                }
              ]
            }

            this.first = 0
            this.last = 0
            this.totalPage = 0
            this.totalRecord = 0

            if (respDetail) {
              this.rowDataStatisticDetail = respDetail.content
              this.totalRecord = respDetail.totalElements
              this.totalPage = respDetail.totalPages
              this.first = (this.currentPage - 1) * this.PAGE_SIZE + 1
              this.last = respDetail.numberOfElements + (this.PAGE_SIZE * (this.currentPage - 1))
              this.rangeWithDots = this.commonService.pagination(this.currentPage, this.totalPage);

              this.resizeLastColumns()
            }

            const interval = setInterval( () => {
              if (this.gridApi) {
                this.gridApi.months = this.subheader.months
                this.gridApi.formatMoney = this.formatMoney
                clearInterval(interval)
              }
            }, 50)
            this.resizeLastColumns()
            this.changeDetectorRef.detectChanges()
            this.changeLoading(false)

          },
          error: ([error, errorDetail]) => {
            this.changeLoading(false)
            console.log(error)
            console.log(errorDetail)
          }
        })
      }
    })
  }

  generateColumnStatisticUser() {
    this.columnDefsStatisticUser = [
      {
        headerName: this.trans('STATISTIC_USER.AMOUNT_FIRST_SEMESTER'),
        headerTooltip: this.trans('STATISTIC_USER.AMOUNT_FIRST_SEMESTER'),
        headerClass: 'parent-header',
        suppressMovable: true,
        children: [
          {
            headerName: this.trans('REGISTER'),
            headerTooltip: this.trans('REGISTER'),
            headerClass: 'sub-header',
            suppressMovable: true,
            minWidth: 120,
            maxWidth: 120,
            cellStyle: {
              ...this.BASE_CSS,
              'display': 'block',
              'text-overflow': 'ellipsis',
              'overflow': 'hidden',
              'padding-top': '16px',
              'border-left': 'none'
            },
            tooltipField: 'countBeginRegister',
            field: 'countBeginRegister'
          },
          {
            headerName: this.trans('EXPIRED'),
            headerTooltip: this.trans('EXPIRED'),
            headerClass: 'sub-header',
            suppressMovable: true,
            minWidth: 120,
            maxWidth: 120,
            cellStyle: {
              ...this.BASE_CSS,
              'display': 'block',
              'text-overflow': 'ellipsis',
              'overflow': 'hidden',
              'padding-top': '16px'
            },
            tooltipField: 'countBeginCancel',
            field: 'countBeginCancel'
          },
        ]
      },
      {
        headerName: this.trans('CHANGE_IN_SEMESTER'),
        headerTooltip: this.trans('CHANGE_IN_SEMESTER'),
        headerClass: 'parent-header',
        suppressMovable: true,
        children: [
          {
            headerName: this.trans('REGISTER'),
            headerTooltip: this.trans('REGISTER'),
            headerClass: 'sub-header',
            suppressMovable: true,
            minWidth: 120,
            maxWidth: 120,
            tooltipField: 'countCurrentRegister',
            field: 'countCurrentRegister',
            cellStyle: {
              ...this.BASE_CSS,
              'display': 'block',
              'text-overflow': 'ellipsis',
              'overflow': 'hidden',
              'padding-top': '16px'
            },
          },
          {
            headerName: this.trans('EXPIRED'),
            headerTooltip: this.trans('EXPIRED'),
            headerClass: 'sub-header',
            suppressMovable: true,
            minWidth: 120,
            maxWidth: 120,
            tooltipField: 'countCurrentCancel',
            field: 'countCurrentCancel',
            cellStyle: {
              ...this.BASE_CSS,
              'display': 'block',
              'text-overflow': 'ellipsis',
              'overflow': 'hidden',
              'padding-top': '16px'
            }
          },
        ]
      },
      {
        headerName: this.trans('AMOUNT_ACTIVE'),
        headerTooltip: this.trans('AMOUNT_ACTIVE'),
        headerClass: 'header-not-children padding7px',
        suppressMovable: true,
        minWidth: 110,
        tooltipField: 'countActiveEnd',
        field: 'countActiveEnd',
        cellStyle: {
          ...this.BASE_CSS,
          'display': 'block',
          'text-overflow': 'ellipsis',
          'overflow': 'hidden',
          'padding-top': '16px'
        },
      },
      {
        headerName: this.trans('USER_GROWTH'),
        headerTooltip: this.trans('USER_GROWTH'),
        headerClass: 'header-not-children padding7px',
        suppressMovable: true,
        minWidth: 110,
        tooltipField: 'ratioGrowthUser',
        cellStyle: {
          ...this.BASE_CSS,
          'display': 'block',
          'padding-top': '16px',
        },
        cellRenderer: params => {
          const growthUser = params.data.ratioGrowthUser
          const backgroundColor = growthUser.startsWith('-') ? growthUser.length == 1 ? 'transparent' : '#D14343' : '#429777'
          const color = backgroundColor == 'transparent' ? '#000000' : '#ffffff'
          return `<span class='ratio-column' style='background: ${backgroundColor}; color: ${color}'>
            ${growthUser}
            </span>`
        }
      }
    ]
  }

  generateColumnStatisticRevenue() {
    this.columnDefsStatisticRevenue = [
      {
        headerName: this.trans('STATISTIC_REVENUE.REVENUE_FIST_SEMESTER'),
        headerTooltip: this.trans('STATISTIC_REVENUE.REVENUE_FIST_SEMESTER'),
        suppressMovable: true,
        minWidth: 140,
        maxWidth: 140,
        cellStyle: {
          ...this.BASE_CSS,
          'display': 'block',
          'text-overflow': 'ellipsis',
          'overflow': 'hidden',
          'padding-top': '16px',
          'border-left': 'none'
        },
        tooltipField: 'sumBeginPrice',
        field: 'sumBeginPrice'
      },
      {
        headerName: this.trans('REVENUE_IN_SEMESTER'),
        headerTooltip: this.trans('REVENUE_IN_SEMESTER'),
        suppressMovable: true,
        minWidth: 140,
        maxWidth: 140,
        cellStyle: {
          ...this.BASE_CSS,
          'display': 'block',
          'text-overflow': 'ellipsis',
          'overflow': 'hidden',
          'padding-top': '16px'
        },
        tooltipField: 'sumCurrentPrice',
        field: 'sumCurrentPrice'
      },
      {
        headerName: this.trans('REVENUE_LAST_SEMESTER'),
        headerTooltip: this.trans('REVENUE_LAST_SEMESTER'),
        suppressMovable: true,
        minWidth: 140,
        cellStyle: {
          ...this.BASE_CSS,
          'display': 'block',
          'text-overflow': 'ellipsis',
          'overflow': 'hidden',
          'padding-top': '16px'
        },
        tooltipField: 'sumPriceEnd',
        field: 'sumPriceEnd'
      },
      {
        headerName: this.trans('REVENUE_GROWTH'),
        headerTooltip: this.trans('REVENUE_GROWTH'),
        headerClass: 'background-gray',
        suppressMovable: true,
        minWidth: 140,
        cellStyle: {
          ...this.BASE_CSS,
          'display': 'block',
          'padding': '0 24px;',
          'padding-top': '16px'
        },
        tooltipField: 'ratioGrowthPrice',
        cellRenderer: params => {
          const growthPrince = params.data.ratioGrowthPrice
          const backgroundColor = growthPrince.startsWith('-') ? growthPrince.length == 1 ? 'transparent' : '#D14343' : '#429777'
          const color = backgroundColor == 'transparent' ? '#000000' : '#ffffff'
          return `<span class='ratio-column' style='background: ${backgroundColor}; color: ${color}'>
            ${growthPrince}
            </span>`
        }
      }
    ]
  }

  generateColumnStatisticDetail() {
    this.columnDefsStatisticDetail = [
      {
        headerName: this.trans('DETAIL_STATISTIC.NO'),
        headerTooltip: this.trans('DETAIL_STATISTIC.NO'),
        suppressMovable: true,
        lockPosition: true,
        minWidth: 60,
        maxWidth: 60,
        pinned: 'left',
        cellStyle: {
          ...this.BASE_CSS,
          'border': 'none'
        },
        valueGetter: params => {
          return params.node.rowIndex + (((this.currentPage - 1) * this.PAGE_SIZE) + 1)
        }
      },
      {
        headerName: this.trans('DETAIL_STATISTIC.PACKAGE'),
        headerTooltip: this.trans('DETAIL_STATISTIC.PACKAGE'),
        headerClass: 'package-name',
        suppressMovable: true,
        minWidth: 80,
        maxWidth: 80,
        pinned: 'left',
        cellStyle: {
          ...this.BASE_CSS,
          'border': 'none',
          'text-align': 'left',
          'display': 'block',
          'text-overflow': 'ellipsis',
          'overflow': 'hidden',
          'padding-top': '16px'
        },
        tooltipField: 'dataPackageName',
        field: 'dataPackageName'
      },
      {
        headerName: this.trans('STATISTIC_USER.AMOUNT_FIRST_SEMESTER'),
        headerTooltip: this.trans('STATISTIC_USER.AMOUNT_FIRST_SEMESTER'),
        headerClass: 'parent-header',
        suppressMovable: true,
        children: [
          {
            headerName: this.trans('REGISTER'),
            headerTooltip: this.trans('REGISTER'),
            headerClass: 'sub-header',
            minWidth: 100,
            cellStyle: {
              ...this.BASE_CSS,
              'border': 'none',
              'display': 'block',
              'text-overflow': 'ellipsis',
              'overflow': 'hidden',
              'padding-top': '16px'
            },
            tooltipValueGetter: params => {
              return this.formatMoney(params.data.registerBegin)
            },
            valueGetter: params => {
              return this.formatMoney(params.data.registerBegin)
            }
          },
          {
            headerName: this.trans('EXPIRED'),
            headerTooltip: this.trans('EXPIRED'),
            headerClass: 'sub-header',
            suppressMovable: true,
            minWidth: 100,
            cellStyle: {
              ...this.BASE_CSS,
              'border': 'none',
              'display': 'block',
              'text-overflow': 'ellipsis',
              'overflow': 'hidden',
              'padding-top': '16px'
            },
            tooltipValueGetter: params => {
              return this.formatMoney(params.data.cancelBegin)
            },
            valueGetter: params => {
              return this.formatMoney(params.data.cancelBegin)
            }
          }
        ]
      },
      {
        headerName: this.trans('STATISTIC_REVENUE.REVENUE_FIST_SEMESTER'),
        headerTooltip: this.trans('STATISTIC_REVENUE.REVENUE_FIST_SEMESTER'),
        headerClass: `header-not-children three-row-${this.currentLang}`,
        suppressMovable: true,
        minWidth: 100,
        cellStyle: {
          ...this.BASE_CSS,
          'border': 'none',
          'display': 'block',
          'text-overflow': 'ellipsis',
          'overflow': 'hidden',
          'padding-top': '16px'
        },
        tooltipValueGetter: params => {
          return this.formatMoney(params.data.sumBeginPrice)
        },
        valueGetter: params => {
          return this.formatMoney(params.data.sumBeginPrice)
        }
      },
      {
        headerName: this.trans('CHANGE_IN_SEMESTER'),
        headerTooltip: this.trans('CHANGE_IN_SEMESTER'),
        headerClass: 'parent-header',
        suppressMovable: true,
        children: [
          {
            headerName: this.trans('REGISTER'),
            headerTooltip: this.trans('REGISTER'),
            headerClass: 'sub-header',
            suppressMovable: true,
            minWidth: 100,
            cellStyle: {
              ...this.BASE_CSS,
              'border': 'none',
              'display': 'block',
              'text-overflow': 'ellipsis',
              'overflow': 'hidden',
              'padding-top': '16px'
            },
            tooltipValueGetter: params => {
              return this.formatMoney(params.data.registerCurrent)
            },
            valueGetter: params => {
              return this.formatMoney(params.data.registerCurrent)
            }
          },
          {
            headerName: this.trans('EXPIRED'),
            headerTooltip: this.trans('EXPIRED'),
            headerClass: 'sub-header',
            suppressMovable: true,
            minWidth: 100,
            tooltipField: 'cancelCurrent',
            field: 'cancelCurrent',
            cellStyle: {
              ...this.BASE_CSS,
              'border': 'none',
              'display': 'block',
              'text-overflow': 'ellipsis',
              'overflow': 'hidden',
              'padding-top': '16px'
            },
            tooltipValueGetter: params => {
              return this.formatMoney(params.data.cancelCurrent)
            },
            valueGetter: params => {
              return this.formatMoney(params.data.cancelCurrent)
            }
          }
        ]
      },
      {
        headerName: this.trans('REVENUE_IN_SEMESTER'),
        headerTooltip: this.trans('REVENUE_IN_SEMESTER'),
        headerClass: `header-not-children three-row-${this.currentLang}`,
        suppressMovable: true,
        minWidth: 100,
        cellStyle: {
          ...this.BASE_CSS,
          'border': 'none',
          'display': 'block',
          'text-overflow': 'ellipsis',
          'overflow': 'hidden',
          'padding-top': '16px'
        },
        tooltipValueGetter: params => {
          return this.formatMoney(params.data.sumCurrentPrice)
        },
        valueGetter: params => {
          return this.formatMoney(params.data.sumCurrentPrice)
        }
      },
      {
        headerName: this.trans('DETAIL_STATISTIC.AMOUNT_LAST_SEMESTER'),
        headerTooltip: this.trans('DETAIL_STATISTIC.AMOUNT_LAST_SEMESTER'),
        headerClass: 'parent-header',
        suppressMovable: true,
        children: [
          {
            headerName: this.trans('REGISTER'),
            headerTooltip: this.trans('REGISTER'),
            headerClass: 'sub-header',
            suppressMovable: true,
            minWidth: 100,
            cellStyle: {
              ...this.BASE_CSS,
              'border': 'none',
              'display': 'block',
              'text-overflow': 'ellipsis',
              'overflow': 'hidden',
              'padding-top': '16px'
            },
            tooltipValueGetter: params => {
              return this.formatMoney(params.data.registerEnd)
            },
            valueGetter: params => {
              return this.formatMoney(params.data.registerEnd)
            }
          },
          {
            headerName: this.trans('EXPIRED'),
            headerTooltip: this.trans('EXPIRED'),
            headerClass: 'sub-header',
            suppressMovable: true,
            minWidth: 100,
            cellStyle: {
              ...this.BASE_CSS,
              'border': 'none',
              'display': 'block',
              'text-overflow': 'ellipsis',
              'overflow': 'hidden',
              'padding-top': '16px'
            },
            tooltipValueGetter: params => {
              return this.formatMoney(params.data.cancelEnd)
            },
            valueGetter: params => {
              return this.formatMoney(params.data.cancelEnd)
            }
          }
        ]
      },
      {
        headerName: this.trans('AMOUNT_ACTIVE'),
        headerTooltip: this.trans('AMOUNT_ACTIVE'),
        headerClass: `header-not-children padding7px three-row-${this.currentLang}`,
        suppressMovable: true,
        minWidth: 110,
        cellStyle: {
          ...this.BASE_CSS,
          'border': 'none',
          'display': 'block',
          'text-overflow': 'ellipsis',
          'overflow': 'hidden',
          'padding-top': '16px'
        },
        tooltipValueGetter: params => {
          return this.formatMoney(params.data.countActiveEnd)
        },
        valueGetter: params => {
          return this.formatMoney(params.data.countActiveEnd)
        }
      },
      {
        headerName: this.trans('REVENUE_LAST_SEMESTER'),
        headerTooltip: this.trans('REVENUE_LAST_SEMESTER'),
        headerClass: 'header-not-children',
        suppressMovable: true,
        minWidth: 100,
        cellStyle: {
          ...this.BASE_CSS,
          'border': 'none',
          'display': 'block',
          'text-overflow': 'ellipsis',
          'overflow': 'hidden',
          'padding-top': '16px'
        },
        tooltipValueGetter: params => {
          return this.formatMoney(params.data.sumPriceEnd)
        },
        valueGetter: params => {
          return this.formatMoney(params.data.sumPriceEnd)
        }
      },
      {
        headerName: this.trans('USER_GROWTH'),
        headerTooltip: this.trans('USER_GROWTH'),
        headerClass: 'padding7px',
        suppressMovable: true,
        minWidth: 110,
        maxWidth: 110,
        pinned: 'right',
        cellStyle: params => {
          const css = {
            ...this.BASE_CSS,
            'border': 'none',
            'display': 'block',
            'text-overflow': 'ellipsis',
            'overflow': 'hidden',
            'padding-top': '16px'
          }
          css.color = params.data.ratioGrowthUser < 0 ? '#D14343' : '#429777'
          return css
        },
        tooltipValueGetter: params => {
          const value = params.data.ratioGrowthUser
          return this.formatRatio(value)
        },
        valueGetter: params => {
          const value = params.data.ratioGrowthUser
          return this.formatRatio(value)
        }
      },
      {
        headerName: this.trans('REVENUE_GROWTH'),
        headerTooltip: this.trans('REVENUE_GROWTH'),
        headerClass: 'padding7px',
        suppressMovable: true,
        pinned: 'right',
        minWidth: 110,
        maxWidth: 110,
        cellStyle: params => {
          const css = {
            ...this.BASE_CSS,
            'border': 'none',
            'display': 'block',
            'text-overflow': 'ellipsis',
            'overflow': 'hidden',
            'padding-top': '16px'
          }
          css.color = params.data.ratioGrowthPrice < 0 ? '#D14343' : '#429777'
          return css
        },
        tooltipValueGetter: params => {
          const value = params.data.ratioGrowthPrice
          return this.formatRatio(value)
        },
        valueGetter: params => {
          const value = params.data.ratioGrowthPrice
          return this.formatRatio(value)
        }
      },
      {
        headerName: this.trans('DETAIL_STATISTIC.CHANGE_HISTORY'),
        headerTooltip: this.trans('DETAIL_STATISTIC.CHANGE_HISTORY'),
        headerClass: `history three-row-${this.currentLang}`,
        suppressMovable: true,
        pinned: 'right',
        minWidth: 100,
        cellStyle: {
          ...this.BASE_CSS,
          'border': 'none',
          'justify-content': 'left',
        },
        cellRendererFramework: StatisticDetailComponent,
        
      }
    ]
  }

  trans(key: string): string {
    return this.translate.instant(`STATISTIC_REVENUE.${key}`)
  }

  exportExcel() {
    const fileName = `${this.trans('FILE_NAME')}${this.searchObj.year}.xlsx`


    switch(this.subheader.type) {
      case SUB_HEADER.TYPE_MONTH:
        this.searchObj.title = `<${this.trans('MONTH')} ${this.subheader.month}/${this.subheader.year}>`
        if (this.currentLang === 'en') {
          this.searchObj.title = `<${this.translate.instant('COMMON.MONTH_'+this.subheader.month)}/${this.subheader.year}>`;
        }
        break;
      case SUB_HEADER.TYPE_QUARTER:
        this.searchObj.title = `<${this.trans('QUARTER')} ${this.subheader.quarter < 4 ? 'I'.repeat(this.subheader.quarter) : 'IV'}/${this.subheader.year}>`
        if (this.currentLang === 'en') {
          this.searchObj.title = `<${this.translate.instant('COMMON.QUARTER_'+this.subheader.quarter)}/${this.subheader.year}>`;
        }
        break;
      case SUB_HEADER.TYPE_YEAR:
        this.searchObj.title = `<${this.trans('YEAR')} ${this.subheader.year}>`
        break;
    }

    this.statisticRevenueService.exportData(this.searchObj, fileName)
  }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit()
  }

  gridSizeChangedDetail(params) {
    params.api.sizeColumnsToFit()
    this.resizeLastColumns()
  }

  onGridReady(params) {
    this.grid = params
    this.gridApi = params.api
    setTimeout( () => {
      params.api.sizeColumnsToFit()
    }, 50)
  }

  resizeLastColumns() {
    setTimeout( () => {
      const header = (document.querySelector('.statistic-detail .ag-pinned-right-header') as HTMLElement)
      const body = (document.querySelector('.statistic-detail .ag-pinned-right-cols-container') as HTMLElement)
      body.style.minWidth = `${header.offsetWidth}px`
    }, 1000)
  }

  formatMoney(money) {
    const moneyFloat = parseFloat(money)
    if ( (money+'').includes('.') && moneyFloat+'' == money) {
      money = moneyFloat.toFixed(2)
    }
    return (moneyFloat+'').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  changeLoading(show): void {
    this.isLoading = show
    this.changeDetectorRef.detectChanges()
  }

  handleSearchObj(subheader) {
    this.searchObj = {
      year: subheader.year
    }

    if (subheader.type == SUB_HEADER.TYPE_MONTH) {
      const dateString= subheader.month.toString()+'/1/'+ subheader.year.toString();
      this.searchObj.fromDateCurrent = moment(new Date(dateString)).startOf('month').format(this.FORMAT_DATE)
      this.searchObj.toDateCurrent = moment(new Date(dateString)).endOf('month').format(this.FORMAT_DATE)
      this.searchObj.toDateBegin = moment(new Date(dateString)).subtract(1, 'months').endOf('month').format(this.FORMAT_DATE)
      // this.searchObj.fromDateCurrent = moment(`${subheader.year}-${subheader.month}`).startOf('month').format(this.FORMAT_DATE)
      // this.searchObj.toDateCurrent = moment(`${subheader.year}-${subheader.month}`).endOf('month').format(this.FORMAT_DATE)
      // this.searchObj.toDateBegin = moment(`${subheader.year}-${subheader.month}`).subtract(1, 'months').endOf('month').format(this.FORMAT_DATE)
      return
    }

    if (subheader.type == SUB_HEADER.TYPE_QUARTER) {
      const quarter = QUARTERS.find(q => q.id == subheader.quarter)
      this.searchObj.fromDateCurrent = `${subheader.year}-${quarter?.fromDate}`
      this.searchObj.toDateCurrent = `${subheader.year}-${quarter?.toDate}`
      this.searchObj.toDateBegin = moment(this.searchObj.fromDateCurrent).subtract(1, 'months').endOf('month').format(this.FORMAT_DATE)
      return
    }

    if (subheader.type == SUB_HEADER.TYPE_YEAR) {
      this.searchObj.fromDateCurrent = `${subheader.year}-01-01`
      this.searchObj.toDateCurrent = `${subheader.year}-12-30`
      this.searchObj.toDateBegin = `${subheader.year-1}-12-30`
      return
    }
  }

  getDataStatisticDetail() {
    this.changeLoading(true)
    this.statisticRevenueService.getDataStatisticDetail(this.searchObj).pipe(take(1)).subscribe({
      next: respDetail => {

        this.first = 0
        this.last = 0
        this.totalPage = 0
        this.totalRecord = 0

        if (respDetail) {
          this.rowDataStatisticDetail = respDetail.content
          this.totalRecord = respDetail.totalElements
          this.totalPage = respDetail.totalPages
          this.first = (this.currentPage - 1) * this.PAGE_SIZE + 1
          this.last = respDetail.numberOfElements + (this.PAGE_SIZE * (this.currentPage - 1))
          this.rangeWithDots = this.commonService.pagination(this.currentPage, this.totalPage);
        }
        this.changeLoading(false)
        this.changeDetectorRef.detectChanges()
      },
      error: error => {
        this.changeLoading(false)
        console.log(error)
      }
    })
  }

  formatRatio(ratioValue: any) {
    if (ratioValue == '-') return ratioValue
    if ((ratioValue+'').includes('.')) {
      return this.formatMoney(parseFloat(ratioValue).toFixed(2)) + '%'
    }
    return this.formatMoney(ratioValue)+'%'
  }

  paging(number) {
    this.currentPage = number
    this.searchObj.pageSize = this.PAGE_SIZE
    this.searchObj.page = this.currentPage
    this.getDataStatisticDetail()
  }

  prev() {
    this.currentPage--
    if (this.currentPage < 1) {
      this.currentPage = 1
      return
    }
    this.paging(this.currentPage)
  }

  next() {
    this.currentPage++
    if (this.currentPage > this.totalPage) {
      this.currentPage = this.totalPage
      return
    }
    this.paging(this.currentPage)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

}
