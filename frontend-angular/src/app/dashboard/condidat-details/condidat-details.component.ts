import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
let apiUrl = 'http://localhost:3800';
@Component({
  selector: 'app-condidat-details',
  templateUrl: './condidat-details.component.html',
  styleUrls: ['./condidat-details.component.css']
})
export class CondidatDetailsComponent implements OnInit   {
  backendUrl: string;
  condidats: any = [];
  id;
  headElements = ['Nom', 'Prenom', 'Email', 'Modele', 'Description', 'Montant', 'Status' ];
  constructor( private router: Router,private http: HttpClient, private route: ActivatedRoute) {this.backendUrl = apiUrl; }

  ngOnInit(): void {

  this.route.paramMap.subscribe(params => {
    console.log(params.get('id'));
    this.id = params.get('id');
    this.getCondidat(params.get('id')).subscribe(
    (response: any) => {
      this.condidats = response;
    });
  });


}

getCondidat(Id){
  return this.http.get(`${this.backendUrl + '/api/condidature'}/${Id}`);

}

Encours() {
  this.http.post(`${this.backendUrl}/api/encours`, {id : this.id}).subscribe(response => {

  });
  Swal.fire({
      icon: 'success',
      title: 'mise à jour effectuée, un mail est envoyé au candidat !',
      showConfirmButton: false,
      timer: 2000
    });
    this.router.navigate(['/dashboard/listeCondidats'])
}
Confirmer(){
  this.http.post(`${this.backendUrl}/api/confirmer`, {id : this.id}).subscribe(response => {

  });
  Swal.fire({
      icon: 'success',
      title: 'mise à jour effectuée, un mail est envoyé au candidat !',
      showConfirmButton: false,
      timer: 2000
    });
    this.router.navigate(['/dashboard/listeCondidats'])

}

Rejeter(){
  this.http.post(`${this.backendUrl}/api/rejeter`, {id : this.id}).subscribe(response => {

  });
  Swal.fire({
      icon: 'success',
      title: 'mise à jour effectuée, un mail est envoyé au candidat !',
      showConfirmButton: false,
      timer: 2000
    });
    this.router.navigate(['/dashboard/listeCondidats'])

}

}
