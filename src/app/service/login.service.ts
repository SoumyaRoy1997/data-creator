import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {login} from "../_helper/login.model";
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import {registration} from '../models/registration-form'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

    public currentUserSubject: BehaviorSubject<login>;
    public currentUser: Observable<login>;
    base_url=environment.base_url;

    constructor(private httpClient: HttpClient, private router: Router) {
        this.currentUserSubject = new BehaviorSubject<login>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): login {
        return this.currentUserSubject.value;
    }

  postRegistration(registrationRequest:registration){
    const headers = {'Content-Type': 'application/json'};
    return this.httpClient.post(this.base_url+"signup",JSON.stringify(registrationRequest),{headers});
  }
  getLogin(loginRequest:registration):Observable<registration>{
    const headers = {'Content-Type': 'application/json'};
    return this.httpClient.post<registration>(this.base_url+"login",JSON.stringify(loginRequest),{headers});
  }
  editProfile(editRequest:registration){
    const headers = {'Content-Type': 'application/json'};
    return this.httpClient.put(this.base_url+"activity",JSON.stringify(editRequest),{headers});
  }
}
