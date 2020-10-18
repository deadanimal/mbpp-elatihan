import { Component, OnInit } from '@angular/core';
import swal from "sweetalert2";

@Component({
  selector: 'app-kursus-penilaian',
  templateUrl: './kursus-penilaian.component.html',
  styleUrls: ['./kursus-penilaian.component.scss']
})
export class KursusPenilaianComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  send() {
    swal.fire({
      title: "Adakah anda pasti untuk menghantar penilaian?",
      text: "Penilaian anda akan dihantar kepada Penyelaras Latihan bagi tujuan analisa",
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
        text: "Penilaian anda telah berjaya dihantar.",
        type: "success",
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: false
      })
    })
  }

}
