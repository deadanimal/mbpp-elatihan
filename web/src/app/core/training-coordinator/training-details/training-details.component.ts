import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { 
  FormBuilder, 
  FormControl, 
  FormGroup, 
  Validators 
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';


import { Core } from 'src/app/shared/services/cores/cores.model';
import { Organisation } from 'src/app/shared/services/organisations/organisations.model';
import { TrainingExtended } from 'src/app/shared/services/trainings/trainings.model';
import { User } from 'src/app/shared/services/users/users.model';
import { CoresService } from 'src/app/shared/services/cores/cores.service';
import { OrganisationsService } from 'src/app/shared/services/organisations/organisations.service';
import { TrainersService } from 'src/app/shared/services/trainers/trainers.service';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
import { UsersService } from 'src/app/shared/services/users/users.service';

import * as moment from 'moment';
import swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import { AttendanceExtended } from 'src/app/shared/services/attendances/attendances.model';
import { AbsenceMemoExtended } from 'src/app/shared/services/absence-memos/absence-memos.model';
import { Note } from 'src/app/shared/services/notes/notes.model';
import { ApplicationExtended } from 'src/app/shared/services/applications/applications.model';
import { NotesService } from 'src/app/shared/services/notes/notes.service';
import { Domain } from 'src/app/shared/services/domains/domains.model';
import { DomainsService } from 'src/app/shared/services/domains/domains.service';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-training-details',
  templateUrl: './training-details.component.html',
  styleUrls: ['./training-details.component.scss']
})
export class TrainingDetailsComponent implements OnInit {

  // Data
  trainingID
  training: TrainingExtended
  organisations: Organisation[] = []
  currentUser: User
  users: User[] = []
  cores: Core[] = []
  coresTemp: Core[] = []
  coresParentTemp = 'GN'
  applications: ApplicationExtended[] = []
  attendances: AttendanceExtended[] = []
  absences: AbsenceMemoExtended[] = []
  notes: Note[] = []
  domains: Domain[] = []

  // Form
  trainingForm: FormGroup
  noteForm: FormGroup

  // Choices
  organiserChoices = [
    { value: 'LL', text: 'Luaran' },
    { value: 'DD', text: 'Dalaman' }
  ]
  courseTypeChoices = [
    { value: 'BB', text: 'Bengkel' },
    { value: 'KK', text: 'Kursus' },
    { value: 'LK', text: 'Lawatan Kerja' },
    { value: 'PP', text: 'Persidangan' },
    { value: 'SP', text: 'Sesi Perjumpaan' },
    { value: 'SS', text: 'Seminar' },
    { value: 'TT', text: 'Taklimat' }
  ]
  targetGroupTypeChoices = [
    { value: 'TB', text: 'Terbuka' },
    { value: 'TH', text: 'Terhad' }
  ]
  methodChoices = [
    { value: 'BS', text: 'Bersemuka'},
    { value: 'TB', text: 'Tidak Bersemuka (online)'}
  ]
  countryChoices = [
    { value: 'DN', text: 'Dalam Negara'},
    { value: 'LN', text: 'Luar Negara'}
  ]
  statusChoices = [
    { value: 'DB', text: 'Dibuka'},
    { value: 'OT', text: 'Lain-lain'},
    { value: 'PN', text: 'Penuh'},
    { value: 'SL', text: 'Selesai'},
    { value: 'DT', text: 'Ditangguh'},
    { value: 'TN', text: 'Tangguh'}
  ]

  // Table
  SelectionType = SelectionType;
  tableMessages = { 
    emptyMessage: 'Tiada rekod dijumpai',
    totalMessage: 'rekod'
  }
  // Applications
  tableApplicationsEntries: number = 5
  tableApplicationsSelected: any[] = []
  tableApplicationsTemp = []
  tableApplicationsActiveRow: any
  tableApplicationsRows: any = []
  // Attendances
  tableAttendancesEntries: number = 5
  tableAttendancesSelected: any[] = []
  tableAttendancesTemp = []
  tableAttendancesActiveRow: any
  tableAttendancesRows: any = []
  // Absences
  tableAbsencesEntries: number = 5
  tableAbsencesSelected: any[] = []
  tableAbsencesTemp = []
  tableAbsencesActiveRow: any
  tableAbsencesRows: any = []
  // Notes
  tableNotesEntries: number = 5
  tableNotesSelected: any[] = []
  tableNotesTemp = []
  tableNotesActiveRow: any
  tableNotesRows: any = []
  
  // Checker
  isApplicationsEmpty: boolean = true
  isAttendancesEmpty: boolean = true
  isAbsencesEmpty: boolean = true
  isNotesEmpty: boolean = true

  // Icon
  iconEmpty = 'assets/img/icons/box.svg'

  // Datepicker
  dateToday: Date
  dateMinStart: Date
  dateMinEnd: Date
  dateStart: Date
  dateEnd: Date
  dateConfig = { 
    isAnimated: true, 
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-dark-blue' 
  }

  // Modal
  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered"
  };

  // File
  fileSize: any
  fileName: any
  fileSizeInformation = null
  fileNameInformation = null

  constructor(
    private coreService: CoresService,
    private domainService: DomainsService,
    private organisationService: OrganisationsService,
    private trainingService: TrainingsService,
    private noteService: NotesService,
    private trainerService: TrainersService,
    private userService: UsersService,
    private loadingBar: LoadingBarService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private notifyService: NotifyService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.trainingID = this.route.snapshot.queryParamMap.get('id')
    // console.log('Training ID', this.trainingID)
    if (!this.trainingID) {
      this.router.navigate(['/tc/trainings/summary'])
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
      this.navigatePage('/tc/trainings/summary')
    }
  }

  ngOnInit() {
  }

  getData() {
    this.loadingBar.start() 
    forkJoin([
      this.organisationService.getAll(),
      this.userService.getAll(),
      this.coreService.getAll(),
      this.trainingService.getOne(this.trainingID)
    ]).subscribe(
      () => {
        this.training = this.trainingService.trainingExtended
        this.applications = this.training['training_application']
        this.attendances = this.training['attendance']
        this.absences = this.training['training_absence_memo']
        this.notes = this.training['training_training_notes']
        this.loadingBar.complete() 
      },
      () => {
        this.loadingBar.complete() 
      },
      () => {
        console.log('Training> ', this.training)
        this.trainingForm.controls['title'].setValue(this.training['title'])
        this.trainingForm.controls['description'].setValue(this.training['description'])
        this.trainingForm.controls['method'].setValue(this.training['method'])
        this.trainingForm.controls['country'].setValue(this.training['country'])
        this.trainingForm.controls['organiser_type'].setValue(this.training['organiser_type'])
        this.trainingForm.controls['organiser'].setValue(this.training['organiser']['id'])
        this.trainingForm.controls['core'].setValue(this.training['core']['id'])
        this.trainingForm.controls['domain'].setValue(this.training['domain']['id'])
        this.trainingForm.controls['course_type'].setValue(this.training['course_type'])
        this.trainingForm.controls['course_code'].setValue(this.training['course_code'])
        this.trainingForm.controls['target_group_type'].setValue(this.training['target_group_type'])
        this.trainingForm.controls['is_group_KPP_A'].setValue(this.training['is_group_KPP_A'])
        this.trainingForm.controls['is_group_KPP_B'].setValue(this.training['is_group_KPP_B'])
        this.trainingForm.controls['is_group_KPP_C'].setValue(this.training['is_group_KPP_C'])
        this.trainingForm.controls['is_group_KP_A'].setValue(this.training['is_group_KP_A'])
        this.trainingForm.controls['is_group_KP_B'].setValue(this.training['is_group_KP_B'])
        this.trainingForm.controls['is_group_KP_C'].setValue(this.training['is_group_KP_C'])
        this.trainingForm.controls['is_department_PDB'].setValue(this.training['is_department_PDB'])
        this.trainingForm.controls['is_department_UUU'].setValue(this.training['is_department_UUU'])
        this.trainingForm.controls['is_department_UAD'].setValue(this.training['is_department_UAD'])
        this.trainingForm.controls['is_department_UPP'].setValue(this.training['is_department_UPP'])
        this.trainingForm.controls['is_department_UPS'].setValue(this.training['is_department_UPS'])
        this.trainingForm.controls['is_department_JKP'].setValue(this.training['is_department_JKP'])
        this.trainingForm.controls['is_department_JPD'].setValue(this.training['is_department_JPD'])
        this.trainingForm.controls['is_department_JPH'].setValue(this.training['is_department_JPH'])
        this.trainingForm.controls['is_department_JPP'].setValue(this.training['is_department_JPP'])
        this.trainingForm.controls['is_department_JKJ'].setValue(this.training['is_department_JKJ'])
        this.trainingForm.controls['is_department_JKB'].setValue(this.training['is_department_JKB'])
        this.trainingForm.controls['is_department_JKEA'].setValue(this.training['is_department_JKEA'])
        this.trainingForm.controls['is_department_JKEB'].setValue(this.training['is_department_JKEB'])
        this.trainingForm.controls['is_department_JPR'].setValue(this.training['is_department_JPR'])
        this.trainingForm.controls['is_department_JKK'].setValue(this.training['is_department_JKK'])
        this.trainingForm.controls['is_department_JKW'].setValue(this.training['is_department_JKW'])
        this.trainingForm.controls['is_department_JLK'].setValue(this.training['is_department_JLK'])
        this.trainingForm.controls['is_department_JPU'].setValue(this.training['is_department_JPU'])
        this.trainingForm.controls['is_department_JPB'].setValue(this.training['is_department_JPB'])
        this.trainingForm.controls['max_participant'].setValue(this.training['max_participant'])
        this.trainingForm.controls['venue'].setValue(this.training['venue'])
        this.trainingForm.controls['address'].setValue(this.training['address'])

        // console.log('Before ', moment(this.training['start_date']))
        this.trainingForm.controls['start_date'].setValue(moment(this.training['start_date']).format('DD-MM-YYYY'))
        // console.log('After ', this.trainingForm.controls['start_date'])

        this.trainingForm.controls['start_time'].setValue(this.training['start_time'])
        this.trainingForm.controls['end_date'].setValue(moment(this.training['end_date']).format('DD-MM-YYYY'))
        this.trainingForm.controls['end_time'].setValue(this.training['end_time'])
        this.trainingForm.controls['cost'].setValue(this.training['cost'])
        this.trainingForm.controls['status'].setValue(this.training['status'])
        this.trainingForm.controls['attachment'].setValue(this.training['attachment'])

        this.organisations = this.organisationService.organisations
        this.users = this.userService.users
        this.cores = this.coreService.cores
        this.domains = this.domainService.domains

        this.coresParentTemp = this.training['core']['parent']
        this.cores.forEach(
          (core: Core) => {
            if (this.training['core']['parent'] == core['parent']) {
              this.coresTemp.push(core)
            }
          }
        )

        this.noteForm.controls['training'].setValue(this.training['id'])
      }
    )
  }

  initForm() {
    this.trainingForm = this.formBuilder.group({
      title: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      description: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      method: new FormControl('BS', Validators.compose([
        Validators.required
      ])),
      country: new FormControl('DN', Validators.compose([
        Validators.required
      ])),
      organiser_type: new FormControl('DD', Validators.compose([
        Validators.required
      ])),
      organiser: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      core: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      domain: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      course_type: new FormControl('KK', Validators.compose([
        Validators.required
      ])),
      course_code: new FormControl({value: null, disabled: true}),
      target_group_type: new FormControl('TB', Validators.compose([
        Validators.required
      ])),
      is_group_KPP_A: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      is_group_KPP_B: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      is_group_KPP_C: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      is_group_KP_A: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      is_group_KP_B: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      is_group_KP_C: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      is_department_PDB: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      is_department_UUU: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      is_department_UAD: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      is_department_UPP: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      is_department_UPS: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      is_department_JKP: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      is_department_JPD: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      is_department_JPH: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      is_department_JPP: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      is_department_JKJ: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      is_department_JKB: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      is_department_JKEA: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      is_department_JKEB: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      is_department_JPR: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      is_department_JKK: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      is_department_JKW: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      is_department_JLK: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      is_department_JPU: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      is_department_JPB: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      max_participant: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      venue: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      address: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      start_date: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      start_time: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      end_date: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      end_time: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      status: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      cost: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      attachment: new FormControl(null),
      transportation: new FormControl(false, Validators.compose([
        Validators.required
      ]))
    })

    this.noteForm = this.formBuilder.group({
      training: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      title: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      note_code: new FormControl(null),
      note_file: new FormControl(null, Validators.compose([
        Validators.required
      ]))
    })

    this.trainingForm.controls['is_group_KPP_A'].patchValue(true)
    this.trainingForm.controls['is_group_KPP_B'].patchValue(true)
    this.trainingForm.controls['is_group_KPP_C'].patchValue(true)
    this.trainingForm.controls['is_group_KP_A'].patchValue(true)
    this.trainingForm.controls['is_group_KP_B'].patchValue(true)
    this.trainingForm.controls['is_group_KP_C'].patchValue(true)
    this.trainingForm.controls['is_department_PDB'].patchValue(true)
    this.trainingForm.controls['is_department_UUU'].patchValue(true)
    this.trainingForm.controls['is_department_UAD'].patchValue(true)
    this.trainingForm.controls['is_department_UPP'].patchValue(true)
    this.trainingForm.controls['is_department_UPS'].patchValue(true)
    this.trainingForm.controls['is_department_JKP'].patchValue(true)
    this.trainingForm.controls['is_department_JPD'].patchValue(true)
    this.trainingForm.controls['is_department_JPH'].patchValue(true)
    this.trainingForm.controls['is_department_JPP'].patchValue(true)
    this.trainingForm.controls['is_department_JKJ'].patchValue(true)
    this.trainingForm.controls['is_department_JKB'].patchValue(true)
    this.trainingForm.controls['is_department_JKEA'].patchValue(true)
    this.trainingForm.controls['is_department_JKEB'].patchValue(true)
    this.trainingForm.controls['is_department_JPR'].patchValue(true)
    this.trainingForm.controls['is_department_JKK'].patchValue(true)
    this.trainingForm.controls['is_department_JKW'].patchValue(true)
    this.trainingForm.controls['is_department_JLK'].patchValue(true)
    this.trainingForm.controls['is_department_JPU'].patchValue(true)
    this.trainingForm.controls['is_department_JPB'].patchValue(true)

    // while (!this.isLogged) {
    //   this.currentUser = this.authService.userDetail
    //   if (this.currentUser) {
    //     this.trainingForm.controls['created_by'].setValue(this.currentUser['id'])
    //     this.isLogged = true
    //   }
    //   console.log('asfqw ', this.currentUser)
    // }
    
    // let todayDate = new Date()
    // let startDate = moment(new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 1)).format('DD-MM-YYYY')
    // let endDate = moment(new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 2)).format('DD-MM-YYYY')
    // this.trainingForm.controls['start_date'].setValue(startDate)
    // this.trainingForm.controls['end_date'].setValue(endDate)
  }

  onChangeCoreParent(value) {
    if (value == 'GN') {
      this.coresTemp = []
      this.cores.forEach(
        (core: Core) => {
          if (core['parent'] == 'GN') {
            this.coresTemp.push(core)
          }
        }
      )
    }
    else if (value == 'FN') {
      this.coresTemp = []
      this.cores.forEach(
        (core: Core) => {
          if (core['parent'] == 'FN') {
            this.coresTemp.push(core)
          }
        }
      )
    }
  }

  onChangeOrganiserType(value) {
    if (value == 'DD') {
      this.organisations.forEach(
        (organisation) => {
          if (organisation['shortname'] == 'MBPP') {
            this.trainingForm.controls['organiser'].setValue(organisation['id'])
            // console.log('Type found D: ', organisation['shortname'])
          }
        }
      )
    }
    else if (value == 'LL') {
      this.trainingForm.controls['organiser'].setValue(this.organisations[0]['id'])
      // console.log('Type found L: ', this.organisations[0]['id'])
    }
  }

  onChangeOrganiser(value) {
    let isDD = false
    this.organisations.forEach(
      (organisation) => {
        if (organisation['shortname'] == 'MBPP') {
          if (organisation['id'] == value) {
            this.trainingForm.controls['organiser_type'].setValue('DD')
            isDD = true
          }
          else if (isDD == false) {
            this.trainingForm.controls['organiser_type'].setValue('LL')
          }
        }
      }
    )
  }

  confirm() {
    // Date YYYY-MM-DD
    // Time hh:mm[:ss[.uuuuuu]]

    // console.log('Before ', this.trainingForm.value)
    let startDate = moment(this.trainingForm.value.start_date, 'DD-MM-YYY').format('YYYY-MM-DD')
    let endDate = moment(this.trainingForm.value.end_date, 'DD-MM-YYY').format('YYYY-MM-DD')
    this.trainingForm.controls['start_date'].setValue(startDate)
    this.trainingForm.controls['end_date'].setValue(endDate)
    // console.log('After ', this.trainingForm.value)

    swal.fire({
      title: 'Pengesahan',
      text: 'Anda pasti untuk mengemaskini latihan ini?',
      type: 'info',
      buttonsStyling: false,
      showCancelButton: true,
      confirmButtonClass: 'btn btn-info',
      confirmButtonText: 'Pasti',
      cancelButtonClass: 'btn btn-outline-info',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.value) {
        this.patch()
      }
    })
  }

  patch() {
    this.loadingBar.start()
    let infoTitle = 'Sedang proses'
    let infoMessage = 'Latihan sedang ditambah'
    this.notifyService.openToastrInfo(infoTitle, infoMessage)
    // console.log('add training')
    // console.log('Trainining: ', this.trainingForm.value)
    // console.log('Speaker ', this.trainerSpeakerForm.value)
    // console.log('Faci ', this.trainerFacilitatorForm.value)
    // console.log('Speaker Ar ', this.trainerSpeakerFormArray)
    // console.log('Faci Ar ', this.trainerFacilitatorFormArray)

    this.loadingBar.complete()

    this.trainingService.update(this.training['id'], this.trainingForm.value).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        let title = 'Tidak berjaya'
        let message = 'Anda tidak berjaya untuk mengemaskini latihan. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        let title = 'Berjaya'
        let message = 'Latihan berjaya dikemaskini.'
        this.notifyService.openToastr(title, message)
        this.getData()
        // this.addTrainer()
        // this.success()
      }
    )
  }

  onChangeTargetType(event) {
    if (event == 'TB') {
      this.trainingForm.controls['is_group_KPP_A'].patchValue(true)
      this.trainingForm.controls['is_group_KPP_B'].patchValue(true)
      this.trainingForm.controls['is_group_KPP_C'].patchValue(true)
      this.trainingForm.controls['is_group_KP_A'].patchValue(true)
      this.trainingForm.controls['is_group_KP_B'].patchValue(true)
      this.trainingForm.controls['is_group_KP_C'].patchValue(true)
      this.trainingForm.controls['is_department_PDB'].patchValue(true)
      this.trainingForm.controls['is_department_UUU'].patchValue(true)
      this.trainingForm.controls['is_department_UAD'].patchValue(true)
      this.trainingForm.controls['is_department_UPP'].patchValue(true)
      this.trainingForm.controls['is_department_UPS'].patchValue(true)
      this.trainingForm.controls['is_department_JKP'].patchValue(true)
      this.trainingForm.controls['is_department_JPD'].patchValue(true)
      this.trainingForm.controls['is_department_JPH'].patchValue(true)
      this.trainingForm.controls['is_department_JPP'].patchValue(true)
      this.trainingForm.controls['is_department_JKJ'].patchValue(true)
      this.trainingForm.controls['is_department_JKB'].patchValue(true)
      this.trainingForm.controls['is_department_JKEA'].patchValue(true)
      this.trainingForm.controls['is_department_JKEB'].patchValue(true)
      this.trainingForm.controls['is_department_JPR'].patchValue(true)
      this.trainingForm.controls['is_department_JKK'].patchValue(true)
      this.trainingForm.controls['is_department_JKW'].patchValue(true)
      this.trainingForm.controls['is_department_JLK'].patchValue(true)
      this.trainingForm.controls['is_department_JPU'].patchValue(true)
      this.trainingForm.controls['is_department_JPB'].patchValue(true)
    }
    else {
      this.trainingForm.controls['is_group_KPP_A'].patchValue(false)
      this.trainingForm.controls['is_group_KPP_B'].patchValue(false)
      this.trainingForm.controls['is_group_KPP_C'].patchValue(false)
      this.trainingForm.controls['is_group_KP_A'].patchValue(false)
      this.trainingForm.controls['is_group_KP_B'].patchValue(false)
      this.trainingForm.controls['is_group_KP_C'].patchValue(false)
      this.trainingForm.controls['is_department_PDB'].patchValue(false)
      this.trainingForm.controls['is_department_UUU'].patchValue(false)
      this.trainingForm.controls['is_department_UAD'].patchValue(false)
      this.trainingForm.controls['is_department_UPP'].patchValue(false)
      this.trainingForm.controls['is_department_UPS'].patchValue(false)
      this.trainingForm.controls['is_department_JKP'].patchValue(false)
      this.trainingForm.controls['is_department_JPD'].patchValue(false)
      this.trainingForm.controls['is_department_JPH'].patchValue(false)
      this.trainingForm.controls['is_department_JPP'].patchValue(false)
      this.trainingForm.controls['is_department_JKJ'].patchValue(false)
      this.trainingForm.controls['is_department_JKB'].patchValue(false)
      this.trainingForm.controls['is_department_JKEA'].patchValue(false)
      this.trainingForm.controls['is_department_JKEB'].patchValue(false)
      this.trainingForm.controls['is_department_JPR'].patchValue(false)
      this.trainingForm.controls['is_department_JKK'].patchValue(false)
      this.trainingForm.controls['is_department_JKW'].patchValue(false)
      this.trainingForm.controls['is_department_JLK'].patchValue(false)
      this.trainingForm.controls['is_department_JPU'].patchValue(false)
      this.trainingForm.controls['is_department_JPB'].patchValue(false)
    }
  }

  entriesChange(type, $event) {
    if (type == 'applications') {
      this.tableApplicationsEntries = $event.target.value;
    }
    else if (type == 'attendances') {
      this.tableAttendancesEntries = $event.target.value;
    }
    else if (type == 'absences') {
      this.tableAbsencesEntries = $event.target.value;
    }
    else if (type == 'notes') {
      this.tableNotesEntries = $event.target.value;
    }
  }

  filterTable(type, $event) {
    let val = $event.target.value.toLowerCase();
    
    if (type == 'applications') {
      this.tableApplicationsTemp = this.tableApplicationsRows.filter(function(d) {
        return d.applicant.toLowerCase().indexOf(val) !== -1 || !val;
      });
    }
    else if (type == 'attendances') {
      this.tableApplicationsTemp = this.tableApplicationsRows.filter(function(d) {
        return d.attendee.full_name.toLowerCase().indexOf(val) !== -1 || !val;
      });
    }
    else if (type == 'absences') {
      this.tableAbsencesTemp = this.tableAbsencesRows.filter(function(d) {
        return d.attendee.full_name.toLowerCase().indexOf(val) !== -1 || !val;
      });
    }
    else if (type == 'notes') {
      this.tableApplicationsTemp = this.tableApplicationsRows.filter(function(d) {
        return d.title.toLowerCase().indexOf(val) !== -1 || !val;
      });
    }
  }

  onSelect(type, { selected }) {
    if (type == 'applications') {
      this.tableApplicationsSelected.splice(0, this.tableApplicationsSelected.length);
      this.tableApplicationsSelected.push(...selected);
    }
    else if (type == 'attendances') {
      this.tableAttendancesSelected.splice(0, this.tableAttendancesSelected.length);
      this.tableAttendancesSelected.push(...selected);
    }
    else if (type == 'absences') {
      this.tableAbsencesSelected.splice(0, this.tableAbsencesSelected.length);
      this.tableAbsencesSelected.push(...selected);
    }
    else if (type == 'notes') {
      this.tableNotesSelected.splice(0, this.tableNotesSelected.length);
      this.tableNotesSelected.push(...selected);
    }
  }

  onActivate(type, event) {
    if (type == 'applications') {
      this.tableApplicationsActiveRow = event.row;
    }
    else if (type == 'attendances') {
      this.tableAttendancesActiveRow = event.row;
    }
    else if (type == 'absences') {
      this.tableAbsencesActiveRow = event.row;
    }
    else if (type == 'notes') {
      this.tableNotesActiveRow = event.row;
    }
  }

  openModal(modalRef: TemplateRef<any>) {
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  closeModal(type) {
    this.modal.hide()
    if (type == 'notes') {
      this.noteForm.reset()
    }
  }

  addNote() {
    this.loadingBar.start()
    let infoTitle = 'Sedang proses'
    let infoMessage = 'Nota sedang ditambah'
    this.notifyService.openToastrInfo(infoTitle, infoMessage)
    this.noteService.post(this.noteForm.value).subscribe(
      () => {
        this.loadingBar.complete()
        let successTitle = 'Berjaya'
        let successMessage = 'Latihan berjaya ditambah'
        this.notifyService.openToastr(successTitle, successMessage)
      },
      () => {
        this.loadingBar.complete()
        let failedTitle = 'Tidak Berjaya'
        let failedMessage = 'Latihan tidak berjaya ditambah. Sila cuba sekali lagi'
        this.notifyService.openToastr(failedTitle, failedMessage)
      },
      () => {
        this.getData()
      }
    )
  }

  onFileChange(event, type) {
    let reader = new FileReader();
    this.fileSize = event.target.files[0].size
    this.fileName = event.target.files[0].name
    
    if (
      event.target.files && 
      event.target.files.length &&
      this.fileSize < 5000000
    ) {
      
      
      const [file] = event.target.files;
      reader.readAsDataURL(file)
      // readAsDataURL(file);
      // console.log(event.target)
      // console.log(reader)
      
      
      reader.onload = () => {
        // console.log(reader['result'])
        if (type == 'notes') {
          this.noteForm.controls['note_file'].setValue(reader.result)
          this.fileSizeInformation = this.fileSize
          this.fileNameInformation = this.fileName
        }
        // console.log(this.registerForm.value)
        // console.log('he', this.registerForm.valid)
        // console.log(this.isAgree)
        // !registerForm.valid || !isAgree
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

  removeFile(type) {
    if (type == 'notes') {
     this.fileSize = 0;
     this.fileName = null;
     this.noteForm.value['note_file'] = null;
     this.fileSizeInformation = null
     this.fileNameInformation = null
     //this.cd.markForCheck();
     //this.cd.detectChanges();
   }
    this.fileName = null
    this.fileSize = null
  }

  downloadNote(row) {
    let url = row['note_file']
    window.open(url, '_blank');
  }

  verifyAbsence(row) {

  }

  verifyAttendance(row) {

  }

  approveApplication(row) {
    
  }

  navigatePage(path: string) {
    // console.log(path)
    this.router.navigate([path])
  }
  

}
