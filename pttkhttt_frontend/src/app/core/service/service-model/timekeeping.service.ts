import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TimekeepingService {

  private API = `${environment.API_GATEWAY_ENDPOINT}`;
  private httpOptions = {
    headers: new HttpHeaders({
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Content-Type': 'application/json'
    }),
  };

  constructor(private http: HttpClient) { }

  handleSearch(data, page, pageSize){
    const url = this.API + `timekeeping/search?page=${page}&pageSize=${pageSize}`;
    return this.http.post<any>(url, data,  this.httpOptions);
  }

  getAllEmployee() {
    const url = this.API + `timekeeping/getAllEmployee`;
    return this.http.get<any>(url, this.httpOptions)
  }

  getById(data) {
    const url = this.API + `timekeeping/getById`;
    return this.http.post<any>(url,data, this.httpOptions)
  }

  handleCreate(data){
    const url = this.API + `timekeeping/create`;
    return this.http.post<any>(url,data, this.httpOptions)
  }

  handleUpdate(data){
    const url = this.API + `timekeeping/update`;
    return this.http.post<any>(url,data, this.httpOptions)
  }

  handleDelete(data){
    const url = this.API + `timekeeping/delete`;
    return this.http.post<any>(url,data, this.httpOptions)
  }

  handleExport(data){
    const url = this.API + `timekeeping/export`;
    return this.http.post(url, data,{responseType: 'blob'});
  }
}
