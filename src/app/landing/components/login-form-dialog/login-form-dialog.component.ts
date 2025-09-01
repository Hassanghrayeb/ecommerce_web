import {Component, OnInit} from '@angular/core';
import {ButtonModel} from '../../../shared/models/button.model';
import {InputColor, InputMode, InputShape, SizeEnum} from '../../../shared/enums/input-mode.enum';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UtilsService} from '../../../shared/services/utils.service';
import {CustomValidators} from '../../../shared/services/validators.service';
import {LoginResponse} from '../../../shared/models/login-response.model';
import {AuthenticationService} from '../../../shared/services/authentication.service';
import { RegistrationFormDialogComponent } from 'src/app/shared/components/registration-form-dialog/registration-form-dialog.component';

@Component({
  selector: 'laitron-login-form-dialog',
  templateUrl: './login-form-dialog.component.html',
  styleUrl: './login-form-dialog.component.sass'
})
export class LoginFormDialogComponent implements OnInit{

  public inputShape = InputShape;
  public inputMode = InputMode;
  public textSize = SizeEnum;
  public inputColor = InputColor;
  public loginForm: FormGroup;

  public actionButtons: ButtonModel[] = [
    {
      label: 'general.cancel',
      icon: '',
      iconDirection: 'right',
      shape: InputShape.PRIMARY,
      color: InputColor.TRANSPARENT1,
      mode: InputMode.LIGHT,
      action: () => this.closeDialog()
    },
    {
      label: 'landing.submit',
      icon: '',
      iconDirection: 'right',
      shape: InputShape.PRIMARY,
      color: InputColor.PRIMARY23,
      mode: InputMode.DARK,
      triggerOnEnter: true,
      action: () => this.login()
    }
  ];

  constructor(
    private _dialogRef: MatDialogRef<LoginFormDialogComponent>,
    private _authService: AuthenticationService,
    private _utilsService: UtilsService,
    private _dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        CustomValidators.noWhitespaceValidator,
      ]),
      password: new FormControl(null, [
        Validators.required,
        CustomValidators.noWhitespaceValidator,
      ]),
    });
  }

  private closeDialog(): void {
    this._dialogRef.close();
  }

  private login(): void{
    if (this.loginForm.valid) {
      const {email, password} = this.trimUserInput();
      this._authService.login(email, password).subscribe({
        next: (data) => this.onLoginSuccess(data),
        error: (error) => this.onLoginFailure(error),
      });
    }
  }

  private trimUserInput(): { email: string; password: string } {
    const user = this.loginForm.getRawValue();
    return {
      email: user.email?.trim() || '',
      password: user.password?.trim() || '',
    };
  }

  private onLoginSuccess(data: LoginResponse): void {
    this.closeDialog();
    this._authService.handleLoginSuccess(data);
  }

  private onLoginFailure(error: string): void {
    this._utilsService.showCustomSnackbar(`auth.${error}`);
    this.loginForm.controls.password.reset();
  }

  public openRegistrationDialog(): void {
    this._dialogRef.close();
    const screenWidth = window.innerWidth;
    const dialogWidth = screenWidth < 500 ? `${screenWidth - 50}px` : '430px';
    this._dialog.open(RegistrationFormDialogComponent, {
      width: dialogWidth,
      height: 'auto'
    });
  }

}
