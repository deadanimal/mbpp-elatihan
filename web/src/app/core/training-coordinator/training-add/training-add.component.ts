import { Component, OnInit, TemplateRef } from '@angular/core';
import { 
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

@Component({
  selector: 'app-training-add',
  templateUrl: './training-add.component.html',
  styleUrls: ['./training-add.component.scss']
})
export class TrainingAddComponent implements OnInit {

  // Data
  training: Training
  organisations: Organisation[] = []

  // Form
  trainingForm: FormGroup
  organisationForm: FormGroup

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
  // statusTypeChoices = [
  //   { value: 'DB', text: 'Dibuka' },
  //   { value: 'DT', text: 'Ditutup' },
  //   { value: 'PN', text: 'Penuh' },
  //   { value: 'TN', text: 'Tangguh' }
  // ]

  // Datepicker
  dateStart = Date()
  dateEnd = Date()
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


  constructor(
    private authService: AuthService,
    private organisationService: OrganisationsService,
    private trainingService: TrainingsService,
    private formBuilder: FormBuilder,
    private loadingBar: LoadingBarService,
    private modalService: BsModalService,
    private router: Router
  ) { 
    this.getData()
  }

  ngOnInit() {
    this.trainingForm = this.formBuilder.group({
      title: new FormControl('', Validators.compose([
        Validators.required
      ])),
      description: new FormControl('', Validators.compose([
        Validators.required
      ])),
      organiser_type: new FormControl('DD', Validators.compose([
        Validators.required
      ])),
      organiser: new FormControl('', Validators.compose([
        Validators.required
      ])),
      course_type: new FormControl('KK', Validators.compose([
        Validators.required
      ])),
      course_code: new FormControl('', Validators.compose([
        Validators.required
      ])),
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
      cost: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      duration_days: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      speaker: new FormControl('', Validators.compose([
        Validators.required
      ])),
      fasilitator: new FormControl('', Validators.compose([
        Validators.required
      ])),
      attachment: new FormControl(Validators.compose([
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

  getData() {
    this.loadingBar.start()
    this.organisationService.getAll().subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.organisations = this.organisationService.organisations
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
    console.log('add training')

    this.trainingService.post(this.trainingForm.value).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.success()
      }
    )
  }

  success() {
    swal.fire({
      title: 'Berjaya',
      text: 'Peperiksaan telah ditambah. Tambah lagi?',
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
        this.navigatePage('/tc/exams/summary')
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

  navigatePage(path: string) {
    // console.log(path)
    this.router.navigate([path])
  }

}
