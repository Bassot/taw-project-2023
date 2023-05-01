import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Auth } from '../Auth/auth';

@Component({
  selector: 'app-login-form',
  template: `
    <form class="user-form" autocomplete="off" [formGroup]="loginForm" (ngSubmit)="submitForm()">
      <div class="form-floating mb-3">
        <input class="form-control" type="text" id="username" formControlName="username" placeholder="username"
               required>
        <label for="username">Username</label>
      </div>

      <div *ngIf="username.invalid && (username.dirty || username.touched)" class="alert alert-danger">
        <div *ngIf="username.errors?.['required']">
          Username is required.
        </div>
      </div>

      <div class="form-floating mb-3">
        <input class="form-control" type="text" formControlName="password" placeholder="password" required>
        <label for="password">Password</label>
      </div>

      <div *ngIf="password.invalid && (password.dirty || password.touched)" class="alert alert-danger">

        <div *ngIf="password.errors?.['required']">
          Password is required.
        </div>
      </div>



      <button class="btn btn-primary" type="submit" [disabled]="loginForm.invalid">Login</button>
    </form>
  `,
  styles: [
    `.user-form {
     max-width: 560px;
     margin-left: auto;
     margin-right: auto;
   }`
  ]
})
export class LoginFormComponent implements OnInit {
  @Input()
  initialState: BehaviorSubject<Auth> = new BehaviorSubject({});

  @Output()
  formValuesChanged = new EventEmitter<Auth>();

  @Output()
  formSubmitted = new EventEmitter<Auth>();

  loginForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) { }

  get username() { return this.loginForm.get('username')!; }
  get password() { return this.loginForm.get('password')!; }

  ngOnInit() {
    this.initialState.subscribe(user => {
      this.loginForm = this.fb.group({
        username: [ user.username, [Validators.required] ],
        password: [ user.password, [Validators.required] ],
      });
    });

    this.loginForm.valueChanges.subscribe((val) => { this.formValuesChanged.emit(val); });
  }

  submitForm() {
    this.formSubmitted.emit(this.loginForm.value);
  }
}

