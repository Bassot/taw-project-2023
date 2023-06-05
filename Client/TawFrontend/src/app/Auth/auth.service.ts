import { Injectable } from '@angular/core';
import { User } from '../User/user';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import {Auth} from "./auth";
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'http://localhost:8080';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};
  private token: string = '';
  constructor(private http: HttpClient, public router: Router) {}

  // Sign-in

  signIn(auth: Auth) {
    return this.http
      .post(`${this.url}/login`, auth)
      .subscribe((res: any) => {
        localStorage.setItem('auth_jwt', res.token);
        this.router.navigate(['/users']);
        alert(res.token);
      });
  }
  getToken() {
    return localStorage.getItem('auth_jwt');
  }
  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('auth_jwt');
    return authToken !== null ? true : false;
  }
  doLogout() {
    let removeToken = localStorage.removeItem('auth_jwt');
    if (removeToken == null) {
      this.router.navigate(['login']);
    }
  }
  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}
