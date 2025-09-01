import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileInformationComponent } from './pages/profile-information/profile-information.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { ProfileInformationService } from './services/profile-information.service';

@NgModule({
  declarations: [
    SettingsComponent,
    ProfileInformationComponent,
  ],
  imports: [SharedModule, SettingsRoutingModule],
  providers: [ ProfileInformationService],
})
export class SettingsModule { }
