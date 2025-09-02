import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductModel } from 'src/app/home/configuration/models/product.model';

@Component({
  selector: 'ecommerce-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.sass',
})

export class ProductCardComponent {

  @Input() product!: ProductModel;
  @Output() add = new EventEmitter<number>();

  constructor(){}
}
