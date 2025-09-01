import { Component } from '@angular/core';
import { PathsEnum } from '../shared/enums/path.enum';
import { RoleEnum } from '../shared/enums/role.enum';

@Component({
  selector: 'laitron-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass'
})
export class HomeComponent {
  navItems = [
    {
      routerLink: PathsEnum.CATALOG,
      icon: 'chat',
      alt: 'catalog',
      label: 'home.sidenav.catalog'
    },
    {
      routerLink: PathsEnum.SETTINGS,
      icon: 'settings',
      alt: 'settings',
      label: 'home.sidenav.settings'
    },
    {
      routerLink: PathsEnum.CONFIGURATION,
      icon: 'tune',
      alt: 'configuration',
      label: 'home.sidenav.configuration',
      allowedRoles: [RoleEnum.ADMIN]
    }
  ];
}
