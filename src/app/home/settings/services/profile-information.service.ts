import {HttpResponse} from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpBaseClass} from 'src/app/shared/base/http-base.class';
import {ApiEnum} from 'src/app/shared/enums/api.enum';
import {ProfileInformation} from '../models/profile-information.model';

@Injectable({providedIn: 'root'})
export class ProfileInformationService extends HttpBaseClass {
  constructor(public injector: Injector) {
    super(injector);
  }

  public getProfile(): Observable<HttpResponse<ProfileInformation>> {
    return this.get<ProfileInformation>(ApiEnum.PROFILE_INFORMATION);
  }

  public updateProfileInformation(
    profileInformation: ProfileInformation
  ): Observable<HttpResponse<ProfileInformation>> {
    return this.post<ProfileInformation>(
      ApiEnum.PROFILE_INFORMATION,
      profileInformation
    );
  }
}
