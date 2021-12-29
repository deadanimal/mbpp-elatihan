import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Note } from 'src/app/shared/services/notes/notes.model';
import { AbsenceMemo } from 'src/app/shared/services/absence-memos/absence-memos.model';
import { Attendance } from 'src/app/shared/services/attendances/attendances.model';
import { TrainingExtended } from 'src/app/shared/services/trainings/trainings.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AttendancesService } from 'src/app/shared/services/attendances/attendances.service';
import { AbsenceMemosService } from 'src/app/shared/services/absence-memos/absence-memos.service';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';

import { forkJoin } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import swal from 'sweetalert2';
import * as moment from 'moment';
import { User } from 'src/app/shared/services/users/users.model';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-training-detail',
  templateUrl: './training-detail.component.html',
  styleUrls: ['./training-detail.component.scss']
})
export class TrainingDetailComponent implements OnInit {

  // Data
  trainingID
  training: TrainingExtended
  notes: Note[] = []
  qrID
  qrCodeCheckIn
  qrCodeCheckOut
  memo: AbsenceMemo
  attendances: Attendance[] = []
  user: User

  // Checker
  isNotesEmpty: boolean = true
  isMemoEmpty: boolean = true
  isAttendancesEmpty: boolean = true
  isLive: boolean = false
  isAfterEnd: boolean = false
  isSameAfterStart: boolean = false
  isSameBeforeEnd: boolean = false
  isBeforeStart: boolean = false

  // Table
  SelectionType = SelectionType;
  tableMessages = { 
    emptyMessage: 'Tiada rekod dijumpai',
    totalMessage: 'rekod'
  }
  tableNotesEntries: number = 5
  tableNotesSelected: any[] = []
  tableNotesTemp = []
  tableNotesActiveRow: any
  tableNotesRows: any = []

  tableAttendancesEntries: number = 5
  tableAttendancesSelected: any[] = []
  tableAttendancesTemp = []
  tableAttendancesActiveRow: any
  tableAttendancesRows: any = []

  // Icon
  iconEmpty = 'assets/img/icons/box.svg'
  iconQR = 'assets/img/icons/qr-code.svg'
  iconMemo = 'assets/img/icons/memo.svg'
  body

  // Modal
  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered"
  };

  // Form
  absenceForm: FormGroup
  absenceFormData: FormData

  // File
  fileSize
  fileName
  fileSizeInformation
  fileNameInformation

  constructor(
    private authService: AuthService,
    private attendanceService: AttendancesService,
    private absenceService: AbsenceMemosService,
    private trainingService: TrainingsService,
    private loadingBar: LoadingBarService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private modalService: BsModalService,
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
    this.initForm()
  }

  getData() {
    let body = {
      'training': this.trainingID
    }

    this.loadingBar.start()
    forkJoin([
      this.trainingService.getOne(this.trainingID),
      this.authService.getDetailByToken(),
      this.absenceService.checkMemo(body),
      this.attendanceService.getAttendances(body)
    ]).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.training = this.trainingService.trainingExtended
        this.notes = this.training['training_training_notes']
        this.user = this.authService.userDetail
        this.memo = this.absenceService.absenceMemo
        this.attendances = this.attendanceService.attendances
        this.absenceForm.controls['training'].setValue(this.training['id'])
        this.absenceForm.controls['attendee'].setValue(this.user['id'])

        if (this.memo) {
          this.isMemoEmpty = false
        }
        else {
          this.isMemoEmpty = true
        }

        // Get live / after
        let today = moment().toDate()
        let start_date = moment(this.training['start_date'], 'YYYY-MM-DD').toDate()
        let end_date = moment(this.training['end_date'], 'YYYY-MM-DD').toDate()

        // Same day
        if (moment(today).isSame(start_date)) {
          this.isLive = true
        }
        else {
          this.isLive = false
        }

        // Same or after
        if (moment(today).isSameOrAfter(start_date)) {
          this.isSameAfterStart = true
        }
        else {
          this.isSameAfterStart = false
        }

        // Same or before
        if (moment(today).isSameOrBefore(end_date)) {
          this.isSameBeforeEnd = true
          this.getQRID()
        }
        else {
          this.isSameBeforeEnd = false
        }
        
        // After
        if (moment(today).isAfter(end_date)) {
          this.isAfterEnd = true
        }
        else {
          this.isAfterEnd = false
        }

        // Before
        if (moment(today).isBefore(start_date)) {
          this.isBeforeStart = true
        }
        else {
          this.isBeforeStart = false
        }

        this.tableNotesRows = this.notes
        this.tableNotesTemp = this.tableNotesRows.map((prop, key) => {
          return {
            ...prop,
            id_index: key+1
          };
        });

        if (this.tableNotesTemp.length >= 1) {
          this.isNotesEmpty = false
        }
        else {
          this.isNotesEmpty = true
        }

        this.tableAttendancesRows = this.attendances
        this.tableAttendancesTemp = this.tableAttendancesRows.map((prop, key) => {
          return {
            ...prop,
            id_index: key+1
          };
        });

        if (this.tableAttendancesTemp.length >= 1) {
          this.isAttendancesEmpty = false
        }
        else {
          this.isAttendancesEmpty = true
        }

        // console.log('Before: ', this.isBeforeStart)
        // console.log('Live: ', this.isLive)
        // console.log('Same before: ',this.isSameBeforeEnd)
        // console.log('After: ', this.isAfterEnd)
      }
    )
  }

  initForm() {
    this.absenceForm = this.fb.group({
      attendee: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      training: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      reason: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      attachment: new FormControl(null, Validators.compose([
        Validators.required
      ])),
    })
  }

  getQRID() {
    this.body = {
      'training': this.training['id']
    }
    console.log("boday id", this.body)
    this.attendanceService.getTodayQR(this.body).subscribe(
      () => {},
      () => {},
      () => {
        console.log("anjay", this.attendanceService)
        this.qrID = this.attendanceService.attendanceQRID[0]['id']
        this.qrCodeCheckIn = this.attendanceService.attendanceQRID[0]['training']+'|check_in|'+moment(new Date()).format('YYYY-MM-DD')
        this.qrCodeCheckOut = this.attendanceService.attendanceQRID[0]['training']+'|check_out|'+moment(new Date()).format('YYYY-MM-DD')
        console.log('qrCodeCheckIn', this.qrCodeCheckIn)
        console.log('qrCodeCheckOut', this.qrCodeCheckOut)
        this.attendances = this.attendanceService.attendances
        // console.log(this.qrID)
        this.tableAttendancesRows = this.attendances
        this.tableAttendancesTemp = this.tableAttendancesRows.map((prop, key) => {
          return {
            ...prop,
            id_index: key+1
          };
        });

        if (this.tableAttendancesTemp.length >= 1) {
          this.isAttendancesEmpty = false
        }
        else {
          this.isAttendancesEmpty = true
        }
      }
    )
  }

  entriesChange($event) {
    this.tableNotesEntries = $event.target.value;
  }

  filterTable($event) {
    let val = $event.target.value.toLowerCase();
    
    this.tableNotesTemp = this.tableNotesRows.filter(function(d) {
      return d.title.toLowerCase().indexOf(val) !== -1 || !val;
    });
  }

  onSelect({ selected }) {
    this.tableNotesSelected.splice(0, this.tableNotesSelected.length);
    this.tableNotesSelected.push(...selected);
  }

  onActivate(event) {
    this.tableNotesActiveRow = event.row;
  }

  navigatePage(path) {
    return this.router.navigate([path])
  }

  downloadNote(row) {
    let url = row['note_file']
    window.open(url, '_blank');
  }

  openModal(modalRef: TemplateRef<any>) {
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  closeModal() {
    this.modal.hide()
  }

  scanSuccessHandler(event) {
    this.loadingBar.start()
    console.log('event', event)
    console.log('check in ', this.qrCodeCheckIn )
    if (event == this.qrCodeCheckIn || event == this.qrCodeCheckOut) {
      this.attendanceService.signAttendance({'qr_code': event}).subscribe(
        () => {
          this.loadingBar.complete()
        },
        (err) => {
          let errorTitle = 'Ralat'
          let errorMessage = 'Terdapat masalah teknikal. Sila hubungi pentadbir sistem'
          this.notifyService.openToastrError(errorTitle, errorMessage)
          console.log("Error QR",err)
          this.loadingBar.complete()
        },
        () => {
          let title = 'Berjaya'
          let message = 'Anda telah menanda kedatangan'
          this.notifyService.openToastr(title, message)
        }
      )
    }
    else {
      let errorTitle = 'Ralat'
      let errorMessage = 'Terdapat masalah teknikal. Sila hubungi pentadbir sistem'
      this.notifyService.openToastrError(errorTitle, errorMessage)
      this.loadingBar.complete()
    }
    this.closeModal()
  }

  scanErrorHandler(event) {
    let title = 'Ralat'
    let message = 'Terdapat masalah teknikal. Sila hubungi pentadbir sistem'
    this.notifyService.openToastrError(title, message)
    this.closeModal()
  }

  confirm() {
    this.absenceFormData = new FormData()
    this.absenceFormData.append('attendee', this.absenceForm.value['attendee'])
    this.absenceFormData.append('training', this.absenceForm.value['training'])
    this.absenceFormData.append('reason', this.absenceForm.value['reason'])
    this.absenceFormData.append('exam', this.absenceForm.value['exam'])
    this.absenceFormData.append('attachment', this.absenceForm.value['attachment'])
    // console.log(examDate)
    // console.log(this.examForm.value)
    swal.fire({
      title: 'Pengesahan',
      text: 'Anda pasti untuk menghantar memo tidak hadir ini?',
      type: 'info',
      buttonsStyling: false,
      showCancelButton: true,
      confirmButtonClass: 'btn btn-info',
      confirmButtonText: 'Pasti',
      cancelButtonClass: 'btn btn-outline-info',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.value) {
        this.addMemo()
      }
    })
  }

  addMemo() {
    this.loadingBar.start()
    let infoTitle = 'Sedang proses'
    let infoMessage = 'Memo tidak hadir sedang ditambah'
    this.notifyService.openToastrInfo(infoTitle, infoMessage)

    // console.log('data', data_)
    this.absenceService.post(this.absenceFormData).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        let title = 'Tidak berjaya'
        let message = 'Anda tidak berjaya untuk menambah memo tidak hadir. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        let title = 'Berjaya'
        let message = 'Memo tidak hadir berjaya ditambah.'
        this.notifyService.openToastr(title, message)
        this.getData()
      }
    )
  }

  onFileChange(event) {
    let reader = new FileReader();
    this.fileSize = event.target.files[0].size
    this.fileName = event.target.files[0].name
    
    if (
      event.target.files && 
      event.target.files.length &&
      this.fileSize < 5000000
    ) {
      
      
      // const [file] = event.target.files;
      const file = event.target.files[0];
      reader.readAsDataURL(file)
      // readAsDataURL(file);
      // console.log(event.target)
      // console.log(reader)
      
      
      reader.onload = () => {
        // console.log(reader['result'])
        this.absenceForm.controls['attachment'].setValue(file)
        this.fileSizeInformation = this.fileSize
        this.fileNameInformation = this.fileName
        // console.log(this.registerForm.value)
        // console.log('he', this.registerForm.valid)
        // console.log(this.isAgree)
        // !registerForm.valid || !isAgree
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

  removeFile() {
    this.fileSize = 0;
    this.fileName = null;
    this.absenceForm.controls['attachment'].patchValue(null);
    this.fileSizeInformation = null
    this.fileNameInformation = null
  }

}
