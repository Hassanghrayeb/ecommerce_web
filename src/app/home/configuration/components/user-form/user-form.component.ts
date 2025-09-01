import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DropdownOption} from 'src/app/shared/models/dropdown-option.model';
import {InputColor, InputMode, InputShape, SizeEnum} from '../../../../shared/enums/input-mode.enum';
import {ButtonModel} from '../../../../shared/models/button.model';
import {UserModel} from '../../pages/user-management/users.model';
import {UsersService} from '../../services/users.service';
import {RolesService} from '../../services/roles.service';
import {UtilsService} from "../../../../shared/services/utils.service";
import { PaginatorConfig } from 'src/app/shared/models/paginator-config.model';
import { ConfigTypeEnum } from 'src/app/shared/enums/config.enum';
import {RoleEnum} from "../../../../shared/enums/role.enum";

@Component({
  selector: 'laitron-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.sass'
})
export class UserFormComponent implements OnInit {

  public userForm: FormGroup;
  public userDetails: UserModel | null;
  public inputColor = InputColor;
  public textSize = SizeEnum;
  public inputShape = InputShape;
  public inputMode = InputMode;
  private paginatorConfig = new PaginatorConfig(ConfigTypeEnum.BE);
  public actionButtons: ButtonModel[] = [
    {
      color: InputColor.TRANSPARENT1,
      shape: InputShape.PRIMARY,
      mode: InputMode.LIGHT,
      label: 'general.cancel',
      icon: '',
      iconDirection: 'right',
      action: () => this.closeDialog()
    },
    {
      color: InputColor.PRIMARY23,
      shape: InputShape.PRIMARY,
      mode: InputMode.LIGHT,
      label: 'general.save',
      icon: '',
      iconDirection: 'right',
      action: () => this.saveUser()
    }
  ];
  public roleOptions: DropdownOption[] = [];

  ngOnInit(): void {
    this.getRoles();
    this.initForm();
    if (this.data?.id) {
      this.getUserDetails(this.data?.id);
    }
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UserModel,
    private _dialogRef: MatDialogRef<UserFormComponent>,
    private _usersService: UsersService,
    private _roleService: RolesService,
    private _utilsService: UtilsService) {
  }

  private initForm(): void {
    const isSuperAdmin = !!(this.data && this.isAdminUser(this.data));

    this.userForm = new FormGroup({
      username: new FormControl({ value: null, disabled: isSuperAdmin }, [Validators.required]),
      password: new FormControl({ value: null, disabled: isSuperAdmin }, [Validators.required]),
      enabled: new FormControl({ value: true, disabled: isSuperAdmin }),
      roles: new FormControl({ value: null, disabled: isSuperAdmin }, [Validators.required])
    });
  }

  private getRoles(): void{
    this._roleService.getAll().subscribe(roles => {
      if (roles.body?.content?.length) {
        this.roleOptions = roles.body.content.map(m => {
          const value: DropdownOption = {
            value: m.id,
            label: m.name
          };
          return value;
        });
      }
    });
  }

  private saveUser(): void {
    if (this.userForm.invalid) {
      return;
    }

    const formValue = this.userForm.getRawValue();
    if (!formValue.password) delete formValue.password;

    if (this.data?.id) {
      formValue.id = this.data.id;
    }

    const action = this.data?.id
      ? this._usersService.updateUser(this.data.id, formValue)
      : this._usersService.createUser(formValue);

    action.subscribe({
      next: () => this.closeDialog(true),
      error: (error) => {
        this._utilsService.showCustomSnackbar(`api_errors.${error.error.code}`);
      }
    });
  }


  private closeDialog(withAppliedAction?: boolean): void {
    this._dialogRef.close(withAppliedAction);
  }


  private getUserDetails(userId: number): void {
    this._usersService.getUser(userId).subscribe((response) => {
      if (response) {
        this.userDetails = response.body;
        if (this.userDetails) {
          this.patchForm(this.userDetails);
        }
      }
    });
  }

  private patchForm(data: UserModel): void {
    this.userForm.controls.username.patchValue(data.username);
    this.userForm.controls.enabled.patchValue(data.enabled);
    this.userForm.controls.roles.patchValue(data.roles?.map((m: any) => m.id));
  }

  private isAdminUser(user: UserModel) {
    return user.roles?.some((role: any) => [RoleEnum.ADMIN].includes(role.name));
  }
}
