import { Component, TemplateRef, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SeriesHighlight } from "@progress/kendo-angular-charts";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NO_ROW_GRID_TEMPLATE } from 'src/app/helpers/constants';

@Component({
    selector: 'kt-statistic-detail',
    templateUrl: 'statistic-detail.component.html',
    styleUrls: ['statistic-detail.component.scss']
})
export class StatisticDetailComponent implements OnInit, ICellRendererAngularComp {


    params
    modalRef: BsModalRef
    noRowDataTemPlate = NO_ROW_GRID_TEMPLATE;
    packageName

    seriesLine: any = {
        type: 'line',
        stack: true,
        name: 'revenue',
        color: '#ed6421',
        axis: 'revenue'
    }

    valueAxes: any = {
        name: 'revenue',
        title: 'Doanh thu ($)',
        color: 'rgb(216, 218, 229)',
        min: 0,
        max: 11000,
        majorUnit: 2000,
        majorGridLine: {
            width: 0
        },
        majorTicks: {
            width: 0,
            size: 0
        }
    }

    labels = {
        color: '#101840',
        font: 'bold 10px Inter',
    }

    labels1 = {
        margin: {
            bottom: 20
        }        
    }

    public highlight: SeriesHighlight = {
        markers: {
          color: "#3366ff",
        },
    };

    public categories: string[] = ['','01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    crossingValues = [1, 99]

    constructor(
        private modalService: BsModalService,
    ) { }

    ngOnInit(): void {
    }

    openModal(template: TemplateRef<any>) {
        const flexRootDOM = document.querySelector('.flex-root') as HTMLElement;
        flexRootDOM.classList.add('overflow-hidden')
        const month = this.params.api.months.reduce( (n, o) => {
            return n > o ? n : o;
        }, this.params.api.months[0])

        this.seriesLine.data = []

        for (let i = 0; i <= month; i++) {
            this.seriesLine.data.push(
                this.params.data[`priceMonth${i}`]
            )
        }

        const maxRevenue = this.seriesLine.data.reduce( (n, o) => {
            return n > o ? n : o
        }, this.seriesLine.data[1])

        if (maxRevenue > 0) {
            const maxRevenueStr = maxRevenue <10?'0'+Math.ceil(maxRevenue)+'':+Math.ceil(maxRevenue)+''
            const max: number = this.resolveMax(maxRevenueStr)

            this.valueAxes.majorUnit = max/5
            this.valueAxes.max = max + (this.valueAxes.majorUnit/2)
        }
        
        this.modalRef = this.modalService.show(
            template,
            { class: 'modal-center statistic-detail-modal' }
        )
        this.modalRef.onHide.subscribe( () => {
            const flexRootDOM = document.querySelector('.flex-root') as HTMLElement;
            flexRootDOM.classList.remove('overflow-hidden')
        })
    }

    closeModal() {
        if (this.modalRef) {
            this.modalRef.hide()
        }
    }

    agInit(params) {
        this.params = params
        this.packageName = params.data.dataPackageName
        this.seriesLine.data = []
    }

    refresh(params): boolean {
        return false
    }

    resolveMax(maxRevenueStr: string) {
        return parseInt((parseInt(maxRevenueStr.substring(0,2))+1)+'0'.repeat( maxRevenueStr.length - 2 ))
    }

    functionReturningString(param): string {
        return '$'+param.value 
    }
}
