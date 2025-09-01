import { Component } from '@angular/core';
import { RoleEnum } from 'src/app/shared/enums/role.enum';
import { NavItem } from 'src/app/shared/models/nav-item.model';

@Component({
  selector: 'laitron-configuration',
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.sass'
})
export class ConfigurationComponent {
  private configurationPath = 'configuration';
  configNavItems: NavItem[] = [
    {
      label: 'configuration_module.side_nav.user_management',
      icon: 'manage_accounts',
      routerLink: `${this.configurationPath}/user-management`,
      allowedRoles: [RoleEnum.ADMIN]
    },
    {
      label: 'configuration_module.side_nav.role_management',
      icon: 'manage_accounts',
      routerLink: `${this.configurationPath}/role-management`,
      allowedRoles: [RoleEnum.ADMIN]
    },
        {
      label: 'configuration_module.side_nav.product_management',
      icon: 'manage_accounts',
      routerLink: `${this.configurationPath}/product-management`,
      allowedRoles: [RoleEnum.ADMIN]
    },
    {
      label: 'configuration_module.side_nav.user_request_management',
      icon: 'manage_accounts',
      routerLink: `${this.configurationPath}/user-request-management`,
      allowedRoles: [RoleEnum.ADMIN]
    },
    {
      label: 'configuration_module.side_nav.order_management',
      icon: 'manage_accounts',
      routerLink: `${this.configurationPath}/order-management`,
      allowedRoles: [RoleEnum.ADMIN]
    },
    {
      label: 'configuration_module.side_nav.cart_management',
      icon: 'manage_accounts',
      routerLink: `${this.configurationPath}/cart-management`,
      allowedRoles: [RoleEnum.ADMIN]
    }
  ];
}
