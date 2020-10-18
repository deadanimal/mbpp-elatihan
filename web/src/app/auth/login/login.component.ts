import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // Image
  imgLogo = 'assets/img/logo/mbpp-logo.png'

  // Form
  focusUsername
  focusPassword
  loginForm: FormGroup
  loginFormMessages = {
    'username': [
      { type: 'required', message: 'NRIC diperlukan' }
    ],
    'password': [
      { type: 'required', message: 'Kata laluan diperlukan' },
      // { type: 'minLength', message: 'Password must have at least 8 characters' }
    ]
  }

  constructor(
    private authService: AuthService,
    private notifyService: NotifyService,
    private formBuilder: FormBuilder,
    private loadingBar: LoadingBarService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required,
        // Validators.email
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        // Validators.minLength(8)
      ]))
    })
  }

  login() {
    this.loadingBar.start()
    this.authService.obtainToken(this.loginForm.value).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.navigatePage('dashboard')
        this.successMessage()
      }
    )
  }

  cheat() {
    let username= '900106075157'
    let pwd = 'mbpplatihan'
    this.loginForm.controls['username'].setValue(username)
    this.loginForm.controls['password'].setValue(pwd)

    this.login()
  }

  navigatePage(path: String) {
    if (path == 'login') {
      return this.router.navigate(['/auth/login'])
    }
    else  if (path == 'forgot') {
      return this.router.navigate(['/auth/forgot'])
    }
    else  if (path == 'register') {
      return this.router.navigate(['/auth/register'])
    }
    else if (path == 'dashboard-admin') {
      return this.router.navigate(['/admin/dashboard'])
    }
    else if (path == 'dashboard-user') {
      return this.router.navigate(['/user/dashboard'])
    }
    else if (path == 'dashboard') {
      return this.router.navigate(['/dashboard'])
    }
  }

  successMessage() {
    let title = 'Berjaya'
    let message = 'Sedang melog masuk'
    this.notifyService.openToastr(title, message)
  }

  // Latihan
  // 900106075157

}
