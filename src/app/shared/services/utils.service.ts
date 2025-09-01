import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(
    private translateService: TranslateService,
    private snackBar: MatSnackBar
  ) {}

  public showCustomSnackbar(
    customMessage: string,
    duration?: number,
    skipTranslation?: Boolean
  ) {
    const message =
      skipTranslation != null && skipTranslation === true
        ? customMessage
        : this.translateService.instant(customMessage);
    this.snackBar.open(message, '', { duration: duration ? duration : 4000 });
  }
}
