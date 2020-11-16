import { Component, OnInit, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { DOCUMENT, DatePipe } from '@angular/common';
import { environment } from './../../../environments/environment';
import Swal from 'sweetalert2' ;
import { HttpClient, HttpEventType, HttpEvent } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { FileUploadService } from '../shared/file-upload.service';
let apiUrl = 'http://localhost:3800';

registerLocaleData(localeFr, 'fr');
@Component({
  selector: 'app-postuler',
  templateUrl: './postuler.component.html',
  styleUrls: ['./postuler.component.css']
})
export class PostulerComponent implements OnInit , AfterViewInit {
  preview: string;
  date;
  backendUrl: string;
 public form: FormGroup;
  constructor( private fileUploadService: FileUploadService, private datepipe: DatePipe, private http: HttpClient,
               private fb: FormBuilder, private router: Router,
               private elementRef: ElementRef, @Inject(DOCUMENT) private document: Document) {
                this.backendUrl = apiUrl;
              }

  ngAfterViewInit(){
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#161719';
 }
  ngOnInit(): void {
    this.date = new Date();
    this.date = this.datepipe.transform(this.date, 'dd/MM/yyyy HH:mm');
    this.form = this.fb.group({
      email: [
        null,
        Validators.compose([Validators.required, CustomValidators.email])
      ],
      nom: new FormControl('', Validators.required),
      prenom: new FormControl('', Validators.required),
      dateNaissance: new FormControl(''),
      numTelephone: new FormControl('',  Validators.required),
      disponibilite: new FormControl(''),
      anneeExperience: new FormControl(''),
      message: new FormControl(''),
      //cv: new FormControl('',Validators.required),
      dateCreation: new FormControl(this.date),
      cv: [null]
    });
  }

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      cv: file
    });
    this.form.get('cv').updateValueAndValidity()

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  onSubmit() {
    console.log('ALLForm', this.form.value);
    console.log('CVvalue', this.form.value.cv);
    this.fileUploadService.addUser(
      this.form.value.nom,
      this.form.value.prenom,
      this.form.value.email,
      this.form.value.dateNaissance,
      this.form.value.numTelephone,
      this.form.value.disponibilite,
      this.form.value.anneeExperience,
      this.form.value.message,
      this.form.value.cv,
      this.form.value.dateCreation,
    ).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          break;
        case HttpEventType.Response:
          console.log('User successfully created!', event.body);
          Swal.fire({
            icon: 'success',
            title: 'Votre candidature est prise en compte, un email de vérification est envoyé !',
            showConfirmButton: false,
            timer: 2000
          });
      }
      this.router.navigate(['/dashboard/home']);
    }, (error : any) => {
      Swal.fire({
        icon: 'error',
        title: 'Email déja existant',
        showConfirmButton: false,
        timer: 2000
      });
    });
  }

}
