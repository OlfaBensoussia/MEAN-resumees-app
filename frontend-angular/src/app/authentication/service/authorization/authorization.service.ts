import { Injectable } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { isNull, isUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  public enabledAuthorizations = [
    {
      name: 'route.dashboard',
      authorized: [0, 1]
    },
    {
      name: 'route.dashboard.home',
      authorized: [0,1]
    },
    {
      name: 'route.dashboard.postuler',
      authorized: [0,1]
    },
    {
      name: 'route.dashboard.listeCondidats',
      authorized: [0,1]
    },
    {
      name: 'route.dashboard.condidatDetails',
      authorized: [0,1]
    },
    {
      name: 'route.dashboard.editCondidat',
      authorized: [0,1]
    }
  ];
  constructor(private authenticationService: AuthenticationService) { }

  isAuthorized(authorizationName: string, level: number) {


    if (authorizationName && !isNull(level) && !isUndefined(level)) {

      const authorizationFound = this.enabledAuthorizations.find(element => {
        return element.name === authorizationName;
      });
      if (authorizationFound) {
        const levelFound = authorizationFound.authorized.find(element => {
          return element === level;
        });

        if (!isUndefined(levelFound) && !isNull(levelFound)) {
          return true;
        }
      }
    }
    return false;
  }

  currentUserIsAuthorized(authorizationName: string) {
    return this.isAuthorized(authorizationName, this.authenticationService.getCurrentLevel());
  }
}
