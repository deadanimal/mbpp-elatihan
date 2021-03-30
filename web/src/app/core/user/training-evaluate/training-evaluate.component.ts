import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { forkJoin, Subscription } from 'rxjs';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { ApplicationsService } from 'src/app/shared/services/applications/applications.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ExternalExtended, InternalExtended } from 'src/app/shared/services/evaluations/evaluations.model';
import { TrainingExtended } from 'src/app/shared/services/trainings/trainings.model';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';

@Component({
  selector: 'app-training-evaluate',
  templateUrl: './training-evaluate.component.html',
  styleUrls: ['./training-evaluate.component.scss']
})
export class TrainingEvaluateComponent implements OnInit {

  // Data
  trainingID
  training: TrainingExtended
  external: ExternalExtended
  internal: InternalExtended
  trainingType: string = 'DD'

  // Form
  externalForm: FormGroup
  internalForm: FormGroup
  contentForm: FormGroup

  // Checker
  isEvaluated: boolean = false

  // Subscriber
  subscription: Subscription

  constructor(
    private authService: AuthService,
    private applicationService: ApplicationsService,
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
    this.externalForm = this.fb.group({})

    this.internalForm = this.fb.group({})

    this.contentForm = this.fb.group({})
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
        this.isEvaluated = this.trainingService.evaluationRes['is_evaluated']

        if (this.trainingType == 'DD') {
          this.external = this.trainingService.evaluationRes['evaluation']
        }
        else if (this.trainingType == 'LL') {
          this.external = this.trainingService.evaluationRes['evaluation']
        }
        else {
          this.navigatePage('/trainings/history')
        }
      }
    )
  }

  evaluate() {

  }

  navigatePage(path) {
    return this.router.navigate([path])
  }

}
