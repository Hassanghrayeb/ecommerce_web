import { HttpResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseClass } from 'src/app/shared/base/http-base.class';
import { PageChangeEvent } from 'src/app/shared/models/page-change-event.interface';
import { PageResponse } from 'src/app/shared/models/page-response.model';
import { ApiEnum } from '../../../shared/enums/api.enum';
import { SimpleIdStatusDTO } from 'src/app/shared/enums/simple-id-status.model';
import { RequestParam } from '../models/request-param.interface';
import { ProductModel } from '../models/product.model';

@Injectable()
export class ProductService extends HttpBaseClass {
  constructor(private _injector: Injector) {
    super(_injector);
  }

  public getAllProducts(
    paginationObj: PageChangeEvent, filter: string
  ): Observable<HttpResponse<PageResponse<ProductModel[]>>> {
    let params : RequestParam = {}
    if (paginationObj) params = { page: paginationObj.page, size: paginationObj.size };

    const withFilter = !filter || filter.trim() === '' ? false : true;
    if(withFilter) params.filter = filter;

    return this.get(ApiEnum.ADMIN_PRODUCT, this.setAndGetParams(params));
  }

    public getAllPublicProducts(
    paginationObj: PageChangeEvent, filter: string
  ): Observable<HttpResponse<PageResponse<ProductModel[]>>> {
    let params : RequestParam = {}
    if (paginationObj) params = { page: paginationObj.page, size: paginationObj.size };

    const withFilter = !filter || filter.trim() === '' ? false : true;
    if(withFilter) params.filter = filter;

    return this.get(ApiEnum.PRODUCT, this.setAndGetParams(params));
  }

  public getProduct(poductId: number): Observable<HttpResponse<ProductModel>> {
    return this.get(ApiEnum.ADMIN_PRODUCT + `/${poductId}`);
  }

  public createProduct(product: ProductModel): Observable<HttpResponse<ProductModel>> {
    return this.post(ApiEnum.ADMIN_PRODUCT, product);
  }

  public updateProduct(
    productId: number,
    product: ProductModel
  ): Observable<HttpResponse<ProductModel>> {
    return this.put(ApiEnum.ADMIN_PRODUCT + `/${productId}`, product);
  }

  public updateProductStatus(simpleStatusForm: SimpleIdStatusDTO): Observable<any> {
    return this.put<any>(ApiEnum.ADMIN_PRODUCT + '/enabled', simpleStatusForm);
  }

  public deleteProductById(id: number): Observable<HttpResponse<any>> {
    return this.delete(`${ApiEnum.ADMIN_PRODUCT}/${id}`);
  }

  public getLowStockProducts(
      paginationObj: PageChangeEvent, filter: string
    ): Observable<HttpResponse<PageResponse<ProductModel[]>>> {
      let params : RequestParam = {}
      if (paginationObj) params = { page: paginationObj.page, size: paginationObj.size };

      const withFilter = !filter || filter.trim() === '' ? false : true;
      if(withFilter) params.filter = filter;

      return this.get(`${ApiEnum.ADMIN_PRODUCT}/low-stock`, this.setAndGetParams(params));
    }
}
