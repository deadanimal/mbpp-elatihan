import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ExamApplicationsService } from 'src/app/shared/services/exam-applications/exam-applications.service';
import { ExamAttendancesService } from 'src/app/shared/services/exam-attendances/exam-attendances.service';
import { ExamResultsService } from 'src/app/shared/services/exam-results/exam-results.service';
import { ExamsService } from 'src/app/shared/services/exams/exams.service';
import { OrganisationsService } from 'src/app/shared/services/organisations/organisations.service';
import { OrganisationTypesService } from 'src/app/shared/services/organisation-types/organisation-types.service';
import { TrainingAbsencesService } from 'src/app/shared/services/training-absences/training-absences.service';
import { TrainingApplicationsService } from 'src/app/shared/services/training-applications/training-applications.service';
import { TrainingAssessmentAnswersService } from 'src/app/shared/services/training-assessment-answers/training-assessment-answers.service';
import { TrainingAssessmentQuestionsService } from 'src/app/shared/services/training-assessment-questions/training-assessment-questions.service';
import { TrainingAttendancesService } from 'src/app/shared/services/training-attendances/training-attendances.service';
import { TrainingNeedAnswersService } from 'src/app/shared/services/training-need-answers/training-need-answers.service';
import { TrainingNeedQuestionsService } from 'src/app/shared/services/training-need-questions/training-need-questions.service';
import { TrainingNotesService } from 'src/app/shared/services/training-notes/training-notes.service';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { TrainingEventsService } from 'src/app/shared/services/training-events/training-events.service';
import { ExamEventsService } from 'src/app/shared/services/exam-events/exam-events.service';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  // Form
  focusUsername
  focusPassword
  loginForm: FormGroup
  loginFormMessages = {
    'username': [
      { type: 'required', message: 'NRIC diperlukan' },
      { type: 'minLength', message: 'NRIC mestilah tidak kurang dari 12 karakter' },
      { type: 'maxLength', message: 'NRIC mestilah tidak lebih dari 12 karakter'}
      // { type: 'email', message: 'Please enter a valid email'}
    ],
    'password': [
      { type: 'required', message: 'Password is required' },
      // { type: 'minLength', message: 'Password must have at least 8 characters' }
    ]
  }

  // Image
  imgLogo = 'assets/img/logo/mbpp-logo.png'
  
  constructor(
    public router: Router,
    public toastr: ToastrService,
    private authService: AuthService,
    private examApplicationService: ExamApplicationsService,
    private examAttendanceService: ExamAttendancesService,
    private examEventService: ExamEventsService,
    private examResultService: ExamResultsService,
    private examService: ExamsService,
    private organisationService: OrganisationsService,
    private organisationTypeService: OrganisationTypesService,
    private trainingAbsenceService: TrainingAbsencesService,
    private trainingApplicationService: TrainingApplicationsService,
    private trainingAssessmentAnswerService: TrainingAssessmentAnswersService,
    private trainingAsessmentQuestionService: TrainingAssessmentQuestionsService,
    private trainingAttendanceService: TrainingAttendancesService,
    private trainingEventService: TrainingEventsService,
    private trainingNeedAnswerService: TrainingNeedAnswersService,
    private trainingNeedQuestionService: TrainingNeedQuestionsService,
    private trainingNoteService: TrainingNotesService,
    private trainingService: TrainingsService,
    private userService: UsersService,
    private loadingBar: LoadingBarService,
    private notifyService: NotifyService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(12)
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required
      ]))
    })
    // this.initServices()
  }

  ngOnDestroy() {

  }

  login(type: String) {
    this.loadingBar.start()
    if (type == 'manual') {
      // console.log('Manual login')
    }
    else if (type == 'latihan') {
      this.loginForm.value.username = '900106075157'
      this.loginForm.value.password = 'mbpplatihan'
    }
    else if (type == 'kakitangan') {
      this.loginForm.value.username = '910204075476'
      this.loginForm.value.password = 'mbpplatihan'
    }
    else if (type == 'jabatan') {
      this.loginForm.value.username = '871013078910'
      this.loginForm.value.password = 'mbpplatihan'
    }
    else if (type == 'admin') {
      this.loginForm.value.username = '881215079181'
      this.loginForm.value.password = 'mbpplatihan'
    }

    this.authService.obtainToken(this.loginForm.value).subscribe(
      () => { 
        // console.log('Success')
        this.loadingBar.complete()
        this.successMessage()
      },
      () => { 
        // console.log('Unsuccess') 
        this.loadingBar.complete()
      },
      () => {
        this.loginForm.reset()
        this.userService.getSingleUser(this.authService.userID).subscribe(
          (res) => {
             // console.log('Success')
            this.authService.userInformation = res
          },
          () => {
             // console.log('Unsuccess')
          },
          () => {
            // console.log('Then')
            if (this.authService.userType=='TC'){
              this.router.navigate(['/penyelaras/dashboard'])
              this.authService.userRole = 1
            }
            else if(this.authService.userType=='ST'){
              this.router.navigate(['/kakitangan/dashboard'])
              this.authService.userRole = 2
            }
            else if (this.authService.userType=='DC'){
              this.router.navigate(['/penyelaras-jabatan/dashboard'])
              this.authService.userRole = 3
            }
            else if (this.authService.userType=='AD'){
              this.router.navigate(['/admin/dashboard'])
              this.authService.userRole = 4
            }
          }
        )
      }
    )
  }

  navigatePage(path: String) {
    if (path == 'forgot') {
      return this.router.navigate(['/auth/forgot'])
    }
  }

  successMessage() {
    let title = 'Berjaya'
    let message = 'Selamat datang!'
    this.notifyService.openToastr(title, message)
  }

  initServices() {
    this.examApplicationService.get().subscribe()
    this.examAttendanceService.get().subscribe()
    this.examEventService.get().subscribe()
    this.examResultService.get().subscribe()
    this.examService.get().subscribe()
    this.organisationService.get().subscribe()
    this.organisationTypeService.get().subscribe()
    this.trainingAbsenceService.get().subscribe()
    this.trainingApplicationService.get().subscribe()
    this.trainingAssessmentAnswerService.get().subscribe()
    this.trainingAsessmentQuestionService.get().subscribe()
    this.trainingAttendanceService.get().subscribe()
    this.trainingEventService.get().subscribe()
    this.trainingNeedAnswerService.get().subscribe()
    this.trainingNeedQuestionService.get().subscribe()
    this.trainingNoteService.get().subscribe()
    this.trainingService.get().subscribe()
    this.userService.get().subscribe()
  }

  unsubsribeServices() {}

}
