import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {CommonServiceService} from "../../../../core/service/utils/common-service.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AcademicAbilitiesService {

  constructor(private http: HttpClient,
              private commonService: CommonServiceService) {

  }

  public save(obj: any) {
    return this.http.post(this.SERVICE_URL + 'attendance-diligence/save', obj);
  }

  public getHoliday(obj: any) {
    return this.http.post(this.SERVICE_URL + 'holiday', obj);
  }

  public getClassRoom(obj:any) {
    return this.http.post<any>(`${this.SERVICE_URL}lass-rooms/teacher-and-year`,obj);
  }

  public getClassroomByUserAndYear(obj: any) {
    return this.http.post<any>(`${this.SERVICE_URL}classroom-by-user-and-year`, obj);
  }

  public exportFile(obj: any) {
    const url = this.SERVICE_URL + 'exportData';
    return this.http.post(url, obj, {responseType: "blob"});
  }

  public updateData(obj: any) {
    return this.http.post<any>(`${this.SERVICE_URL}academic-abilities`, obj);
  }

  public search(obj: any) {
    return this.http.post<any>(`${this.SERVICE_URL}academic-abilities/grid`, obj);
  }

  public getAbility() {
    return this.http.get<any>(`${this.SERVICE_URL}ap-param?type=ABILITY`);
  }

  public getSemesterByYear(year: string) {
    return this.http.get<any>(`${this.SERVICE_URL}school-years/drop-list-semester?year=${year}`);
  }

  get SERVICE_URL(): string {
    return environment.API_GATEWAY_ENDPOINT;
  }
}
