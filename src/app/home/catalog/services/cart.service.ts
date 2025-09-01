import { Injectable, Injector, computed, signal } from '@angular/core';
import { HttpBaseClass } from 'src/app/shared/base/http-base.class';
import { CartModel, CartItemModel } from '../models/catalog.model';
import { HttpResponse } from '@angular/common/http';
import { Observable, switchMap, tap, catchError, of } from 'rxjs';
import { ApiEnum } from 'src/app/shared/enums/api.enum';
import { PageChangeEvent } from 'src/app/shared/models/page-change-event.interface';
import { RequestParam } from '../../configuration/models/request-param.interface';
import { PageResponse } from 'src/app/shared/models/page-response.model';

@Injectable()
export class CartService extends HttpBaseClass {

  readonly items = signal<CartItemModel[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly total = computed<number>(() =>
    this.items().reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
  );
  readonly count = computed<number>(() => this.items().length);

  constructor(private _injector: Injector) {
    super(_injector);
  }

  public getAllCarts(paginationObj: PageChangeEvent, filter: string): 
    Observable<HttpResponse<PageResponse<CartModel[]>>> {

    let params : RequestParam = {}
    if (paginationObj) params = { page: paginationObj.page, size: paginationObj.size };

    const withFilter = !filter || filter.trim() === '' ? false : true;
    if(withFilter) params.filter = filter;

    return this.get(ApiEnum.ADMIN_CART, this.setAndGetParams(params));
  }

  public getItem(): Observable<HttpResponse<CartModel>> {
    this.loading.set(true);
    this.error.set(null);

    return this.get<CartModel>(`${ApiEnum.CART}`).pipe(
      tap((res) => {
        const body = res.body ?? null;
        console.log(body);
        this.items.set(body?.items as CartItemModel[]);
      }),
      catchError((err) => {
        this.error.set(err?.message ?? 'Failed to load cart');
        this.items.set([]);
        return of(err as HttpResponse<CartModel>);
      }),
      tap(() => this.loading.set(false))
    );
  }

  public addItem(productId: number, quantity: number = 1): Observable<HttpResponse<CartModel>> {
    return this.post<CartItemModel>(`${ApiEnum.CART}/items`, { productId, quantity }).pipe(
      switchMap(() => this.getItem())
    );
  }

  public updateItemQuantity(itemId: number, quantity: number): Observable<HttpResponse<CartModel>> {
    return this.put<void>(`${ApiEnum.CART}/items/${itemId}`, { quantity }).pipe(
      switchMap(() => this.getItem())
    );
  }

  public removeItem(itemId: number): Observable<HttpResponse<CartModel>> {
    return this.delete<void>(`${ApiEnum.CART}/items/${itemId}`).pipe(
      switchMap(() => this.getItem())
    );
  }

  public clear(): Observable<HttpResponse<CartModel>> {
    return this.delete<void>(`${ApiEnum.CART}/clear`).pipe(
      switchMap(() => this.getItem())
    );
  }

  public checkout(): Observable<HttpResponse<CartModel>> {
    return this.post<void>(`${ApiEnum.ORDER}/checkout`).pipe(
      switchMap(() => this.getItem())
    );
  }

  public deleteCartById(id: number): Observable<HttpResponse<any>> {
    return this.delete(`${ApiEnum.ADMIN_CART}/${id}`);
  }
}