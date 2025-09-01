import { HttpResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseClass } from 'src/app/shared/base/http-base.class';
import { UserModel } from '../pages/user-management/users.model';
import { PageChangeEvent } from 'src/app/shared/models/page-change-event.interface';
import { PageResponse } from 'src/app/shared/models/page-response.model';
import { ApiEnum } from '../../../shared/enums/api.enum';
import { SimpleIdStatusDTO } from 'src/app/shared/enums/simple-id-status.model';
import { RequestParam } from '../models/request-param.interface';

@Injectable()
export class UsersService extends HttpBaseClass {
  constructor(public injector: Injector) {
    super(injector);
  }

  public getAllUsers(
    paginationObj: PageChangeEvent, filter: string
  ): Observable<HttpResponse<PageResponse<UserModel[]>>> {
    let params : RequestParam = {}
    if (paginationObj) params = { page: paginationObj.page, size: paginationObj.size };

    const withFilter = !filter || filter.trim() === '' ? false : true;
    if(withFilter) params.filter = filter;

    return this.get(ApiEnum.USER_API, this.setAndGetParams(params));
  }

  public getUser(userId: number): Observable<HttpResponse<UserModel>> {
    return this.get(ApiEnum.USER_API + `/${userId}`);
  }

  public createUser(user: UserModel): Observable<HttpResponse<UserModel>> {
    return this.post(ApiEnum.USER_API, user);
  }

  public updateUser(
    userId: number,
    user: UserModel
  ): Observable<HttpResponse<UserModel>> {
    return this.put(ApiEnum.USER_API + `/${userId}`, user);
  }

  public assignRoleToUser(userId: number, roleId: number): Observable<any> {
    return this.put(ApiEnum.USER_API + `/${userId}/roles/${roleId}`);
  }

  public updateUserStatus(favoriteForm: SimpleIdStatusDTO): Observable<any> {
    return this.put<any>(ApiEnum.USER_API + '/enabled', favoriteForm);
  }

  public getAllRegisteredUsers(
    paginationObj: PageChangeEvent, filter: string
  ): Observable<HttpResponse<PageResponse<UserModel[]>>> {
    let params : RequestParam = {}
    if (paginationObj) params = { page: paginationObj.page, size: paginationObj.size };

    const withFilter = !filter || filter.trim() === '' ? false : true;
    if(withFilter) params.filter = filter;
    
    return this.get(ApiEnum.ADMIN_REGISTRATION, this.setAndGetParams(params));
  }

  public approveRegisterdUser(userId: string): Observable<HttpResponse<any>> {
    return this.post(`${ApiEnum.ADMIN_REGISTRATION}/user/${userId}/verify`);
  }
}
