import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';

@Component({
  selector: 'app-pengurusan-tambah',
  templateUrl: './pengurusan-tambah.component.html',
  styleUrls: ['./pengurusan-tambah.component.scss']
})
export class PengurusanTambahComponent implements OnInit {

  // Form
  registerForm: FormGroup
  userForm: FormGroup

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private loadingBar: LoadingBarService,
    private notifyService: NotifyService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required
      ])),
      password1: new FormControl('', Validators.compose([
        Validators.required
      ])),
      password2: new FormControl('', Validators.compose([
        Validators.required
      ])),
    })
  
    this.userForm = this.formBuilder.group({
      full_name: new FormControl('', Validators.compose([
        Validators.required
      ])),
      nric: new FormControl('', Validators.compose([
        Validators.required
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required
      ])),
      user_type: new FormControl('', Validators.compose([
        Validators.required
      ])),
      address: new FormControl('', Validators.compose([
        Validators.required
      ])),
      grade: new FormControl('', Validators.compose([
        Validators.required
      ])),
      position: new FormControl('', Validators.compose([
        Validators.required
      ])),
      gender: new FormControl('', Validators.compose([
        Validators.required
      ])),
      department: new FormControl('', Validators.compose([
        Validators.required
      ])),
      mobile: new FormControl('', Validators.compose([
        Validators.required
      ]))
    })
  }

  register() {
    this.loadingBar.start()
    this.authService.registerAccount(this.registerForm.value).subscribe(
      (res) => {
        // console.log('Success')
        this.loadingBar.complete()
        this.update(res.id)
      },
      () => {
        // console.log('Unsuccess')
        this.loadingBar.complete()
      },
      () => {
        // console.log('After')
      }
    )
  }

  update(id: string) {
    this.userForm.value.email = this.registerForm.value.email
    this.userService.update(this.userForm.value, id).subscribe(
      () => {
        // console.log('Success')
      },
      () => {
        // console.log('Unsuccess')
      },
      () => {
        // console.log('After')
        this.successMessage()
      }
    )
  }

  successMessage() {
    let title = 'Berjaya'
    let message = 'Pengguna telah ditambah'
    this.notifyService.openToastr(title, message)
  }

}
