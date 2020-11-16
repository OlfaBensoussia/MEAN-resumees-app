import { AuthService } from './../service/auth.service';
import { Component, OnInit, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { DOCUMENT } from '@angular/common';
import { environment } from './../../../environments/environment';
import Swal from 'sweetalert2' ;
const password = new FormControl('', Validators.required);
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, AfterViewInit  {
  public form: FormGroup;
  hide = true;
  hide1 = true;
  constructor(private fb: FormBuilder, private router: Router, private elementRef: ElementRef,
              private authService: AuthService, @Inject(DOCUMENT) private document: Document) {}

  ngAfterViewInit(){
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#161719';
 }
  ngOnInit(): void {
    this.form = this.fb.group({
      email: [
        null,
        Validators.compose([Validators.required, CustomValidators.email])
      ],
      // tslint:disable-next-line: object-literal-shorthand
      password: password,
      // tslint:disable-next-line: object-literal-shorthand
      confirmPassword: confirmPassword,
      username: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    this.authService.addUser(this.form.value).subscribe((res: any) => {
      Swal.fire({
        icon: 'success',
        title: 'Utilisateur est enregistré',
        showConfirmButton: false,
        timer: 1500
      }).then((result) => {
        this.router.navigate(['/authentication/login']);
      });
    }, error => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Utilisateur est déjà enregistré !',
      });
    });
  }

  signIn() {
    this.router.navigate(['/authentication/login']);
    }
}
