import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment'
import { BasicService } from 'src/app/core/service/utils/basic.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HelperService } from 'src/app/core/service/utils/helper.service';
import { CommonServiceService } from 'src/app/core/service/utils/common-service.service';


@Injectable({
    providedIn: 'root'
  })
export class StatisticRevenueService extends BasicService {

    API = environment.API_GATEWAY_ENDPOINT
    // API = 'http://localhost:8084/api/'

    constructor(
      private commonService: CommonServiceService,
      httpClient: HttpClient,
      helperService: HelperService
    )  {
      super(httpClient, helperService)
    }
   
    getDataStatistic(data) {
      return this.postRequest(
        `${this.API}register-packages/get-data-statistical`, data
      )
    }

    getDataStatisticDetail(data) {
      return this.postRequest(
        `${this.API}register-packages/get-details-data`, data,
        {page: data.page-1, size: data.pageSize}
      )
    }

    exportData(data: any, fileName: string) {
      this.commonService.downloadFile(`${this.API}report-package/export`, data, null, fileName)
    }

}