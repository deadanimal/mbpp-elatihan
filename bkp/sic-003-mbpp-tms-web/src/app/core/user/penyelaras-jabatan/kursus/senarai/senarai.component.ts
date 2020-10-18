import { Component, OnInit, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';

@Component({
  selector: 'app-senarai',
  templateUrl: './senarai.component.html',
  styleUrls: ['./senarai.component.scss']
})
export class SenaraiComponent implements OnInit {

  viewModal: BsModalRef
  @ViewChild("modalView", { static: false }) modalView: ElementRef
  rejectModal: BsModalRef
  @ViewChild("modalReject", { static: false }) modalReject: ElementRef
  printModal: BsModalRef
  @ViewChild("modalPrint", {static: false}) modalPrint: ElementRef

  selectedKakitangan = ''
  selectedLatihan = ''

  default = {
    keyboard: true,
    class: "modal-dialog-centered modal-secondary"
  };

  focus

  constructor(
    private modalService: BsModalService,
    private notifyService: NotifyService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  detailModal(modalDefault: TemplateRef<any>) {
    this.viewModal = this.modalService.show(this.modalView, this.default)
  }

  navigatePage(path: string) {
    this.router.navigate([path])
  }

  sendApplication() {
    let title = 'Berjaya'
    let message = 'Permohonan telah dihantar'
    setTimeout(
      () => {
        this.notifyService.openToastr(title, message)
      }, 1500
    )
  }

  filterTable(filterValue: string) {

  }

  openSearch() {
    document.body.classList.add("g-navbar-search-showing");
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-showing");
      document.body.classList.add("g-navbar-search-show");
    }, 150);
    setTimeout(function () {
      document.body.classList.add("g-navbar-search-shown");
    }, 300);
  }

  closeSearch() {
    document.body.classList.remove("g-navbar-search-shown");
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-show");
      document.body.classList.add("g-navbar-search-hiding");
    }, 150);
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-hiding");
      document.body.classList.add("g-navbar-search-hidden");
    }, 300);
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-hidden");
    }, 500);
  }

}
