import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { User } from 'src/app/shared/services/auth/auth.model';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

  // Data
  user: User

  // Form
  passwordForm: FormGroup


  constructor(
    private authService: AuthService,
    public loadingBar: LoadingBarService,
    private notifyService: NotifyService,
    private formBuilder: FormBuilder
  ) { 
    this.initUserData()
  }

  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
      new_password1: new FormControl(''),
      new_password2: new FormControl('')
    })
  }

  initUserData() {
    this.user = this.authService.userInformation
    if (this.user.user_type == 'ST') {
      this.user.user_type = 'Kakitangan'
    }
    else if (this.user.user_type == 'DC') {
      this.user.user_type = 'Penyelaras Jabatan'
    }
    else if (this.user.user_type == 'DH') {
      this.user.user_type = 'Ketua Jabatan'
    }
    else if (this.user.user_type == 'DD') {
      this.user.user_type = 'Pengarah Jabatan'
    }
    else if (this.user.user_type == 'TC') {
      this.user.user_type = 'Penyelaras Latihan'
    }
    else if (this.user.user_type == 'AD') {
      this.user.user_type = 'Administrator'
    }
    // console.log(this.user)
  }

  changePassword() {
    this.loadingBar.start()
    console.log(this.passwordForm.value)
    this.authService.changePassword(this.passwordForm.value).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.successMessage()
      }
    )
  }

  successMessage() {
    let title = 'Berjaya'
    let message = 'Kata laluan anda telah diubah'
    this.notifyService.openToastr(title, message)
  }

}
