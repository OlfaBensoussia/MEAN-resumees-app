import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { AuthorizationService } from "src/app/authentication/service/authorization/authorization.service";
import { AuthenticationService } from "src/app/authentication/service/authentication.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  typeArbre = new FormControl('default');
  warning: boolean;
  couleur: string;
  titre: string;
  currentUserName: string;
  constructor(
   private activatedRoute: ActivatedRoute,
    private router: Router,
    private authorizationService: AuthorizationService,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.currentUserName = this.authenticationService.getCurrentUserName();
    console.log('currentUserName : ', this.currentUserName);

    //this.data.currentWarning.subscribe(message => this.warning = message);

  }

  showLink(authorizationName: string) {
    return this.authorizationService.currentUserIsAuthorized(authorizationName);
  }

  logout(){
    this.authenticationService.logout();

  }

  postuler(){ 
    this.router.navigate(['/dashboard/postuler']);
  }
}
