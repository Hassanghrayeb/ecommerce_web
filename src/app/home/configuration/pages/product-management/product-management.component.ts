import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ConfigTypeEnum } from 'src/app/shared/enums/config.enum';
import { InputColor, InputMode, InputShape } from 'src/app/shared/enums/input-mode.enum';
import { PaginatorConfig } from 'src/app/shared/models/paginator-config.model';
import { ProductsColumnDef } from './products.config';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { DataTableBaseClass } from 'src/app/shared/base/data-table.base';
import { PageChangeEvent } from 'src/app/shared/models/page-change-event.interface';
import { SimpleIdStatusDTO } from 'src/app/shared/enums/simple-id-status.model';
import { ProductModel } from '../../models/product.model';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ViewLowStockComponent } from '../../components/view-low-stock/view-low-stock.component';

@Component({
  selector: 'laitron-product-management',
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.sass'
})
export class ProductManagementComponent extends DataTableBaseClass<any> implements OnInit, OnDestroy{

  paginatorConfig = new PaginatorConfig(ConfigTypeEnum.BE);
  public inputColor = InputColor;
  public inputShape = InputShape;
  public inputMode = InputMode;
  public dataTableColumnsDefinition = ProductsColumnDef;
  public canAdd: boolean = false;
  public hasViewAcces: boolean = false;
  public count: number;
  public searchForm: FormGroup;

  private _destroy$ = new Subject<void>();

  constructor(
      private _productService: ProductService,
      private _injector: Injector,
      private _utilsService: UtilsService,
      private _dialog: MatDialog
    ) {
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

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
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
    this._productService.getAllProducts(paginationObj, filter).subscribe({
      next: (data) => {
        if (data && data.body) {
          let list = data.body;
          this.count = list.totalElements;
          this.setDataTableData(list, first);
        }
      },
      error: (err) => {
      }
    })
  }

  public onViewLowStockProducts(): void {
    this._dialog.open(ViewLowStockComponent, {
      injector: Injector.create({
        providers: [
          {provide: ProductService, useValue: this._injector.get(ProductService)},
        ],
      }),
    })
  }


  public addProduct(): void {
    this.openEditProductDialog();
  }

  actionClicked(ev: any) {
    switch (ev.name) {
      case 'edit':
        this.openEditProductDialog(ev.data);
        break;
      case 'delete':
        this.onProductDelete(ev.data);
        break;
      default:
        break;
    }
  }

  clickToggle(ev: any) {
    if (ev.name == 'enabled') {
      this.toggleEnabled(ev);
    }
  }

  toggleEnabled(ev: any) {
    if (ev.data) {
      const favoriteForm: SimpleIdStatusDTO = {
        id: ev.data.id,
        status: !ev.data.enabled,
      };
      this._productService.updateProductStatus(favoriteForm).subscribe({
        next: () => {
          this._utilsService.showCustomSnackbar(
            'admin_module.products.update_status_success',
            4000
          );
          this.getListing({
            page: this.paginatorConfig.page,
            size: this.paginatorConfig.size,
          }, false);
        },
        error: () => {
          this._utilsService.showCustomSnackbar(
            'admin_module.products.update_status_error',
            4000
          );
        },
      });
    }
  }

  onPage(pageChangeEvent: PageChangeEvent) {
    this.getListing({
      page: pageChangeEvent.page,
      size: pageChangeEvent.size,
    }, false);
  }

  private onProductDelete(product?: ProductModel): void {
    this._productService.deleteProductById(product?.id as number)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          this.getListing({page: this.paginatorConfig.page, size: this.paginatorConfig.size}, true);
        },
        error: (error) => { this._utilsService.showCustomSnackbar(`api_errors.${error.error.code}`); }
      })
  }

  private openEditProductDialog(product?: ProductModel): void {
    this._dialog.open(ProductFormComponent, {
      data: product,
      injector: Injector.create({
        providers: [
          {provide: ProductService, useValue: this._injector.get(ProductService)},
        ],
      }),
    }).afterClosed().subscribe((withActionApplied: boolean) => {
      if (withActionApplied) {
        this.getListing({
          page: this.paginatorConfig.page,
          size: this.paginatorConfig.size,
        }, true);
      }
    });
  }

  private initForm(): void {
    this.searchForm = new FormGroup({
      search: new FormControl(null)
    });
  }

}
