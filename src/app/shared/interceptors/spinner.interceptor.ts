import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpResponse,
  HttpHeaderResponse,
  HttpSentEvent,
  HttpProgressEvent,
  HttpUserEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { SpinnerService } from "../services/spinner.service";
import { ApiEnum } from "../enums/api.enum";
import { throwError } from 'rxjs';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

  constructor(private _spinnerService: SpinnerService) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

    const showLoader = (req.headers.get('showLoader') ? req.headers.get('showLoader')?.toLowerCase() === 'true' : true);

    if (showLoader) {
      this._spinnerService.pushRequest(req);
    }

    return next.handle(req).pipe(
      tap(response => {
        if (response instanceof HttpResponse && showLoader) {
          this._spinnerService.popRequest();
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (showLoader) {
          this._spinnerService.popRequest();
        }
        return throwError(error);
      })
    );
  }
}
