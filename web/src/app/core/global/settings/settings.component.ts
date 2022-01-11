import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { forkJoin } from 'rxjs';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { SecurityAnswer, SecurityQuestion } from 'src/app/shared/services/security/security.model';
import { SecurityService } from 'src/app/shared/services/security/security.service';
import { User } from 'src/app/shared/services/users/users.model';
import { CustomValidators } from 'src/app/shared/validators/custom/custom-validators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  // Form
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
  answer: SecurityAnswer

  // Checker
  isDetailLoad: boolean = false 

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

    setTimeout(
      () => {
        this.user = this.authService.userDetail
        this.getData()
      }, 2500
    )
  }

  initForm() {
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
    forkJoin([
      this.securityService.getQuestions(),
      this.securityService.getUserAnswer({'user': this.user['id']})
    ]).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.questions = this.securityService.questions
        this.answer = this.securityService.answer

        this.securityForm.controls['question'].setValue(this.answer['question'])
        this.securityForm.controls['answer'].setValue(this.answer['answer'])
      }
    )
  }

  changePassword() {
    this.loadingBar.start()
    this.authService.changePassword(this.passwordForm.value).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
        let title = 'Ralat'
        let message = 'Kata laluan tidak berjaya dikemaskini. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
      },
      () => {
        let title = 'Berjaya'
        let message = 'Kata laluan berjaya dikemaskini. Sila log masuk semula menggunakan kata laluan baru'
        this.notifyService.openToastr(title, message)
        this.navigatePage('/auth/login')
      }
    )
  }

  changeInput(input: any, input2:any): any {
    input.type = input.type === 'password' ? 'text' : 'password';
    input2.type = input2.type === 'password' ? 'text' : 'password';
  }

  changeInputAnswer(answer:any):any {
    answer.type = answer.type ==='password' ? 'text' : 'password';
  }

  changeSecurity() {
    this.loadingBar.start()
    this.securityService.patchAnswer(this.answer['id'], this.securityForm.value).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
        let title = 'Ralat'
        let message = 'Soalan / jawapan sekuriti tidak berjaya dikemaskini. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
      },
      () => {
        let title = 'Berjaya'
        let message = 'Soalan / jawapan sekuriti berjaya dikemaskini'
        this.notifyService.openToastr(title, message)
      }
    )
  }

  navigatePage(path: string) {
    return this.router.navigate([path])
  }

}
