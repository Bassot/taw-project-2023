import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'http://localhost:8080';
  private users$: Subject<User[]> = new Subject();

  constructor(private httpClient: HttpClient) { }

  private refreshUsers() {
    this.httpClient.get<User[]>(`${this.url}/users`)
      .subscribe(users => {
        this.users$.next(users);
      });
  }

  getUsers(): Subject<User[]> {
    this.refreshUsers();
    return this.users$;
  }

  createUser(user: User): Observable<string> {
    return this.httpClient.post(`${this.url}/users`, user, { responseType: 'text' });
  }


  deleteUser(username: string): Observable<string> {
    return this.httpClient.delete(`${this.url}/users/${username}`, { responseType: 'text' });
  }

  getUser(username: string): Observable<User> {
    return this.httpClient.get<User>(`${this.url}/users/${username}`);
  }

  updateUser(username: string, user: User): Observable<string> {
    return this.httpClient.put(`${this.url}/users/${username}`, user, { responseType: 'text' });
  }
}
