import { Component,  OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProgressSpinnerComponent } from 'src/app/common/progress-spinner/progress-spinner.component';
import { registration } from 'src/app/models/registration-form';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../service/authentication.service';
import { LoginService } from '../../service/login.service';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  public loginInvalid: boolean;
  hide = true;
  private route: ActivatedRoute;
  selectedTab: number=0;
  userDetails:registration;
  @ViewChild(SignupComponent, {static: false}) child1: SignupComponent;
  constructor(private loginservice: LoginService,
              private fb: FormBuilder,
              private router: Router,
              private authService: AuthenticationService,
              public dialog:MatDialog) {
  }

  username = '';
  password = '';
  loading = false;
  error = '';

  ngAfterViewInit() {this.selectedTab = this.child1.selectedTab; }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required]
    });
  }
  getLogin() {
    var loginRequest:registration={
      "username":this.loginForm.get('username').value,
      "password":this.loginForm.get('password').value
    }
    let dialogRef: MatDialogRef<ProgressSpinnerComponent> = this.dialog.open(ProgressSpinnerComponent, {
      panelClass: 'transparent',
      disableClose: true
    });
    this.loginservice.getLogin(loginRequest).subscribe(data=>{
      dialogRef.close();
      this.userDetails=data;
      loginRequest['password']='';
      this.authService.login(this.userDetails);
      localStorage.setItem('dashboard', JSON.stringify(this.userDetails.dashboard));
      this.router.navigateByUrl('home');
      Swal.fire('Successfully Logged in as: ' , loginRequest.username, 'success');
    },
      error=>{ 
        dialogRef.close();
        Swal.fire('Unable to Login' , loginRequest.username, 'error');
    })
  }

}
