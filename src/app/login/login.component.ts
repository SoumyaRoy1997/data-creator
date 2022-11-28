import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../service/authentication.service';
import { LoginService } from '../service/login.service';

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
  constructor(private loginservice: LoginService,
              private fb: FormBuilder,
              private router: Router,
              private authService: AuthenticationService) {
  }

  username = '';
  password = '';
  loading = false;
  error = '';

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required]
    });
  }
  onSubmitFirebase(username: any , password: any) {
    const flag = true;
    this.loading = true;
    this.loginservice.getLogin().subscribe((data) => {
      data = data.filter(user => user.email.localeCompare(username) === 0);
      if (data.length === 0) {
        this.loading = false;
        Swal.fire('Invalid Username', 'Check your Input', 'error');
      } else {
        if (data[0].password.localeCompare(password) === 0) {
          this.authService.login(data[0]);
          Swal.fire('Successfully Logged In as: ' , username, 'success');
          this.loading = false;
          this.router.navigateByUrl('home');
        } else {
          this.loading = false;
          Swal.fire('Invalid Password', 'Check your Input', 'error');
        }
      }
    });
  }

}
