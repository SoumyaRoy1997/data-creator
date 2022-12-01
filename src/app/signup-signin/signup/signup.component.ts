import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProgressSpinnerComponent } from 'src/app/common/progress-spinner/progress-spinner.component';
import { registration } from 'src/app/models/registration-form';
import { LoginService } from 'src/app/service/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  registrationForm: FormGroup;
  registrationRequest:registration
  selectedTab=0;
  constructor(private fb: FormBuilder,
              private dialog: MatDialog,
              private registrationService:LoginService) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }
  
  getRegistration(){
    this.registrationRequest={
      "fname":this.registrationForm.get('firstName').value,
      "lname":this.registrationForm.get('lastName').value,
      "username":this.registrationForm.get('username').value,
      "password":this.registrationForm.get('password').value,
    }
    let dialogRef: MatDialogRef<ProgressSpinnerComponent> = this.dialog.open(ProgressSpinnerComponent, {
      panelClass: 'transparent',
      disableClose: true
    });
    this.registrationService.postRegistration(this.registrationRequest).subscribe(data=>{
      console.log(data)
      dialogRef.close();
      Swal.fire('Successfully Registerd User! ' , this.registrationRequest.username, 'success');
      this.registrationForm.reset();
      this.registrationForm.clearValidators();
      this.registrationForm.updateValueAndValidity({onlySelf:true})
    },error=>{
      dialogRef.close();
      Swal.fire('Unable to Register User! ' , this.registrationRequest.username, 'error');
    })
  }
}
