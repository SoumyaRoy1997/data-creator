import { Injectable } from '@angular/core';
import { HttpClient , HttpParams} from '@angular/common/http';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { registration } from '../models/registration-form';
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    public currentUserSubject: BehaviorSubject<registration>;
    public currentUser: Observable<registration>;
    constructor(private http: HttpClient, private router: Router, private location: Location) {
        this.currentUserSubject = new BehaviorSubject<registration>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): registration {
        return this.currentUserSubject.value;
    }

    login(user: registration) {
                if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    return user;
                }
    }
    logout() {
        localStorage.clear();
        this.currentUserSubject.next(null);
        this.router.navigateByUrl('user');
    }
}
