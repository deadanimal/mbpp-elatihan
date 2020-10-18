import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';

@Component({
  selector: 'app-tambah',
  templateUrl: './tambah.component.html',
  styleUrls: ['./tambah.component.scss']
})
export class TambahComponent implements OnInit {

  // Stepper
  isLinear = false
  isDisableRipple = true
  labelPosition = 'bottom'

  trainingTypes = [
    { value: 'LL', text: 'Luaran' },
    { value: 'DD', text: 'Dalaman' },
    { value: 'OT', text: 'Lain-lain' }
  ]
  courseTypes = [
    { value: 'KK', text: 'Kursus' },
    { value: 'PP', text: 'Persidangan' },
    { value: 'SS', text: 'Seminar' },
    { value: 'LK', text: 'Lawatan Kerja' },
    { value: 'TT', text: 'Taklimat' },
    { value: 'SP', text: 'Sesi Perjumpaan' },
    { value: 'OT', text: 'Lain-lain' },
  ]
  departmentTypes = [
    { value: 'KW', text: 'Kawalan Bangunan' },
    { value: 'KN', text: 'Kejuruteraan' },
    { value: 'KK', text: 'Kesihatan, Persekitaran dan Pelesenan' },
    { value: 'PB', text: 'Perbendaharaan' },
    { value: 'PP', text: 'Penilaian dan Pengurusan Harta' },
    { value: 'UU', text: 'Undang-undang' },
    { value: 'KP', text: 'Khidmat Pengurusan' },
    { value: 'KM', text: 'Khidmat Kemasyarakatan' },
    { value: 'KW', text: 'Konservasi Warisan' },
    { value: 'PB', text: 'Pesuruhjaya Bangunan' },
    { value: 'PG', text: 'Penguatkuasaan' },
    { value: 'PN', text: 'Perkhidmatan Perbandaran' },
    { value: 'LL', text: 'Landskap' },
    { value: 'OT', text: 'Other' },
  ]

  // Datepicker
  datePickerConfig = { 
    dateInputFormat: 'DD-MM-YYYY' 
  }
  datePickerValue
  // Form
  trainingApplicationForm = new FormGroup({
    course_code: new FormControl(''),
    title: new FormControl(''),
    training_type: new FormControl(''),
    description: new FormControl(''),
    course_type: new FormControl(''),
    target_group: new FormControl(''),
    department_type: new FormControl(''),
    organiser: new FormControl(''),
    max_participant: new FormControl(''),
    venue: new FormControl(''),
    address: new FormControl(''),
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    start_time: new FormControl(''),
    end_time: new FormControl(''),
    speaker: new FormControl(''),
    fasilitator: new FormControl(''),
    cost: new FormControl('')

  })

  constructor(
    private formBuilder: FormBuilder,
    private trainingsService: TrainingsService
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log('Submitting..')
    console.log(this.trainingApplicationForm.value)
    this.trainingApplicationForm.reset()
  }

}
