import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingsComponent} from './settings.component';
import {ProfileInformationComponent} from './pages/profile-information/profile-information.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {path: 'profile', component: ProfileInformationComponent},
      {path: '', redirectTo: 'profile', pathMatch: 'full'},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {
}
