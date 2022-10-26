import { Injectable } from "@angular/core";
import { BasicService } from "src/app/core/service/utils/basic.service";
import { environment } from '../../../../../environments/environment'
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SubjectExemptionService extends BasicService {

    API = `${environment.API_GATEWAY_ENDPOINT}subject-exemptions-details`

    save(obj: any): Observable<any> {
        return this.postRequest(`${this.API}`, obj)
    }

    findBySchoolYearAndStudentCode(obj: any): Observable<any> {
        return this.postRequest(`${this.API}?findByStudentCodeAndYear`, obj)
    }

}