import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import swal from "sweetalert2";
import * as moment from 'moment';
import * as listTypes from 'src/app/shared/list/types';

import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
// import { TrainingCodeGroupsService } from 'src/app/shared/services/training-code-groups/training-code-groups.service';
// import { TrainingCodeClassService } from 'src/app/shared/services/training-code-class/training-code-class.service';
// import { TrainingCodeCategoriesService } from 'src/app/shared/services/training-code-categories/training-code-categories.service';
// import { TrainingCodeGroup } from 'src/app/shared/services/training-code-groups/training-code-groups.model';
// import { TrainingCodeClass } from 'src/app/shared/services/training-code-class/training-code-class.model';
// import { TrainingCodeCategory } from 'src/app/shared/services/training-code-categories/training-code-categories.model';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { OrganisationsService } from 'src/app/shared/services/organisations/organisations.service';
import { Organisation } from 'src/app/shared/services/organisations/organisations.model';
import { Courses } from 'src/assets/data/courses';
import { Departments } from 'src/assets/data/departments';
import { Organisers } from 'src/assets/data/organiser-type';
import { Results } from 'src/assets/data/results';
import { Status } from 'src/assets/data/status';
import { TargetGroupTypes } from 'src/assets/data/target-group-types';
import { TargetGroups } from 'src/assets/data/target-groups';

@Component({
  selector: 'app-kursus-tambah',
  templateUrl: './kursus-tambah.component.html',
  styleUrls: ['./kursus-tambah.component.scss']
})
export class KursusTambahComponent implements OnInit {

  // Stepper
  isLinear = false
  isDisableRipple = true
  labelPosition = 'bottom'

  organiserValue = ''
  auto_course_code = ''

  // Application form
  trainingForm: FormGroup
  // trainingApplicationForm = new FormGroup({
  //   course_code: new FormControl('', Validators.compose([
  //     Validators.required
  //   ])),
  //   title: new FormControl('', Validators.compose([
  //     Validators.required
  //   ])),
  //   description: new FormControl('', Validators.compose([
  //     Validators.required
  //   ])),
  //   course_type: new FormControl('', Validators.compose([
  //     Validators.required
  //   ])),
  //   category: new FormControl('', Validators.compose([
  //     Validators.required
  //   ])),
  //   target_group_type: new FormControl(''),
  //   target_group: new FormControl('', Validators.compose([
  //     Validators.required
  //   ])),
  //   department: new FormControl(''),
  //   organiser: new FormControl('', Validators.compose([
  //     Validators.required
  //   ])),
  //   organiser_type: new FormControl('', Validators.compose([
  //     Validators.required
  //   ])),
  //   max_participant: new FormControl('', Validators.compose([
  //     Validators.required
  //   ])),
  //   venue: new FormControl('', Validators.compose([
  //     Validators.required
  //   ])),
  //   address: new FormControl('', Validators.compose([
  //     Validators.required
  //   ])),
  //   start_date: new FormControl('', Validators.compose([
  //     Validators.required
  //   ])),
  //   end_date: new FormControl('', Validators.compose([
  //     Validators.required
  //   ])),
  //   start_time: new FormControl('', Validators.compose([
  //     Validators.required
  //   ])),
  //   end_time: new FormControl('', Validators.compose([
  //     Validators.required
  //   ])),
  //   speaker: new FormControl(''),
  //   agency: new FormControl(''),
  //   fasilitator: new FormControl(''),
  //   cost: new FormControl('', Validators.compose([
  //     Validators.required
  //   ]))
  // })
  validationMessages = {
    'course_code': [
      { type: 'required', message: 'Anda perlu memilih kod kursus'}
    ],
    'title': [
      { type: 'required', message: 'Anda perlu mengisi tajuk kursus'}
    ],
    'training_type': [
      { type: 'required', message: 'Anda perlu memilih jenis kursus'}
    ],
    'description': [
      { type: 'required', message: 'Anda perlu mengisi keterangan kursus' }
    ],
    'course_type': [
      { type: 'required', message: 'Anda perlu memilih jenis kursus' }
    ],
    'category': [
      { type: 'required', message: 'Anda perlu memilih kategori kursus' }
    ],
    'target_group_type': [
      { type: 'required', message: 'Anda perlu memilih jenis kumpulan sasaran' }
    ],
    'target_group': [
      { type: 'required', message: 'Anda perlu memilih kumpulan sasaran' }
    ],
    'department': [
      { type: 'required', message: 'Anda perlu memilih jabatan' }
    ],
    'organiser': [
      { type: 'required', message: 'Anda perlu mengisi penganjur kursus' }
    ],
    'organiser_type': [
      { type: 'required', message: 'Anda perlu memilih jenis anjuran' }
    ],
    'max_participant': [
      { type: 'required', message: 'Anda perlu mengisi bilangan peserta' }
    ],
    'venue': [
      { type: 'required', message: 'Anda perlu mengisi tempat kursus' }
    ],
    'address': [
      { type: 'required', message: 'Anda perlu mengisi alamat tempat kursus' }
    ],
    'start_date': [
      { type: 'required', message: 'Anda perlu mengisi tarikh mula kursus' }
    ],
    'end_date': [
      { type: 'required', message: 'Anda perlu mengisi tarikh tamat kursus' }
    ],
    'start_time': [
      { type: 'required', message: 'Anda perlu mengisi waktu mula kursus' }
    ],
    'end_time': [
      { type: 'required', message: 'Anda perlu mengisi waktu tamat kursus' }
    ],
    'cost': [
      { type: 'required', message: 'Anda perlu mengisi kos kursus' }
    ]
  }

  trainingTypes = listTypes.trainings
  courseTypes = listTypes.courses
  departmentTypes = listTypes.departments

  // trainingCodeGroup: TrainingCodeGroup[] = []
  // trainingCodeClass: TrainingCodeClass[] = []
  // trainingCodeCategory: TrainingCodeCategory[] = []

  // Datepicker
  datePickerConfig = { 
    containerClass: 'theme-dark-blue',
    dateInputFormat: 'DD-MM-YYYY' 
  }
  datePickerValue

  // Data
  organisations: Organisation[] = []

  courseOptns = Courses
  departmentOptns = Departments
  organiserTypeOptns = Organisers
  resultOptns = Results
  statusOptns = Status
  targetGroupTypeOptns = TargetGroupTypes
  targetGroupOptns = TargetGroups

  constructor(
    private trainingService: TrainingsService,
    private organisationService: OrganisationsService,
    private formBuilder: FormBuilder,
    private loadingBar: LoadingBarService,
    private toastr: ToastrService,
    private notifyService: NotifyService
  ) { 
    this.organisationService.get().subscribe(
      () => {},
      () => {},
      () => { this.organisations = this.organisationService.organisations }
    )
  }

  ngOnInit() {
    this.trainingForm = this.formBuilder.group({
      title: new FormControl('', Validators.compose([
        Validators.required
      ])),
      description: new FormControl('', Validators.compose([
        Validators.required
      ])),
      organiser_type: new FormControl('', Validators.compose([
        Validators.required
      ])),
      organiser: new FormControl('', Validators.compose([
        Validators.required
      ])),
      course_type: new FormControl('', Validators.compose([
        Validators.required
      ])),
      category: new FormControl('', Validators.compose([
        Validators.required
      ])),
      course_code: new FormControl('', Validators.compose([
        Validators.required
      ])),
      target_group_type: new FormControl('', Validators.compose([
        Validators.required
      ])),
      target_group: new FormControl(Validators.compose([
        Validators.required
      ])),
      department: new FormControl('', Validators.compose([
        Validators.required
      ])),
      max_participant: new FormControl('', Validators.compose([
        Validators.required
      ])),
      venue: new FormControl('', Validators.compose([
        Validators.required
      ])),
      address: new FormControl('', Validators.compose([
        Validators.required
      ])),
      start_date: new FormControl('', Validators.compose([
        Validators.required
      ])),
      start_time: new FormControl('', Validators.compose([
        Validators.required
      ])),
      end_date: new FormControl('', Validators.compose([
        Validators.required
      ])),
      end_time: new FormControl('', Validators.compose([
        Validators.required
      ])),
      cost: new FormControl('', Validators.compose([
        Validators.required
      ])),
      duration_days: new FormControl('1', Validators.compose([
        Validators.required
      ])),
      speaker: new FormControl('', Validators.compose([
        // Validators.required
      ])),
      fasilitator: new FormControl('', Validators.compose([
        // Validators.required
      ])),
      attachment: new FormControl()
    })
  }

  // initData() {
  //   this.trainingCodeGroup = this.trainingCodeGroupService.groups
  //   this.trainingCodeClass = this.trainingCodeClassService.classes
  //   this.trainingCodeCategory = this.trainingCodeCategoryService.categories
  // }

  confirmSubmit() {
    this.trainingForm.controls['start_date'].setValue(moment(new Date(this.trainingForm.value.start_date)).format("YYYY-MM-DD"))
    this.trainingForm.controls['end_date'].setValue(moment(new Date(this.trainingForm.value.end_date)).format("YYYY-MM-DD"))
    swal.fire({
      title: "Pengesahan",
      text: "Adakah anda pasti untuk mendafar kursus ini?",
      type: "question",
      buttonsStyling: false,
      showCancelButton: true,
      confirmButtonClass: "btn btn-success",
      confirmButtonText: "Pasti",
      cancelButtonClass: "btn btn-danger",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.value) {
        this.register()
      }
    })
  }

  register() {
    // this.trainingForm.controls['full_name'].setValue()
    this.loadingBar.start()
    this.trainingService.create(this.trainingForm.value).subscribe(
      () => {
        this.successfulCreateMessage()
        this.loadingBar.complete()
      },
      () => {
        this.unsuccessfulCreateMessage()
        this.loadingBar.complete()
      },
      () => {
        this.trainingForm.reset()
        this.trainingService.get().subscribe()
      }
    )
  }

  // registerTraining() {
  //   this.trainingApplicationForm.value.start_date = moment(new Date(this.trainingApplicationForm.value.start_date)).format("YYYY-MM-DD")
  //   this.trainingApplicationForm.value.end_date = moment(new Date(this.trainingApplicationForm.value.end_date)).format("YYYY-MM-DD")
  //   this.trainingApplicationForm.value.organiser = this.organiserValue
  //   this.trainingApplicationForm.value.course_code = this.auto_course_code
  //   this.loadingBar.start()
  //   this.trainingService.create(this.trainingApplicationForm.value).subscribe(
  //     () => {
  //       this.successfulCreateMessage()
  //       this.loadingBar.complete()
  //     },
  //     () => {
  //       this.unsuccessfulCreateMessage()
  //       this.loadingBar.complete()
  //     },
  //     () => {
  //       this.trainingApplicationForm.reset()
  //       this.trainingService.get().subscribe()
  //     }
  //   )
  // }

  onOrganiserTypeChange() {
    if (this.trainingForm.value.organiser_type == 'DD') {
      console.log('DD')
      this.organisations.forEach(
        (organisation) => {
          if (organisation.shortname == 'MBPP') {
            this.trainingForm.controls['organiser'].setValue(organisation.id)
          }
        }
      )
      // this.trainingForm.value.organiser = 'MBPP'
      this.organiserValue = 'MBPP'
    }
  }

  onCategoryChange() {
    this.auto_course_code = this.trainingForm.value.category + '/1'
    this.trainingForm.value.course_code = this.auto_course_code
  }

  successfulCreateMessage() {
    let title = 'Berjaya'
    let message = 'Kursus telah ditambah'
    this.notifyService.openToastr(title, message)
  }

  unsuccessfulCreateMessage() {
    let title = 'Tidak berjaya'
    let message = 'Sila cuba sekali lagi'
    this.notifyService.openToastrHttp(title, message)
  }

}
