import { NgModule } from '@angular/core';
import { LoginComponent } from './signin/login.component';
import { RouterModule } from '@angular/router';
import { LoginRoutingModule } from './login-routing.module';
import {SharedModule} from '../common/shared.module';
import {LoginService} from '../service/login.service'
import { AuthenticationService } from '../service/authentication.service';
import { SignupComponent } from './signup/signup.component';

@NgModule({
    declarations: [
        LoginComponent,
        SignupComponent
    ],
    imports: [
      SharedModule,
      LoginRoutingModule,
      RouterModule
    ],
  exports: [
    LoginComponent,
    SignupComponent
  ],
  providers: [LoginService,AuthenticationService]
  })
  export class LoginModule {}
