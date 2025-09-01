import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {LandingRoutingModule} from './landing-routing.module';
import {LandingComponent} from './landing.component';
import {HeaderComponent} from './landing-sections/header/header.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { IntroSectionComponent } from './landing-sections/intro-section/intro-section.component';


@NgModule({
  declarations: [
    LandingComponent,
    HeaderComponent,
    IntroSectionComponent,
    LandingPageComponent],
  imports: [
    SharedModule,
    LandingRoutingModule
  ],
  providers: []
})
export class LandingModule {
}
