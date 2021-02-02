import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { FormBuilder } from '@angular/forms';

import { Note } from 'src/app/shared/services/notes/notes.model';
import { TrainingExtended } from 'src/app/shared/services/trainings/trainings.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AttendancesService } from 'src/app/shared/services/attendances/attendances.service';
import { AbsenceMemosService } from 'src/app/shared/services/absence-memos/absence-memos.service';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';

import { forkJoin } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-training-detail',
  templateUrl: './training-detail.component.html',
  styleUrls: ['./training-detail.component.scss']
})
export class TrainingDetailComponent implements OnInit {

  // Data
  trainingID
  training: TrainingExtended

  // Checker
  isNotesEmpty: boolean = true
  isLive: boolean = false

  constructor(
    private authService: AuthService,
    private attendanceService: AttendancesService,
    private absenceService: AbsenceMemosService,
    private trainingService: TrainingsService,
    private loadingBar: LoadingBarService,
    private fb: FormBuilder,
    private notifyService: NotifyService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.trainingID = this.route.snapshot.queryParamMap.get('id')

    if (!this.trainingID) {
      this.navigatePage('/takwim')
    }

    if (
      this.trainingID && (
        typeof this.trainingID === 'string' || 
        this.trainingID instanceof String
      )
    ) {
      this.getData()
    }
    else {
      this.navigatePage('/trainings/summary')
    }
  }

  ngOnInit() {
    // let today = moment().toDate()
    // console.log(today)
    // moment(today).isSame('2010-02-01', 'day')
  }

  getData() {
    this.loadingBar.start()
    forkJoin([
      this.trainingService.getOne(this.trainingID),
      this.authService.getDetailByToken()
    ]).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.training = this.trainingService.trainingExtended
        // console.log('training: ', this.training)

        // Get live or not
        let today = moment().toDate()
        let start_date = moment(this.training['start_date'], 'YYYY-MM-DD').toDate()
        console.log(today)
        console.log(start_date)
        
        if (moment(today).isSame(start_date)) {
          this.isLive = true
        }
        else {
          this.isLive = false
        }

        // this.applyForm.controls['training'].setValue(this.training['id'])
        // this.applyForm.controls['applicant'].setValue(this.authService.userDetail['id'])
      }
    )
  }

  navigatePage(path) {
    return this.router.navigate([path])
  }

}
