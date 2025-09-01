import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from './materials.module';
import {NgOtpInputModule} from "ng-otp-input";

@NgModule({
  declarations: [],
  imports: [TranslateModule, NgOtpInputModule],
  exports: [TranslateModule, ReactiveFormsModule, MaterialModule, NgOtpInputModule],
})
export class ThirdPartiesModule {}
