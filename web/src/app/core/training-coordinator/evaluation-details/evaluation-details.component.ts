import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { forkJoin, Subscription } from 'rxjs';
import { ExternalExtended, InternalExtended } from 'src/app/shared/services/evaluations/evaluations.model';
import { EvaluationsService } from 'src/app/shared/services/evaluations/evaluations.service';

@Component({
  selector: 'app-evaluation-details',
  templateUrl: './evaluation-details.component.html',
  styleUrls: ['./evaluation-details.component.scss']
})
export class EvaluationDetailsComponent implements OnInit {

  // Data
  evaluationID
  evaluationType
  internal: InternalExtended
  external: ExternalExtended

  // Checker
  isInternal: boolean = false
  isExternal: boolean = false

  // Subscriber
  subscription: Subscription

  constructor(
    private evaluationService: EvaluationsService,
    private loadingBar: LoadingBarService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.evaluationID = this.route.snapshot.queryParamMap.get('id')
    this.evaluationType = this.route.snapshot.queryParamMap.get('type')
    // console.log('Training ID', this.trainingID)
    if (!this.evaluationID) {
      this.router.navigate(['/tc/evaluations'])
    }

    if (
      this.evaluationID && (
        typeof this.evaluationID === 'string' || 
        this.evaluationID instanceof String
      )
    ) {
      this.getData()
    }
    else {
      this.navigatePage('/tc/evaluations')
    }
  }

  ngOnInit() {
  }

  getData() {
    this.loadingBar.start()
    let item_ = []

    if (this.evaluationType == 'internal') {
      this.isInternal = true
      this.isExternal = false
      item_.push(this.evaluationService.getInternals())
    }
    else if (this.evaluationType == 'external') {
      this.isInternal = false
      this.isExternal = true
      item_.push(this.evaluationService.getExternals())
    }

    this.subscription = forkJoin(item_).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        if (this.evaluationType == 'internal') {
          this.internal = this.evaluationService.internalExtended
        }
        else if (this.evaluationType == 'external') {
          this.external = this.evaluationService.externalExtended
        }
      }
    )
  }
  
  approve() {
    this.loadingBar.start()
    if (this.evaluationType == 'internal') {
      this.evaluationService.approveInternal(this.evaluationID).subscribe(
        () => {
          this.loadingBar.complete()
        },
        () => {
          this.loadingBar.complete()
        },
        () => {}
      )
    }
    else if (this.evaluationType == 'external') {
      this.evaluationService.approveExternal(this.evaluationID).subscribe(
        () => {
          this.loadingBar.complete()
        },
        () => {
          this.loadingBar.complete()
        },
        () => {}
      )
    }
    else {
      this.loadingBar.complete()
    }
  }

  verify() {
    this.loadingBar.start()
    if (this.evaluationType == 'internal') {
      this.evaluationService.verifyInternal(this.evaluationID).subscribe(
        () => {
          this.loadingBar.complete()
        },
        () => {
          this.loadingBar.complete()
        },
        () => {}
      )
    }
    else if (this.evaluationType == 'external') {
      this.evaluationService.verifyExternal(this.evaluationID).subscribe(
        () => {
          this.loadingBar.complete()
        },
        () => {
          this.loadingBar.complete()
        },
        () => {}
      )
    }
    else {
      this.loadingBar.complete()
    }
  }

  navigatePage(path) {
    return this.router.navigate([path])
  }

}
