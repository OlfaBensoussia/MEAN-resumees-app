import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';

var apiUrl = 'http://localhost:3800';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  backendUrl : string;
  constructor(private http: HttpClient) { 
    this.backendUrl = apiUrl;
  }

  addUser(user) {
    return this.http.post(this.backendUrl+'/users/', user);
  }

  login(state, user) {
    // return this.http.post('/users/login/'+state, user);
    return this.http.post(this.backendUrl+'/users/login/'+state, user);
  }
}
