import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataTableBaseClass } from 'src/app/shared/base/data-table.base';
import { ConfigTypeEnum } from 'src/app/shared/enums/config.enum';
import { PermissionEnum } from 'src/app/shared/enums/user-role.enum';
import { PageChangeEvent } from 'src/app/shared/models/page-change-event.interface';
import { PaginatorConfig } from 'src/app/shared/models/paginator-config.model';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { RolesColumnDef } from './roles.config';
import { RolesService } from '../../services/roles.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { InputColor, InputMode, InputShape } from 'src/app/shared/enums/input-mode.enum';
import { RoleModel } from './roles.model';
import { RoleFormComponent } from '../../components/role-form/role-form.component';
import {FormControl, FormGroup} from "@angular/forms";
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ecommerce-role-management',
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.sass'
})
export class RoleManagementComponent extends DataTableBaseClass<any> implements OnInit, OnDestroy {
  paginatorConfig = new PaginatorConfig(ConfigTypeEnum.BE);
  public dataTableColumnsDefinition = RolesColumnDef;
  private hasViewAcces: boolean = false;
  public inputColor = InputColor;
  public inputShape = InputShape;
  public inputMode = InputMode;
  public count: number;
  public searchForm: FormGroup;

  private _canAdd: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    public roleService: RolesService,
    public injector: Injector,
    private authService: AuthenticationService,
    private _dialog: MatDialog,
  ) {
    super(injector);

    this.dataTableColumnsDefinition.forEach((column) => {
      if (column.property === 'edit') {
        column.visible = this.authService.userAccessRightValidation(
          PermissionEnum.ROLE_EDIT
        );
      } else if (column.property === 'delete') {
        column.visible = this.authService.userAccessRightValidation(
          PermissionEnum.ROLE_DELETE
        );
      }
    });

    this._canAdd = this.authService.userAccessRightValidation(
      PermissionEnum.ROLE_EDIT
    );
    this.hasViewAcces = this.authService.userAccessRightValidation(
      PermissionEnum.ROLE_GET
    );
  }

  ngOnInit(): void {
    this.initForm();
    this.listenToFilter();
    if (this.hasViewAcces) {
      this.getListing({
        page: this.paginatorConfig.page,
        size: this.paginatorConfig.size,
      }, true);
    }
  }

  private listenToFilter(): void {
    this.searchForm.controls.search.valueChanges
    .pipe(debounceTime(300), takeUntil(this.destroy$))
    .subscribe({
      next: () => { this.getListing({ page: this.paginatorConfig.page, size: this.paginatorConfig.size }, true); }
    })
  }

  public getListing(paginationObj: PageChangeEvent, first: boolean): void {
    const filter = this.searchForm.controls.search.value;
    this.roleService.getAllRoles(paginationObj, filter).subscribe({
      next: (data) => {
        if (data && data.body) {
          this.count = data.body.totalElements;
          this.setDataTableData(data.body, first);
        }
      },
      error: (err) => {}
    })
  }

  public actionClicked(ev: any): void {
    switch (ev.name) {
      case 'edit':
        this.openEditRoleDialog(ev.data)
        break;
      case 'delete':
        this.openConfirmationDialog(ev);
        break;
      default:
        break;
    }
  }

  onPage(pageChangeEvent: PageChangeEvent) {
    this.getListing({
      page: pageChangeEvent.page,
      size: pageChangeEvent.size,
    }, false);
  }


  public addRole() {
    this.openEditRoleDialog();
  }

  private openEditRoleDialog(role?: RoleModel): void {
    this._dialog.open(RoleFormComponent, {
      data: {
        id: role?.id,
      },
      injector: Injector.create({
        providers: [
          {provide: RolesService, useValue: this.injector.get(RolesService)}
        ],
      }),
    }).afterClosed().subscribe((withActionApplied: boolean) => {
      if (withActionApplied) {
        this.getListing({
          page: this.paginatorConfig.page,
          size: this.paginatorConfig.size,
        }, true);
      }
    });
  }

  private openConfirmationDialog(ev: any): void {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      data: {
        confirmationMessage: 'settings_module.role_management.delete_confirmation',
        confirmationButton: 'general.confirm'
      },
      maxWidth: '550px',
      height: 'auto',
    });
    dialogRef.afterClosed().subscribe((result) => {
      switch (ev.name) {
        case 'delete':
          if (result) {
            this.deleteRole(ev.data?.id);
          }
          break;
        default:
          break;
      }

    });
  }

  private deleteRole(id: number): void {
    this.roleService.deleteRoleById(id).subscribe(() => {
      this.getListing({
        page: this.paginatorConfig.page,
        size: this.paginatorConfig.size,
      }, true);
    });
  }

  private initForm(): void{
    this.searchForm = new FormGroup({
      search: new FormControl(null)
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
