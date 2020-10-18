import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

  currentUserProfilePicture: string = null
  currentUserFullName: string = ''
  currentUserGender: string = ''
  currentUserNRIC: string = ''
  currentUserDepartment: string = ''
  currentUserPosition: string = ''
  currentUserGrade: string = ''
  currentUserPhone: string = ''
  currentUserEmail: string = ''

  newPasswordForm = new FormGroup({
    new_password1: new FormControl(''),
    new_password2: new FormControl('')
  })
  
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    public loadingBar: LoadingBarService,
    public toastr: ToastrService
  ) {
    this.initUserData()
  }

  ngOnInit() {
  }

  initUserData() {
    this.userService.getSingleUser(this.authService.userID).subscribe(
      (res) => {
        this.currentUserFullName = res.full_name
        this.currentUserGender = res.gender
        this.currentUserNRIC = res.nric
        this.currentUserDepartment = res.department
        this.currentUserPosition = res.position
        this.currentUserGrade = res.gred
        this.currentUserPhone = res.mobile
        this.currentUserEmail = res.email
        this.currentUserProfilePicture = res.profile_picture
      }
    )
  }

  changePassword() {
    this.loadingBar.start()
    console.log(this.newPasswordForm.value)
    this.authService.changePassword(this.newPasswordForm.value).subscribe(
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
