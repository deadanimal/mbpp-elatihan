import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { User } from 'src/app/shared/services/users/users.model';
import { forkJoin } from 'rxjs';
import { SecurityService } from 'src/app/shared/services/security/security.service';
import { SecurityQuestion } from 'src/app/shared/services/security/security.model';

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
  passwordForm: FormGroup
  securityForm: FormGroup
  
  // Data
  user: User
  questions: SecurityQuestion[] = []

  // Checker
  isFirstLogin: boolean = false

  constructor(
    private authService: AuthService,
    private securityService: SecurityService,
    private notifyService: NotifyService,
    private fb: FormBuilder,
    private loadingBar: LoadingBarService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm()
    this.getData()
  }

  initForm() {
    this.loginForm = this.fb.group({
      username: new FormControl(null, Validators.compose([
        Validators.required,
        // Validators.email
      ])),
      password: new FormControl(null, Validators.compose([
        Validators.required,
        // Validators.minLength(8)
      ]))
    })

    this.passwordForm = this.fb.group({
      new_password1: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      new_password2: new FormControl(null, Validators.compose([
        Validators.required
      ]))
    })

    this.securityForm = this.fb.group({
      user: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      question: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      answer: new FormControl(null, Validators.compose([
        Validators.required
      ]))
    })
  }

  getData() {
    this.loadingBar.start()
    this.securityService.getQuestions().subscribe(
      () => {
        console.log(this.securityService.questions)
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.questions = this.securityService.questions
      }
    )
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
        this.getDetail()
      }
    )
  }

  getDetail() {
    this.authService.getUserDetail().subscribe(
      () => {},
      () => {},
      () => {
        this.user = this.authService.userDetail
        this.checkFirstLogin()
      }
    )
  }

  checkFirstLogin() {
    switch(this.user['is_first_login']) {
      case false:
        this.navigatePage('dashboard')
        // this.successMessage()
        let title = 'Berjaya'
        let message = 'Sedang melog masuk'
        this.notifyService.openToastr(title, message)
        this.loginForm.reset()
        break;
      case true:
        this.isFirstLogin = true
        this.securityForm.controls['user'].setValue(this.authService.userID)
        if (this.questions.length > 0) {
          this.securityForm.controls['question'].setValue(this.questions[0]['id'])
        }
        break;
    }
  }

  setupSecurity() {
    this.loadingBar.start()
    forkJoin([
      this.authService.changePassword(this.passwordForm.value),
      this.securityService.createAnswer(this.securityForm.value)
    ]).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
        let title = 'Ralat'
        let message = 'Kata laluan dan soalan sekuriti tidak berjaya diset. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
      },
      () => {
        this.isFirstLogin = false
        let title = 'Berjaya'
        let message = 'Kata laluan dan soalan sekuriti berjaya diset. Sila log masuk semula menggunakan kata laluan baru'
        this.notifyService.openToastr(title, message)
        this.passwordForm.reset()
        this.securityForm.reset()
        window.location.reload();
      }
    )
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

  viewManual() {
    let manualPath = 'assets/pdf/eLatihan.pdf'
    window.open(manualPath, '_blank');
  }

  cheat() {
    // Kakitangan - ST
    // let username= '900106075157'
    // let pwd = 'mbpplatihan'
    // Ketua Jabatan - DC
    // let username= '900106075156'
    // let pwd = 'mbpplatihan'
    // Ketua Latihan - TC
    let username= '900106075155'
    let pwd = 'mbpplatihan123'

    this.loginForm.controls['username'].setValue(username)
    this.loginForm.controls['password'].setValue(pwd)

    this.login()
  }
  

  // Latihan
  // 900106075157

}
