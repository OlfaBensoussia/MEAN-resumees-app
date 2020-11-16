import { environment } from './../../environments/environment';
import { AuthConfig } from 'angular-oauth2-oidc';

export const authPasswordFlowConfig: AuthConfig = {
  tokenEndpoint: `http://localhost:3800/auth/login`,
  clientId: 'client',
  scope: '',
  dummyClientSecret: 'b2e396e3-9bs4-49e8-95d2-065c5erui3',
  //redirectUri:  window.location.origin + '/dashboard',
  userinfoEndpoint: `http://localhost:3800/auth/info`,
  
  skipSubjectCheck: true,
  oidc: true,
  requireHttps: false
};


// export const authPasswordFlowConfig: AuthConfig = {

// Url of the Identity Provider
// issuer: 'http://localhost:3686/auth/login',
// oidc: false,
// responseType: 'token',
// // URL of the SPA to redirect the user to after login
// redirectUri:  window.location.origin + '/dashboard',

// clientId: 'oAuth2-login',
// strictDiscoveryDocumentValidation: false,

//  scope: 'open worklists genstate',


