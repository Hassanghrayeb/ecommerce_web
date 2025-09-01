import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { NavItem } from '../../models/nav-item.model';
import {FormControl, FormGroup} from "@angular/forms";
import {InputColor, InputShape} from "../../enums/input-mode.enum";

@Component({
  selector: 'laitron-sub-nav',
  templateUrl: './sub-nav.component.html',
  styleUrl: './sub-nav.component.sass',
})
export class SubNavComponent implements OnInit, OnChanges {
  public displayedNavItems: NavItem[] = [];
  public selectedNavRoute: string = 'profile';
  public searchForm: FormGroup;
  public inputColor = InputColor;
  public inputShape = InputShape;

  @Input() navItems: NavItem[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.initForm();
    this.route.parent?.url.subscribe((parentUrlSegment) => {
      this.route.firstChild?.url.subscribe((childUrlSegment) => {
        if (parentUrlSegment.length > 0 && childUrlSegment.length > 0) {
          this.selectedNavRoute = `${parentUrlSegment[0]?.path || ''}/${childUrlSegment[0]?.path || ''}`;
        }
      });
    });
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.displayedNavItems = [];
    this.navItems.forEach(navItem => {
      if(this.authService.hasRole(navItem.allowedRoles)){
        this.displayedNavItems.push(navItem);
      }
    });
  }

  public selectNavItem(selectedNav: NavItem): void {
    this.selectedNavRoute = selectedNav.routerLink;
    this.router.navigate([`/home/${selectedNav.routerLink}`]);
  }

  private initForm(): void {
    this.searchForm = new FormGroup({
      search: new FormControl(null)
    });
  }
}
