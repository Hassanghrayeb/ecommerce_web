import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RoleFormComponent } from './components/role-form/role-form.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';
import { RoleManagementComponent } from './pages/role-management/role-management.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { RolesService } from './services/roles.service';
import { UsersService } from './services/users.service';
import { ViewUserDetailsComponent } from './components/view-user-details/view-user-details.component';
import { UserRequestManagementComponent } from './pages/user-request-management/user-request-management.component';
import { ProductManagementComponent } from './pages/product-management/product-management.component';
import { ProductService } from './services/product.service';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { OrderService } from './services/order.service';
import { OrderManagementComponent } from './pages/order-management/order-management.component';
import { CartManagementComponent } from './pages/cart-management/cart-management.component';
import { CartService } from '../catalog/services/cart.service';
import { ViewLowStockComponent } from './components/view-low-stock/view-low-stock.component';

@NgModule({
  declarations: [
    ConfigurationComponent,
    UserManagementComponent,
    UserFormComponent,
    RoleManagementComponent,
    RoleFormComponent,
    ViewUserDetailsComponent,
    UserRequestManagementComponent,
    ProductManagementComponent,
    ProductFormComponent,
    OrderManagementComponent,
    CartManagementComponent,
    ViewLowStockComponent
  ],
  imports: [SharedModule, ConfigurationRoutingModule],
  providers: [ RolesService, UsersService, ProductService, OrderService, CartService],
})
export class ConfigurationModule { }
