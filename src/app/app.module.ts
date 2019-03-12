import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {WeaponsComponent} from './weapons/weapons.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule, MatSelectModule,
  MatSidenavModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
import {MatSortModule} from '@angular/material/sort';
import {ForFilterPipe} from './pipes/for-filter.pipe';
import {TranslatePipe} from './pipes/translate.pipe';
import {ItemsService} from './services/config/items.service';
import {LocalizationService} from './services/config/localization.service';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule} from '@angular/common';
import { RoundPerMinutePipe } from './pipes/round-per-minute.pipe';

@NgModule({
  declarations: [
    AppComponent,
    WeaponsComponent,
    TranslatePipe,
    ForFilterPipe,
    RoundPerMinutePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    CommonModule,
    MatSelectModule
  ],
  providers: [
    ItemsService,
    LocalizationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
