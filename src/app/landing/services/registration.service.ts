import { Injectable, Injector } from '@angular/core';
import { HttpBaseClass } from 'src/app/shared/base/http-base.class';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import {  UserRegistrationModel, UserRegistrationResponse } from '../models/registration.model';
import { ApiEnum } from 'src/app/shared/enums/api.enum';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService extends HttpBaseClass{

  constructor(public injector: Injector) {
      super(injector);
    }

    public registerUser(userRegistration: UserRegistrationModel):
    Observable<HttpResponse<UserRegistrationResponse>>
    {
       return this.post(`${ApiEnum.REGISTRATION}`, userRegistration, {
        observe: 'response',
      }, undefined, undefined, true);
    }
}
