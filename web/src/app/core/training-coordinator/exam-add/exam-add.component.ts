import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ExamsService } from 'src/app/shared/services/exams/exams.service';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { User } from 'src/app/shared/services/users/users.model';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Router } from '@angular/router';

import swal from 'sweetalert2';
import * as moment from 'moment';
import Selectr from 'mobius1-selectr';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'app-exam-add',
  templateUrl: './exam-add.component.html',
  styleUrls: ['./exam-add.component.scss']
})
export class ExamAddComponent implements OnInit {

  // Data
  staffs: User[] = []
  selectedStaff: User

  // Selectr
  // selectr: any = document.getElementById("selectr");
  // options = {};
  // selectorDefault = new Selectr(this.selectr, this.options)

  // Form
  examForm: FormGroup

  // Datepicker
  dateValue: Date
  dateConfig = { 
    isAnimated: true, 
    dateInputFormate: 'YYYY-MM-DDTHH:mm:ss.SSSSZ',
    containerClass: 'theme-dark-blue' 
  }

  // Choices
  choicesResult = [
    { text: 'Lulus', value: 'PA' },
    { text: 'Gagal', value: 'FA' }
  ]
  choicesClassification = [
    { text: 'Faedah Kewangan', value: 'FKW' },
    { text: 'Pengesahan Dalam Perkhidmatan', value: 'PDP' },
    { text: 'Peperiksaan Peningkatan Secara Lantikan (PSL)', value: 'PSL' }
  ]

  constructor(
    private authService: AuthService,
    private examService: ExamsService,
    private userService: UsersService,
    private loadingBar: LoadingBarService,
    private config: NgSelectConfig,
    private formBuilder: FormBuilder,
    private router: Router
  ) { 
    this.getData()
    this.config.notFoundText = 'Tiada rekod';
    this.config.appendTo = 'body';
  }

  ngOnInit() {
    // var selectr: any = document.getElementById("selectr");
    // var options = {};
    // this.selectorDefault = new Selectr(selectr, options);
    
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
      staff: new FormControl(Validators.compose([
        Validators.required
      ])),
      document_copy: new FormControl(),
      classification: new FormControl(this.choicesClassification[0].value, Validators.compose([
        Validators.required
      ])),
      note: new FormControl()
    })
  }

  getData() {
    this.loadingBar.start()
    this.userService.getAll().subscribe(
      () => {
        this.loadingBar.complete()
        this.userService.users.forEach(
          (user: User) => {
            if(user.nric) {
              this.staffs.push(user)
              // console.log(this.staffs)
            }
          }
        )
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        // this.selectorDefault.add(this.staffs)
      }
    )
  }

  confirm() {
    let examDate = moment(this.dateValue).format('YYYY-MM-DDTHH:mm:ss.SSSSZ')
    this.examForm.controls['date'].setValue(examDate)
    this.examForm.controls['staff'].setValue(this.selectedStaff.id)
    // this.examForm.controls['staff'].setValue()
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
        this.success()
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
        this.navigatePage('/tc/exams/summary')
      }
    })
  }

  navigatePage(path: string) {
    this.router.navigate([path])
  }

}
