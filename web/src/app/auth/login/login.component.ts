import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { User } from 'src/app/shared/services/users/users.model';
import { forkJoin } from 'rxjs';
import { SecurityService } from 'src/app/shared/services/security/security.service';
import { SecurityQuestion } from 'src/app/shared/services/security/security.model';
import { CustomValidators } from 'src/app/shared/validators/custom/custom-validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // Data
  paramID: string = null
  isRedirect: boolean = false

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
      { type: 'minLength', message: 'Kata laluan mesti mengandungi sekurang-kurangnya 8 aksara' }
    ]
  }
  passwordForm: FormGroup
  passwordFormMessages = {
    'new_password1': [
      { type: 'required', message: 'Kata laluan diperlukan' },
      { type: 'minlength', message: 'Kata laluan mesti mengandungi sekurang-kurangnya 8 aksara' },
      { type: 'hasNumber', message: 'Kata laluan mesti mengandungi sekurang-kurangnya 1 digit' },
      // { type: 'hasCapitalCase', message: 'Kata laluan mesti mengandungi sekurang-kurangnya 1 huruf besar' },
      // { type: 'hasSmallCase', message: 'Kata laluan mesti mengandungi sekurang-kurangnya 1 huruf kecil' }
    ],
    'new_password2': [
      { type: 'required', message: 'Ulang kata laluan diperlukan' },
      { type: 'NoPassswordMatch', message: 'Kata laluan tidak sepadan' }
    ]
  }
  securityForm: FormGroup
  securityFormMessages = {
    'question': [
      { type: 'required', message: 'Soalan sekuriti diperlukan' },
    ],
    'answer': [
      { type: 'required', message: 'Jawapan soalan sekuriti diperlukan' }
    ]
  }
  
  // Data
  user: User
  questions: SecurityQuestion[] = []
  currentDate: Date = new Date();

  // Checker
  isFirstLogin: boolean = false

  constructor(
    private authService: AuthService,
    private securityService: SecurityService,
    private notifyService: NotifyService,
    private fb: FormBuilder,
    private loadingBar: LoadingBarService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.paramID = this.route.snapshot.queryParamMap.get('id')
    if (this.route.snapshot.queryParamMap.get('redirect')) {
      this.isRedirect = true
    }
  }

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
        Validators.minLength(8)
      ]))
    })

    this.passwordForm = this.fb.group({
      new_password1: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.minLength(8),
        CustomValidators.patternValidator(/\d/, {
          hasNumber: true
        }),
        // CustomValidators.patternValidator(/[A-Z]/, {
        //   hasCapitalCase: true
        // }),
        // // check whether the entered password has a lower case letter
        // CustomValidators.patternValidator(/[a-z]/, {
        //   hasSmallCase: true
        // })
      ])),
      new_password2: new FormControl(null, Validators.compose([
        Validators.required
      ]))
    }, { validator: CustomValidators.passwordMatchValidator })

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
        // console.log(this.securityService.questions)
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
        let title = 'Ralat'
        let message = 'Sila muat semula halaman ini'
        this.notifyService.openToastrError(title, message)
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
        let title = 'Ralat'
        let message = 'NRIC dan kata laluan tidak sepadan'
        this.notifyService.openToastrError(title, message)
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
        this.navigatePage('/dashboard')
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
        if (!this.questions) {
          this.getData()
        }
        break;
    }
  }

  setupSecurity() {
    this.loadingBar.start()
    this.authService.changePassword(this.passwordForm.value).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
        let title = 'Ralat'
        let message = 'Kata laluan tidak berjaya diset. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
      },
      () => {
        this.addSecurityAnswer()
      }
    )
  }

  addSecurityAnswer() {
    this.loadingBar.start()
    this.securityService.createAnswer(this.securityForm.value).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
        let title = 'Ralat'
        let message = 'Soalan sekuriti tidak berjaya diset. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
      },
      () => {
        this.isFirstLogin = false
        let title = 'Berjaya'
        let message = 'Kata laluan dan soalan sekuriti berjaya diset. Sila log masuk semula menggunakan kata laluan baru'
        this.notifyService.openToastr(title, message)
        this.passwordForm.reset()
        this.securityForm.reset()
        this.runChecker()
      }
    )
  }

  runChecker() {
    this.loadingBar.start()
    this.securityService.checker().subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {}
    )
  }

  navigatePage(path: string) {
    if (path == 'forgot') {
      return this.router.navigate(['/auth/forgot'])
    }
    if (this.isRedirect) {
      let redirect_path = '/trainings/information'
      let extras = this.paramID
      let queryParams = {
        queryParams: {
          id: extras
        }
      }
      this.router.navigate([redirect_path], queryParams)
    }
    else {
      return this.router.navigate([path])
    }
  }

  viewManual() {
    let manualPath = 'assets/pdf/eLatihan.pdf'
    window.open(manualPath, '_blank');
  }

  cheat() {
    // Kakitangan - ST 1bf84de1-1102-4d07-bb59-896378e70eab
    // let username= '900106075157'
    // let pwd = 'mbpplatihan'
    // Penyelaras Jabatan - DC 8b6b8639-e23a-4061-83d4-3c7f69a49bfb
    // let username= '900106075156'
    // let pwd = 'mbpplatihan123'
    // Penyelaras Latihan - TC bc87f9ca-520b-4ede-84be-e5978aa8e467
    let username= '900106075155' 
    let pwd = 'mbpplatihan123'
    // Ketua Jabatan - DH 321eea06-c911-453d-af57-14beaf38f4b6
    // let username= '900106075154'
    // let pwd = 'mbpplatihan123'
    // Pentadbir Sistem - AD 3866890b-2723-462a-9db4-3097d8321613
    // let username= '900206075154' 
    // let pwd = 'mbpplatihan123'

    this.loginForm.controls['username'].setValue(username)
    this.loginForm.controls['password'].setValue(pwd)

    this.login()
  }
  

  // Latihan
  // 900106075157

}
