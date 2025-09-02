import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { DataTableBaseClass } from 'src/app/shared/base/data-table.base';
import { ConfigTypeEnum } from 'src/app/shared/enums/config.enum';
import { InputColor, InputMode, InputShape } from 'src/app/shared/enums/input-mode.enum';
import { PaginatorConfig } from 'src/app/shared/models/paginator-config.model';
import { FormControl, FormGroup } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { PageChangeEvent } from 'src/app/shared/models/page-change-event.interface';
import { OrdersColumnDef } from './order.config';
import { OrderItemModel, OrderModel } from '../../models/order.model';

@Component({
  selector: 'ecommerce-order-management',
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.sass'
})
export class OrderManagementComponent extends DataTableBaseClass<any> implements OnInit, OnDestroy {

  paginatorConfig = new PaginatorConfig(ConfigTypeEnum.BE);
  public inputColor = InputColor;
  public inputShape = InputShape;
  public inputMode = InputMode;
  public dataTableColumnsDefinition = OrdersColumnDef;
  public canAdd: boolean = false;
  public hasViewAcces: boolean = false;
  public count: number;
  public searchForm: FormGroup;

  private _destroy$ = new Subject<void>();
  
  constructor(
      private _orderService: OrderService,
      private _injector: Injector,
      private _utilsService: UtilsService
    ) 
    {
      super(_injector);
    }
  
  ngOnInit(): void {
    this.initForm();
    this.listenToFilter();
    this.getListing({
      page: this.paginatorConfig.page,
      size: this.paginatorConfig.size,
    }, true);
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

  private getListing(paginationObj: PageChangeEvent, first: boolean): void {
    const filter = this.searchForm.controls.search.value;
    this._orderService.getAllOrders(paginationObj, filter)
    .pipe(takeUntil(this._destroy$))
    .subscribe({
      next: (data) => {
        if (data && data.body) {
          this.count = data.body.totalElements;
          let list = data.body;
            list.content.forEach((order: OrderModel) => {
            order.items = order.items?.map((orderItem: OrderItemModel) => 
              (
                {...orderItem, name:  `${orderItem?.productName} [${orderItem.quantity} items]`}
            ));
          });
          this.setDataTableData(data.body, first);
        }
      },
      error: (error) => { this._utilsService.showCustomSnackbar(`api_errors.${error.error.code}`); }
    })
  }

}
