import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PathsEnum} from '../../enums/path.enum';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {InputColor, InputMode, InputShape, SizeEnum} from '../../enums/input-mode.enum';
import { TranslateService } from '@ngx-translate/core';
import { Direction } from '@angular/cdk/bidi';

@Component({
  selector: 'ecommerce-page-title',
  templateUrl: './page-title.component.html',
  styleUrl: './page-title.component.sass'
})
export class PageTitleComponent {
  @Input()
  public title: string = '';
  @Input()
  public backPath: PathsEnum | string;
  @Input()
  public confirmActionOnBack: boolean = true;
  @Input()
  public backEnabled: boolean;
  @Input()
  public textSize: SizeEnum = SizeEnum.BIG;
  @Input()
  public withBorder: boolean = false;

  @Output()
  public goBackClick: EventEmitter<void> = new EventEmitter<void>();

  public inputMode = InputMode;
  public inputColor = InputColor;
  public inputShape = InputShape;
  direction: Direction | "auto" = 'ltr';

  constructor(
    private _router: Router,
    private _location: Location,
    private translateService: TranslateService) {
      this.setDirection();
  }

  public goBack(): void{
    if (this.goBackClick && this.goBackClick.observers.length > 0) {
      this.goBackClick.emit();
    } else {
      if (this.backPath) {
        this._router.navigateByUrl(this.backPath);
      } else {
        this._location.back();
      }
    }
  }

  private setDirection() {
    this.direction = this.translateService.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.translateService.onLangChange.subscribe(event => {
			this.direction = event.lang === 'ar' ? 'rtl' : 'ltr';
		  });
  }
}

