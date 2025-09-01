import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { RoleEnum } from '../enums/role.enum';
import { PathsEnum } from '../enums/path.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    return Promise.resolve(this.authService.checkIfUserIsAvailable()).then(
      (isLoggedIn) => {
        if (!isLoggedIn) {
          this.router.navigate([PathsEnum.LANDING_PAGE]);
          return false;
        }
        const requiresAdmin = route.url[0].path === RoleEnum.ADMIN;
        if (requiresAdmin) {
          return this.authService.isAdmin().then((isAdmin) => {
            if (isAdmin) {
              return true;
            } else {
              this.router.navigate([PathsEnum.LANDING_PAGE]);
              return false;
            }
          });
        }
        return true;
      }
    );
  }
}
