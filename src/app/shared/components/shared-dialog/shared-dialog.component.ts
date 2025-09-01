import { Component, Input, OnInit } from '@angular/core';
import { ButtonModel } from '../../models/button.model';
import { InputColor, InputMode, InputShape } from '../../enums/input-mode.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'laitron-shared-dialog',
  templateUrl: './shared-dialog.component.html',
  styleUrl: './shared-dialog.component.sass'
})
export class SharedDialogComponent implements OnInit {

  @Input() title: string;
  @Input() subTitle: string;
  @Input() actionButtons: ButtonModel[];
  @Input() headerButton?: ButtonModel;

  public direction: 'ltr' | 'rtl' = 'ltr';
  public inputColor = InputColor;
  public inputShape = InputShape;
  public inputMode = InputMode;

  constructor(private _translationService: TranslateService) {}

  ngOnInit(): void {
    this.setDirection();
  }

  private setDirection(): void {
    this.direction = this._translationService.currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  public handleEnterKey(event: Event): void {
  const keyboardEvent = event as KeyboardEvent;

  const defaultBtn = this.actionButtons?.find(btn => btn.triggerOnEnter);
  if (defaultBtn && typeof defaultBtn.action === 'function') {
    keyboardEvent.preventDefault();
    defaultBtn.action(0);
  }
}
}
