import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import {DatePipe} from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SafePipeModule } from 'safe-pipe';
import { MatPaginatorIntl } from "@angular/material/paginator";
import { OAuthModule } from "angular-oauth2-oidc";
import { TokenInterceptor } from "src/app/authentication/interceptors/token.interceptor";
import { ErrorsInterceptor } from "src/app/authentication/interceptors/errors.interceptor";


@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],
  declarations: [
    AppComponent,
    ],
  imports: [
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    SafePipeModule,
    OAuthModule.forRoot(),
  ],
 
  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  { provide: MatPaginatorIntl},
   {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorsInterceptor,
      multi: true,
    }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
