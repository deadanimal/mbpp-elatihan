import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { forkJoin, Subscription } from 'rxjs';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { ApplicationsService } from 'src/app/shared/services/applications/applications.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Content, ExternalExtended, InternalExtended } from 'src/app/shared/services/evaluations/evaluations.model';
import { EvaluationsService } from 'src/app/shared/services/evaluations/evaluations.service';
import { TrainingExtended } from 'src/app/shared/services/trainings/trainings.model';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';

import swal from 'sweetalert2';

@Component({
  selector: 'app-training-evaluate',
  templateUrl: './training-evaluate.component.html',
  styleUrls: ['./training-evaluate.component.scss']
})
export class TrainingEvaluateComponent implements OnInit {

  // Data
  trainingID = null
  training: TrainingExtended
  external: ExternalExtended
  internal: InternalExtended
  contents: Content
  trainingType: string = 'DD'

  // Form
  externalForm: FormGroup
  internalForm: FormGroup
  contentForm: FormGroup
  contentFormArray: FormArray

  // Checker
  isEvaluated: boolean = false

  // Subscriber
  subscription: Subscription
  subscriptionEvaluation: Subscription
  subscriptionContent: Subscription

  constructor(
    private authService: AuthService,
    private applicationService: ApplicationsService,
    private evaluationService: EvaluationsService,
    private trainingService: TrainingsService,
    private loadingBar: LoadingBarService,
    private fb: FormBuilder,
    private notifyService: NotifyService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.trainingID = this.route.snapshot.queryParamMap.get('id')
    this.trainingType = this.route.snapshot.queryParamMap.get('type')
    if (
      this.trainingID && (
        typeof this.trainingID === 'string' || 
        this.trainingID instanceof String
      )
    ) {
      this.getData()
      this.initForm()
    }
    else {
      this.navigatePage('/trainings/history')
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  initForm() {
    this.externalForm = this.fb.group({
      training: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      attendee: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      answer_1: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      answer_2: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      answer_3: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      answer_4: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      answer_5: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      answer_6: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      answer_7: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      answer_8: new FormControl(null, Validators.compose([
        Validators.required
      ]))
    })

    this.internalForm = this.fb.group({
      training: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      attendee: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      answer_1: new FormControl('3', Validators.compose([
        Validators.required
      ])),
      answer_2: new FormControl('2', Validators.compose([
        Validators.required
      ])),
      answer_3: new FormControl('2', Validators.compose([
        Validators.required
      ])),
      answer_4: new FormControl('3', Validators.compose([
        Validators.required
      ])),
      answer_5: new FormControl('3', Validators.compose([
        Validators.required
      ])),
      answer_6: new FormControl('3', Validators.compose([
        Validators.required
      ])),
      answer_7: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      answer_8: new FormControl(null, Validators.compose([
        Validators.required
      ]))
    })

    this.contentForm = this.fb.group({
      contentFormArray: this.fb.array([this.initContentForm()])
    })
  }

  initContentForm() {
    return this.fb.group({
      evaluation: new FormControl(this.trainingID, Validators.compose([
        Validators.required
      ])),
      topic_trainer: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      content: new FormControl('3', Validators.compose([
        Validators.required
      ])),
      presentation: new FormControl('3', Validators.compose([
        Validators.required
      ])),
      relevance: new FormControl('3', Validators.compose([
        Validators.required
      ]))
    })
  }

  addContent() {
    this.contentFormArray = this.contentForm.get('contentFormArray') as FormArray
    this.contentFormArray.push(this.initContentForm())
  }

  removeContent(ind: number) {
    this.contentFormArray.removeAt(ind)
  }

  getData() {
    this.loadingBar.start()
    this.subscription = forkJoin([
      this.trainingService.checkEvaluation(this.trainingID)
    ]).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        // Checker
        this.isEvaluated = this.trainingService.evaluationRes['is_evaluated']

        // Init value
        this.externalForm.controls['training'].patchValue(this.trainingID)
        this.externalForm.controls['attendee'].patchValue(this.authService.userID)
        this.internalForm.controls['training'].patchValue(this.trainingID)
        this.internalForm.controls['attendee'].patchValue(this.authService.userID)


        if (this.trainingType == 'DD') {
          this.internal = this.trainingService.evaluationRes['evaluation']

          if (this.isEvaluated) {
            this.internalForm.controls['answer_1'].patchValue(this.internal['answer_1'])
            this.internalForm.controls['answer_2'].patchValue(this.internal['answer_2'])
            this.internalForm.controls['answer_3'].patchValue(this.internal['answer_3'])
            this.internalForm.controls['answer_4'].patchValue(this.internal['answer_4'])
            this.internalForm.controls['answer_5'].patchValue(this.internal['answer_5'])
            this.internalForm.controls['answer_6'].patchValue(this.internal['answer_6'])
            this.internalForm.controls['answer_7'].patchValue(this.internal['answer_7'])
            this.internalForm.controls['answer_8'].patchValue(this.internal['answer_8'])
            this.internalForm.controls['answer_1'].disable()
            this.internalForm.controls['answer_2'].disable()
            this.internalForm.controls['answer_3'].disable()
            this.internalForm.controls['answer_4'].disable()
            this.internalForm.controls['answer_5'].disable()
            this.internalForm.controls['answer_6'].disable()
            this.internalForm.controls['answer_7'].disable()
            this.internalForm.controls['answer_8'].disable()
          }
        }
        else if (this.trainingType == 'LL') {
          this.external = this.trainingService.evaluationRes['evaluation']

          if (this.isEvaluated) {
            this.externalForm.controls['answer_1'].patchValue(this.external['answer_1'])
            this.externalForm.controls['answer_2'].patchValue(this.external['answer_2'])
            this.externalForm.controls['answer_3'].patchValue(this.external['answer_3'])
            this.externalForm.controls['answer_4'].patchValue(this.external['answer_4'])
            this.externalForm.controls['answer_5'].patchValue(this.external['answer_5'])
            this.externalForm.controls['answer_6'].patchValue(this.external['answer_6'])
            this.externalForm.controls['answer_7'].patchValue(this.external['answer_7'])
            this.externalForm.controls['answer_8'].patchValue(this.external['answer_8'])
            this.externalForm.controls['answer_1'].disable()
            this.externalForm.controls['answer_2'].disable()
            this.externalForm.controls['answer_3'].disable()
            this.externalForm.controls['answer_4'].disable()
            this.externalForm.controls['answer_5'].disable()
            this.externalForm.controls['answer_6'].disable()
            this.externalForm.controls['answer_7'].disable()
            this.externalForm.controls['answer_8'].disable()
          }
        }
        else {
          this.navigatePage('/trainings/history')
        }
      }
    )
  }

  confirm(type: string) {
    swal.fire({
      title: 'Pengesahan',
      text: 'Anda pasti untuk menghantar penilaian untuk latihan ini?',
      type: 'info',
      buttonsStyling: false,
      showCancelButton: true,
      confirmButtonClass: 'btn btn-info',
      confirmButtonText: 'Pasti',
      cancelButtonClass: 'btn btn-outline-info',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.value) {
        this.evaluate(type)
      }
    })
  }

  evaluate(type: string) {
    this.loadingBar.start()

    if (type === 'internal') {
      this.subscriptionEvaluation = this.evaluationService.createInternal(this.internalForm.value).subscribe(
        (res) => {
          this.loadingBar.complete()
          if (
            this.contentForm.value.contentFormArray
          ) {
            this.submitContent(res['id'])
          }
        },
        () => {
          this.loadingBar.complete()
          let title = 'Tidak berjaya'
          let message = 'Anda tidak berjaya untuk menghantar penilaian ini. Sila cuba sekali lagi'
          this.notifyService.openToastrError(title, message)
        },
        () => {
          let title = 'Berjaya'
          let message = 'Penilaian berjaya dihantar'
          this.notifyService.openToastr(title, message)
          this.getData()
        }
      )
    }
    else if (type === 'external') {
      this.subscriptionEvaluation = this.evaluationService.createExternal(this.externalForm.value).subscribe(
        (res) => {
          this.loadingBar.complete()
        },
        () => {
          this.loadingBar.complete()
          let title = 'Tidak berjaya'
          let message = 'Anda tidak berjaya untuk menghantar penilaian ini. Sila cuba sekali lagi'
          this.notifyService.openToastrError(title, message)
        },
        () => {
          let title = 'Berjaya'
          let message = 'Penilaian berjaya dihantar'
          this.notifyService.openToastr(title, message)
          this.getData()
        }
      )
    }
    else {
      this.loadingBar.complete()
    }

  }

  submitContent(id: any) {
    if (this.contentForm.value.contentFormArray) {
      this.loadingBar.start()
      this.contentForm.value.contentFormArray.forEach(
        (contentForm) => {
          contentForm['evaluation'] = id
          this.subscriptionContent = this.evaluationService.createContent(contentForm).subscribe(
            (res) => {
              this.loadingBar.complete()
            },
            () => {
              this.loadingBar.complete()
              let title = 'Tidak berjaya'
                let message = 'Anda tidak berjaya untuk menghantar kandungan penilaian ini. Sila cuba sekali lagi'
                this.notifyService.openToastrError(title, message)
            },
            () => {
              let title = 'Berjaya'
              let message = 'Kandungan Penilaian berjaya dihantar'
              this.notifyService.openToastr(title, message)
              this.getData()
            }
          )
        }
      )
    }
  }

  navigatePage(path) {
    return this.router.navigate([path])
  }

}
