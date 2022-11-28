import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { LoginRoutingModule } from './login-routing.module';
import {SharedModule} from '../common/shared.module';
import {LoginService} from '../service/login.service'
import { AuthenticationService } from '../service/authentication.service';

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
      SharedModule,
      LoginRoutingModule,
      RouterModule
    ],
  exports: [
    LoginComponent
  ],
  providers: [LoginService,AuthenticationService]
  })
  export class LoginModule {}
