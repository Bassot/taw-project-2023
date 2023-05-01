import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../Auth/auth.service";
import {User} from "../User/user";
import {Auth} from "../Auth/auth";

@Component({
  selector: 'app-login-user',
  template: `
   <h2 class="text-center m-5">Login</h2>
   <app-login-form (formSubmitted)="login($event)"></app-login-form>
 `
})
export class UserLoginComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  login(auth: Auth) {
    this.authService.signIn(auth)
  }
}
