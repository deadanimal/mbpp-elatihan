import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { forkJoin } from 'rxjs';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { ApplicationsService } from 'src/app/shared/services/applications/applications.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { TrainingExtended } from 'src/app/shared/services/trainings/trainings.model';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';

import swal from 'sweetalert2';

@Component({
  selector: 'app-training-information',
  templateUrl: './training-information.component.html',
  styleUrls: ['./training-information.component.scss']
})
export class TrainingInformationComponent implements OnInit {

  // Data
  trainingID
  training: TrainingExtended

  // Form
  applyForm: FormGroup

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
      this.initForm()
    }
    else {
      this.navigatePage('/takwim')
    }
  }

  ngOnInit() {
    this.initForm()
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
        console.log('training: ', this.training)

        this.applyForm.controls['training'].setValue(this.training['id'])
        this.applyForm.controls['applicant'].setValue(this.authService.userDetail['id'])
      }
    )
  }

  initForm() {
    this.applyForm = this.fb.group({
      training: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      applicant: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      application_type: new FormControl('PS', Validators.compose([
        Validators.required
      ]))
    })
  }

  confirm() {
    swal.fire({
      title: 'Pengesahan',
      text: 'Anda pasti untuk mendaftar ke dalam latihan ini?',
      type: 'info',
      buttonsStyling: false,
      showCancelButton: true,
      confirmButtonClass: 'btn btn-info',
      confirmButtonText: 'Pasti',
      cancelButtonClass: 'btn btn-outline-info',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.value) {
        this.apply()
      }
    })
  }

  apply() {
    this.loadingBar.start()
    let infoTitle = 'Sedang proses'
    let infoMessage = 'Pendaftaran sedang diproses'
    this.notifyService.openToastrInfo(infoTitle, infoMessage)

    this.applicationService.post(this.applyForm.value).subscribe(
      () => {
        this.loadingBar.complete()
        let title = 'Berjaya'
        let message = 'Anda berjaya mendaftar ke dalam latihan ini'
        this.notifyService.openToastr(title, message)
      },
      () => {
        this.loadingBar.complete()
        let title = 'Tidak berjaya'
        let message = 'Anda tidak berjaya untuk mendaftarkan diri ke dalam latihan. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        this.navigatePage('/dashboard')
      }
    )
  }

  navigatePage(path) {
    return this.router.navigate([path])
  }

}
