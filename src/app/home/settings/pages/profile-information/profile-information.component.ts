import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {
  InputColor,
  InputMode,
  InputShape,
} from 'src/app/shared/enums/input-mode.enum';
import {ButtonModel} from '../../../../shared/models/button.model';
import {ProfileInformationService} from '../../services/profile-information.service';
import {ProfileInformation} from '../../models/profile-information.model';
import {AuthenticationService} from '../../../../shared/services/authentication.service';
import {SafeUrl} from '@angular/platform-browser';
import { HttpResponse } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'laitron-profile-information',
  templateUrl: './profile-information.component.html',
  styleUrl: './profile-information.component.sass',
})
export class ProfileInformationComponent implements OnInit {

  private _destroy$ = new Subject<void>();

  @ViewChild('fileInput') fileInput: ElementRef;
  public inputColor = InputColor;
  public inputShape = InputShape;
  public inputMode = InputMode;
  public profileInfoForm: FormGroup;
  public passwordForm: FormGroup;
  public isLoading = true;
  public profileImageUrl: SafeUrl | null = null;
  public saveProfileInformationButton: ButtonModel[] = [
    {
      label: 'settings_module.profile_info.save',
      icon: '',
      iconDirection: 'left',
      shape: InputShape.PRIMARY,
      color: InputColor.PRIMARY11,
      mode: InputMode.LIGHT,
      action: () => this.onProfileChange()
    },
  ];

  ngOnInit(): void {
    this.initForm();
    this.initPasswordForm();
  }

  constructor(
    private profileInformationService: ProfileInformationService,
    private _authenticationService: AuthenticationService,
  ) {
  }

  public onLogout(): void {
    this._authenticationService.logout();
  }

  private initForm(): void {
    this.profileInformationService.getProfile().subscribe((x) => {
      const profile = x.body;
      if (profile) {
        this.initProfileInfoForm(profile);
        this.isLoading = false;
      }
    });
  }

  private initProfileInfoForm(profile: ProfileInformation): void {
    this.profileInfoForm = new FormGroup({
      firstName: new FormControl(profile.firstName, Validators.required),
      lastName: new FormControl(profile.lastName, Validators.required),
      username: new FormControl({value: profile.email, disabled: true}, Validators.required),
      email: new FormControl({value: profile.email, disabled: true}, Validators.required),
    });
  }


  private initPasswordForm(): void {
    this.passwordForm = new FormGroup({
      currentPassword: new FormControl(null, Validators.required),
      newPassword: new FormControl(null, Validators.required),
    });
  }


  public onProfileChange(): void {
    this.profileInformationService
      .updateProfileInformation(this.profileInfoForm.value)
      .pipe(takeUntil(this._destroy$))
      .subscribe((response: HttpResponse<ProfileInformation>) => {
        const updatedProfile = response.body;
        if (updatedProfile) {
          this._authenticationService.updateSession(updatedProfile);
        }
      });
  }

}
