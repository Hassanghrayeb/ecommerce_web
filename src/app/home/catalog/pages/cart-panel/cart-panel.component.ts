import { Component, computed, OnInit, Signal } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItemModel } from '../../models/catalog.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'ecommerce-cart-panel',
  templateUrl: './cart-panel.component.html',
  styleUrl: './cart-panel.component.sass',
})

export class CartPanelComponent implements OnInit {

  public trackById = (_: number, it: any) => it.id;
  public readonly items: Signal<CartItemModel[]>;
  public readonly total: Signal<number>;

  private _destroy$ = new Subject<void>();
  

  readonly count = computed(
    () => this.items().reduce((n, i) => n + i.quantity, 0)
  );

  constructor(private _cartService: CartService){
      this.items = this._cartService.items;
      this.total = this._cartService.total;  
  }

  ngOnInit() { this._cartService.getItem().subscribe(); }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public setQty(itemId: number, q: number): void { 
    this._cartService.updateItemQuantity(itemId, q)
      .pipe(takeUntil(this._destroy$))
      .subscribe(); 
  }

  public remove(itemId: number): void { 
    this._cartService.removeItem(itemId)
      .pipe(takeUntil(this._destroy$))
      .subscribe(); 
  }

  public clear(): void { 
    this._cartService.clear()
      .pipe(takeUntil(this._destroy$))
      .subscribe(); 
  }

  public checkout(): void { 
    this._cartService.checkout()
      .pipe(takeUntil(this._destroy$))
      .subscribe(); 
  }
  
}
