import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { InputColor, InputMode, InputShape } from '../../enums/input-mode.enum';
import { NavItem } from '../../models/nav-item.model';
import {Router} from "@angular/router";
import {PathsEnum} from "../../enums/path.enum";
import { Subscription } from 'rxjs';

@Component({
  selector: 'ecommerce-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.sass',
})
export class SideNavComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public navItems: NavItem[] = [];

  public displayedNavItems: NavItem[] = [];
  public profileName: string;
  public inputShape = InputShape;
  public inputColor = InputColor;
  public inputMode = InputMode;
  private _userNameSubscription: Subscription;

  constructor(private authenticationService: AuthenticationService, private _router: Router) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.displayedNavItems = [];
    this.navItems.forEach(navItem => {
      if(this.authenticationService.hasRole(navItem.allowedRoles)){
        this.displayedNavItems.push(navItem);
      }
    })
  }

  ngOnDestroy(): void {
    if(this._userNameSubscription){
      this._userNameSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.setName();
  }

  public logout(): void{
    this.authenticationService.logout();
  }

  public goToHome(): void{
    this._router.navigate([PathsEnum.HOME]);
  }

  private setName(): void {
    this._userNameSubscription = this.authenticationService.userInitials$.subscribe((initials: string) => {
      this.profileName = initials;
    });
  }
}
