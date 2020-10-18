import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import swal from "sweetalert2";

@Component({
  selector: 'app-kursus-kehadiran',
  templateUrl: './kursus-kehadiran.component.html',
  styleUrls: ['./kursus-kehadiran.component.scss']
})
export class KursusKehadiranComponent implements OnInit {

  constructor(
    private toastr: ToastrService
  ) { }

  ngOnInit() {
  }

  showNoti() {
    swal.fire({
      title: "Adakah anda pasti untuk menghantar surat tidak hadir?",
      text: "Surat tidak hadir anda akan dihantar kepada Penyelaras Latihan",
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
        text: "Surat tidak hadir anda telah berjaya dihantar.",
        type: "success",
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: false
      })
    })
  }

}
