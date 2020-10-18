import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from 'src/app/shared/services/auth/auth.model';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

  public userInformation: User

  changePasswordForm = new FormGroup({
    new_password1: new FormControl(''),
    new_password2: new FormControl('')
  })


  constructor(
    private authService: AuthService,
    public loadingBar: LoadingBarService,
    public toastr: ToastrService
  ) { 
    this.initUserData()
  }

  ngOnInit() {
  }

  initUserData() {
    this.userInformation = this.authService.userInformation
    if (this.userInformation.user_type == 'ST') {
      this.userInformation.user_type = 'Kakitangan'
    }
    // else if (this.userInformation.user_type == 'DC') {
    //   this.userInformation.user_type = 'Penyelaras Jabatan'
    // }
    // else if (this.userInformation.user_type == 'DH') {
    //   this.userInformation.user_type = 'Ketua Jabatan'
    // }
    else if (this.userInformation.user_type == 'DD') {
      this.userInformation.user_type = 'Pengarah Jabatan'
    }
    else if (this.userInformation.user_type == 'TC') {
      this.userInformation.user_type = 'Penyelaras Latihan'
    }
    else if (this.userInformation.user_type == 'AD') {
      this.userInformation.user_type = 'Administrator'
    }
    // console.log(this.userInformation)
  }

  changePassword() {
    this.loadingBar.start()
    console.log(this.changePasswordForm.value)
    this.authService.changePassword(this.changePasswordForm.value).subscribe(
      () => {
        this.loadingBar.complete()
        this.successfulMessage()
      },
      () => {
        this.loadingBar.complete()
        this.unsuccessfulMessage()
      },
      () => {
      }
    )
  }

  successfulMessage() {
    this.toastr.show(
      '<span class="alert-icon fas fa-check-circle" data-notify="icon"></span> <div class="alert-text"</div> <span class="alert-title" data-notify="title">Berjaya!</span> <span data-notify="message">Password anda telah diubah.</span></div>', 
      '',
      {
        timeOut: 3000,
        closeButton: true,
        enableHtml: true,
        tapToDismiss: false,
        titleClass: 'alert-title',
        positionClass: 'toast-top-right',
        toastClass: 'ngx-toastr alert alert-dismissible alert-success alert-notify'
        
      }
    )
  }

  unsuccessfulMessage() {
    this.toastr.show(
      '<span class="alert-icon fas fa-check-circle" data-notify="icon"></span> <div class="alert-text"</div> <span class="alert-title" data-notify="title">Tidak berjaya</span> <span data-notify="message">Sila cuba sekali lagi.</span></div>', 
      '',
      {
        timeOut: 3000,
        closeButton: true,
        enableHtml: true,
        tapToDismiss: false,
        titleClass: 'alert-title',
        positionClass: 'toast-top-right',
        toastClass: 'ngx-toastr alert alert-dismissible alert-warning alert-notify'
        
      }
    )
  }

}
