import { NgModule, Provider } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatRadioModule} from '@angular/material/radio';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {FormsModule} from "@angular/forms";


@NgModule({
  exports: [
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatCardModule,
    MatSidenavModule,
    MatButtonModule,
    MatDividerModule,
    MatSelectModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatChipsModule,
    MatAutocompleteModule,
    FormsModule
  ],
  providers: [],
})
export class MaterialModule {
  static forServices(): Provider[] {
    return [];
  }
}
