import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2'
@Component({
  selector: 'app-maklumat-pemohon',
  templateUrl: './maklumat-pemohon.component.html',
  styleUrls: ['./maklumat-pemohon.component.scss']
})
export class MaklumatPemohonComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  saveEdit(){}

  acceptApplication(){
    console.log('Accept application..')
    swal.fire({
      title: "Adakah anda pasti untuk menerima permohonan ini?",
      //text: ".",
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
        text: "Permohonan pemohon telah diterima. Pemohon akan menerima notifikasi.",
        type: "success",
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: false
      })
    })
  }

}
