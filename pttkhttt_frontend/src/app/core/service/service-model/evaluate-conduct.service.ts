import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NotiService} from './notification.service';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {CommonServiceService} from '../utils/common-service.service';
import {SubjectModel} from '../model/subjects.model';

@Injectable({
  providedIn: 'root'
})

export class EvaluateConductService {

  // private API = `${environment.API_GATEWAY_ENDPOINT}evaluate-conduct/`;
  // private API = 'http://13.212.112.239:8083/api/';
  private API = `${environment.AUTH_SERVER}/api/evaluate-conduct/`;

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

  getSemesterByYear(year : any):Observable<any>{
    return this.httpClient.post<any>(`${this.API}semester-by-year`,year,this.httpOptions);
  }

  searchEvaluate(obj : any):Observable<any>{
    return this.httpClient.post<any>(`${this.API}search`,obj,this.httpOptions);
  }

  getCompetition(type : any):Observable<any>{
    return this.httpClient.post<any>(`${this.API}competition`,type,this.httpOptions);
  }
  getClassroomFollowUserIdAndYears(type : any):Observable<any>{
    return this.httpClient.post<any>(`${this.API}classroom-by-user-and-year`,type,this.httpOptions);
  }

  updateData(obj : any):Observable<any>{
    return this.httpClient.post<any>(`${this.API}update`,obj,this.httpOptions);
  }

  getTeacherEvaluate(obj : any):Observable<any>{
    return this.httpClient.post<any>(`${this.API}teacher-evaluate`,obj,this.httpOptions);
  }

  getAllClassRoom():Observable<any>{
    const url = `${environment.API_GATEWAY_ENDPOINT}/class-rooms`;
    return this.httpClient.get<any>(`${url}`);
  }


}
