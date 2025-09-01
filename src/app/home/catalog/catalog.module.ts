import { NgModule } from '@angular/core';
import { CatalogComponent } from './catalog.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { CartPanelComponent } from './pages/cart-panel/cart-panel.component';
import { CartItemRowComponent } from './components/cart-item-row/cart-item-row.component';
import { CatalogRoutingModule } from './catalog-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CartService } from './services/cart.service';
import { ProductService } from '../configuration/services/product.service';

@NgModule({
  declarations: [
    CatalogComponent,
    ProductCardComponent,
    ProductListComponent,
    CartItemRowComponent,
    CartPanelComponent
  ],
  imports: [SharedModule, CatalogRoutingModule],
  providers: [ CartService, ProductService],
})
export class CatalogModule { }
