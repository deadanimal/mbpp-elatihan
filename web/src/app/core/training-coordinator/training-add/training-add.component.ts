import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { 
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators 
} from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Training, TrainingType } from 'src/app/shared/services/trainings/trainings.model';
import { Router } from '@angular/router';

import swal from 'sweetalert2';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { OrganisationsService } from 'src/app/shared/services/organisations/organisations.service';
import { Organisation } from 'src/app/shared/services/organisations/organisations.model';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { User } from 'src/app/shared/services/users/users.model';
import { Core } from 'src/app/shared/services/cores/cores.model';
import { forkJoin } from 'rxjs';
import { CoresService } from 'src/app/shared/services/cores/cores.service';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { TrainersService } from 'src/app/shared/services/trainers/trainers.service';
import { Trainer } from 'src/app/shared/services/trainers/trainers.model';
import { DomainsService } from 'src/app/shared/services/domains/domains.service';
import { Domain } from 'src/app/shared/services/domains/domains.model';
import { QuillViewHTMLComponent } from 'ngx-quill';

@Component({
  selector: 'app-training-add',
  templateUrl: './training-add.component.html',
  styleUrls: ['./training-add.component.scss']
})
export class TrainingAddComponent implements OnInit {

  // Data
  training: Training
  organisations: Organisation[] = []
  currentUser: User
  users: User[] = []
  cores: Core[] = []
  coresTemp: Core[] = []
  coresParentTemp = 'GN'
  domains: Domain[] = []
  nextCode: string = ''
  trainingTypes: TrainingType[] = []

  // Form
  trainingForm: FormGroup
  organisationForm: FormGroup
  typeForm: FormGroup
  trainerSpeakerForm: FormGroup
  trainerFacilitatorForm: FormGroup
  trainerSpeakerFormArray: FormArray
  trainerFacilitatorFormArray: FormArray

  trainingFormMessages = {
    'title': [
      { type: 'required', message: 'Diperlukan' }
    ],
    'description': [
      { type: 'required', message: 'Diperlukan' }
    ],
    'method': [
      { type: 'required', message: 'Diperlukan' }
    ],
    'country': [
      { type: 'required', message: 'Diperlukan' }
    ],
    'organiser_type': [
      { type: 'required', message: 'Diperlukan' }
    ],
    'organiser': [
      { type: 'required', message: 'Diperlukan' }
    ],
    'core': [
      { type: 'required', message: 'Diperlukan' }
    ],
    'domain': [
      { type: 'required', message: 'Diperlukan' }
    ],
    'training_type': [
      { type: 'required', message: 'Diperlukan' }
    ],
    'target_group_type': [
      { type: 'required', message: 'Diperlukan' }
    ],
    'max_participant': [
      { type: 'required', message: 'Diperlukan' }
    ],
    'venue': [
      { type: 'required', message: 'Diperlukan' }
    ],
    'start_date': [
      { type: 'required', message: 'Diperlukan' }
    ],
    'start_time': [
      { type: 'required', message: 'Diperlukan' }
    ],
    'end_date': [
      { type: 'required', message: 'Diperlukan' }
    ],
    'end_time': [
      { type: 'required', message: 'Diperlukan' }
    ],
    'cost': [
      { type: 'required', message: 'Diperlukan' }
    ]
  }

  // Stepper
  isLinear = false
  isDisableRipple = true
  labelPosition = 'bottom'

  // Choices { value: '', text: '' }
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
  // statusTypeChoices = [
  //   { value: 'DB', text: 'Dibuka' },
  //   { value: 'DT', text: 'Ditutup' },
  //   { value: 'PN', text: 'Penuh' },
  //   { value: 'TN', text: 'Tangguh' }
  // ]

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

  // Checker
  isLogged: boolean = false

  // File
  fileSize: any
  fileName: any
  fileSizeInformationAttachment = null
  fileNameInformationAttachment = null
  fileSizeInformationAttachmentApproval = null
  fileNameInformationAttachmentApproval = null

  // Quill
  @ViewChild('scheduleNotes', {
    static: true
  }) headerEN: QuillViewHTMLComponent

  constructor(
    private authService: AuthService,
    private coreService: CoresService,
    private domainService: DomainsService,
    private organisationService: OrganisationsService,
    private trainingService: TrainingsService,
    private trainerService: TrainersService,
    private userService: UsersService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private loadingBar: LoadingBarService,
    private modalService: BsModalService,
    private notifyService: NotifyService,
    private router: Router
  ) { 
    this.getData()
  }

  ngOnInit() {
    this.initForm()
  }
  

  getData() {
    this.dateToday = new Date()
    // this.dateMinStart = new Date(this.dateToday.getFullYear(), this.dateToday.getMonth(), this.dateToday.getDate() + 1)
    // this.dateMinEnd = new Date(this.dateToday.getFullYear(), this.dateToday.getMonth(), this.dateToday.getDate() + 2)

    this.loadingBar.start()
    forkJoin([
      this.organisationService.getAll(),
      this.userService.getAll(),
      this.coreService.getAll(),
      this.authService.getDetailByToken(),
      this.domainService.getDomains(),
      this.trainingService.getNextCode(),
      this.trainingService.getTrainingTypes()
    ]).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.organisations = this.organisationService.organisations
        this.users = this.userService.users
        this.cores = this.coreService.cores
        this.currentUser = this.authService.userDetail
        this.domains = this.domainService.domains
        this.nextCode = this.trainingService.trainingNextCode
        this.trainingTypes = this.trainingService.trainingTypes
        this.trainingForm.controls['created_by'].setValue(this.currentUser['id'])

        this.trainingTypes.forEach(
          (type_) => {
            if (
              type_['active'] &&
              !this.trainingForm.value['training_type']
            ) {
              this.trainingForm.controls['training_type'].setValue(type_['id'])
            }
          }
        )

        this.domains.forEach(
          (domain_) => {
            if (
              domain_['active'] &&
              !this.trainingForm.value['domain']
            ) {
              this.trainingForm.controls['domain'].setValue(domain_['id'])
            }
          }
        )
        
        this.cores.forEach(
          (core: Core) => {
            if (
              core['parent'] == 'GN' &&
              core['active']
            ) {
              this.coresTemp.push(core)
              if (!this.trainingForm.value['core']) {
                this.trainingForm.controls['core'].setValue(core['id'])
              }
            }
          }
        )

        this.organisations.forEach(
          (organisation) => {
            if (organisation['shortname'] == 'MBPP') {
              this.trainingForm.controls['organiser'].setValue(organisation['id'])
            }
          }
        )
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
      training_type: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      course_code: new FormControl({value: null, disabled: true}),
      target_group_type: new FormControl('TB', Validators.compose([
        Validators.required
      ])),
      is_group_KP_A: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_group_KP_B: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_group_KP_C: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_group_KP_D: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_11: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_15: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_21: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_31: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_41: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_45: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_47: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_51: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_55: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_61: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_63: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_71: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_81: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_86: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_90: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_91: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_92: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_93: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_94: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_01: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_02: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_03: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_04: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_05: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_06: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_07: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_08: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_09: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_10: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_11: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_12: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_13: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_14: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_15: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_16: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_17: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_18: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_19: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_20: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_21: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_22: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_23: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_24: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_25: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_26: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_27: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_28: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_29: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_30: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_31: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_32: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_33: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_34: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_35: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_36: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_37: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_38: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_39: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_40: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_41: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_42: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_43: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_44: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_45: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_46: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_47: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_48: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_49: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_50: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_51: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_52: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_53: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_54: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_55: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_60: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ba19: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_fa29: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_fa32: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_fa41: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_fa44: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_fa48: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ft19: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ga17: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ga19: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ga22: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ga26: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ga29: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ga32: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ga41: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_gv41: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ha11: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ha14: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ha16: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ha19: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ha22: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ja19: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ja22: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ja29: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ja36: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ja38: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ja40: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ja41: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ja44: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ja48: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ja52: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ja54: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_kp11: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_kp14: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_kp19: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_kp22: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_kp29: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_kp32: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_kp41: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_la29: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_la41: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_la44: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_la52: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_la54: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na01: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na11: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na14: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na17: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na19: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na22: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na26: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na29: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na30: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na32: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na36: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na41: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na44: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na48: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na52: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na54: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ra01: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ra03: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ua11: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ua14: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ua17: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ua19: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ua24: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ua29: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ua32: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ua36: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ua41: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ud43: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ud48: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ud52: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_vu06: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_vu07: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_wa17: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_wa19: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_wa22: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_wa26: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_wa28: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_wa29: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_wa32: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_wa36: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_wa41: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_wa44: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_wa48: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_wa52: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_wa54: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_waa41: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_waa44: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      max_participant: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      venue: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      address: new FormControl(null),
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
      schedule_notes: new FormControl(null),
      cost: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      attachment: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      attachment_approval: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      transportation: new FormControl(false, Validators.compose([
        Validators.required
      ])),
      created_by: new FormControl(null, Validators.compose([
        Validators.required
      ]))
    })

    this.organisationForm = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required
      ])),
      shortname: new FormControl('', Validators.compose([
        Validators.required
      ]))
    })

    this.typeForm = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required
      ]))
    })

    this.trainerSpeakerForm = this.formBuilder.group({
      trainerSpeakerFormArray: this.formBuilder.array([this.initSpeakerForm()])
    })

    this.trainerFacilitatorForm = this.formBuilder.group({
      trainerFacilitatorFormArray: this.formBuilder.array([this.initFacilitatorForm()])
    })
  }

  initSpeakerForm() {
    return this.formBuilder.group({
      name: new FormControl(null),
      phone: new FormControl(null),
      training: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      trainer_type: new FormControl('SP', Validators.compose([
        Validators.required
      ]))
    })
  }

  initFacilitatorForm() {
    return this.formBuilder.group({
      name: new FormControl(null),
      phone: new FormControl(null),
      training: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      trainer_type: new FormControl('FC', Validators.compose([
        Validators.required
      ]))
    })
  }

  addSpeaker() {
    this.trainerSpeakerFormArray = this.trainerSpeakerForm.get('trainerSpeakerFormArray') as FormArray
    this.trainerSpeakerFormArray.push(this.initSpeakerForm())
  }

  removeSpeaker(ind: number) {
    this.trainerSpeakerFormArray.removeAt(ind)
  }

  addFacilitator() {
    this.trainerFacilitatorFormArray = this.trainerFacilitatorForm.get('trainerFacilitatorFormArray') as FormArray
    this.trainerFacilitatorFormArray.push(this.initFacilitatorForm())
  }

  removeFacilitator(ind: number) {
    this.trainerFacilitatorFormArray.removeAt(ind)
  }

  onChangeCoreParent(value) {
    if (value == 'GN') {
      this.coresTemp = []
      this.cores.forEach(
        (core: Core) => {
          if (
            core['parent'] == 'GN' &&
            core['active']
          ) {
            this.coresTemp.push(core)
          }
        }
      )
    }
    else if (value == 'FN') {
      this.coresTemp = []
      this.cores.forEach(
        (core: Core) => {
          if (
            core['parent'] == 'FN' &&
            core['active']
          ) {
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

    let startDate = moment(this.trainingForm.value.start_date).format('YYYY-MM-DD')
    let endDate = moment(this.trainingForm.value.end_date).format('YYYY-MM-DD')
    this.trainingForm.controls['start_date'].setValue(startDate)
    this.trainingForm.controls['end_date'].setValue(endDate)

    // console.log(this.trainingForm.value)
    swal.fire({
      title: 'Pengesahan',
      text: 'Anda pasti untuk mendaftar latihan ini?',
      type: 'info',
      buttonsStyling: false,
      showCancelButton: true,
      confirmButtonClass: 'btn btn-info',
      confirmButtonText: 'Pasti',
      cancelButtonClass: 'btn btn-outline-info',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.value) {
        this.add()
      }
    })
  }

  add() {
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

    const trainingFormData = new FormData()
    let trainingFormDataKey = []
    for (let key in this.trainingForm.value) {
      trainingFormDataKey.push(key)
    }
    trainingFormDataKey.forEach(
      (key) => {
        trainingFormData.append(key, this.trainingForm.value[key])
      }
    )

    this.loadingBar.complete()
    this.trainingService.post(trainingFormData).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        let title = 'Tidak berjaya'
        let message = 'Anda tidak berjaya untuk menambah latihan. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        let title = 'Berjaya'
        let message = 'Latihan berjaya ditambah.'
        this.notifyService.openToastr(title, message)
        if (
          this.trainerSpeakerForm.value.trainerSpeakerFormArray ||
          this.trainerFacilitatorForm.value.trainerFacilitatorFormArray
        ) {
          this.addTrainer()
        }
        // this.success()
      }
    )
  }

  addTrainer() {
    let trainingID = this.trainingService.training['id']
    let infoTitle = 'Sedang proses'
    let infoMessageSpeaker = 'Penceramah sedang ditambah'
    let infoMessageFacilitator = 'Fasilitator sedang ditambah'

    if (this.trainerSpeakerForm.value.trainerSpeakerFormArray) {
      this.loadingBar.start()
      this.notifyService.openToastrInfo(infoTitle, infoMessageSpeaker)
      this.trainerSpeakerForm.value.trainerSpeakerFormArray.forEach(
        (speakerForm) => {
          speakerForm['training'] = trainingID
          this.trainerService.create(speakerForm).subscribe(
            () => {
              this.loadingBar.complete()
            },
            () => {
              this.loadingBar.complete()
            },
            () => {}
          )
        }
      )
    }

    if (this.trainerFacilitatorForm.value.trainerFacilitatorFormArray) {
      this.loadingBar.start()
      this.notifyService.openToastrInfo(infoTitle, infoMessageFacilitator)
      this.trainerFacilitatorForm.value.trainerFacilitatorFormArray.forEach(
        (facilitatorForm) => {
          facilitatorForm['training'] = trainingID
          this.trainerService.create(facilitatorForm).subscribe(
            () => {
              this.loadingBar.complete()
            },
            () => {
              this.loadingBar.complete()
            },
            () => {}
          )
        }
      )
    }

    this.trainingForm.reset()
    this.navigatePage('/tc/trainings/summary')
  }


  success() {
    swal.fire({
      title: 'Berjaya',
      text: 'Latihan telah ditambah. Tambah lagi?',
      type: 'success',
      buttonsStyling: false,
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      confirmButtonText: 'Tambah',
      cancelButtonClass: 'btn btn-success-info',
      cancelButtonText: 'Tidak'
    }).then((result) => {
      if (result.value) {
        this.trainingForm.reset()
      }
      else {
        this.navigatePage('/tc/trainings/summary')
      }
    })
  }

  failed() {
    swal.fire({
      title: 'Tidak berjaya',
      text: 'Latihan tidak berjaya ditambah. Sila cuba sekali lagi.',
      type: 'warning',
      buttonsStyling: false,
      showCancelButton: true,
      confirmButtonClass: 'btn btn-warning',
      confirmButtonText: 'Tambah',
      cancelButtonClass: 'btn btn-warning-info',
      cancelButtonText: 'Tidak'
    }).then((result) => {
      if (result.value) {
        // this.trainingForm.reset()
      }
      else {
        this.trainingForm.reset()
        this.navigatePage('/tc/trainings/summary')
      }
    })
  }
  
  openModal(modalRef: TemplateRef<any>) {
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  closeModal() {
    this.modal.hide()
    this.organisationForm.reset()
  }

  addOrganisation() {
    // console.log('masuk')
    this.loadingBar.start()
    this.organisationService.post(this.organisationForm.value).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        let title = 'Tidak berjaya'
        let message = 'Anda tidak berjaya untuk menambah penganjur. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        let title = 'Berjaya'
        let message = 'Penganjur berjaya ditambah.'
        this.notifyService.openToastr(title, message)
        this.getData()
        this.organisationForm.reset()
        // this.successOrganisation()
        this.closeModal()
      }
    )
  }

  addType() {
    // console.log('masuk')
    this.loadingBar.start()
    this.trainingService.createTrainingType(this.typeForm.value).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        let title = 'Tidak berjaya'
        let message = 'Anda tidak berjaya untuk menambah jenis latihan. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        let title = 'Berjaya'
        let message = 'Jenis latihan berjaya ditambah.'
        this.notifyService.openToastr(title, message)
        this.getData()
        this.organisationForm.reset()
        // this.successOrganisation()
        this.closeModal()
      }
    )
  }

  successOrganisation () {
    swal.fire({
      title: 'Berjaya',
      text: 'Organisasi telah ditambah',
      type: 'success',
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-success',
      confirmButtonText: 'Tambah'
    })
  }

  onChangeTargetType(event) {
    if (event == 'TB') {
      this.trainingForm.controls['is_group_KP_A'].patchValue(true)
      this.trainingForm.controls['is_group_KP_B'].patchValue(true)
      this.trainingForm.controls['is_group_KP_C'].patchValue(true)
      this.trainingForm.controls['is_group_KP_D'].patchValue(true)
      this.trainingForm.controls['is_department_11'].patchValue(true)
      this.trainingForm.controls['is_department_15'].patchValue(true)
      this.trainingForm.controls['is_department_21'].patchValue(true)
      this.trainingForm.controls['is_department_31'].patchValue(true)
      this.trainingForm.controls['is_department_41'].patchValue(true)
      this.trainingForm.controls['is_department_45'].patchValue(true)
      this.trainingForm.controls['is_department_47'].patchValue(true)
      this.trainingForm.controls['is_department_51'].patchValue(true)
      this.trainingForm.controls['is_department_55'].patchValue(true)
      this.trainingForm.controls['is_department_61'].patchValue(true)
      this.trainingForm.controls['is_department_63'].patchValue(true)
      this.trainingForm.controls['is_department_71'].patchValue(true)
      this.trainingForm.controls['is_department_81'].patchValue(true)
      this.trainingForm.controls['is_department_86'].patchValue(true)
      this.trainingForm.controls['is_department_90'].patchValue(true)
      this.trainingForm.controls['is_department_91'].patchValue(true)
      this.trainingForm.controls['is_department_92'].patchValue(true)
      this.trainingForm.controls['is_department_93'].patchValue(true)
      this.trainingForm.controls['is_department_94'].patchValue(true)
      this.trainingForm.controls['is_position_01'].patchValue(true)
      this.trainingForm.controls['is_position_02'].patchValue(true)
      this.trainingForm.controls['is_position_03'].patchValue(true)
      this.trainingForm.controls['is_position_04'].patchValue(true)
      this.trainingForm.controls['is_position_05'].patchValue(true)
      this.trainingForm.controls['is_position_06'].patchValue(true)
      this.trainingForm.controls['is_position_07'].patchValue(true)
      this.trainingForm.controls['is_position_08'].patchValue(true)
      this.trainingForm.controls['is_position_09'].patchValue(true)
      this.trainingForm.controls['is_position_10'].patchValue(true)
      this.trainingForm.controls['is_position_11'].patchValue(true)
      this.trainingForm.controls['is_position_12'].patchValue(true)
      this.trainingForm.controls['is_position_13'].patchValue(true)
      this.trainingForm.controls['is_position_14'].patchValue(true)
      this.trainingForm.controls['is_position_15'].patchValue(true)
      this.trainingForm.controls['is_position_16'].patchValue(true)
      this.trainingForm.controls['is_position_17'].patchValue(true)
      this.trainingForm.controls['is_position_18'].patchValue(true)
      this.trainingForm.controls['is_position_19'].patchValue(true)
      this.trainingForm.controls['is_position_20'].patchValue(true)
      this.trainingForm.controls['is_position_21'].patchValue(true)
      this.trainingForm.controls['is_position_22'].patchValue(true)
      this.trainingForm.controls['is_position_23'].patchValue(true)
      this.trainingForm.controls['is_position_24'].patchValue(true)
      this.trainingForm.controls['is_position_25'].patchValue(true)
      this.trainingForm.controls['is_position_26'].patchValue(true)
      this.trainingForm.controls['is_position_27'].patchValue(true)
      this.trainingForm.controls['is_position_28'].patchValue(true)
      this.trainingForm.controls['is_position_29'].patchValue(true)
      this.trainingForm.controls['is_position_30'].patchValue(true)
      this.trainingForm.controls['is_position_31'].patchValue(true)
      this.trainingForm.controls['is_position_32'].patchValue(true)
      this.trainingForm.controls['is_position_33'].patchValue(true)
      this.trainingForm.controls['is_position_34'].patchValue(true)
      this.trainingForm.controls['is_position_35'].patchValue(true)
      this.trainingForm.controls['is_position_36'].patchValue(true)
      this.trainingForm.controls['is_position_37'].patchValue(true)
      this.trainingForm.controls['is_position_38'].patchValue(true)
      this.trainingForm.controls['is_position_39'].patchValue(true)
      this.trainingForm.controls['is_position_40'].patchValue(true)
      this.trainingForm.controls['is_position_41'].patchValue(true)
      this.trainingForm.controls['is_position_42'].patchValue(true)
      this.trainingForm.controls['is_position_43'].patchValue(true)
      this.trainingForm.controls['is_position_44'].patchValue(true)
      this.trainingForm.controls['is_position_45'].patchValue(true)
      this.trainingForm.controls['is_position_46'].patchValue(true)
      this.trainingForm.controls['is_position_47'].patchValue(true)
      this.trainingForm.controls['is_position_48'].patchValue(true)
      this.trainingForm.controls['is_position_49'].patchValue(true)
      this.trainingForm.controls['is_position_50'].patchValue(true)
      this.trainingForm.controls['is_position_51'].patchValue(true)
      this.trainingForm.controls['is_position_52'].patchValue(true)
      this.trainingForm.controls['is_position_53'].patchValue(true)
      this.trainingForm.controls['is_position_54'].patchValue(true)
      this.trainingForm.controls['is_position_55'].patchValue(true)
      this.trainingForm.controls['is_position_60'].patchValue(true)
      this.trainingForm.controls['is_ba19'].patchValue(true)
      this.trainingForm.controls['is_fa29'].patchValue(true)
      this.trainingForm.controls['is_fa32'].patchValue(true)
      this.trainingForm.controls['is_fa41'].patchValue(true)
      this.trainingForm.controls['is_fa44'].patchValue(true)
      this.trainingForm.controls['is_fa48'].patchValue(true)
      this.trainingForm.controls['is_ft19'].patchValue(true)
      this.trainingForm.controls['is_ga17'].patchValue(true)
      this.trainingForm.controls['is_ga19'].patchValue(true)
      this.trainingForm.controls['is_ga22'].patchValue(true)
      this.trainingForm.controls['is_ga26'].patchValue(true)
      this.trainingForm.controls['is_ga29'].patchValue(true)
      this.trainingForm.controls['is_ga32'].patchValue(true)
      this.trainingForm.controls['is_ga41'].patchValue(true)
      this.trainingForm.controls['is_gv41'].patchValue(true)
      this.trainingForm.controls['is_ha11'].patchValue(true)
      this.trainingForm.controls['is_ha14'].patchValue(true)
      this.trainingForm.controls['is_ha16'].patchValue(true)
      this.trainingForm.controls['is_ha19'].patchValue(true)
      this.trainingForm.controls['is_ha22'].patchValue(true)
      this.trainingForm.controls['is_ja19'].patchValue(true)
      this.trainingForm.controls['is_ja22'].patchValue(true)
      this.trainingForm.controls['is_ja29'].patchValue(true)
      this.trainingForm.controls['is_ja36'].patchValue(true)
      this.trainingForm.controls['is_ja38'].patchValue(true)
      this.trainingForm.controls['is_ja40'].patchValue(true)
      this.trainingForm.controls['is_ja41'].patchValue(true)
      this.trainingForm.controls['is_ja44'].patchValue(true)
      this.trainingForm.controls['is_ja48'].patchValue(true)
      this.trainingForm.controls['is_ja52'].patchValue(true)
      this.trainingForm.controls['is_ja54'].patchValue(true)
      this.trainingForm.controls['is_kp11'].patchValue(true)
      this.trainingForm.controls['is_kp14'].patchValue(true)
      this.trainingForm.controls['is_kp19'].patchValue(true)
      this.trainingForm.controls['is_kp22'].patchValue(true)
      this.trainingForm.controls['is_kp29'].patchValue(true)
      this.trainingForm.controls['is_kp32'].patchValue(true)
      this.trainingForm.controls['is_kp41'].patchValue(true)
      this.trainingForm.controls['is_la29'].patchValue(true)
      this.trainingForm.controls['is_la41'].patchValue(true)
      this.trainingForm.controls['is_la44'].patchValue(true)
      this.trainingForm.controls['is_la52'].patchValue(true)
      this.trainingForm.controls['is_la54'].patchValue(true)
      this.trainingForm.controls['is_na01'].patchValue(true)
      this.trainingForm.controls['is_na11'].patchValue(true)
      this.trainingForm.controls['is_na14'].patchValue(true)
      this.trainingForm.controls['is_na17'].patchValue(true)
      this.trainingForm.controls['is_na19'].patchValue(true)
      this.trainingForm.controls['is_na22'].patchValue(true)
      this.trainingForm.controls['is_na26'].patchValue(true)
      this.trainingForm.controls['is_na29'].patchValue(true)
      this.trainingForm.controls['is_na30'].patchValue(true)
      this.trainingForm.controls['is_na32'].patchValue(true)
      this.trainingForm.controls['is_na36'].patchValue(true)
      this.trainingForm.controls['is_na41'].patchValue(true)
      this.trainingForm.controls['is_na44'].patchValue(true)
      this.trainingForm.controls['is_na48'].patchValue(true)
      this.trainingForm.controls['is_na52'].patchValue(true)
      this.trainingForm.controls['is_na54'].patchValue(true)
      this.trainingForm.controls['is_ra01'].patchValue(true)
      this.trainingForm.controls['is_ra03'].patchValue(true)
      this.trainingForm.controls['is_ua11'].patchValue(true)
      this.trainingForm.controls['is_ua14'].patchValue(true)
      this.trainingForm.controls['is_ua17'].patchValue(true)
      this.trainingForm.controls['is_ua19'].patchValue(true)
      this.trainingForm.controls['is_ua24'].patchValue(true)
      this.trainingForm.controls['is_ua29'].patchValue(true)
      this.trainingForm.controls['is_ua32'].patchValue(true)
      this.trainingForm.controls['is_ua36'].patchValue(true)
      this.trainingForm.controls['is_ua41'].patchValue(true)
      this.trainingForm.controls['is_ud43'].patchValue(true)
      this.trainingForm.controls['is_ud48'].patchValue(true)
      this.trainingForm.controls['is_ud52'].patchValue(true)
      this.trainingForm.controls['is_vu06'].patchValue(true)
      this.trainingForm.controls['is_vu07'].patchValue(true)
      this.trainingForm.controls['is_wa17'].patchValue(true)
      this.trainingForm.controls['is_wa19'].patchValue(true)
      this.trainingForm.controls['is_wa22'].patchValue(true)
      this.trainingForm.controls['is_wa26'].patchValue(true)
      this.trainingForm.controls['is_wa28'].patchValue(true)
      this.trainingForm.controls['is_wa29'].patchValue(true)
      this.trainingForm.controls['is_wa32'].patchValue(true)
      this.trainingForm.controls['is_wa36'].patchValue(true)
      this.trainingForm.controls['is_wa41'].patchValue(true)
      this.trainingForm.controls['is_wa44'].patchValue(true)
      this.trainingForm.controls['is_wa48'].patchValue(true)
      this.trainingForm.controls['is_wa52'].patchValue(true)
      this.trainingForm.controls['is_wa54'].patchValue(true)
      this.trainingForm.controls['is_waa41'].patchValue(true)
      this.trainingForm.controls['is_waa44'].patchValue(true)
    }
    else {
      this.trainingForm.controls['is_group_KP_A'].patchValue(false)
      this.trainingForm.controls['is_group_KP_B'].patchValue(false)
      this.trainingForm.controls['is_group_KP_C'].patchValue(false)
      this.trainingForm.controls['is_group_KP_D'].patchValue(false)
      this.trainingForm.controls['is_department_11'].patchValue(false)
      this.trainingForm.controls['is_department_15'].patchValue(false)
      this.trainingForm.controls['is_department_21'].patchValue(false)
      this.trainingForm.controls['is_department_31'].patchValue(false)
      this.trainingForm.controls['is_department_41'].patchValue(false)
      this.trainingForm.controls['is_department_45'].patchValue(false)
      this.trainingForm.controls['is_department_47'].patchValue(false)
      this.trainingForm.controls['is_department_51'].patchValue(false)
      this.trainingForm.controls['is_department_55'].patchValue(false)
      this.trainingForm.controls['is_department_61'].patchValue(false)
      this.trainingForm.controls['is_department_63'].patchValue(false)
      this.trainingForm.controls['is_department_71'].patchValue(false)
      this.trainingForm.controls['is_department_81'].patchValue(false)
      this.trainingForm.controls['is_department_86'].patchValue(false)
      this.trainingForm.controls['is_department_90'].patchValue(false)
      this.trainingForm.controls['is_department_91'].patchValue(false)
      this.trainingForm.controls['is_department_92'].patchValue(false)
      this.trainingForm.controls['is_department_93'].patchValue(false)
      this.trainingForm.controls['is_department_94'].patchValue(false)
      this.trainingForm.controls['is_position_01'].patchValue(false)
      this.trainingForm.controls['is_position_02'].patchValue(false)
      this.trainingForm.controls['is_position_03'].patchValue(false)
      this.trainingForm.controls['is_position_04'].patchValue(false)
      this.trainingForm.controls['is_position_05'].patchValue(false)
      this.trainingForm.controls['is_position_06'].patchValue(false)
      this.trainingForm.controls['is_position_07'].patchValue(false)
      this.trainingForm.controls['is_position_08'].patchValue(false)
      this.trainingForm.controls['is_position_09'].patchValue(false)
      this.trainingForm.controls['is_position_10'].patchValue(false)
      this.trainingForm.controls['is_position_11'].patchValue(false)
      this.trainingForm.controls['is_position_12'].patchValue(false)
      this.trainingForm.controls['is_position_13'].patchValue(false)
      this.trainingForm.controls['is_position_14'].patchValue(false)
      this.trainingForm.controls['is_position_15'].patchValue(false)
      this.trainingForm.controls['is_position_16'].patchValue(false)
      this.trainingForm.controls['is_position_17'].patchValue(false)
      this.trainingForm.controls['is_position_18'].patchValue(false)
      this.trainingForm.controls['is_position_19'].patchValue(false)
      this.trainingForm.controls['is_position_20'].patchValue(false)
      this.trainingForm.controls['is_position_21'].patchValue(false)
      this.trainingForm.controls['is_position_22'].patchValue(false)
      this.trainingForm.controls['is_position_23'].patchValue(false)
      this.trainingForm.controls['is_position_24'].patchValue(false)
      this.trainingForm.controls['is_position_25'].patchValue(false)
      this.trainingForm.controls['is_position_26'].patchValue(false)
      this.trainingForm.controls['is_position_27'].patchValue(false)
      this.trainingForm.controls['is_position_28'].patchValue(false)
      this.trainingForm.controls['is_position_29'].patchValue(false)
      this.trainingForm.controls['is_position_30'].patchValue(false)
      this.trainingForm.controls['is_position_31'].patchValue(false)
      this.trainingForm.controls['is_position_32'].patchValue(false)
      this.trainingForm.controls['is_position_33'].patchValue(false)
      this.trainingForm.controls['is_position_34'].patchValue(false)
      this.trainingForm.controls['is_position_35'].patchValue(false)
      this.trainingForm.controls['is_position_36'].patchValue(false)
      this.trainingForm.controls['is_position_37'].patchValue(false)
      this.trainingForm.controls['is_position_38'].patchValue(false)
      this.trainingForm.controls['is_position_39'].patchValue(false)
      this.trainingForm.controls['is_position_40'].patchValue(false)
      this.trainingForm.controls['is_position_41'].patchValue(false)
      this.trainingForm.controls['is_position_42'].patchValue(false)
      this.trainingForm.controls['is_position_43'].patchValue(false)
      this.trainingForm.controls['is_position_44'].patchValue(false)
      this.trainingForm.controls['is_position_45'].patchValue(false)
      this.trainingForm.controls['is_position_46'].patchValue(false)
      this.trainingForm.controls['is_position_47'].patchValue(false)
      this.trainingForm.controls['is_position_48'].patchValue(false)
      this.trainingForm.controls['is_position_49'].patchValue(false)
      this.trainingForm.controls['is_position_50'].patchValue(false)
      this.trainingForm.controls['is_position_51'].patchValue(false)
      this.trainingForm.controls['is_position_52'].patchValue(false)
      this.trainingForm.controls['is_position_53'].patchValue(false)
      this.trainingForm.controls['is_position_54'].patchValue(false)
      this.trainingForm.controls['is_position_55'].patchValue(false)
      this.trainingForm.controls['is_position_60'].patchValue(false)
      this.trainingForm.controls['is_ba19'].patchValue(false)
      this.trainingForm.controls['is_fa29'].patchValue(false)
      this.trainingForm.controls['is_fa32'].patchValue(false)
      this.trainingForm.controls['is_fa41'].patchValue(false)
      this.trainingForm.controls['is_fa44'].patchValue(false)
      this.trainingForm.controls['is_fa48'].patchValue(false)
      this.trainingForm.controls['is_ft19'].patchValue(false)
      this.trainingForm.controls['is_ga17'].patchValue(false)
      this.trainingForm.controls['is_ga19'].patchValue(false)
      this.trainingForm.controls['is_ga22'].patchValue(false)
      this.trainingForm.controls['is_ga26'].patchValue(false)
      this.trainingForm.controls['is_ga29'].patchValue(false)
      this.trainingForm.controls['is_ga32'].patchValue(false)
      this.trainingForm.controls['is_ga41'].patchValue(false)
      this.trainingForm.controls['is_gv41'].patchValue(false)
      this.trainingForm.controls['is_ha11'].patchValue(false)
      this.trainingForm.controls['is_ha14'].patchValue(false)
      this.trainingForm.controls['is_ha16'].patchValue(false)
      this.trainingForm.controls['is_ha19'].patchValue(false)
      this.trainingForm.controls['is_ha22'].patchValue(false)
      this.trainingForm.controls['is_ja19'].patchValue(false)
      this.trainingForm.controls['is_ja22'].patchValue(false)
      this.trainingForm.controls['is_ja29'].patchValue(false)
      this.trainingForm.controls['is_ja36'].patchValue(false)
      this.trainingForm.controls['is_ja38'].patchValue(false)
      this.trainingForm.controls['is_ja40'].patchValue(false)
      this.trainingForm.controls['is_ja41'].patchValue(false)
      this.trainingForm.controls['is_ja44'].patchValue(false)
      this.trainingForm.controls['is_ja48'].patchValue(false)
      this.trainingForm.controls['is_ja52'].patchValue(false)
      this.trainingForm.controls['is_ja54'].patchValue(false)
      this.trainingForm.controls['is_kp11'].patchValue(false)
      this.trainingForm.controls['is_kp14'].patchValue(false)
      this.trainingForm.controls['is_kp19'].patchValue(false)
      this.trainingForm.controls['is_kp22'].patchValue(false)
      this.trainingForm.controls['is_kp29'].patchValue(false)
      this.trainingForm.controls['is_kp32'].patchValue(false)
      this.trainingForm.controls['is_kp41'].patchValue(false)
      this.trainingForm.controls['is_la29'].patchValue(false)
      this.trainingForm.controls['is_la41'].patchValue(false)
      this.trainingForm.controls['is_la44'].patchValue(false)
      this.trainingForm.controls['is_la52'].patchValue(false)
      this.trainingForm.controls['is_la54'].patchValue(false)
      this.trainingForm.controls['is_na01'].patchValue(false)
      this.trainingForm.controls['is_na11'].patchValue(false)
      this.trainingForm.controls['is_na14'].patchValue(false)
      this.trainingForm.controls['is_na17'].patchValue(false)
      this.trainingForm.controls['is_na19'].patchValue(false)
      this.trainingForm.controls['is_na22'].patchValue(false)
      this.trainingForm.controls['is_na26'].patchValue(false)
      this.trainingForm.controls['is_na29'].patchValue(false)
      this.trainingForm.controls['is_na30'].patchValue(false)
      this.trainingForm.controls['is_na32'].patchValue(false)
      this.trainingForm.controls['is_na36'].patchValue(false)
      this.trainingForm.controls['is_na41'].patchValue(false)
      this.trainingForm.controls['is_na44'].patchValue(false)
      this.trainingForm.controls['is_na48'].patchValue(false)
      this.trainingForm.controls['is_na52'].patchValue(false)
      this.trainingForm.controls['is_na54'].patchValue(false)
      this.trainingForm.controls['is_ra01'].patchValue(false)
      this.trainingForm.controls['is_ra03'].patchValue(false)
      this.trainingForm.controls['is_ua11'].patchValue(false)
      this.trainingForm.controls['is_ua14'].patchValue(false)
      this.trainingForm.controls['is_ua17'].patchValue(false)
      this.trainingForm.controls['is_ua19'].patchValue(false)
      this.trainingForm.controls['is_ua24'].patchValue(false)
      this.trainingForm.controls['is_ua29'].patchValue(false)
      this.trainingForm.controls['is_ua32'].patchValue(false)
      this.trainingForm.controls['is_ua36'].patchValue(false)
      this.trainingForm.controls['is_ua41'].patchValue(false)
      this.trainingForm.controls['is_ud43'].patchValue(false)
      this.trainingForm.controls['is_ud48'].patchValue(false)
      this.trainingForm.controls['is_ud52'].patchValue(false)
      this.trainingForm.controls['is_vu06'].patchValue(false)
      this.trainingForm.controls['is_vu07'].patchValue(false)
      this.trainingForm.controls['is_wa17'].patchValue(false)
      this.trainingForm.controls['is_wa19'].patchValue(false)
      this.trainingForm.controls['is_wa22'].patchValue(false)
      this.trainingForm.controls['is_wa26'].patchValue(false)
      this.trainingForm.controls['is_wa28'].patchValue(false)
      this.trainingForm.controls['is_wa29'].patchValue(false)
      this.trainingForm.controls['is_wa32'].patchValue(false)
      this.trainingForm.controls['is_wa36'].patchValue(false)
      this.trainingForm.controls['is_wa41'].patchValue(false)
      this.trainingForm.controls['is_wa44'].patchValue(false)
      this.trainingForm.controls['is_wa48'].patchValue(false)
      this.trainingForm.controls['is_wa52'].patchValue(false)
      this.trainingForm.controls['is_wa54'].patchValue(false)
      this.trainingForm.controls['is_waa41'].patchValue(false)
      this.trainingForm.controls['is_waa44'].patchValue(false)
    }
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
        if (type == 'attachment') {
          this.trainingForm.controls['attachment'].setValue(file)
          this.fileSizeInformationAttachment = this.fileSize
          this.fileNameInformationAttachment = this.fileName
        }
        else if (type == 'attachment_approval') {
          this.trainingForm.controls['attachment_approval'].setValue(file)
          this.fileSizeInformationAttachmentApproval = this.fileSize
          this.fileNameInformationAttachmentApproval = this.fileName
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
    if (type == 'attachment') {
      this.fileSize = 0;
      this.fileName = null;
      this.trainingForm.controls['attachment'].patchValue(null);
      this.fileSizeInformationAttachment = null
      this.fileNameInformationAttachment = null
      //this.cd.markForCheck();
      //this.cd.detectChanges();
    }
    else if (type == 'attachment_approval') {
      this.fileSize = 0;
      this.fileName = null;
      this.trainingForm.controls['attachment_approval'].patchValue(null);
      this.fileSizeInformationAttachmentApproval  = null
      this.fileNameInformationAttachmentApproval  = null
    }
      this.fileName = null
      this.fileSize = null
  }

  navigatePage(path: string) {
    // console.log(path)
    this.router.navigate([path])
  }

  checkForm() {
    console.log('form: ', this.trainingForm.value)
  }

}
