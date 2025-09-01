import {Injectable} from '@angular/core';
import { BehaviorSubject, Observable, ObservableInput, of, Subject, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {StorageEnum} from '../models/storage.enum';
import {SessionModel} from '../models/session.model';
import {LoginResponse} from '../models/login-response.model';
import {SettingsService} from './settings.service';
import {ApiEnum} from '../enums/api.enum';
import {Router} from '@angular/router';
import {PathsEnum} from '../enums/path.enum';
import {PermissionEnum} from '../enums/user-role.enum';
import {RoleEnum} from '../enums/role.enum';
import {TranslateService} from '@ngx-translate/core';
import { ProfileInformation } from 'src/app/home/settings/models/profile-information.model';
import {MatDialog} from '@angular/material/dialog';
import { CompleteProfileDialogComponent } from '../components/complete-profile-dialog/complete-profile-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  private _waitUntilReady$ = new Subject<void>();
  private _initialsSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this.getUserInitials());

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService,
    private router: Router,
    private translateService: TranslateService,
    private dialog: MatDialog
  ) {
  }

  get accessToken() {
    return this.getActiveSession()?.accessToken;
  }

  get username() {
    return this.getActiveSession()?.userName;
  }

  get firstName() {
    return this.getActiveSession()?.firstName;
  }

  get lastName() {
    return this.getActiveSession()?.lastName;
  }

  get emailAddress() {
    return this.getActiveSession()?.email;
  }

  private getUserInitials(): string {
    return (this.firstName && this.lastName)
      ? (this.firstName[0] + this.lastName[0]).toLocaleUpperCase()
      : (this.username ? this.username.slice(0, 2) : '').toLocaleUpperCase();
  }

  get userInitials$() {
    return this._initialsSubject.asObservable();
  }

  get fullName() {
    return (this.firstName && this.lastName)
      ? `${this.firstName} ${this.lastName}`
      : this.username || '';
  }

  public getActiveSession(): SessionModel | null {
    const sessionData = localStorage.getItem(StorageEnum.ACTIVE_SESSION);
    if (sessionData) {
      const parsedData = JSON.parse(sessionData);
      return Object.assign(new SessionModel(), parsedData);
    }
    return null;
  }

  public login(username: string, password: string): Observable<LoginResponse> {
    this.clearSession();

    return this.http
      .post<LoginResponse>(
        `${this.settingsService.settings.baseUrl}${ApiEnum.AUTH}`,
        {
          username: username,
          password: password,
        }
      )
      .pipe(catchError(this.handleError));
  }

  public checkUserExists(email: string): Observable<any> {
    return this.http
      .post<{ exists: boolean }>(
        `${this.settingsService.settings.baseUrl}${ApiEnum.EMAIL_EXISTS}`,
        { emailAddress: email }
      );
  }

  public logout(): void {
    this.translateService.use('en');
    this.clearSession();
    // TODO: call logout endpoint
    this.router.navigate([PathsEnum.LANDING_PAGE]);
  }

  private handleError(error: HttpErrorResponse): ObservableInput<any> {
    return throwError(error?.error?.error);
  }

  public handleLoginSuccess(loginResponse: LoginResponse) {
    const activeSession = Object.assign(new SessionModel(), {
      access_token: loginResponse.access_token,
      expires_in: loginResponse.expires_in,
      refresh_token: loginResponse.refresh_token,
      token_type: loginResponse.token_type,
      user_id: loginResponse.user_profile.id,
      username: loginResponse.user_profile.username,
      firstName: loginResponse.user_profile?.person?.firstName,
      lastName: loginResponse.user_profile?.person?.lastName,
      roles: loginResponse.user_profile.roles,
      email: loginResponse.user_profile?.person?.email,

    });

    localStorage.setItem(
      StorageEnum.ACTIVE_SESSION,
      JSON.stringify(activeSession)
    );

    localStorage.setItem(
      StorageEnum.TOKEN_EXPIRES_AT,
      new Date().getTime() + Number(loginResponse.expires_in) * 1000 + ''
    );

    this._waitUntilReady$.subscribe(() => {
      this.executePostLoginLogic();
    })

    const continueLogin = () => {
      this._waitUntilReady$.next();
      this._initialsSubject.next(this.getUserInitials());
    };
    const missingFields = loginResponse.user_validation?.missingRequiredFieldList || [];
    if (missingFields.length) {
      const dialogRef = this.dialog.open(CompleteProfileDialogComponent, {
        disableClose: true,
        width: '500px',
        data: {
          missingFields,
          firstName: loginResponse.user_profile?.person?.firstName,
          lastName: loginResponse.user_profile?.person?.lastName,
          email: loginResponse.user_profile?.person?.email,
        }
      });

      dialogRef.afterClosed().subscribe((updated: ProfileInformation | boolean) => {
        if (updated) {
          this.updateSession(updated as ProfileInformation);
          continueLogin();
        } else {
          this.logout();
        }
      });
    } else {
      continueLogin();
    }
  }

  private executePostLoginLogic(): void {
      this.router.navigateByUrl(PathsEnum.HOME);
  }

  public clearSession(): void {
    localStorage.removeItem(StorageEnum.ACTIVE_SESSION);
    localStorage.removeItem(StorageEnum.TOKEN_EXPIRES_AT);
  }

  public isAccessTokenExpired(): boolean {
    const tokenExpiresAt = localStorage.getItem(StorageEnum.TOKEN_EXPIRES_AT);
    if (tokenExpiresAt) {
      return !(Number(tokenExpiresAt) > new Date().getTime());
    }
    return false;
  }

  public checkIfUserIsAvailable(): boolean {
    return this.getActiveSession() !== null && !this.isAccessTokenExpired();
  }

  public isAdmin(): Promise<boolean> {
    const roles = this.getActiveSession()?.roles;
    if (roles) {
      return Promise.resolve(
        roles.some((x) => x.name === RoleEnum.ADMIN)
      );
    }
    return Promise.resolve(false);
  }

  public refreshToken(): Observable<any> {
    const refresh_token = this.getActiveSession()?.refresh_token;
    if (refresh_token) {
      return this.http
        .post<LoginResponse>(
          `${this.settingsService.settings.baseUrl}${ApiEnum.REFRESH_TOKEN}`,
          {
            username: this.username,
            refreshToken: refresh_token,
          }
        )
        .pipe(
          tap((data) => this.handleLoginSuccess(data as LoginResponse)),
          catchError((error) => {
            this.logout();
            return throwError(error);
          })
        );
    }
    return of();
  }

  public getPermissions(): String[] {
    const permissions: String[] = [];
    const roles = this.getActiveSession()?.roles;
    if (roles) {
      roles.forEach((role) => {
        role.permissions.forEach((permission) => {
          permissions.push(permission.name);
        });
      });
    }
    return permissions;
  }

  public userAccessRightValidation(permission: PermissionEnum): boolean {
    return true;
    // TODO: Uncomment this when BE merged
    if (permission) {
      let authorities = this.getPermissions();
      return authorities.includes(permission);
    }
    return false;
  }

  public hasRole(allowedRoles?: string[]): boolean {
    if (!allowedRoles) {
      return true;
    }
    const roles = this.getActiveSession()?.roles;
    if (roles) {
      return roles.some((role) => allowedRoles.includes(role.name));
    }
    return false;
  }


  public updateSession(updatedProfile: ProfileInformation) {
    const activeSession = this.getActiveSession();
    if (activeSession) {
      activeSession.firstName = updatedProfile.firstName;
      activeSession.lastName = updatedProfile.lastName;
      activeSession.email = updatedProfile.email;
      localStorage.setItem(
        StorageEnum.ACTIVE_SESSION,
        JSON.stringify(activeSession)
      );
      this._initialsSubject.next(this.getUserInitials());
    }
  }
}
