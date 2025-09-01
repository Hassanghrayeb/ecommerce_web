import {HttpResponse} from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpBaseClass} from 'src/app/shared/base/http-base.class';
import {ApiEnum} from 'src/app/shared/enums/api.enum';
import {PageChangeEvent} from 'src/app/shared/models/page-change-event.interface';
import {PageResponse} from 'src/app/shared/models/page-response.model';
import {RoleModel} from '../pages/role-management/roles.model';
import { RequestParam } from '../models/request-param.interface';


@Injectable()
export class RolesService extends HttpBaseClass {
  constructor(public injector: Injector) {
    super(injector);
  }

  permissionResponse: any;

  public getAllRoles(
    paginationObj: PageChangeEvent, filter: string
  ): Observable<HttpResponse<PageResponse<RoleModel[]>>> {
    let params : RequestParam = {}
    if (paginationObj) params = { page: paginationObj.page, size: paginationObj.size };

    const withFilter = !filter || filter.trim() === '' ? false : true;
    if(withFilter) params.filter = filter;

    return this.get(ApiEnum.ROLE_API, this.setAndGetParams(params));
  }

  public getAll(): Observable<HttpResponse<PageResponse<RoleModel[]>>> {
    return this.get(ApiEnum.ROLE_API);
  }

  public getRoleById(id: number): Observable<HttpResponse<RoleModel>> {
    return this.get(`${ApiEnum.ROLE_API}/${id}`);
  }

  public editRoleById(id: number, role: RoleModel): Observable<HttpResponse<RoleModel>> {
    return this.put(`${ApiEnum.ROLE_API}/${id}`, role);
  }

  public deleteRoleById(id: number): Observable<any> {
    return this.delete(`${ApiEnum.ROLE_API}/${id}`);
  }

  public createRole(newRole: RoleModel): Observable<HttpResponse<RoleModel>> {
    return this.post(ApiEnum.ROLE_API, newRole);
  }

  public getRoleByUserId(userId: number): Observable<HttpResponse<RoleModel[]>> {
    return this.get(`${ApiEnum.ROLE_API}/user/${userId}`);
  }

  public getAllPermission(): Observable<HttpResponse<any>>{
    return this.get(`${ApiEnum.PERMISSION_API}`);
  }

  public setRolePermissions(roleId: number, permissionsId: number[]): Observable<HttpResponse<any>> {
    const formattedPermissionsId = `/${permissionsId.join(',')}`;
    return this.put<any>(`${ApiEnum.ROLE_API}/${roleId}/permissions${formattedPermissionsId}`);
  }
}
