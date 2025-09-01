import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputColor, InputMode, InputShape } from '../../enums/input-mode.enum';
import { ButtonModel } from '../../models/button.model';
import { ProfileInformation } from 'src/app/home/settings/models/profile-information.model';
import { ProfileInformationService } from 'src/app/home/settings/services/profile-information.service';
import { UtilsService } from '../../services/utils.service';
import { AuthenticationService } from '../../services/authentication.service';
import { CustomValidators } from '../../services/validators.service';

interface DialogData {
  missingFields: string[];
  firstName: string;
  lastName: string;
  email: string | null;
}

@Component({
  selector: 'laitron-complete-profile-dialog',
  templateUrl: './complete-profile-dialog.component.html',
  styleUrl: './complete-profile-dialog.component.sass'
})
export class CompleteProfileDialogComponent implements OnInit {
  public profileForm: FormGroup;
  public inputColor = InputColor;
  public inputMode = InputMode;
  public inputShape = InputShape;

  public actionButtons: ButtonModel[] = [
    {
      label: 'general.cancel',
      icon: '',
      iconDirection: 'right',
      shape: InputShape.PRIMARY,
      color: InputColor.TRANSPARENT1,
      mode: InputMode.LIGHT,
      action: () => this.onCancel()
    },
    {
      label: 'settings_module.profile_info.save',
      icon: '',
      iconDirection: 'right',
      shape: InputShape.PRIMARY,
      color: InputColor.PRIMARY23,
      mode: InputMode.DARK,
      action: () => this.onSave()
    }
  ];

  constructor(
    private dialogRef: MatDialogRef<CompleteProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private profileService: ProfileInformationService,
    private utilsService: UtilsService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    const controls: { [key: string]: FormControl } = {};
    if (this.data.missingFields.includes('firstName')) {
      controls['firstName'] = new FormControl(this.data.firstName || '', Validators.required);
    }
    if (this.data.missingFields.includes('lastName')) {
      controls['lastName'] = new FormControl(this.data.lastName || '', Validators.required);
    }
    if (this.data.missingFields.includes('email')) {
      controls['email'] = new FormControl(this.data.email || '', [Validators.required, CustomValidators.emailValidator]);
    }
    this.profileForm = new FormGroup(controls);
  }

  private onSave(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const profile: ProfileInformation = {
      firstName: this.profileForm.get('firstName')?.value || this.data.firstName,
      lastName: this.profileForm.get('lastName')?.value || this.data.lastName,
      email: this.profileForm.get('email')?.value || this.data.email || ''
    };
    this.profileService.updateProfileInformation(profile).subscribe({
      next: () => {
        this.authService.updateSession(profile);
        this.dialogRef.close(profile);
      },
      error: () => this.utilsService.showCustomSnackbar('general.error')
    });
  }

  private onCancel(): void {
    this.authService.logout();
    this.dialogRef.close(false);
  }
}

