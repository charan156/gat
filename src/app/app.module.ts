import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SafePipe } from './safe.pipe';
import { SearchformComponent } from './searchform/searchform.component';
import { textsearchComponent } from './textsearch/textsearch.component';
import { MatTabsModule } from '@angular/material';
import { MatTableModule } from '@angular/material';
import { MatSortModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
  declarations: [
    AppComponent,    
    SafePipe,    
    SearchformComponent,
    textsearchComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSortModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,      
    BrowserAnimationsModule,
    MatTableModule,
    MDBBootstrapModule.forRoot(),
    AngularFontAwesomeModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
