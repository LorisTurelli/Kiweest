import { LOCALE_ID, NgModule } from '@angular/core';
import localeIt from '@angular/common/locales/it';
import { registerLocaleData } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import * as moment from 'moment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule,MatDialogConfig} from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {DragDropModule} from '@angular/cdk/drag-drop';

import { NavbarComponent } from './navbar/navbar.component';
import { DialogConfermaRimuoviRicetta, KitchenComponent } from './kitchen/kitchen.component';
import { DialogConfermaRimuoviMenu,WeekComponent } from './week/week.component';
import { ListComponent } from './list/list.component';
import { EditRecipeComponent,DialogIngredientComponent } from './kitchen/edit-recipe/edit-recipe.component';
import { HttpClientModule } from '@angular/common/http';
import { SettingsComponent } from './settings/settings.component';
import { EditWeekComponent, SelectRecipeDialogComponent } from './week/edit-week/edit-week.component';

const MY_DATE_FORMATS = {
  parse: {
      dateInput: {month: 'short', year: 'numeric', day: 'numeric'}
  },
  display: {
      // dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
      dateInput: 'input',
      monthYearLabel: {year: 'numeric', month: 'short'},
      dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
      monthYearA11yLabel: {year: 'numeric', month: 'long'},
  }
};


registerLocaleData(localeIt);
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    KitchenComponent,
    WeekComponent,
    ListComponent,
    EditRecipeComponent,
    DialogIngredientComponent,
    DialogConfermaRimuoviRicetta,
    DialogConfermaRimuoviMenu,
    SettingsComponent,
    EditWeekComponent,
    SelectRecipeDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatDialogModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DragDropModule
  ],
  providers: [
    MatDialogConfig,
    { provide: LOCALE_ID, useValue: 'it' },
    { provide: MAT_DATE_LOCALE, useValue: 'it-IT' },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
