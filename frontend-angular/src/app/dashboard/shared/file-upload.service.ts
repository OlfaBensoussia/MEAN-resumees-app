import { Injectable } from '@angular/core';
import { Condidat } from './condidat';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class FileUploadService {

  baseURL = "http://localhost:3800/api";
  editURL = "http://localhost:3800/api/edit";

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  // Get Users
  getUsers() {
    return this.http.get(this.baseURL)
  }

  // Create User
  addUser(nom: string, prenom: string, email:string, dateNaissance: Date,
    numTelephone: number, disponibilite: number, anneeExperience: number, message: string,
    profileImage: File, dateCreation: Date): Observable<any> {
    var formData: any = new FormData();
    formData.append("nom", nom);
    formData.append("prenom", prenom);
    formData.append("email", email);
    formData.append("disponibilite", disponibilite);
    formData.append("anneExperience", anneeExperience);
    formData.append("message", message);
    formData.append("numTelephone", numTelephone);
    formData.append("dateNaissance", dateNaissance);
    formData.append("cv", profileImage);
    formData.append("dateCreation", dateCreation);

    return this.http.post<Condidat>(`${this.baseURL}`, formData, {
      reportProgress: true,
      observe: 'events'
    })
  }

  modifyUser(nom: string, prenom: string, email:string, dateNaissance: Date,
    numTelephone: number, disponibilite: number, anneeExperience: number, message: string,
    profileImage: File, dateCreation: Date): Observable<any> {
    var formData: any = new FormData();
    formData.append("nom", nom);
    formData.append("prenom", prenom);
    formData.append("email", email);
    formData.append("disponibilite", disponibilite);
    formData.append("anneExperience", anneeExperience);
    formData.append("message", message);
    formData.append("numTelephone", numTelephone);
    formData.append("dateNaissance", dateNaissance);
    formData.append("cv", profileImage);
    formData.append("dateCreation", dateCreation);

    return this.http.post<Condidat>(`${this.editURL}`, formData, {
      reportProgress: true,
      observe: 'events'
    })
  }

  // Error handling 
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}