import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing.component';
import {LandingPageComponent} from './pages/landing-page/landing-page.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    children: [
      {path: '', component: LandingPageComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }

