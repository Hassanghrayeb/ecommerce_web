import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'catalog',
        loadChildren: () =>
          import('./catalog/catalog.module').then((m) => m.CatalogModule),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.module').then((m) => m.SettingsModule),
      },
      {
        path: 'configuration',
        loadChildren: () =>
          import('./configuration/configuration.module').then((m) => m.ConfigurationModule),
      },
      { path: '**', redirectTo: 'settings' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
