import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { DataTableBaseClass } from 'src/app/shared/base/data-table.base';
import { InputColor, InputMode, InputShape } from 'src/app/shared/enums/input-mode.enum';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageChangeEvent } from 'src/app/shared/models/page-change-event.interface';
import { LowStockProductsColumnDef } from '../../pages/product-management/products.config';
import { ButtonModel } from 'src/app/shared/models/button.model';

@Component({
  selector: 'ecommerce-view-low-stock',
  templateUrl: './view-low-stock.component.html',
  styleUrl: './view-low-stock.component.sass'
})
export class ViewLowStockComponent extends DataTableBaseClass<any> implements OnInit, OnDestroy{

    public inputColor = InputColor;
    public inputShape = InputShape;
    public inputMode = InputMode;
    public dataTableColumnsDefinition = LowStockProductsColumnDef;
    public canAdd: boolean = false;
    public hasViewAcces: boolean = false;
    public count: number;
    public searchForm: FormGroup;
      public actionButtons: ButtonModel[] = [
        {
          color: InputColor.PRIMARY23,
          shape: InputShape.PRIMARY,
          mode: InputMode.LIGHT,
          label: 'general.close',
          icon: '',
          iconDirection: 'right',
          action: () => this.closeDialog()
        }
      ];

    private _destroy$ = new Subject<void>();
    
    constructor(
        private _dialogRef: MatDialogRef<ViewLowStockComponent>,
        private _productService: ProductService,
        private _injector: Injector,
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
      this._productService.getLowStockProducts(paginationObj, filter).subscribe({
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
  
    onPage(pageChangeEvent: PageChangeEvent) {
      this.getListing({
        page: pageChangeEvent.page,
        size: pageChangeEvent.size,
      }, false);
    }
  
    private initForm(): void {
      this.searchForm = new FormGroup({
        search: new FormControl(null)
      });
    }

      private closeDialog(): void {
    this._dialogRef.close();
  }
  
    ngOnDestroy(): void {
      this._destroy$.next();
      this._destroy$.complete();
    }
    
}
