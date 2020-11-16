import { Component, OnInit } from '@angular/core';
import { authPasswordFlowConfig } from './../../config/auth-password-flow.config';
import { Authentication } from './../models/authentication.model'
import { AuthenticationService } from './../service/authentication.service';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { Validators, FormControl, FormBuilder, FormGroup } from "@angular/forms";
import { CustomValidators } from 'ngx-custom-validators';
import Swal from 'sweetalert2';
import { isUndefined, isNull } from "util";
import * as _ from 'lodash';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public wrongPassword: boolean;
  public form: FormGroup;
  hide = true;

  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private oauthService: OAuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {

    this.wrongPassword = false;
    this.ConfigureSingleSignOn();

  }
  ConfigureSingleSignOn() {
    this.oauthService.configure(authPasswordFlowConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.tryLogin();

  }
  ngOnInit(): void {

    this.form = this.fb.group({
      email: [
        null,
        Validators.compose([Validators.required, CustomValidators.email])
      ],
      password: new FormControl('', Validators.required)
    });
  }
  /**
     * Login function
     *
     * @param {Authentication} authentication
     * @memberof LoginComponent
     */
  onSubmit() {
    if (this.form.valid) {
      console.log('email', this.form.value.email);
      this.wrongPassword = false;
      // this.oauthService.initImplicitFlow();

      this.authenticationService.login({ username: this.form.value.email, password: this.form.value.password })
        .then((res) => {
          this.route.queryParams.subscribe(params => {
            const name = params['returnUrl'];
            if (!isUndefined(params['returnUrl']) && !isNull(params['returnUrl'])) {
              this.router.navigate([name]);
            }
            else {
              this.router.navigate(['/dashboard']);
            }
          });
        }, error => {
          console.log('error', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Email ou mot de passe incorrect !',
          });
        });
    }
  }
}
