import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { registration } from 'src/app/models/registration-form';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { SideNavService } from '../../service/side-nav.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public userSub: Subscription;
  public authenticated = false;
  public user: registration;
  datasourceLoaded=true;
  constructor(private authenticationService: AuthenticationService,
    private sideNavService: SideNavService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {
    this.mobileQuery = window.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', () => {
      this.mobileQueryListener();
    });
  }
  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;
  @ViewChild('snav') sidenav: MatSidenav;
  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
  
  clickMenu() {
    this.sidenav.toggle();
    console.log("Hi")
  }

  ngOnInit(): void {
    this.userSub = this.authenticationService.currentUserSubject.subscribe(user => {
      this.authenticated = !!user;
      this.user = user;
    });
    var dashboardList=localStorage.getItem('dashboard');
    if(dashboardList == null || dashboardList == undefined){
      this.datasourceLoaded=false;
    }
  }

  logoutUser() {
    this.authenticationService.logout();
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', () => {
      this.mobileQueryListener();
    });
    this.userSub.unsubscribe();
  }

}
