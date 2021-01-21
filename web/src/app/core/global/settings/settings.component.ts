import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { forkJoin } from 'rxjs';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { SecurityAnswer, SecurityQuestion } from 'src/app/shared/services/security/security.model';
import { SecurityService } from 'src/app/shared/services/security/security.service';
import { User } from 'src/app/shared/services/users/users.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  // Form
  passwordForm: FormGroup
  securityForm: FormGroup

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
        Validators.required
      ])),
      new_password2: new FormControl(null, Validators.compose([
        Validators.required
      ]))
    })

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
