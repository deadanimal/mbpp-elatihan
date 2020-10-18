import { Component, OnInit } from '@angular/core';
import { ExamsService } from 'src/app/shared/services/exams/exams.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import swal from 'sweetalert2';
import * as moment from 'moment';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exam-add',
  templateUrl: './exam-add.component.html',
  styleUrls: ['./exam-add.component.scss']
})
export class ExamAddComponent implements OnInit {

  // Form
  examForm: FormGroup

  // Choices
  choicesResult = [
    { text: 'Lulus', value: 'PA' },
    { text: 'Gagal', value: 'FA' }
  ]

  // Datepicker
  dateValue: Date
  dateConfig = { 
    isAnimated: true, 
    dateInputFormate: 'YYYY-MM-DDTHH:mm:ss.SSSSZ',
    containerClass: 'theme-dark-blue' 
  }

  constructor(
    private authService: AuthService,
    private examService: ExamsService,
    private formBuilder: FormBuilder,
    private loadingBar: LoadingBarService,
    private router: Router
  ) { }

  ngOnInit() {
    this.examForm = this.formBuilder.group({
      title: new FormControl('', Validators.compose([
        Validators.required
      ])),
      code: new FormControl('', Validators.compose([
        Validators.required
      ])),
      date: new FormControl('', Validators.compose([
        Validators.required
      ])),
      result: new FormControl(this.choicesResult[0].value, Validators.compose([
        Validators.required
      ])),
      staff: new FormControl(this.authService.userID, Validators.compose([
        Validators.required
      ])),
      document_copy: new FormControl(),
    })
  }

  confirm() {
    let examDate = moment(this.examForm.value.date).format('YYYY-MM-DDTHH:mm:ss.SSSSZ') 
    this.examForm.controls['date'].setValue(examDate)
    this.examForm.controls['staff'].setValue(this.authService.userID)
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
    this.examService.post(this.examForm.value).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.examForm.reset()
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
        this.navigatePage('/exams/summary')
      }
    })
  }

  navigatePage(path: string) {
    this.router.navigate([path])
  }

}
