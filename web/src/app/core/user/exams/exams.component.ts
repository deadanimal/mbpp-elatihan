import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { ExamsService } from 'src/app/shared/services/exams/exams.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Exam, ExamAttendee, ExamAttendeeExtended, ExamExtended } from 'src/app/shared/services/exams/exams.model';

import * as moment from 'moment';
import swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { Section } from 'src/app/shared/code/user';
import { forkJoin } from 'rxjs';

export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox'
}

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.scss']
})
export class ExamsComponent implements OnInit {

  // Data
  exams: ExamAttendeeExtended[] = []
  selectedExam: ExamExtended
  examsOption: Exam[] = []
  examsTemp: Exam[] = []
  examTypeTemp = 'FKW'
  sections = Section

  // Table
  tableEntries: number = 5
  tableSelected: any[] = []
  tableTemp = []
  tableActiveRow: any
  tableRows: any = []
  tableMessages = { 
    emptyMessage: 'Tiada rekod dijumpai',
    totalMessage: 'rekod'
  }
  SelectionType = SelectionType;

  // Checker
  isEmpty: boolean = true

  // Icon
  iconEmpty = 'assets/img/icons/box.svg'

  // Form
  examForm: FormGroup

  // Datepicker
  dateValue: Date
  dateConfig = { 
    isAnimated: true, 
    dateInputFormate: 'YYYY-MM-DDTHH:mm:ss.SSSSZ',
    containerClass: 'theme-dark-blue modal-lg' 
  }

  // Choices
  choicesResult = [
    { text: 'LULUS', value: 'PA' },
    { text: 'GAGAL', value: 'FA' }
  ]
  choicesType = [
    { text: 'FAEDAH KEWANGAN', value: 'FKW' },
    { text: 'PENGESAHAN DALAM PERKHIDMATAN', value: 'PDP' },
    { text: 'PEPERIKSAAN PENINGKATAN SECARA LANTIKAN (PSL)', value: 'PSL' }
  ]

  // Modal
  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: 'modal-dialog-centered'
  };

  // File
  fileName
  fileSize
  fileNameInformation
  fileSizeInformation

  constructor(
    private authService: AuthService,
    private examService: ExamsService,
    private loadingBar: LoadingBarService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private notifyService: NotifyService,
    private modalService: BsModalService
  ) { 
    this.getData()
  }

  ngOnInit() {
    this.initForm()
  }

  initForm() {
    this.examForm = this.formBuilder.group({
      exam: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      date: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      result: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      note: new FormControl(null),
      document_copy: new FormControl(null, Validators.compose([
        Validators.required
      ])),
    })
  }

  getData() {
    // console.log(filterField)
    // console.log('boom')
    this.loadingBar.start()
    forkJoin([
      this.examService.getSelf(),
      this.examService.getExamList()
    ]).subscribe(
      () => {
        this.loadingBar.complete()
        this.exams = this.examService.attendees
        this.tableRows = this.exams
        this.tableRows.forEach(
          (row) => {
            row.date = moment(row.date).format('DD/MM/YYYY')
          }
        )
        // console.log(this.tableRows)
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.examsOption = this.examService.exams
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

        this.examsOption.forEach(
          (exam: Exam) => {
            if (
              exam['classification'] == 'FKW' &&
              exam['active']
            ) {
              this.examsTemp.push(exam)
              if (!this.examForm.value['exam']) {
                this.examForm.controls['exam'].setValue(this.examsTemp[0]['id'])
              }
            }
          }
        )
      }
    )
  }

  entriesChange($event) {
    this.tableEntries = $event.target.value;
  }

  filterTable($event) {
    let val = $event.target.value.toLowerCase();
    this.tableTemp = this.tableRows.filter(function(d) {
      return d.title.toLowerCase().indexOf(val) !== -1 || !val;
    });
  }

  onSelect({ selected }) {
    this.tableSelected.splice(0, this.tableSelected.length);
    this.tableSelected.push(...selected);
  }

  onActivate(event) {
    this.tableActiveRow = event.row;
  }

  openModal(modalRef: TemplateRef<any>, row) {
    this.selectedExam = row
    this.examForm.controls['exam'].setValue(this.selectedExam['exam']['id'])
    this.examForm.controls['document_copy'].setValue(this.selectedExam['document_copy'])
    this.examForm.controls['result'].setValue(this.selectedExam['result'])
    this.examForm.controls['note'].setValue(this.selectedExam['note'])
    this.examForm.controls['date'].setValue(this.selectedExam['date'])
    this.dateValue = moment(this.selectedExam['date'], 'YYYY-MM-DDTHH:mm:ss.SSSSZ').toDate()
    this.examTypeTemp = this.selectedExam['exam']['classification']

    this.examsOption.forEach(
      (exam: Exam) => {
        if (
          exam['classification'] == this.examTypeTemp &&
          exam['active']
        ) {
          this.examsTemp.push(exam)
        }
      }
    )

    this.modal = this.modalService.show(modalRef, this.modalConfig);
    // console.log('Wee', this.examForm.value)
  }

  closeModal() {
    this.modal.hide()
    delete this.selectedExam
    this.examForm.reset()
  }

  update() {
    this.loadingBar.start()
    let infoTitle = 'Sedang proses'
    let infoMessage = 'Peperiksaan sedang dikemaskini'
    this.notifyService.openToastrInfo(infoTitle, infoMessage)

    this.examService.updateAttendee(this.selectedExam.id, this.examForm.value).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        let title = 'Tidak berjaya'
        let message = 'Anda tidak berjaya untuk mengemaskini peperiksaan. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        let title = 'Berjaya'
        let message = 'Peperiksaan berjaya dikemaskini.'
        this.notifyService.openToastr(title, message)
        this.success()
        this.getData()
        this.examForm.reset()
        this.closeModal()
        this.initForm()
      }
    )
  }

  success() {
    swal.fire({
      title: 'Berjaya',
      text: 'Peperiksaan berjaya dikemaskini',
      type: 'success',
      buttonsStyling: false,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonClass: 'btn btn-outline-success',
      cancelButtonText: 'Tutup'
    })
  }

}
