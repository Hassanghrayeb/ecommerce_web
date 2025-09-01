import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
} from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { ApiEnum } from '../enums/api.enum';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (request.url.includes(ApiEnum.AUTH)) {
      return next.handle(request);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 401 || error.status === 403) {
          return this.authService.refreshToken().pipe(
            switchMap(() => {
              return next.handle(request);
            }),
            catchError((err) => {
              if (err.url.includes(ApiEnum.AUTH) || err.status === 401 || err.status === 403) {
                this.authService.logout();
              }
              return throwError(err);
            })
          );
        } else {
          return throwError(error);
        }
      })
    );
  }
}
