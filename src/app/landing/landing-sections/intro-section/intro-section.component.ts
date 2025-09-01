import {Component, Injector} from '@angular/core';
import {InputColor, InputMode, InputShape} from "../../../shared/enums/input-mode.enum";
import {MatDialog} from "@angular/material/dialog";
import { Direction } from '@angular/cdk/bidi';
import { TranslateService } from '@ngx-translate/core';
import { RegistrationFormDialogComponent } from 'src/app/shared/components/registration-form-dialog/registration-form-dialog.component';

@Component({
  selector: 'laitron-intro-section',
  templateUrl: './intro-section.component.html',
  styleUrl: './intro-section.component.sass'
})
export class IntroSectionComponent {

  public inputShape = InputShape;
  public inputColor = InputColor;
  public inputMode = InputMode;
  public direction: Direction | "auto" = 'ltr';

  constructor(private _dialog: MatDialog, private _translateService: TranslateService, private _injector: Injector) {
    this.setDirection();
  }

  public openRegistrationDialog(): void {
    // MatDialog uses its own injector to resolve dependencies for the component
    // module's injector services are not resolved with MatDialog unless explicitly passed to the dialog
    const screenWidth = window.innerWidth;
    const dialogWidth = screenWidth < 500 ? `${screenWidth - 50}px` : '430px';
    this._dialog.open(RegistrationFormDialogComponent, {
      width: dialogWidth,
      height: 'auto',
    });
  }

  private setDirection(): void{
    this.direction = this._translateService.currentLang === 'ar' ? 'rtl' : 'ltr';
    this._translateService.onLangChange.subscribe(event => {
      this.direction = event.lang === 'ar' ? 'rtl' : 'ltr';
    });
  }
}
