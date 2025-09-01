import { Component } from '@angular/core';
import { NavItem } from 'src/app/shared/models/nav-item.model';

@Component({
  selector: 'laitron-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.sass'
})
export class SettingsComponent {
  private settingsPath = 'settings';
  public settingsNavItems: NavItem[] = [
    {
      label: 'settings_module.side_nav.profile_information',
      icon: 'person',
      routerLink: `${this.settingsPath}/profile`,
    }
  ];
}
