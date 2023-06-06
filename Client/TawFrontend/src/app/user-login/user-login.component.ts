import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {UserService} from "../User/user.service";
import {Auth} from "../Auth/auth";
@Component({
  selector: 'app-login-user',
  templateUrl: 'user-login.component.html',
  styleUrls: ['user-login.component.css']
})
export class UserLoginComponent {
  constructor( private router: Router, private userService: UserService) {}

  login(email: string, password: string, remember: boolean) {
    let curUser: Auth = {
      email: email,
      password: password
    }
    this.userService.signIn(curUser, remember).subscribe({
      next: (res) => {
        console.log('You are logged in, response: ' + JSON.stringify(res));
        console.log('Role: ' + this.userService.getRole());
        switch (this.userService.getRole()) {
          case 'Waiter':
            this.router.navigate(['/waiters']);
            break;
          case 'Cook':
            this.router.navigate(['/cooks']);
            break;
          case 'Bartender':
            this.router.navigate(['/bartender']);
            break;
          case 'Cashier':
            this.router.navigate(['/cashier']);
            break;
        }
      },
      error: (err) => {
        console.log(('Login error: ' + JSON.stringify(err)));
      }
    });
  }
  navToSignUp(){
    this.router.navigate(['/signup']);
  }
}
