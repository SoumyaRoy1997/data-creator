import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {MatSidenav} from '@angular/material/sidenav';
@Injectable()
export class SideNavService {
  private sidenav: MatSidenav;
 public sideNavToggleSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() { }
  public setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
    this.sideNavToggleSubject = new BehaviorSubject(sidenav);
  }

  public toggle() {
    this.sidenav.toggle();
    // return this.sideNavToggleSubject.next(null);
  }
}