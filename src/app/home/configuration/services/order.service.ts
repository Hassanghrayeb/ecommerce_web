import { HttpResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseClass } from 'src/app/shared/base/http-base.class';
import { PageChangeEvent } from 'src/app/shared/models/page-change-event.interface';
import { PageResponse } from 'src/app/shared/models/page-response.model';
import { RequestParam } from '../models/request-param.interface';
import { ApiEnum } from 'src/app/shared/enums/api.enum';
import { OrderModel } from '../models/order.model';

@Injectable()
export class OrderService extends HttpBaseClass{

  constructor(private _injector: Injector) {
    super(_injector);
  }

  public getAllOrders(
      paginationObj: PageChangeEvent, filter: string
    ): Observable<HttpResponse<PageResponse<OrderModel[]>>> {
      let params : RequestParam = {}
      if (paginationObj) params = { page: paginationObj.page, size: paginationObj.size };
  
      const withFilter = !filter || filter.trim() === '' ? false : true;
      if(withFilter) params.filter = filter;
  
      return this.get(ApiEnum.ADMIN_ORDER, this.setAndGetParams(params));
    }
  
  public getOrder(poductId: number): Observable<HttpResponse<OrderModel>> {
    return this.get(ApiEnum.ADMIN_ORDER + `/${poductId}`);
  }
}
