import {
  Component,
  OnInit,
  OnDestroy,
  TemplateRef,
  ElementRef,
  ViewChild
} from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal"
import swal from "sweetalert2";

import { Training } from 'src/app/shared/services/trainings/trainings.model';
import { TrainingApplication } from 'src/app/shared/services/training-applications/training-applications.modal';
import { TrainingNote } from 'src/app/shared/services/training-notes/training-notes.model';
import { User } from 'src/app/shared/services/users/users.model';

import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
import { TrainingApplicationsService } from 'src/app/shared/services/training-applications/training-applications.service';
import { TrainingNotesService } from 'src/app/shared/services/training-notes/training-notes.service';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-kursus-butiran',
  templateUrl: './kursus-butiran.component.html',
  styleUrls: ['./kursus-butiran.component.scss']
})
export class KursusButiranComponent implements OnInit, OnDestroy {

  // Table
  @ViewChild(MatPaginator, { static: true }) paginatorParticipant: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortParticipant: MatSort;
  @ViewChild('paginatorApplication', { static: true }) paginatorApplication: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortApplication: MatSort;

  public tableParticipant: string[] = ['full_name', 'grade', 'department', 'position', 'id']
  public tableParticipantSource: MatTableDataSource<any>
  public tableApplication: string[] = ['full_name', 'grade', 'department', 'position', 'id']
  public tableApplicationSource: MatTableDataSource<any>
  
  // Data
  public selectedTraining: Training = null
  public trainings: Training[] = []
  public trainingApplications: TrainingApplication[] = []
  public trainingNotes: TrainingNote[] = []
  public staffs: User[] = []

  public course_code = ''

  // Datepicker
	public datePickerConfig = { 
		isAnimated: true, 
		containerClass: 'theme-blue' 
	}
  public datePickerValue

  // Modal
  public modalRef: BsModalRef
  public modalOptions = {
    keyboard: true,
    class: "modal-dialog-centered"
  }

  // Form
  public updateForm = new FormGroup({
    course_code: new FormControl('', [
      Validators.required
    ]),
    title: new FormControl('', [
      Validators.required
    ]),
    organiser_type: new FormControl('', [
      Validators.required
    ]),
    description: new FormControl('', [
      Validators.required
    ]),
    course_type: new FormControl('', [
      Validators.required
    ]),
    category: new FormControl('', [
      Validators.required
    ]),
    agency: new FormControl('', [
      Validators.required
    ]),
    target_group: new FormControl('', [
      Validators.required
    ]),
    department: new FormControl('', [
      Validators.required
    ]),
    organiser: new FormControl('', [
      Validators.required
    ]),
    max_participant: new FormControl('', [
      Validators.required
    ]),
    venue: new FormControl('', [
      Validators.required
    ]),
    address: new FormControl('', [
      Validators.required
    ]),
    start_date: new FormControl('', [
      Validators.required
    ]),
    end_date: new FormControl('', [
      Validators.required
    ]),
    start_time: new FormControl('', [
      Validators.required
    ]),
    end_time: new FormControl('', [
      Validators.required
    ]),
    speaker: new FormControl('', [
      Validators.required
    ]),
    fasilitator: new FormControl('', [
      Validators.required
    ]),
    cost: new FormControl('', [
      Validators.required
    ])
  })

  constructor(
    private trainingService: TrainingsService,
    private trainingApplicationService: TrainingApplicationsService,
    private trainingNoteService: TrainingNotesService,
    private userService: UsersService,

    private modalService: BsModalService,
    private router: Router,
    private toastr: ToastrService
  ) { 
    this.selectedTraining = this.router.getCurrentNavigation().extras as Training
    this.trainings = this.trainingService.trainings
    this.trainingApplications = this.trainingApplicationService.applications
    this.trainingNotes = this.trainingNoteService.notes
    this.staffs = this.userService.users
  }

  ngOnInit() {
    // console.log('----------------------------')
    // console.log('selected training: ', this.selectedTraining)
    // console.log('trainings: ', this.trainings)
    // console.log('training applications: ', this.trainingApplications)
    // console.log('training notes: ', this.trainingNotes)
    // console.log('staffs: ', this.staffs)
    // console.log('----------------------------'
    this.initFormValue()
  }

  ngOnDestroy() {

  }

  initFormValue() {
    this.updateForm.value.course_code = this.selectedTraining.course_code
    this.updateForm.value.organiser_type = this.selectedTraining.organiser_type
    this.updateForm.value.title = this.selectedTraining.title
    this.updateForm.value.organiser_type = this.selectedTraining.organiser_type
    this.updateForm.value.description = this.selectedTraining.description
    this.updateForm.value.course_type = this.selectedTraining.course_type
    this.updateForm.value.target_group = this.selectedTraining.target_group
    this.updateForm.value.department = this.selectedTraining.department
    this.updateForm.value.organiser = this.selectedTraining.organiser
    this.updateForm.value.max_participant = this.selectedTraining.max_participant
    this.updateForm.value.venue = this.selectedTraining.venue
    this.updateForm.value.address = this.selectedTraining.address
    this.updateForm.value.start_date = this.selectedTraining.start_date
    this.updateForm.value.end_date = this.selectedTraining.end_date
    this.updateForm.value.start_time = this.selectedTraining.start_time
    this.updateForm.value.end_date = this.selectedTraining.end_time
    this.updateForm.value.speaker = this.selectedTraining.speaker
    this.updateForm.value.fasilitator = this.selectedTraining.fasilitator
    this.updateForm.value.cost = this.selectedTraining.cost
    // this.updateForm.value.duration = this.selectedTraining.duration

    if (this.selectedTraining.organiser_type == 'DD') {
      this.selectedTraining.organiser_type = 'Dalaman'
    }
    else if (this.selectedTraining.organiser_type == 'LL') {
      this.selectedTraining.organiser_type = 'Luaran'
    }
    else if (this.selectedTraining.organiser_type == 'OT') {
      this.selectedTraining.organiser_type = 'Lain-lain'
    }

    if (this.selectedTraining.course_type == 'KK') {
      this.selectedTraining.course_type = 'Kursus'
    }
    else if (this.selectedTraining.course_type == 'PP') {
      this.selectedTraining.course_type = 'Persidangan'
    }
    else if (this.selectedTraining.course_type == 'SS') {
      this.selectedTraining.course_type = 'Seminar'
    }
    else if (this.selectedTraining.course_type == 'LK') {
      this.selectedTraining.course_type = 'Lawatan Kerja'
    }
    else if (this.selectedTraining.course_type == 'TT') {
      this.selectedTraining.course_type = 'Taklimat'
    }
    else if (this.selectedTraining.course_type == 'SP') {
      this.selectedTraining.course_type = 'Sesi Perjumpaan'
    }
    else if (this.selectedTraining.course_type == 'OT') {
      this.selectedTraining.course_type = 'Lain-lain'
    }

    if (this.selectedTraining.department == 'KW') {
      this.selectedTraining.department = 'KA'
    }
    else if (this.selectedTraining.department == 'KN') {
      this.selectedTraining.department = 'Kejuruteraan'
    }
    else if (this.selectedTraining.department == 'KK') {
      this.selectedTraining.department = 'Kesihatan, Persekitaran dan Pelesenan'
    }
    else if (this.selectedTraining.department == 'PB') {
      this.selectedTraining.department = 'Perbendaharaan'
    }
    else if (this.selectedTraining.department == 'PP') {
      this.selectedTraining.department = 'Penilaian dan Pengurusan Harta'
    }
    else if (this.selectedTraining.department == 'UU') {
      this.selectedTraining.department = 'Undang-undang'
    }
    else if (this.selectedTraining.department == 'KP') {
      this.selectedTraining.department = 'Khidmat Pengurusan'
    }
    else if (this.selectedTraining.department == 'KM') {
      this.selectedTraining.department = 'Khidmat Kemasyarakatan'
    }
    else if (this.selectedTraining.department == 'KW') {
      this.selectedTraining.department = 'Konservasi Warisan'
    }
    else if (this.selectedTraining.department == 'PB') {
      this.selectedTraining.department = 'Pesuruhjaya Bangunan'
    }
    else if (this.selectedTraining.department == 'PG') {
      this.selectedTraining.department = 'Penguatkuasaan'
    }
    else if (this.selectedTraining.department == 'PN') {
      this.selectedTraining.department = 'Perkhidmatan Perbandaran'
    }
    else if (this.selectedTraining.department == 'LL') {
      this.selectedTraining.department = 'Lanskap'
    }
    else if (this.selectedTraining.department == 'BP') {
      this.selectedTraining.department = 'Bahagian Pelesenan'
    }
    else if (this.selectedTraining.department == 'UD') {
      this.selectedTraining.department = 'Unit Audit Dalaman'
    }
    else if (this.selectedTraining.department == 'UO') {
      this.selectedTraining.department = 'Unit OSC'
    }
    else if (this.selectedTraining.department == 'OT') {
      this.selectedTraining.department = 'Lain-lain'
    }
  }

  openModalQR(modalTemplateRef: TemplateRef<any>) {
    this.modalRef = this.modalService.show(modalTemplateRef, this.modalOptions)
  }

  openModal(modalTemplateRef: TemplateRef<any>) {
    this.modalRef = this.modalService.show(modalTemplateRef, this.modalOptions)
  }

  openUpdateConfirmation() {
    swal.fire({
      title: "Pengesahan",
      text: "Adakah anda pasti untuk menyimpan data yang telah disunting ini?",
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: "btn btn-success",
      confirmButtonText: "Pasti",
      cancelButtonClass: "btn btn-danger",
      cancelButtonText: "Batal",
      buttonsStyling: false
    }).then((result) => {
        if(result.value) {
          this.updateTraining()
        }
      }
    )
  }

  updateTraining() {
    this.successfulUpdateMessage()
  }

  successfulUpdateMessage() {
    this.toastr.show(
      '<span class="alert-icon far fa-bell"></span> <div class="alert-text"</div> <span class="alert-title" data-notify="title">Berjaya</span> <span data-notify="message">Kursus berjaya disunting</span></div>',
      '',
      {
        timeOut: 3000,
        closeButton: true,
        enableHtml: true,
        tapToDismiss: true,
        titleClass: 'alert-title',
        positionClass: 'toast-top-right',
        toastClass: "ngx-toastr alert alert-dismissible alert-danger alert-notify",
      }
    );
  }

  unsuccessfulUpdateMessage() {
    this.toastr.show(
      '<span class="alert-icon far fa-bell"></span> <div class="alert-text"</div> <span class="alert-title" data-notify="title">Tidak berjaya</span> <span data-notify="message">Kursus tidak berjaya disunting</span></div>',
      '',
      {
        timeOut: 3000,
        closeButton: true,
        enableHtml: true,
        tapToDismiss: true,
        titleClass: 'alert-title',
        positionClass: 'toast-top-right',
        toastClass: "ngx-toastr alert alert-dismissible alert-danger alert-notify",
      }
    );
  }

  openApproveApplicationConfirmation() {
    swal.fire({
      title: "Pengesahan",
      text: "Adakah anda pasti untuk menerima permohonan calon ini?",
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: "btn btn-success",
      confirmButtonText: "Pasti",
      cancelButtonClass: "btn btn-danger",
      cancelButtonText: "Batal",
      buttonsStyling: false
    }).then((result) => {
        if(result.value) {
          this.approveApplication()
        }
      }
    )
  }

  approveApplication() {
    this.successfulApproveApplication()
  }

  successfulApproveApplication() {
    this.toastr.show(
      '<span class="alert-icon far fa-bell"></span> <div class="alert-text"</div> <span class="alert-title" data-notify="title">Berjaya</span> <span data-notify="message">Calon telah berjaya diluluskan</span></div>',
      '',
      {
        timeOut: 3000,
        closeButton: true,
        enableHtml: true,
        tapToDismiss: true,
        titleClass: 'alert-title',
        positionClass: 'toast-top-right',
        toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify",
      }
    );
  }

  unsuccessfulApproveApplication() {
    this.toastr.show(
      '<span class="alert-icon far fa-bell"></span> <div class="alert-text"</div> <span class="alert-title" data-notify="title">Tidak berjaya</span> <span data-notify="message">Calon tidak berjaya diluluskan</span></div>',
      '',
      {
        timeOut: 3000,
        closeButton: true,
        enableHtml: true,
        tapToDismiss: true,
        titleClass: 'alert-title',
        positionClass: 'toast-top-right',
        toastClass: "ngx-toastr alert alert-dismissible alert-danger alert-notify",
      }
    );
  }

  confirmSubmit() {
    swal.fire({
      title: "Pengesahan",
      text: "Adakah anda pasti?",
      type: "question",
      buttonsStyling: false,
      showCancelButton: true,
      confirmButtonClass: "btn btn-success",
      confirmButtonText: "Pasti",
      cancelButtonClass: "btn btn-danger",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.value) {
        this.showNoti()
      }
    })
  }

  showNoti() {
    this.toastr.show(
      '<span class="alert-icon ni ni-bell-55" data-notify="icon"></span> <div class="alert-text"</div> <span class="alert-title" data-notify="title">Berjaya</span> <span data-notify="message">Permohonan diterima</span></div>',
      '',
      {
        timeOut: 3000,
        closeButton: true,
        enableHtml: true,
        tapToDismiss: false,
        titleClass: 'alert-title',
        positionClass: 'toast-top-right',
        toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify",
      }
    )
  }

  showNoti1() {
    this.toastr.show(
      '<span class="alert-icon ni ni-bell-55" data-notify="icon"></span> <div class="alert-text"</div> <span class="alert-title" data-notify="title">Berjaya</span> <span data-notify="message">Senarai berjaya dicetak</span></div>',
      '',
      {
        timeOut: 3000,
        closeButton: true,
        enableHtml: true,
        tapToDismiss: false,
        titleClass: 'alert-title',
        positionClass: 'toast-top-right',
        toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify",
      }
    )
  }


}
