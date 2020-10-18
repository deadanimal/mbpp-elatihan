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
  selector: 'app-kursus',
  templateUrl: './kursus.component.html',
  styleUrls: ['./kursus.component.scss']
})
export class KursusComponent implements OnInit {

  // Data
  
  // Modal
  viewModal: BsModalRef
  @ViewChild("modalView", { static: false }) modalView: ElementRef
  default = {
    keyboard: true,
    class: "modal-dialog-centered modal-secondary"
  };

  constructor(
    private modalService: BsModalService
  ) { }

  ngOnInit() {
  }

  doViewModal(){
    this.viewModal = this.modalService.show(this.modalView, this.default)
  }

  applyTraining() {
    console.log('Applying training..')
    this.viewModal.hide()
    swal.fire({
      title: "Adakah anda pasti untuk memohon kursus ini?",
      text: "Permohonan anda akan dihantar kepada Penyelaras Latihan",
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
        text: "Permohonan anda telah berjaya dihantar.",
        type: "success",
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: false
      })
    })
  }

}
