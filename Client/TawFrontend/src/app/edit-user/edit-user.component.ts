import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../User/user';
import { UserService } from '../User/user.service';

@Component({
  selector: 'app-edit-user.component.ts',
  template: `
   <h2 class="text-center m-5">Edit a user</h2>
   <app-user-form [initialState]="user" (formSubmitted)="editUser($event)"></app-user-form>
 `
})
export class EditUserComponent implements OnInit {
  user: BehaviorSubject<User> = new BehaviorSubject({});

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
  ) { }

  ngOnInit() {
    const username = this.route.snapshot.paramMap.get('id');
    if (!username) {
      alert('No username provided');
    }

    this.userService.getUser(username !).subscribe((user) => {
      this.user.next(user);
    });
  }

  editUser(user: User) {
    this.userService.updateUser(this.user.value.username || '', user)
      .subscribe({
        next: () => {
          this.router.navigate(['/employees']);
        },
        error: (error) => {
          alert('Failed to update employee');
          console.error(error);
        }
      })
  }
}


