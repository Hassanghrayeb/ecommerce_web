import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { InfoDialogComponent } from './components/info-dialog/info-dialog.component';
import { SlideToggleComponent } from './components/slide-toggle/slide-toggle.component';
import { SuccessDialogComponent } from './components/success-dialog/success-dialog.component';
import { AuthGuard } from './guards/auth.guard';
import { CanActivatePageGuard } from './guards/can-activate-page.guard';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';
import { RequestInterceptor } from './interceptors/request.interceptor';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { SpinnerInterceptor } from './interceptors/spinner.interceptor';
import { ComponentsModule } from './modules/components.module';
import { BrowserApisService } from './services/browser-apis.service';
import { GlobalErrorHandlerService } from './services/global-error-handler.service';
import { LoggingService } from './services/logging.service';
import { SpinnerService } from './services/spinner.service';
import { LoginFormDialogComponent } from '../landing/components/login-form-dialog/login-form-dialog.component';

@NgModule({
  declarations: [
    ConfirmationDialogComponent,
    InfoDialogComponent,
    SlideToggleComponent,
    SuccessDialogComponent,
    LoginFormDialogComponent,
  ],
  imports: [ComponentsModule, RouterLinkActive],
  exports: [ComponentsModule, SlideToggleComponent],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: SpinnerInterceptor,
          multi: true,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: RequestInterceptor,
          multi: true,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ResponseInterceptor,
          multi: true,
        },
        GlobalErrorHandlerService,
        LoggingService,
        CanDeactivateGuard,
        AuthGuard,
        CanActivatePageGuard,
        SpinnerService,
        BrowserApisService
      ],
    };
  }
}
