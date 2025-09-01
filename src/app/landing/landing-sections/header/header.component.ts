import { Component, Injector } from '@angular/core';
import {PathsEnum} from '../../../shared/enums/path.enum';
import {InputColor, InputMode, InputShape} from '../../../shared/enums/input-mode.enum';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Direction } from '@angular/cdk/bidi';
import {LoginFormDialogComponent} from "../../components/login-form-dialog/login-form-dialog.component";
import {AuthenticationService} from "../../../shared/services/authentication.service";

@Component({
  selector: 'laitron-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass'
})
export class HeaderComponent {
  public PathEnum = PathsEnum;
  public inputColor = InputColor;
  public inputMode = InputMode;
  public inputShape = InputShape;
  public  direction: Direction | "auto" = 'ltr';

  constructor(private router: Router, private _dialog: MatDialog, private _translateService: TranslateService,
    private _injector: Injector
  ) {
    this.setDirection();
  }

  public onLoginClicked(): void {
    const screenWidth = window.innerWidth;
    const dialogWidth = screenWidth < 600 ? `${screenWidth - 50}px` : '400px';
    this._dialog.open(LoginFormDialogComponent, {
      minWidth: dialogWidth,
      height: 'auto',
      injector: Injector.create({
        providers: [
          {provide: AuthenticationService, useValue: this._injector.get(AuthenticationService)}
        ],
      }),
    });
  }

  private setDirection() {
    this.direction = this._translateService.currentLang === 'ar' ? 'rtl' : 'ltr';
    this._translateService.onLangChange.subscribe(event => {
      this.direction = event.lang === 'ar' ? 'rtl' : 'ltr';
    });
  }

  public goToLanding(): void{
    this.router.navigateByUrl(PathsEnum.LANDING_PAGE);
  }
}
