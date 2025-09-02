import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DropdownOption} from 'src/app/shared/models/dropdown-option.model';
import {InputColor, InputMode, InputShape, SizeEnum} from '../../../../shared/enums/input-mode.enum';
import {ButtonModel} from '../../../../shared/models/button.model';
import {RoleModel} from '../../pages/role-management/roles.model';
import {RolesService} from '../../services/roles.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'ecommerce-role-form',
  templateUrl: './role-form.component.html',
  styleUrl: './role-form.component.sass'
})
export class RoleFormComponent implements OnInit {

  private _destroy$ = new Subject<void>();
  
  public roleForm: FormGroup;
  public permissionsForm: FormGroup;
  public roleDetails: RoleModel | null;
  public inputColor = InputColor;
  public textSize = SizeEnum;
  public inputShape = InputShape;
  public inputMode = InputMode;
  public permissionsLookup: DropdownOption[];
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
      action: () => this.saveRole()
    }
  ];

  ngOnInit(): void {
    this.initForm();
    this.getPermission();
    if (this.data?.id) {
      this.getRoleDetails(this.data?.id);
    }
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private _dialogRef: MatDialogRef<RoleFormComponent>,
    private _rolesService: RolesService) {
  }

  private initForm(): void {
    this.roleForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null)
    });
    this.permissionsForm = new FormGroup({
      permissions: new FormControl(null, [Validators.required])
    });
  }

  private saveRole(): void {
    if (this.roleForm.invalid) {
      return;
    }
    const formValue = this.roleForm.getRawValue();
    if (!formValue.password) {
      delete formValue.password;
    }
    if (this.data.id) {
      formValue.id = this.data.id;
    }

    const action = this.data.id
      ? this._rolesService.editRoleById(this.data.id, formValue)
      : this._rolesService.createRole(formValue);
    action
    .pipe(takeUntil(this._destroy$))
    .subscribe((response) => {
      if (this.permissionsForm.dirty && response.body) {
        this.setRolePermissions(response.body.id);
      } else {
        this.closeDialog(true);
      }
    });
  }

  private closeDialog(withAppliedAction?: boolean): void {
    this._dialogRef.close(withAppliedAction);
  }


  private getRoleDetails(roleId: number): void {
    this._rolesService.getRoleById(roleId)
    .pipe(takeUntil(this._destroy$))
    .subscribe((response) => {
      if (response) {
        this.roleDetails = response.body;
        if (this.roleDetails) {
          this.roleForm.patchValue(this.roleDetails);
          this.permissionsForm.patchValue(this.roleDetails);
        }
      }
    });
  }

  private getPermission(): void {
    this._rolesService.getAllPermission()
    .pipe(takeUntil(this._destroy$))
    .subscribe((response) => {
      if (response && response.body) {
        this.permissionsLookup = response.body?.map((item: { name: string; id: number; }) => ({value: item.id, label: item.name}));
      }
    });
  }

  private setRolePermissions(roleId: number): void {
    this._rolesService.setRolePermissions(roleId, this.permissionsForm.get('permissions')?.value)
    .pipe(takeUntil(this._destroy$))
    .subscribe((response) => {
      if (response) {
        this.closeDialog(true);
      }
    });
  }
}
