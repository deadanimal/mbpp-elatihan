import { Component, OnInit } from '@angular/core';
import { ExamsService } from 'src/app/shared/services/exams/exams.service';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { LoadingBarService } from '@ngx-loading-bar/core';

import { 
  FormBuilder, 
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

import swal from 'sweetalert2';
import * as moment from 'moment';
import { Router } from '@angular/router';

import { UsersService } from 'src/app/shared/services/users/users.service';
import { User } from 'src/app/shared/services/users/users.model';
import { Results } from 'src/assets/data/results';

@Component({
  selector: 'app-peperiksaan-tambah',
  templateUrl: './peperiksaan-tambah.component.html',
  styleUrls: ['./peperiksaan-tambah.component.scss']
})
export class PeperiksaanTambahComponent implements OnInit {

  // Form
  examForm: FormGroup
  selectedStaff: User

  // Datepicker
  datePickerConfig = { 
		isAnimated: true, 
    containerClass: 'theme-blue', 
    dateInputFormat: 'DD/MM/YYYY'
  }
  
  // Data
  staffs: User[] = []
  resultOptns = Results

  constructor(
    private userService: UsersService,
    private examService: ExamsService,
    private loadingBar: LoadingBarService,
    private notifyService: NotifyService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { 
    this.userService.get().subscribe(
      () => {},
      () => {},
      () => {
        this.staffs = this.userService.users
      }
    )
  }

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
      start_time: new FormControl('', Validators.compose([
        Validators.required
      ])),
      document_copy: new FormControl(),
      result: new FormControl('', Validators.compose([
        Validators.required
      ]))
    })
  }

  confirm(){
    this.examForm.controls['date'].setValue(moment(new Date(this.examForm.value.date)).format("YYYY-MM-DDTHH:MM:SS"))
    // console.log('Submitting..')
    // console.log(this.examForm.value)
    swal.fire({
      title: "Adakah anda pasti untuk menambah info ini?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: "btn btn-primary",
      cancelButtonClass: "btn btn-secondary",
      confirmButtonText: "Pasti",
      cancelButtonText: "Batal",
      buttonsStyling: false
    })
    .then(result => {
      if (result.value){
        this.register()
      }
    })
  }

  register() {
    this.loadingBar.start()
    this.examService.create(this.examForm.value).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.examForm.reset()
        this.examService.get().subscribe()
        this.successMessage()
        this.router.navigate(['/penyelaras/peperiksaan'])
      }
    )
  }

  successMessage() {
    let title = 'Berjaya'
    let message = 'Peperiksaan telah ditambah'
    this.notifyService.openToastr(title, message)
  }

  // tambah -> refresh -> go to overview

}
