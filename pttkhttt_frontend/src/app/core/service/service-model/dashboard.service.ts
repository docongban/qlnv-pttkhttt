import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {NotiService} from './notification.service';
import {environment} from '../../../../environments/environment';
import {ComparisonOperator, FilterItems, GridParam, SortDirection} from '../model/grid-param';
import {catchError, map, tap} from 'rxjs/operators';
import {error} from '@angular/compiler/src/util';
import {BasicService} from '../utils/basic.service';
import {HelperService} from '../utils/helper.service';
import { CommonServiceService } from '../utils/common-service.service';
import { Teacher } from '../model/teacher.model';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
  })

  export class DashboardService extends BasicService{

    private API = `${environment.API_GATEWAY_ENDPOINT}`;
    private inforFind: GridParam;
    private API_TEST = `${environment.API_GATEWAY_ENDPOINT}`;

    private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      })
    }

    constructor(private http: HttpClient, private notiService: NotiService,private commonService: CommonServiceService,
                public helperService: HelperService) {
      super(http,helperService);
    }

    getAll(data){
        return this.httpClient.post<any>(`${this.API}dashBoard/getInfoForStatistic`,data,this.httpOptions);
    }

    getListSchoolByProvince(id){
      return this.http.get<any>(`${this.API}getSchoolsByProvinceId/${id}`, this.httpOptions);
    }
}
