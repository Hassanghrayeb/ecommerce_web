import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductModel } from '../../models/product.model';
import { InputColor, InputMode, InputShape, SizeEnum } from 'src/app/shared/enums/input-mode.enum';
import { ButtonModel } from 'src/app/shared/models/button.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'laitron-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.sass'
})
export class ProductFormComponent implements OnInit{

  private _destroy$ = new Subject<void>();

  public productForm: FormGroup;
  public productDetails: ProductModel | null;
  public inputColor = InputColor;
  public textSize = SizeEnum;
  public inputShape = InputShape;
  public inputMode = InputMode;
  public actionButtons: ButtonModel[] = [
    {
      color: InputColor.TRANSPARENT1,
      shape: InputShape.PRIMARY,
      mode: InputMode.LIGHT,
      label: 'general.cancel',
      icon: '',
      iconDirection: 'right',
      action: () => this.closeDialog()
    },
    {
      color: InputColor.PRIMARY23,
      shape: InputShape.PRIMARY,
      mode: InputMode.LIGHT,
      label: 'general.save',
      icon: '',
      iconDirection: 'right',
      action: () => this.saveProduct()
    }
  ];

  ngOnInit(): void {
    this.initForm();
    if (this.data?.id) {
      this.getProductDetails(this.data?.id);
    }
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ProductModel,
    private _dialogRef: MatDialogRef<ProductFormComponent>,
    private _productService: ProductService,
    private _utilsService: UtilsService) {
  }

  private initForm(): void {
    this.productForm = new FormGroup({
      sku: new FormControl( null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required]),
      currency: new FormControl(null, [Validators.required]),
      stock: new FormControl(null, [Validators.required]),
      enabled: new FormControl(true),
    });
  }


  private saveProduct(): void {
    if (this.productForm.invalid) {
      return;
    }

    const formValue = this.productForm.getRawValue();

    if (this.data?.id) {
      formValue.id = this.data.id;
    }

    const action = this.data?.id
      ? this._productService.updateProduct(this.data.id, formValue)
      : this._productService.createProduct(formValue);

    action
    .pipe(takeUntil(this._destroy$))
    .subscribe({
      next: () => this.closeDialog(true),
      error: (error) => {
        this._utilsService.showCustomSnackbar(`api_errors.${error.error.code}`);
      }
    });
  }


  private closeDialog(withAppliedAction?: boolean): void {
    this._dialogRef.close(withAppliedAction);
  }


  private getProductDetails(productId: number): void {
    this._productService.getProduct(productId)
    .pipe(takeUntil(this._destroy$))
    .subscribe((response) => {
      if (response) {
        this.productDetails = response.body;
        if (this.productDetails) {
          this.patchForm(this.productDetails);
        }
      }
    });
  }

  private patchForm(data: ProductModel): void {
    this.productForm.controls.sku.patchValue(data.sku);
    this.productForm.controls.enabled.patchValue(data.enabled);
    this.productForm.controls.name.patchValue(data.name);
    this.productForm.controls.description.patchValue(data.description);
    this.productForm.controls.currency.patchValue(data.currency);
    this.productForm.controls.stock.patchValue(data.stock);
    this.productForm.controls.price.patchValue(data.price);
  }

}
