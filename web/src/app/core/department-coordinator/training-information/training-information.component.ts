import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { TrainingExtended } from 'src/app/shared/services/trainings/trainings.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ApplicationsService } from 'src/app/shared/services/applications/applications.service';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/shared/services/users/users.model';


import * as moment from 'moment';
import swal from 'sweetalert2';
import { Section } from 'src/app/shared/code/user';
import { UsersService } from 'src/app/shared/services/users/users.service';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-training-information',
  templateUrl: './training-information.component.html',
  styleUrls: ['./training-information.component.scss']
})
export class TrainingInformationComponent implements OnInit {

  // Data
  trainingID
  training: TrainingExtended
  staffs: User[] = []
  selectedStaffs: User[]
  sections = Section

  // Form
  applyForm: FormGroup

  // Checker
  isApplied: boolean = false
  isApplying: boolean = false
  isEmpty: boolean = true

  // Date
  dateToday

  // Table
  tableEntries: number = 5
  tableSelected: any[] = []
  tableTemp = []
  dataStaff = []
  tableActiveRow: any
  tableRows: any = []
  tableMessages = { 
    emptyMessage: 'Tiada rekod dijumpai',
    totalMessage: 'rekod'
  }
  SelectionType = SelectionType;

  // Icon
  iconEmpty = 'assets/img/icons/box.svg'

  constructor(
    private authService: AuthService,
    private applicationService: ApplicationsService,
    private trainingService: TrainingsService,
    private loadingBar: LoadingBarService,
    private fb: FormBuilder,
    private notifyService: NotifyService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UsersService
  ) { 
    this.trainingID = this.route.snapshot.queryParamMap.get('id')
  
    if (!this.trainingID) {
      this.navigatePage('/dc/trainings/summary')
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
      this.navigatePage('/dc/trainings/summary')
    }
  }

  ngOnInit() {
    this.initForm()
    this.dateToday = moment().format('YYYY-MM-DD')
  }

  getData() {
    this.loadingBar.start()
    forkJoin([
      this.trainingService.getOne(this.trainingID),
      this.authService.getDetailByToken(),
      this.trainingService.getApplicableDepartment(this.trainingID),
      this.userService.getDepartmentStaffs()
    ]).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.training = this.trainingService.trainingExtended
        this.dataStaff = this.trainingService.applicableStaffs
        this.staffs = this.userService.users
        console.log('list of staff : ', this.staffs)
        console.log('list of staff : ', this.dataStaff)

        this.applyForm.controls['training'].setValue(this.training['id'])

        // Applied?
        this.staffs.forEach(
          (staff) => {
            staff['applied'] = false
            
            this.training.training_application.forEach(
              (application) => {
                // console.log(application)
                if (application['applicant']['id'] == staff['id']) {
                  staff['applied'] = true
                }
              }
            )
          }
        )
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
      text: 'Anda pasti untuk mencalonkan kakitangan berikut ke dalam latihan ini?',
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
    let body = {
      'training': this.training['id'],
      'applicants': this.selectedStaffs
    }
    let infoTitle = 'Sedang proses'
    let infoMessage = 'Pencalonan sedang diproses'
    this.notifyService.openToastrInfo(infoTitle, infoMessage)

    this.applicationService.postBatch(body).subscribe(
      () => {
        this.loadingBar.complete()
        let title = 'Berjaya'
        let message = 'Anda berjaya mencalonkan kakitangan berikut ke dalam latihan ini'
        this.notifyService.openToastr(title, message)
      },
      () => {
        this.loadingBar.complete()
        let title = 'Tidak berjaya'
        let message = 'Anda tidak berjaya untuk mencalonkan kakitangan berikut ke dalam latihan. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        // this.navigatePage('/dc/dashboard')
        this.selectedStaffs = []
        this.applyForm.reset()
        this.getData()
      }
    )
  }

  onChangeSelect($event) {
    this.tableRows = this.selectedStaffs
    this.tableTemp = this.tableRows.map((prop, key) => {
      return {
        ...prop,
        id_index: key+1
      };
    });

    if (this.tableTemp.length >= 1) {
      this.isEmpty = false
    }
    else {
      this.isEmpty = true
    }
  }

  entriesChange($event) {
    this.tableEntries = $event.target.value;
  }

  filterTable($event, type) {
    let val = $event.target.value.toLowerCase();
    if (type == 'name') {
      this.tableTemp = this.tableRows.filter(function(d) {
        return d.applicant.full_name.toLowerCase().indexOf(val) !== -1 || !val;
      });
    }
    else if (type == 'organiser_type') {
      if (val == 'aa') {
        this.tableTemp = this.tableRows
      }
      else {
        this.tableTemp = this.tableRows.filter(function(d) {
          return d.organiser_type.toLowerCase().indexOf(val) !== -1 || !val;
        });
      }
    }
    else if (type == 'year') {
      if (val == 'aa') {
        this.tableTemp = this.tableRows
      }
      else {
        this.tableTemp = this.tableRows.filter(function(d) {
          return d.start_date_year.toLowerCase().indexOf(val) !== -1 || !val;
        });
      }
    }
  }

  onSelect({ selected }) {
    this.tableSelected.splice(0, this.tableSelected.length);
    this.tableSelected.push(...selected);
  }

  onActivate(event) {
    this.tableActiveRow = event.row;
  }

  navigatePage(path) {
    return this.router.navigate([path])
  }

  openApplyForm() {
    this.isApplying = !this.isApplying
  }

  viewSelected() {
    console.log(this.selectedStaffs)
  }

  downloadAttachment(type) {
    console.log('huhe', type)
    if (type == 'attachment') {
      let url = this.training['attachment']
      const urlHehe = 'https://mbpp-api.pipeline.com.my'+url
      console.log('url', urlHehe)
      window.open(urlHehe, '_blank');
    }
    else if (type == 'attachment_approval') {
      let url = this.training['attachment_approval']
      const urlHehe = 'https://mbpp-api.pipeline.com.my'+url
      console.log('url', urlHehe)
      window.open(urlHehe, '_blank');
    }
  
  }

}
