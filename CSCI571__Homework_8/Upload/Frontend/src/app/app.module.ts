import { NgModule,Component,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms'; // <-- Import FormsModule here
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { BaseComponent } from './base/base.component';
import { FavouriteComponent } from './favourite/favourite.component'; 
import { GoogleMapsModule } from '@angular/google-maps'
import { MatDialogModule } from '@angular/material/dialog';
import { MapDialogComponent } from './map-dialog/map-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';


// @NgModule({
//   declarations: [
//     AppComponent
//   ],
//   imports: [
//     BrowserModule
//     // AppRoutingModule
//   ],
//   providers: [],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }



@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    FavouriteComponent,
    MapDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatTabsModule,
    GoogleMapsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    NgbModule,
    NgbCarouselModule,
    NgbModalModule
  ],
  providers: [],
  bootstrap: [AppComponent]
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
