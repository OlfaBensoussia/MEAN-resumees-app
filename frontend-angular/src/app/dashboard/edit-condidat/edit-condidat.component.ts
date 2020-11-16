import { Component, OnInit, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'app-edit-condidat',
  templateUrl: './edit-condidat.component.html',
  styleUrls: ['./edit-condidat.component.css']
})
export class EditCondidatComponent implements OnInit , AfterViewInit {
  preview: string;
  date;
  backendUrl: string;
 public form: FormGroup;
  constructor( private fileUploadService: FileUploadService, private datepipe: DatePipe, private http: HttpClient,
               private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
               private elementRef: ElementRef, @Inject(DOCUMENT) private document: Document) {
                this.backendUrl = apiUrl;
              }

  ngAfterViewInit(){
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#161719';
 }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.getCondidat(params.get('id')).subscribe(
      (response: any) => {
        console.log('response', response)
        this.date = new Date();
        this.date = this.datepipe.transform(this.date, 'dd/MM/yyyy HH:mm');
        this.form = this.fb.group({
      email: [
        response[0].email,
        Validators.compose([Validators.required, CustomValidators.email])
      ],
      nom: new FormControl(response[0].nom, Validators.required),
      prenom: new FormControl(response[0].prenom, Validators.required),
      dateNaissance: new FormControl(response[0].dateNaissance),
      numTelephone: new FormControl(response[0].numTelephone,  Validators.required),
      disponibilite: new FormControl(response[0].disponibilite),
      anneeExperience: new FormControl(response[0].anneeExperience),
      message: new FormControl(response[0].message),
      dateCreation: new FormControl(this.date),
      cv: [response[0].cv]
    });
      });
    });
    
  }
  getCondidat(Id){
    return this.http.get(`${this.backendUrl + '/api/condidature'}/${Id}`);
  
  }


  onSubmit() {
    console.log('ALLForm', this.form.value.nom);
    console.log('CVvalue', this.form.value.cv);
    this.fileUploadService.modifyUser(
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
      Swal.fire({
        icon: 'success',
        title: 'Votre candidature est perise en compte, un email de vérification est envoyé !',
        showConfirmButton: false,
        timer: 2000
      });
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
      }
      this.router.navigate(['/dashboard/home']);
    })

  }

}
