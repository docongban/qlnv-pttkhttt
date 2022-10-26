import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NotiService} from './notification.service';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {CommonServiceService} from '../utils/common-service.service';


@Injectable({
  providedIn: 'root'
})

export class PackageManagementService {

  private API = `${environment.API_GATEWAY_ENDPOINT}`;
  // private API = 'http://13.212.112.239:8083/api/';
  // private API = `${environment.AUTH_SERVER}/api/`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
    })
  }
  constructor(private httpClient: HttpClient,
              private notiService: NotiService,
              private commonService: CommonServiceService) {
  }


  getAllSchool():Observable<any>{
    return this.httpClient.get<any>(`${this.API}schools/getAll`);
  }

  getSchoolHasLimit50(codeOrName:any):Observable<any>{
    return this.httpClient.get<any>(`${this.API}schools/getSchoolHasLimit50?codeOrName=${codeOrName}`);
  }

  getAlDataPackage():Observable<any>{
    return this.httpClient.get<any>(`${this.API}dataPackage/getAll`);
  }

  getDataPackageLimit50(codeOrName:any):Observable<any>{
    return this.httpClient.get<any>(`${this.API}dataPackage/getDataPackageLimit50?codeOrName=${codeOrName}`);
  }

  searchManagementRegistration(obj : any): Observable<any>{
    return this.httpClient.post<any>(`${this.API}register-packages/searchManagementRegistration`,obj,this.httpOptions);
  }

  export(dataSearch: any) {
    return this.httpClient.post(
      `${this.API}register-packages/export`,
      { ...dataSearch},
      { responseType: 'blob' }
    );
  }

  activeRegister(obj : any): Observable<any>{
    return this.httpClient.post<any>(`${this.API}register-packages/active`,obj,this.httpOptions);
  }


}
