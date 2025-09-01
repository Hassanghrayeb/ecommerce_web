import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {UsersColumnDef} from 'src/app/home/configuration/pages/user-management/users.config';
import {DataTableBaseClass} from 'src/app/shared/base/data-table.base';
import {SimpleIdStatusDTO} from 'src/app/shared/enums/simple-id-status.model';
import {PermissionEnum} from 'src/app/shared/enums/user-role.enum';
import {PageChangeEvent} from 'src/app/shared/models/page-change-event.interface';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {UtilsService} from 'src/app/shared/services/utils.service';
import {UserModel} from './users.model';
import {InputColor, InputMode, InputShape} from 'src/app/shared/enums/input-mode.enum';
import {RoleEnum} from 'src/app/shared/enums/role.enum';
import {InfoDialogComponent} from 'src/app/shared/components/info-dialog/info-dialog.component';
import {PaginatorConfig} from 'src/app/shared/models/paginator-config.model';
import {ConfigTypeEnum} from 'src/app/shared/enums/config.enum';
import {UsersService} from '../../services/users.service';
import {UserFormComponent} from '../../components/user-form/user-form.component';
import {FormControl, FormGroup} from "@angular/forms";
import {RolesService} from '../../services/roles.service';
import {Subject} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {ViewUserDetailsComponent} from "../../components/view-user-details/view-user-details.component";

@Component({
  selector: 'laitron-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.sass'
})
export class UserManagementComponent extends DataTableBaseClass<any> implements OnInit, OnDestroy {
  paginatorConfig = new PaginatorConfig(ConfigTypeEnum.BE);
  public inputColor = InputColor;
  public inputShape = InputShape;
  public inputMode = InputMode;
  public dataTableColumnsDefinition = UsersColumnDef;
  public canAdd: boolean = false;
  public hasViewAcces: boolean = false;
  public count: number;
  public searchForm: FormGroup;

  private _destroy$ = new Subject<void>();


  constructor(
    public userService: UsersService,
    public injector: Injector,
    private authService: AuthenticationService,
    private utilsService: UtilsService,
    private _dialog: MatDialog
  ) {
    super(injector);

    this.dataTableColumnsDefinition.forEach((column) => {
      if (column.property == 'edit') {
        column.visible = this.authService.userAccessRightValidation(
          PermissionEnum.USER_EDIT
        );
      } else if (column.property == 'delete') {
        column.visible = false; 
      }
    });

    this.canAdd = this.authService.userAccessRightValidation(
      PermissionEnum.USER_EDIT
    );
    this.hasViewAcces = this.authService.userAccessRightValidation(
      PermissionEnum.USER_GET
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
      .pipe(debounceTime(300), takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          this.getListing({page: this.paginatorConfig.page, size: this.paginatorConfig.size}, true);
        }
      })
  }

  private getListing(paginationObj: PageChangeEvent, first: boolean): void {
    const filter = this.searchForm.controls.search.value;
    this.userService.getAllUsers(paginationObj, filter).subscribe({
      next: (data) => {
        if (data && data.body) {
          this.count = data.body.totalElements;
          let list = data.body;
          list.content.forEach(user => {
            user.roles?.forEach((role: any) => {
              role.type = this.getColorByRole(role.name);
            });
          });
          this.setDataTableData(data.body, first);
        }
      },
      error: (err) => {
      }
    })
  }


  public addUser(): void {
    this.openEditUserDialog();
  }

  actionClicked(ev: any) {
    switch (ev.name) {
      case 'edit':
        this.openEditUserDialog(ev.data);
        break;
      case 'view':
        this.openViewUserDialog(ev.data);
        break;
      case 'delete':
        // Handle delete
        break;
      default:
        break;
    }
  }

  clickToggle(ev: any) {
    if (ev.name == 'enabled') {
      this.toggleEnabled(ev);
    }
  }

  toggleEnabled(ev: any) {
    if (this.isAdminUser(ev.data)) {
      this.openInfoDialog();
      return;
    }
    if (ev.data) {
      const favoriteForm: SimpleIdStatusDTO = {
        id: ev.data.id,
        status: !ev.data.enabled,
      };
      this.userService.updateUserStatus(favoriteForm).subscribe({
        next: () => {
          this.utilsService.showCustomSnackbar(
            'admin_module.users.update_status_success',
            4000
          );
          this.getListing({
            page: this.paginatorConfig.page,
            size: this.paginatorConfig.size,
          }, false);
        },
        error: () => {
          this.utilsService.showCustomSnackbar(
            'admin_module.users.update_status_error',
            4000
          );
        },
      });
    }
  }

  onPage(pageChangeEvent: PageChangeEvent) {
    this.getListing({
      page: pageChangeEvent.page,
      size: pageChangeEvent.size,
    }, false);
  }

  private openEditUserDialog(user?: UserModel): void {
    this._dialog.open(UserFormComponent, {
      data: user,
      injector: Injector.create({
        providers: [
          {provide: UsersService, useValue: this.injector.get(UsersService)},
          {provide: RolesService, useValue: this.injector.get(RolesService)},
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

  private isAdminUser(user: UserModel): boolean {
    return user.roles?.some((role: any) => [RoleEnum.ADMIN].includes(role.name)) as boolean;
  }

  private getColorByRole(role: string): string {
    switch (role) {
      case RoleEnum.ADMIN:
        return 'black';
      case RoleEnum.STANDARD:
      default:
        return 'red';
    }
  }

  private initForm(): void {
    this.searchForm = new FormGroup({
      search: new FormControl(null)
    });
  }

  private openInfoDialog(): void {
    this._dialog.open(InfoDialogComponent, {
      data: {
        infoMessage: 'settings_module.user_management.not_allowed',
        infoButton: 'general.okay'
      }
    });
  }

  private openViewUserDialog(user: UserModel): void {
    this._dialog.open(ViewUserDetailsComponent, {
      data: user
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
