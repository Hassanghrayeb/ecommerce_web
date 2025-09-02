import {Component, Injector, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { SuccessDialogComponent } from "../../../shared/components/success-dialog/success-dialog.component";
import { InputColor, InputMode, InputShape, SizeEnum } from "../../../shared/enums/input-mode.enum";
import { ButtonModel } from "../../../shared/models/button.model";
import { CustomValidators } from 'src/app/shared/services/validators.service';
import { DropdownOption } from 'src/app/shared/models/dropdown-option.model';
import { RegistrationService } from 'src/app/landing/services/registration.service';
import { UserRegistrationModel, UserRegistrationResponse } from 'src/app/landing/models/registration.model';
import { UtilsService } from '../../services/utils.service';
import { PlatformLocation } from '@angular/common';
import {LoginFormDialogComponent} from "../../../landing/components/login-form-dialog/login-form-dialog.component";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'laitron-registration-form-dialog',
  templateUrl: './registration-form-dialog.component.html',
  styleUrl: './registration-form-dialog.component.sass'
})
export class RegistrationFormDialogComponent implements OnInit{

  public inputColor = InputColor;
  public registrationForm: FormGroup;
  public countryOfJurisdiction: DropdownOption[];
  public mobileCountries: DropdownOption[];
  public inputShape = InputShape;
  public inputMode = InputMode;
  public textSize = SizeEnum;
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
      action: () => this.submitRequest()
    }
  ];
  

  public successButton: ButtonModel =
  {
    label: 'auth.login.login',
    icon: '',
    iconDirection: 'right',
    shape: InputShape.PRIMARY,
    color: InputColor.PRIMARY11,
    mode: InputMode.LIGHT,
    action: () => this.login()
  };

  constructor(
    private _dialogRef: MatDialogRef<RegistrationFormDialogComponent>,
    private _dialog: MatDialog,
    private _registrationService: RegistrationService,
    private _authService: AuthenticationService,
    private _utilsService: UtilsService,
    private _injector: Injector) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.registrationForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      emailAddress: new FormControl(null, [Validators.required, CustomValidators.emailValidator]),
      password: new FormControl(null, [Validators.required, CustomValidators.strongPasswordValidator]),
      confirmPassword: new FormControl(null, [Validators.required, CustomValidators.confirmPasswordValidator]),
    });

    this.registrationForm.get('password')?.valueChanges.subscribe(() => {
      this.registrationForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  public checkUserExists(email: string): void {
    if (!email || email.trim() === '') {
      return;
    }
    this._authService.checkUserExists(email).subscribe(response => {
      if (response.exists) {
        this.registrationForm.get('emailAddress')?.setErrors({ emailAlreadyExists: true });
      }
    });
  }

  public onEmailBlur(): void{
    if (this.registrationForm.get('emailAddress')?.valid) {
      this.checkUserExists(this.registrationForm.get('emailAddress')?.value);
    }
  }

  public closeDialog(): void {
    this._dialogRef.close();
  }

  public submitRequest(): void {
    if(this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }
      const value: UserRegistrationModel = this.registrationForm.getRawValue();
      this.registerUser(value);
  }

  private registerUser(userRegistration: UserRegistrationModel): void {
    this._registrationService.registerUser(userRegistration).subscribe({
    next: (data) => { if(data.body) this.onRegisterSuccess(data.body) },
    error: (error) => this.onRegisterFailure(error)
  })
}

  private onRegisterSuccess(response: UserRegistrationResponse): void {
    if(response.userRegistrationDTO){
        this.openSuccessDialog();
    }
  }

  private onRegisterFailure(error: any): void {
    this._utilsService.showCustomSnackbar(`userRegistration: ${error.error.message}`);
  }



  private openSuccessDialog(): void {
    this._dialog.closeAll();
    this._dialog.open(SuccessDialogComponent, {
      maxWidth: '600px',
      maxHeight: '400px',
      data: {
        title: 'landing.request_success',
        successIcon: 'assets/icons/check.svg',
        description: 'landing.request_success_description',
        buttons: [this.successButton]
      }
    });
  }


  private login(): void {
    this._dialog.closeAll();
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

}
