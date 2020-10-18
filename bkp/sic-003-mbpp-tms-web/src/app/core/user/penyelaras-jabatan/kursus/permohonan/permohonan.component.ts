import { Component, OnInit, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { LoadingBarService } from '@ngx-loading-bar/core';

const Jabatan = [
  { value: 'bahagian-pelesenan', name: 'Bahagian Pelesenan' },
  { value: 'kawalan-bangunan', name: 'Kawalan Bangunan' },
  { value: 'kejuruteraan', name: 'Kejuruteraan' },
  { value: 'kesihatan-persekitaran-pelesenan', name: 'Kesihatan, Persekitaran & Pelesenan' },
  { value: 'khidmat-kemasyarakatan', name: 'Khidmat Kemasyarakatan' },
  { value: 'khidmat-pengurusan', name: 'Khidmat Pengurusan' },
  { value: 'konservasi-warisan', name: 'Konservasi Warisan' },
  { value: 'landskap', name: 'Landskap' },
  { value: 'penasihat-undang-undang', name: 'Penasihat Undang-Undang' },
  { value: 'penguatkuasaan', name: 'Penguatkuasaan' },
  { value: 'penilaian-pengurusan-harta', name: 'Penilaian & Pengurusan Harta' },
  { value: 'perancangan-pembangunan', name: 'Perancangan Pembangunan' },
  { value: 'perbendaharaan', name: 'Perbendaharaan' },
  { value: 'perkhidmatan-perbandaran', name: 'Perkhidmatan Perbandaran' },
  { value: 'pesuruhjaya-bangunan', name: 'Pesuruhjaya Bangunan' },
  { value: 'unit-audit-dalam', name: 'Unit Audit Dalam' },
  { value: 'unit-osc', name: 'Unit OSC' }
]

const Latihan = [
  { value: 'bengkel', name: 'Bengkel' },
  { value: 'kursus', name: 'Kursus' },
  { value: 'lawatan', name: 'Lawatan Kerja' },
  { value: 'persidangan', name: 'Persidangan' },
  { value: 'seminar', name: 'Seminar' },
  { value: 'perjumpaan', name: 'Sesi Perjumpaan' },
  { value: 'taklimat', name: 'Taklimat' },
  { value: 'lain', name: 'Lain-lain' }
]

@Component({
  selector: 'app-permohonan',
  templateUrl: './permohonan.component.html',
  styleUrls: ['./permohonan.component.scss']
})
export class PermohonanComponent implements OnInit {

  jabatanList = Jabatan
  latihanList = Latihan
  viewModal: BsModalRef
  @ViewChild("modalView", { static: false }) modalView: ElementRef
  rejectModal: BsModalRef
  @ViewChild("modalReject", { static: false }) modalReject: ElementRef
  printModal: BsModalRef
  @ViewChild("modalPrint", {static: false}) modalPrint: ElementRef

  default = {
    keyboard: true,
    class: "modal-dialog-centered modal-secondary"
  };

  bsValue
  focus
  
  constructor(
    private toastr: ToastrService,
    private modalService: BsModalService,
    private notifyService: NotifyService,
    private loadingBar: LoadingBarService
  ) { }

  ngOnInit() {
  }

  // Filter by NRIC then pencalonan

  // Filter by Nama Kursus untuk table
  
  showNoti() {
    let title = 'Berjaya'
    let message = 'Permohonan diluluskan'
    setTimeout(
      () => {
        this.notifyService.openToastr(title, message)
      }, 1500
    )
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

  detailModal(modalDefault: TemplateRef<any>) {
    this.viewModal = this.modalService.show(this.modalView, this.default)
  }

  detailsModal(modalDefault: TemplateRef<any>) {
    this.rejectModal = this.modalService.show(this.modalReject, this.default)
  }

  printsModal(modalDefault: TemplateRef<any>) {
    this.printModal = this.modalService.show(this.modalPrint, this.default)
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
