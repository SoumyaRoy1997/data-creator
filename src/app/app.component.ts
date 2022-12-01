import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { registration } from './models/registration-form';
import { AuthenticationService } from './service/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'data-creator-ui';
  isAuthenticated: boolean;
  private userSub: Subscription;
  user: registration;
  constructor(public authenticationService: AuthenticationService) {

  }

 ngOnInit() {
  this.userSub = this.authenticationService.currentUserSubject.subscribe(user => {
    this.isAuthenticated = !!user;
   });
  if (this.isAuthenticated) {
    if (window.location.pathname.localeCompare('/user') === 0 || window.location.pathname.localeCompare('/') === 0) {
       this.authenticationService.logout();
     }
   }
  }
ngOnDestroy(): void {

  this.userSub.unsubscribe();
}
}
