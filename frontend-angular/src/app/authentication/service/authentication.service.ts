
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, identity } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfig } from './../../config/app.config';


import { OAuthService } from 'angular-oauth2-oidc';
import { CookieService } from 'ngx-cookie-service';
import { Authentication } from "src/app/authentication/models/authentication.model";
import { authPasswordFlowConfig } from 'src/app/config/auth-password-flow.config';
import { isUndefined, isNull } from "util";
import { Router } from "@angular/router";
import { JwtHelperService } from '@auth0/angular-jwt';

/**
 * Authentification Service
 *
 * @export
 * @class AuthenticationService
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {



  /**
   *Creates an instance of AuthenticationService.
   * @param {HttpClient} http
   * @memberof AuthenticationService
   */
  constructor(
    private http: HttpClient,
    private oauthService: OAuthService,
    private router: Router) { }

  login(authentication: Authentication) {

    return this.oauthService.fetchTokenUsingPasswordFlowAndLoadUserProfile(
      authentication.username,
      authentication.password
    );
  }

  /**
   * Logout function
   *
   * @memberof AuthenticationService
   */
  logout() {

    this.oauthService.logOut(true);
    this.router.navigate(['/authentication/login'])
    //localStorage.removeItem('access_tableaux');

  }

  getCurrentUser(): any {
    return this.oauthService.getIdentityClaims() as any;
  }

  getCurrentUserRole() {
    const userIdentity = this.oauthService.getIdentityClaims() as any;
    // return identity.authorities[0].authority;
    if (userIdentity && userIdentity.role) {
      return userIdentity.role;
    }
    return null;
    // return 'ROLE_SUPER_ADMIN';
    // return 'ROLE_RESPO_COM';
    // return 'ROLE_CHEF_ATEL';
    // return 'ROLE_TECH'
  }


  getCurrentLevel() {
    const token = this.oauthService.getAccessToken() as any;
    const helper = new JwtHelperService();
    const tokenDecoded= helper.decodeToken(token);
    if (tokenDecoded && !isUndefined(tokenDecoded.level) && !isNull(tokenDecoded.level)) {
      return tokenDecoded.level;
    }
  }
  

  getCurrentUserUid() {
    const userIdentity = this.oauthService.getIdentityClaims() as any;
    return userIdentity.id;
  }

  /**
   * Get the current username to the format firstname - lastname
   *
   * @returns {string}
   * @memberof AuthenticationService
   */
  getCurrentUserName(): string {
    const userIdentity = this.oauthService.getIdentityClaims() as any;
    if (userIdentity && userIdentity.username) {
      return `${userIdentity.username}`;
    }
    return null;
  }



  // forgetPassword(authenticationForgetPassword: AuthenticationForgetPassword) {
  //   return this.http.post<any>(`${this.accountsUrl}.forget.password`, authenticationForgetPassword);
  // }

  // newPassword(authenticationNewPassword: AuthenticationNewPassword) {
  //   return this.http.put<any>(`${this.accountsUrl}.new.password`, authenticationNewPassword);
  // }


}
