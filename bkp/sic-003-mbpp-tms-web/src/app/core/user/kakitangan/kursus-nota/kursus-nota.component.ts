import { Component, OnInit } from '@angular/core';
import { TrainingNotesService } from 'src/app/shared/services/training-notes/training-notes.service';
import { TrainingNote } from 'src/app/shared/services/training-notes/training-notes.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-kursus-nota',
  templateUrl: './kursus-nota.component.html',
  styleUrls: ['./kursus-nota.component.scss']
})
export class KursusNotaComponent implements OnInit {

  public trainingNotes: TrainingNote[] = []
  constructor(
    private trainingNoteService: TrainingNotesService,

    private toastr: ToastrService
  ) { }

  ngOnInit() {
  }

  downloadingNoteToastr() {
    this.toastr.show(
      '<span class="fas fa-file-download" data-notify="icon"></span> <div class="alert-text"</div> <span class="alert-title" data-notify="title">Muat turun</span> <span data-notify="message">Nota anda sedang dimuat turun</span></div>',
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
