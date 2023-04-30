import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../User/user';
import { UserService } from '../User/user.service';

@Component({
  selector: 'app-users-list',
  template: `
    <h2 class="text-center m-5">Users List</h2>

    <table class="table table-striped table-bordered">
      <thead>
      <tr>
        <th>Username</th>
        <th>Email</th>
        <th>Role</th>
      </tr>
      </thead>

      <tbody>
      <tr *ngFor="let user of users$ | async">
        <td>{{user.username}}</td>
        <td>{{user.email}}</td>
        <td>{{user.role}}</td>
        <td>
          <button class="btn btn-danger" (click)="deleteUser(user.username || '')">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>

    <button class="btn btn-primary mt-3" [routerLink]="['new']">Add a New User</button>
  `
})
export class UsersListComponent implements OnInit {
  users$: Observable<User[]> = new Observable();

  constructor(private usersService: UserService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  deleteUser(id: string): void {
    this.usersService.deleteUser(id).subscribe({
      next: () => this.fetchUsers()
    });
  }

  private fetchUsers(): void {
    this.users$ = this.usersService.getUsers();
  }
}
