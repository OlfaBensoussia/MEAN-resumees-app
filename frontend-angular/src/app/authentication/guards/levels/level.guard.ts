import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from "src/app/authentication/service/authentication.service";
import { AuthorizationService } from "src/app/authentication/service/authorization/authorization.service";

@Injectable({
  providedIn: 'root'
})
export class LevelGuard implements CanActivate {

  constructor(
    private authenticationService: AuthenticationService,
    private authorizationService: AuthorizationService,
    private router: Router, ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const routeAuthorization = next.data.routeAuthorization;
    if (routeAuthorization) {
      // si l'utilisateur n'est pas autorisé d'accèder à l'url: routeAuthorization
      if (!this.authorizationService.currentUserIsAuthorized(routeAuthorization)) {
        // si l'utilisateur est authentifié
        if (this.authenticationService.getCurrentUser()) {

          this.router.navigate(['/dashboard']);
        }
        // s'il est n'est pas authentifié on lui redirigé vers la page login
        else {
          this.router.navigate(['/authentication/login']);
        }
      }
      return this.authorizationService.currentUserIsAuthorized(routeAuthorization);
    }
    return true;
  }
}


