import {
  Component,
  OnInit,
  TemplateRef,
  ElementRef,
  ViewChild
} from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import swal from "sweetalert2";

@Component({
  selector: 'app-kursus-info',
  templateUrl: './kursus-info.component.html',
  styleUrls: ['./kursus-info.component.scss']
})
export class KursusInfoComponent implements OnInit {

  imgNotFound = '/src/assets/img/icons/common/error-404.svg'
  notAttendModal: BsModalRef
  attendanceModal: BsModalRef
  @ViewChild("modalNotAttend", { static: false }) modalNotAttend: ElementRef;
  @ViewChild("modalAttendance", { static: false }) modalAttendance: ElementRef;
  default = {
    keyboard: true,
    class: "modal-dialog-centered modal-secondary"
  };

  isCollapsed: boolean = true

  constructor(
    private modalService: BsModalService
  ) { }

  ngOnInit() {
  }

  openModalNotAttend(){
    console.log('Not attend')
    this.notAttendModal = this.modalService.show(this.modalNotAttend, this.default)
  }

  openModalAttendance(){
    this.attendanceModal = this.modalService.show(this.modalAttendance, this.default)
  }

  submitNotAttend(){
    console.log('Submit..')
    this.notAttendModal.hide()
    swal.fire({
      title: "Adakah anda pasti untuk menghantar surat tidak hadir ini?",
      text: "Surat tidak hadir ini akan dihantar kepada Penyelaras Latihan",
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
