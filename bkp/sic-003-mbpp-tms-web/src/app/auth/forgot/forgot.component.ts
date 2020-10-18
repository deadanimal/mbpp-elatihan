import { Component, OnInit } from '@angular/core';
import { 
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  
  // Form
  focusEmail
  resetForm: FormGroup
  resetFormMessages = {
    'email': [
      { type: 'required', message: 'NRIC diperlukan' },
      // { type: 'email', message: 'Emel yang sah diperlukan' }
    ]
  }
  securityForm: FormGroup

  // Image
  imgLogo = 'assets/img/logo/mbpp-logo.png'

  // Data
  questions = [
    { text: 'Apakah nama panggilan anda ketika kecil?' },
    { text: 'Apakah buah kegemaran anda?' },
    { text: 'Apakah makanan kegemaran anda?' },
    { text: 'Apakah warna kegemaran anda?' },
    { text: 'Apakah haiwan kegemaran anda?' }
  ]
  
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private loadingBar: LoadingBarService,
    private notifyService: NotifyService,
    private router: Router
  ) { }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required
      ]))
    })

    this.securityForm = this.formBuilder.group({
      question: new FormControl('', Validators.compose([
        Validators.required
      ])),
      answer: new FormControl('', Validators.compose([
        Validators.required
      ]))
    })
  }

  reset() {
    this.loadingBar.start()
    this.authService.resetPassword(this.resetForm.value).subscribe(
      () => {
        // console.log('Success')
        this.loadingBar.complete()
      },
      () => {
        // console.log('Unsuccess')
        this.loadingBar.complete()
      },
      () => {
        // console.log('Then')
        this.resetForm.reset()
        this.successMessage()
      }
    )
  }

  navigatePage(path: String) {
    if (path == 'login') {
      return this.router.navigate(['/auth/login'])
    }
  }

  successMessage() {
    let title = 'Berjaya'
    let message = 'Reset link telah dihantar ke emel anda'
    this.notifyService.openToastr(title, message)
  }

}
