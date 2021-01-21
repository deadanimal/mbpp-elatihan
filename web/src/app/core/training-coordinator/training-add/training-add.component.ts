import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
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
import { Training } from 'src/app/shared/services/trainings/trainings.model';
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

  // Form
  trainingForm: FormGroup
  organisationForm: FormGroup
  trainerSpeakerForm: FormGroup
  trainerFacilitatorForm: FormGroup
  trainerSpeakerFormArray: FormArray
  trainerFacilitatorFormArray: FormArray

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
  fileSizeInformation = null
  fileNameInformation = null


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
    this.dateMinStart = new Date(this.dateToday.getFullYear(), this.dateToday.getMonth(), this.dateToday.getDate() + 1)
    this.dateMinEnd = new Date(this.dateToday.getFullYear(), this.dateToday.getMonth(), this.dateToday.getDate() + 2)

    this.loadingBar.start()
    forkJoin([
      this.organisationService.getAll(),
      this.userService.getAll(),
      this.coreService.getAll(),
      this.authService.getDetailByToken(),
      this.domainService.getDomains()
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
        this.trainingForm.controls['created_by'].setValue(this.currentUser['id'])
        
        this.cores.forEach(
          (core: Core) => {
            if (core['parent'] == 'GN') {
              this.coresTemp.push(core)
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
      domain: new FormControl(null),
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
      cost: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      attachment: new FormControl(null, Validators.compose([
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

    this.trainerSpeakerForm = this.formBuilder.group({
      trainerSpeakerFormArray: this.formBuilder.array([this.initSpeakerForm()])
    })

    this.trainerFacilitatorForm = this.formBuilder.group({
      trainerFacilitatorFormArray: this.formBuilder.array([this.initFacilitatorForm()])
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

  initSpeakerForm() {
    return this.formBuilder.group({
      name: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      phone: new FormControl(null, Validators.compose([
        Validators.required
      ])),
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
      name: new FormControl(null, Validators.compose([
        Validators.required
      ])),
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
            console.log('Type found D: ', organisation['shortname'])
          }
        }
      )
    }
    else if (value == 'LL') {
      this.trainingForm.controls['organiser'].setValue(this.organisations[0]['id'])
      console.log('Type found L: ', this.organisations[0]['id'])
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

    console.log(this.trainingForm.value)
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

    this.loadingBar.complete()

    this.trainingService.post(this.trainingForm.value).subscribe(
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
    console.log('masuk')
    this.loadingBar.start()
    this.organisationService.post(this.organisationForm.value).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.getData()
        this.successOrganisation()
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
        if (type == 'training') {
          this.trainingForm.controls['attachment'].setValue(reader.result)
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
    if (type == 'training') {
     this.fileSize = 0;
     this.fileName = null;
     this.trainingForm.value['attachment'] = null;
     this.fileSizeInformation = null
     this.fileNameInformation = null
     //this.cd.markForCheck();
     //this.cd.detectChanges();
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
