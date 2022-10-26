// Angular
import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
// RxJS
import {Observable} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {tap} from 'rxjs/operators';
import {AuthService} from '../../../auth/_services';
import {ToastrService} from "ngx-toastr";

@Injectable()
export class InterceptService implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
  ) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = sessionStorage.getItem(environment.authTokenKey);
    const lang = localStorage.getItem('language');
    if (authToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
          'Accept-Language': lang
        }
      });
    } else {
      req = req.clone({
        setHeaders: {
          'Accept-Language': lang
        }
      });
    }
    return next.handle(req).pipe(
      tap(res => {
        if (res instanceof HttpResponse) {
          sessionStorage.setItem(environment.authTokenKey, res.headers.get('Authorization'));
        }
      })
    );

  }
}
