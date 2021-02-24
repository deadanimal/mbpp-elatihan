import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Router } from '@angular/router';

import { User } from 'src/app/shared/services/users/users.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ExamsService } from 'src/app/shared/services/exams/exams.service';
import { UsersService } from 'src/app/shared/services/users/users.service';

import swal from 'sweetalert2';
import * as moment from 'moment';
import { Exam } from 'src/app/shared/services/exams/exams.model';
import { forkJoin } from 'rxjs';
import { Section } from 'src/app/shared/code/user';

export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox'
}

@Component({
  selector: 'app-exam-add',
  templateUrl: './exam-add.component.html',
  styleUrls: ['./exam-add.component.scss']
})
export class ExamAddComponent implements OnInit {

  // Data
  staffs: User[] = []
  selectedStaff: User
  exams: Exam[] = []
  examsTemp: Exam[] = []
  examTypeTemp = 'FKW'
  sections = Section

  // Form
  examForm: FormGroup
  examFormData: FormData

  // Datepicker
  dateValue: Date
  dateConfig = { 
    isAnimated: true, 
    dateInputFormate: 'YYYY-MM-DD',
    containerClass: 'theme-dark-blue' 
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

  // File
  fileSize
  fileName
  fileSizeInformation
  fileNameInformation

  constructor(
    private authService: AuthService,
    private examService: ExamsService,
    private userService: UsersService,
    private cd: ChangeDetectorRef,
    private config: NgSelectConfig,
    private formBuilder: FormBuilder,
    private loadingBar: LoadingBarService,
    private notifyService: NotifyService,
    private router: Router
  ) {
    this.getData()
    this.config.notFoundText = 'Tiada rekod';
    this.config.appendTo = 'body';
  }

  ngOnInit() {
    this.initForm()
  }

  getData() {
    this.loadingBar.start()
    forkJoin([
      this.authService.getDetailByToken(),
      this.examService.getExamList(),
      this.userService.getDepartmentStaffs()
    ]).subscribe(
      () => {
        this.loadingBar.complete()
        this.exams = this.examService.exams
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.exams.forEach(
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

        this.userService.users.forEach(
          (user: User) => {
            if(user.nric) {
              this.staffs.push(user)
              // console.log(this.staffs)
            }
          }
        )
      }
    )
  }

  initForm() {
    this.examForm = this.formBuilder.group({
      exam: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      staff: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      date: new FormControl(null),
      document_copy: new FormControl(null),
      result: new FormControl(this.choicesResult[0].value, Validators.compose([
        Validators.required
      ])),
      note: new FormControl(null)
    })
  }

  confirm() {
    let examDate = moment(this.examForm.value['date']).format('YYYY-MM-DDTHH:mm:ss.SSSSZ') 
    this.examForm.controls['date'].setValue(examDate)
    // console.log(this.examForm.value)
    this.examFormData = new FormData()
    this.examFormData.append('exam', this.examForm.value['exam'])
    this.examFormData.append('staff', this.examForm.value['staff'])
    this.examFormData.append('date', this.examForm.value['date'])
    this.examFormData.append('result', this.examForm.value['result'])
    this.examFormData.append('document_copy', this.examForm.value['document_copy'])
    this.examFormData.append('note', this.examForm.value['note'])
    // console.log(examDate)
    // console.log(this.examForm.value)
    swal.fire({
      title: 'Pengesahan',
      text: 'Anda pasti untuk mendaftar peperiksaan ini?',
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
    let infoMessage = 'Peperiksaan sedang ditambah'
    this.notifyService.openToastrInfo(infoTitle, infoMessage)

    this.examService.createAttendee(this.examFormData).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        let title = 'Tidak berjaya'
        let message = 'Anda tidak berjaya untuk menambah peperiksaan. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        let title = 'Berjaya'
        let message = 'Peperiksaan berjaya ditambah.'
        this.notifyService.openToastr(title, message)
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
        this.examForm.reset()
      }
      else {
        this.navigatePage('/tc/exams/summary')
      }
    })
  }

  onClassificationChange(value) {
    this.examsTemp = []
    if (value == 'FKW') {
      this.exams.forEach(
        (exam: Exam) => {
          if (
            exam['classification'] == 'FKW' &&
            exam['active']
          ) {
            this.examsTemp.push(exam)
            this.examForm.controls['exam'].setValue(this.examsTemp[0]['id'])
          }
        }
      )
    }
    else if (value == 'PDP') {
      this.exams.forEach(
        (exam: Exam) => {
          if (
            exam['classification'] == 'PDP' &&
            exam['active']
          ) {
            this.examsTemp.push(exam)
            this.examForm.controls['exam'].setValue(this.examsTemp[0]['id'])
          }
        }
      )
    }
    else if (value == 'PSL') {
      this.exams.forEach(
        (exam: Exam) => {
          if (
            exam['classification'] == 'PSL' &&
            exam['active']
          ) {
            this.examsTemp.push(exam)
            this.examForm.controls['exam'].setValue(this.examsTemp[0]['id'])
          }
        }
      )
    }
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
      
      
      const file = event.target.files[0];
      reader.readAsDataURL(file)
      // readAsDataURL(file);
      // console.log(event.target)
      // console.log(reader)
      
      
      reader.onload = () => {
        // console.log(reader['result'])
        this.examForm.controls['document_copy'].setValue(file)
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
    this.examForm.controls['document_copy'].patchValue(null);
    this.fileSizeInformation = null
    this.fileNameInformation = null
  }

  navigatePage(path: string) {
    this.router.navigate([path])
  }

  checkValue() {
    console.log('form ', this.examForm.value)
  }

  onStaffChange(value) {
    // console.log(value)
    this.examForm.controls['staff'].setValue(value['id'])
    this.sections.forEach(
      (section) => {
        if (section['value'] == this.selectedStaff['section_code']) {
          this.selectedStaff['section'] = section['text']
        }
      }
    )
  }

}
