import { Injectable } from '@angular/core';
import { HttpClient , HttpParams} from '@angular/common/http';
import { BehaviorSubject, Observable, from } from 'rxjs';
import {login} from '../_helper/login.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    public currentUserSubject: BehaviorSubject<login>;
    public currentUser: Observable<login>;
     base_url = environment.base_url;
  baseurl = this.base_url + '/Flight-App/Admin';
    constructor(private http: HttpClient, private router: Router, private location: Location) {
        this.currentUserSubject = new BehaviorSubject<login>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): login {
        return this.currentUserSubject.value;
    }

    login(user: login) {
                if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    return user;
                }

    }

    logout() {
        localStorage.clear();
        this.currentUserSubject.next(null);
        this.router.navigateByUrl('home');
    }
}
