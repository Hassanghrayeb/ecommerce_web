import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { CartService } from 'src/app/home/catalog/services/cart.service';
import { DataTableBaseClass } from 'src/app/shared/base/data-table.base';
import { ConfigTypeEnum } from 'src/app/shared/enums/config.enum';
import { InputColor, InputMode, InputShape } from 'src/app/shared/enums/input-mode.enum';
import { PaginatorConfig } from 'src/app/shared/models/paginator-config.model';
import { CartsColumnDef } from './cart.config';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { PageChangeEvent } from 'src/app/shared/models/page-change-event.interface';
import { CartItemModel, CartModel } from 'src/app/home/catalog/models/catalog.model';

@Component({
  selector: 'laitron-cart-management',
  templateUrl: './cart-management.component.html',
  styleUrl: './cart-management.component.sass'
})
export class CartManagementComponent extends DataTableBaseClass<any> implements OnInit, OnDestroy{

  paginatorConfig = new PaginatorConfig(ConfigTypeEnum.BE);
  public inputColor = InputColor;
  public inputShape = InputShape;
  public inputMode = InputMode;
  public dataTableColumnsDefinition = CartsColumnDef;
  public canAdd: boolean = false;
  public hasViewAcces: boolean = false;
  public count: number;
  public searchForm: FormGroup;

  private _destroy$ = new Subject<void>();

  constructor(
        private _cartService: CartService,
        private _injector: Injector,
        private _utilsService: UtilsService
      ) { super(_injector);}

  ngOnInit(): void {
        this.initForm();
        this.listenToFilter();
        this.getListing({
          page: this.paginatorConfig.page,
          size: this.paginatorConfig.size,
        }, true);
      }
  
  private initForm(): void {
    this.searchForm = new FormGroup({
      search: new FormControl(null)
    });
  }
  
  private listenToFilter(): void {
    this.searchForm.controls.search.valueChanges
      .pipe(debounceTime(300), takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          this.getListing({page: this.paginatorConfig.page, size: this.paginatorConfig.size}, true);
        }
      })
  }

  actionClicked(ev: any) {
    switch (ev.name) {
      case 'delete':
        this.onCartDelete(ev.data);
        break;
      default:
        break;
    }
  }

  private onCartDelete(cart: CartModel): void {
    this._cartService.deleteCartById(cart?.id)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          this._utilsService.showCustomSnackbar(`cart deleted Successfully`);
          this.getListing({
            page: this.paginatorConfig.page,
            size: this.paginatorConfig.size,
          }, false);
      },
        error: (error) => { this._utilsService.showCustomSnackbar(`api_errors.${error.error.code}`); }
      }); 
  }

  formatItemName = (productName?: string, quantity?: number) => {
    const q = quantity ?? 0;
    const unit = q === 1 ? 'item' : 'items';
    return `${productName ?? ''} [${q} ${unit}]`;
  };

  private getListing(paginationObj: PageChangeEvent, first: boolean): void {
    const filter = this.searchForm.controls.search.value;
    this._cartService.getAllCarts(paginationObj, filter).subscribe({
      next: (data) => {
        if (!data?.body) return;

        const { body } = data;
        this.count = body.totalElements ?? 0;

        const content = (body.content ?? [])
          .filter((cart: CartModel) => (cart?.items?.length ?? 0) > 0)
          .map((cart: CartModel) => ({
            ...cart,
            items: (cart.items ?? []).map((cartItem: CartItemModel) => ({
              ...cartItem,
              name: this.formatItemName(cartItem?.productName, cartItem?.quantity),
            })),
          }));

        const page = { ...body, content };

        this.setDataTableData(page, first);

      },
      error: (error) => { this._utilsService.showCustomSnackbar(`api_errors.${error.error.code}`); }
    })
  }

  onPage(pageChangeEvent: PageChangeEvent) {
    this.getListing({
      page: pageChangeEvent.page,
      size: pageChangeEvent.size,
    }, false);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
