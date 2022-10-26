import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
// @ts-ignore
import {SchoolInformation} from './../models/schoolInformation';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {SearchSchoolModel} from '../model/search-school.model';
import {SchoolModel} from '../model/school.model';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  private API = `${environment.API_GATEWAY_ENDPOINT}`;

  constructor(private httpClient: HttpClient) { }

  private isReload = new BehaviorSubject<boolean>(false);
  isReload$ = this.isReload.asObservable();

  apiGetAll(): Observable<SchoolInformation[]>{
    return this.httpClient.get<SchoolInformation[]>(`${this.API}diem-truong/tat-ca`);
  }

  apiGet(id: string){
    return this.httpClient.get<SchoolInformation[]>(`${this.API}diem-truong/${id}`);
  }

  apiAdd(createData: SchoolInformation): Observable<SchoolInformation>{
    return this.httpClient.post<SchoolInformation>(`${this.API}diem-truong/tao`, createData);
  }

  apiUpdate(id: string, updateData: SchoolInformation): Observable<SchoolInformation>{
    return this.httpClient.put<SchoolInformation>(`${this.API}diem-truong/sua/${id}`, updateData);
  }

  apiDelete(id: string): Observable<any>{
    return this.httpClient.delete(`${this.API}diem-truong/xoa/${id}`);
  }

  apiDeleteMany(id: string){
    return this.httpClient.delete(`${this.API}diem-truong/xoa-danh-sach`)
  }
  // list schools
  getAllSchool(): Observable<any>{
    return this.httpClient.get<any>(`${this.API}schools/getAll`);
  }
  search(searchSchool: SearchSchoolModel, page: any, pageSize: any): Observable<any>{
    return this.httpClient.post<any>(`${this.API}schools/search?page=${page}&page-size=${pageSize}`, searchSchool);
  }
  export(searchSchool: SearchSchoolModel){
    return this.httpClient.post(`${this.API}schools/export`, searchSchool, {responseType: 'blob'});
  }
  createSchool(school: SchoolModel): Observable<any>{
    return this.httpClient.post(`${this.API}schools`, school);
  }
  getDataPackageByLevelSchool(levelSchool: any): Observable<any>{
    return this.httpClient.get<any[]>(`${this.API}data-packages/getByLevelSchool?levelSchool=${levelSchool}`);
  }

  updateSchool(school: SchoolModel): Observable<any>{
    return this.httpClient.put(`${this.API}schools/${school.id}`, school);
  }

  deleteSchool(id: number): Observable<any>{
    return this.httpClient.delete(`${this.API}schools/${id}`);
  }

  getById(id: number):Observable<any>{
    return this.httpClient.get(`${this.API}schools/findById?id=${id}`);
  }

  getInfor(id: any): Observable<any>{
    return this.httpClient.get(`${this.API}schools/infor-school/${id}`);
  }

  getByCode(code: any):Observable<any>{
    return this.httpClient.get<any>(`${this.API}schools/getByCode/${code}`);
  }

  // Khi cập nhật thành công
  changeIsReload(value: boolean) {
    this.isReload.next(value);
    console.log('changeIsReload ', value);
  }
}
