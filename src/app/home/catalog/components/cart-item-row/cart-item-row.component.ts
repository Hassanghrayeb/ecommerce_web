import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItemModel } from '../../models/catalog.model';

@Component({
  selector: 'ecommerce-cart-item-row',
  templateUrl: './cart-item-row.component.html',
  styleUrl: './cart-item-row.component.sass',
})
export class CartItemRowComponent {
  @Input() item: CartItemModel;
  @Output() qtyChange = new EventEmitter<number>();
  @Output() remove = new EventEmitter<void>();
  
  constructor(){}
}
