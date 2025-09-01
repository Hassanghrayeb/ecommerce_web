import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {ButtonModel} from '../../models/button.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'laitron-success-dialog',
  templateUrl: './success-dialog.component.html',
  styleUrl: './success-dialog.component.sass'
})
export class SuccessDialogComponent implements OnInit, OnDestroy{

  public direction: 'ltr' | 'rtl' = 'ltr';
  private destroy$ = new Subject<void>();

  constructor(public dialogRef: MatDialogRef<SuccessDialogComponent>,
              private _translateService: TranslateService,
              @Inject(MAT_DIALOG_DATA) public data: {
                title: string,
                titleParams: { [key: string]: string },
                description: string,
                descriptionParams: { [key: string]: string },
                note: string,
                buttons: ButtonModel[],
                successIcon: string,
              }) {
  }

  public closeDialog(): void{
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.setDirection();
  }

  private setDirection(): void {
    this.direction = this._translateService.currentLang === 'ar' ? 'rtl' : 'ltr';
    this._translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        this.direction = event.lang === 'ar' ? 'rtl' : 'ltr';
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
