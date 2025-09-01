import { Component, Input, SimpleChanges } from '@angular/core';
import { NavItem } from '../../models/nav-item.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'laitron-icon-text-dropdown',
  templateUrl: './icon-text-dropdown.component.html',
  styleUrl: './icon-text-dropdown.component.sass'
})
export class IconTextDropdownComponent {
  
  @Input() navItems: NavItem[] = [];
  
  public displayedNavItems: NavItem[] = [];
  public selectedNavItem: NavItem;
  public selectedNavRoute: string = 'profile';
  public collapsed: boolean = true;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _authService: AuthenticationService) {}

  ngOnInit(): void {
    this._route.parent?.url.subscribe((parentUrlSegment) => {
      this._route.firstChild?.url.subscribe((childUrlSegment) => {
        if (parentUrlSegment.length > 0 && childUrlSegment.length > 0) {
          this.selectedNavRoute = `${parentUrlSegment[0]?.path || ''}/${childUrlSegment[0]?.path || ''}`;
          this.selectedNavItem = this.displayedNavItems.filter(navItem => navItem.routerLink === this.selectedNavRoute)[0];
        }
      });
    });

  }


  ngOnChanges(changes: SimpleChanges): void {
    this.displayedNavItems = [];
    this.navItems.forEach(navItem => {
      if(this._authService.hasRole(navItem.allowedRoles)){
        this.displayedNavItems.push(navItem);
      }
    });
    this.selectedNavItem = this.displayedNavItems[0]
  }

  public selectNavItem(selectedNav: NavItem): void {
    this._router.navigate([`/home/${selectedNav.routerLink}`]);
  }

  public expandCollapse(){
    this.collapsed = !this.collapsed;
  }

}
