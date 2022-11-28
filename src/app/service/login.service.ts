import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {login} from "../_helper/login.model";
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

    public currentUserSubject: BehaviorSubject<login>;
    public currentUser: Observable<login>;

    constructor(private httpClient: HttpClient, private router: Router) {
        this.currentUserSubject = new BehaviorSubject<login>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): login {
        return this.currentUserSubject.value;
    }

  getLogin(){
      return this.httpClient.get<login[]>('assets/login-data.json');
  }
}
