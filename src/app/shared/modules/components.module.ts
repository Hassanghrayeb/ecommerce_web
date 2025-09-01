import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AiDropdownComponent } from '../components/ai-dropdown/ai-dropdown.component';
import { AiInputFormFieldComponent } from '../components/ai-input-form-field/ai-input-form-field.component';
import { ButtonComponent } from '../components/button/button.component';
import { PageTitleComponent } from '../components/page-title/page-title.component';
import { ThirdPartiesModule } from './third-parties.module';
import { DatepickerComponent } from '../components/date-picker/date-picker.component';
import { EmptyIconComponent } from '../components/empty-icon/empty-icon.component';
import { SideNavComponent } from '../components/side-nav/side-nav.component';
import { ListDataTableComponent } from '../components/list-data-table/list-data-table.component';
import { AiRadioButtonComponent } from '../components/ai-radio-button/ai-radio-button.component';
import { SharedDialogComponent } from '../components/shared-dialog/shared-dialog.component';
import { SectionBoxComponent } from '../components/section-box/section-box.component';
import { SubNavComponent } from '../components/sub-nav/sub-nav.component';
import { IconTextDropdownComponent } from '../components/icon-text-dropdown/icon-text-dropdown.component';
import { TextareaFormFieldComponent } from '../components/textarea-form-field/textarea-form-field.component';
import { InputFormErrorComponent } from '../components/input-form-error/input-form-error.component';
import { RegistrationFormDialogComponent } from '../components/registration-form-dialog/registration-form-dialog.component';
import { CompleteProfileDialogComponent } from '../components/complete-profile-dialog/complete-profile-dialog.component';

const sharedComponent = [
  AiInputFormFieldComponent,
  ButtonComponent,
  PageTitleComponent,
  AiDropdownComponent,
  DatepickerComponent,
  EmptyIconComponent,
  SideNavComponent,
  ListDataTableComponent,
  AiRadioButtonComponent,
  SharedDialogComponent,
  SectionBoxComponent,
  SubNavComponent,
  IconTextDropdownComponent,
  TextareaFormFieldComponent,
  InputFormErrorComponent,
  RegistrationFormDialogComponent,
  CompleteProfileDialogComponent
];

@NgModule({
  imports: [CommonModule, ThirdPartiesModule, RouterLink, RouterLinkActive],
  declarations: [...sharedComponent],
  exports: [CommonModule, ThirdPartiesModule, ...sharedComponent],
})
export class ComponentsModule {}
