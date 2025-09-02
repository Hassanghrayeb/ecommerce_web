import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InputColor, InputMode, InputShape } from 'src/app/shared/enums/input-mode.enum';
import { ButtonModel } from 'src/app/shared/models/button.model';
import { UserModel } from '../../pages/user-management/users.model';

@Component({
  selector: 'ecommerce-view-user-details',
  templateUrl: './view-user-details.component.html',
  styleUrl: './view-user-details.component.sass'
})
export class ViewUserDetailsComponent implements OnInit {

  public detailsForm: FormGroup;
  public inputColor = InputColor;
  public inputShape = InputShape;
  public inputMode = InputMode;
  public actionButtons: ButtonModel[] = [
    {
      color: InputColor.PRIMARY23,
      shape: InputShape.PRIMARY,
      mode: InputMode.LIGHT,
      label: 'general.close',
      icon: '',
      iconDirection: 'right',
      action: () => this.closeDialog()
    }
  ];

  constructor(
    private _dialogRef: MatDialogRef<ViewUserDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserModel
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    const toYMD = (s?: string | null) =>
      s?.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? null;

    this.detailsForm = new FormGroup({
      email: new FormControl(this.data?.person?.email ?? null),
      registrationDate: new FormControl(toYMD(this.data?.updateTimestamp)),
      roles: new FormControl((this.data?.roles as any[] ?? []).map(r => r.name || r).join(', '))
    });

    this.detailsForm.disable();
  }


  private closeDialog(): void {
    this._dialogRef.close();
  }
}
