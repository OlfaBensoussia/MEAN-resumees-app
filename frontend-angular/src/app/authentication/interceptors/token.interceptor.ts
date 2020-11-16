import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { OAuthStorage, OAuthResourceServerErrorHandler } from 'angular-oauth2-oidc';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private authStorage: OAuthStorage,
    private router: Router,
    private errorHandler: OAuthResourceServerErrorHandler
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Si on est déjà logué :
    if (this.authStorage.getItem('access_token')) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authStorage.getItem('access_token')}`
        }
      });
    } 

    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<any>) => {},
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this.authStorage.removeItem('access_token');
              this.router.navigate(['/authentication/login']);
            }
          }
        }
      )
    );
  }
}
