import {Direction} from '@angular/cdk/bidi';
import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {StorageEnum} from "./shared/models/storage.enum";

@Component({
  selector: 'laitron-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  public direction: Direction | "auto" = 'ltr';

  constructor(
    private readonly translate: TranslateService) 
  {
    this.initializeTranslation();
  }

  initializeTranslation(): void {
    const languageKey = localStorage.getItem(StorageEnum.LANGUAGE) || 'en';
    this.translate.setDefaultLang(languageKey);
    this.translate.use(languageKey);

    this.translate.onLangChange.subscribe(event => {
      this.direction = event.lang === 'ar' ? 'rtl' : 'ltr';
    });
  }

}
