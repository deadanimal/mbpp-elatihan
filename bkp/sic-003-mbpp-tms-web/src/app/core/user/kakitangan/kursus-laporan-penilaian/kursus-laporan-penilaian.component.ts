import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-kursus-laporan-penilaian',
  templateUrl: './kursus-laporan-penilaian.component.html',
  styleUrls: ['./kursus-laporan-penilaian.component.scss']
})
export class KursusLaporanPenilaianComponent implements OnInit {

  constructor(
    private toastr: ToastrService
  ) { }

  ngOnInit() {
  }

  showNoti() {
    this.toastr.show(
      '<span class="fas fa-file-download" data-notify="icon"></span> <div class="alert-text"</div> <span class="alert-title" data-notify="title">Berjaya</span> <span data-notify="message">Laporan penilaian anda berjaya dihantar</span></div>',
      "",
      {
        timeOut: 3000,
        closeButton: true,
        enableHtml: true,
        tapToDismiss: true,
        titleClass: "alert-title",
        positionClass: "toast-top-right",
        toastClass:
          "ngx-toastr alert alert-dismissible alert-success alert-notify"
      }
    )
  }

}
