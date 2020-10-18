import { Component, OnInit } from '@angular/core';
import swal from "sweetalert2";
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

  surveyForm: FormGroup

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.surveyForm = this.fb.group({
      position: new FormControl(),
      training: new FormControl()
    })
  }

  doSendSurvey() {
    console.log('Applying training..')
    swal.fire({
      title: "Adakah anda pasti untuk menghantar survey?",
      text: "Survey anda akan dihantar kepada Penyelaras Latihan bagi tujuan analisa",
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: "btn btn-primary",
      cancelButtonClass: "btn btn-secondary",
      confirmButtonText: "Pasti",
      cancelButtonText: "Batal",
      buttonsStyling: false
    })
    .then(result => {
      swal.fire({
        title: "Berjaya!",
        text: "Survey anda telah berjaya dihantar.",
        type: "success",
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: false
      })
    })
  }

}
