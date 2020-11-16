import { SignupComponent } from './signup/signup.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationComponent } from './authentication.component';
import { LoginComponent } from "src/app/authentication/login/login.component";

const routes: Routes = [{ path: '', component: AuthenticationComponent, children: [

    {
      path: 'signup',
      component: SignupComponent
    },
    {
      path: 'login',
      component: LoginComponent
    }
]
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
