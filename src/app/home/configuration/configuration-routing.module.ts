import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationComponent } from './configuration.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { RoleManagementComponent } from './pages/role-management/role-management.component';
import { UserRequestManagementComponent } from './pages/user-request-management/user-request-management.component';
import { ProductManagementComponent } from './pages/product-management/product-management.component';
import { OrderManagementComponent } from './pages/order-management/order-management.component';
import { CartManagementComponent } from './pages/cart-management/cart-management.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationComponent,
    children: [
      {path: 'user-management', component: UserManagementComponent},
      {path: 'role-management', component: RoleManagementComponent},
      {path: 'user-request-management', component: UserRequestManagementComponent},
      {path: 'product-management', component: ProductManagementComponent},
      {path: 'order-management', component: OrderManagementComponent},
      {path: 'cart-management', component: CartManagementComponent},
      {path: '', redirectTo: 'user-management', pathMatch: 'full'},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationRoutingModule {
}
