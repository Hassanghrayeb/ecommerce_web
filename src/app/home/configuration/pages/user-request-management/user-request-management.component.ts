import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { DataTableBaseClass } from 'src/app/shared/base/data-table.base';
import { ConfigTypeEnum } from 'src/app/shared/enums/config.enum';
import { InputColor, InputShape, InputMode } from 'src/app/shared/enums/input-mode.enum';
import { PaginatorConfig } from 'src/app/shared/models/paginator-config.model';
import { UsersService } from '../../services/users.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { PageChangeEvent } from 'src/app/shared/models/page-change-event.interface';
import { UserRegistrationModel } from 'src/app/landing/models/registration.model';
import { UsersRequestColumnDef } from './user-request.config';

@Component({
  selector: 'laitron-user-request-management',
  templateUrl: './user-request-management.component.html',
  styleUrl: './user-request-management.component.sass'
})
export class UserRequestManagementComponent extends DataTableBaseClass<any> implements OnInit, OnDestroy {

    paginatorConfig = new PaginatorConfig(ConfigTypeEnum.BE);
    public inputColor = InputColor;
    public inputShape = InputShape;
    public inputMode = InputMode;
    public dataTableColumnsDefinition = UsersRequestColumnDef;
    public canAdd: boolean = false;
    public hasViewAcces: boolean = false;
    public count: number;
    public searchForm: FormGroup;
  
    private _destroy$ = new Subject<void>();

constructor(
    private _userService: UsersService,
    private _injector: Injector,
    private _utilsService: UtilsService
  ) 
  {
    super(_injector);
  }

  ngOnInit(): void {
      this.initForm();
      this.listenToFilter();
      this.getListing({
        page: this.paginatorConfig.page,
        size: this.paginatorConfig.size,
      }, true);
    }

  private initForm(): void {
    this.searchForm = new FormGroup({
      search: new FormControl(null)
    });
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
    this._userService.getAllRegisteredUsers(paginationObj, filter).subscribe({
      next: (data) => {
        if (data && data.body) {
          this.count = data.body.totalElements;
          this.setDataTableData(data.body, first);
        }
      },
      error: (error) => { this._utilsService.showCustomSnackbar(`api_errors.${error.error.code}`); }
    })
  }

  onPage(pageChangeEvent: PageChangeEvent) {
  this.getListing({
    page: pageChangeEvent.page,
    size: pageChangeEvent.size,
  }, false);
  }

  actionClicked(ev: any) {
    switch (ev.name) {
      case 'approve':
        this.approveRegisterdUser(ev.data);
        break;
      default:
        break;
    }
  }

  private approveRegisterdUser(userRegistrationModel: UserRegistrationModel): void {
    this._userService.approveRegisterdUser(userRegistrationModel.id)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (response) => {
        if (response.status === 200) {
          this._utilsService.showCustomSnackbar(`user.verified.susccessfully`);
          this.getListing({
            page: this.paginatorConfig.page,
            size: this.paginatorConfig.size,
          }, false);
        }
      },
      error: (error) => { this._utilsService.showCustomSnackbar(`api_errors.${error.error.code}`); }
      })
  }

    ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
