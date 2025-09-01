import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductModel } from 'src/app/home/configuration/models/product.model';
import { ProductService } from 'src/app/home/configuration/services/product.service';
import { CartService } from '../../services/cart.service';
import { Subject, takeUntil } from 'rxjs';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { PaginatorConfig } from 'src/app/shared/models/paginator-config.model';
import { ConfigTypeEnum } from 'src/app/shared/enums/config.enum';
import { PageChangeEvent } from 'src/app/shared/models/page-change-event.interface';

@Component({
  selector: 'laitron-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.sass',
})
export class ProductListComponent implements OnInit, OnDestroy {
  
  paginatorConfig = new PaginatorConfig(ConfigTypeEnum.BE);
  private _destroy$ = new Subject<void>();

  public products: ProductModel[] = [];
  public loading = true;
  public error = '';
  trackById = (_: number, p: ProductModel) => p.id;

  constructor(
    private _productService: ProductService, 
    private _cartService: CartService,
    private _utilsService: UtilsService
  ){}

  ngOnInit() {
    this.getListing({
      page: this.paginatorConfig.page,
      size: this.paginatorConfig.size,
    }, true);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }


  private getListing(paginationObj: PageChangeEvent, first: boolean): void {
    this._productService.getAllPublicProducts(paginationObj, '')
    .pipe(takeUntil(this._destroy$))
    .subscribe({
      next: ({body}) => { this.products = body?.content as ProductModel[]; this.loading = false; },
      error: (error) => { this._utilsService.showCustomSnackbar(`api_errors.${error.error.code}`); this.loading = false;}
    });
  }

  public onAddProduct(productId: number): void {
    this._cartService.addItem(productId)
      .pipe(takeUntil(this._destroy$))
      .subscribe();
  }
}
