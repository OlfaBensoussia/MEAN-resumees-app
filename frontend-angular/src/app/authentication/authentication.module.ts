import { MaterialModule } from './../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageServiceModule } from 'ngx-webstorage-service';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationComponent } from './authentication.component';
import { SignupComponent } from './signup/signup.component';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenInterceptor } from 'src/app/authentication/interceptors/token.interceptor';
import { ErrorsInterceptor } from "src/app/authentication/interceptors/errors.interceptor";
import { LoginComponent } from "src/app/authentication/login/login.component";


@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],
  declarations: [AuthenticationComponent,SignupComponent,LoginComponent],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    // tslint:disable-next-line: deprecation
    StorageServiceModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi : true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorsInterceptor,
      multi: true,
    }
  ]
   
})
export class AuthenticationModule { }
