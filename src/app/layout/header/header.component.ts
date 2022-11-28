import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public userSub: Subscription;
  public authenticated=false;
  constructor() { }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {

    this.userSub.unsubscribe();
  }

}
