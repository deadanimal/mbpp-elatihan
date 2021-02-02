import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { User } from 'src/app/shared/services/users/users.model';
import { UsersService } from 'src/app/shared/services/users/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  //  Data
  users: User[] = []
  selectedUser

  // Form
  userForm: FormGroup

  constructor(
    private userService: UsersService,
    private fb: FormBuilder,
    private loadingBar: LoadingBarService
  ) { }

  ngOnInit() {
  }

  getData() {

  }

  initForm() {

  }

}
