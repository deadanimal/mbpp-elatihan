import { Component, OnInit, TemplateRef } from '@angular/core';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
import { TrainingNotesService } from 'src/app/shared/services/training-notes/training-notes.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Training } from 'src/app/shared/services/trainings/trainings.model';
import { TrainingNote } from 'src/app/shared/services/training-notes/training-notes.model';

@Component({
  selector: 'app-kursus-butiran',
  templateUrl: './kursus-butiran.component.html',
  styleUrls: ['./kursus-butiran.component.scss']
})
export class KursusButiranComponent implements OnInit {

  // Data
  public selectedTraining: Training = null
  public trainingNote: TrainingNote[] = []

   // Datepicker
	public datePickerConfig = { 
		isAnimated: true, 
		containerClass: 'theme-blue' 
	}
  public datePickerValue

  // Modal
  public modalRef: BsModalRef
  public modalOptions = {
    keyboard: true,
    class: "modal-dialog-centered"
  }

  constructor(
    private trainingService: TrainingsService,
    private trainingNoteService: TrainingNotesService,

    private modalService: BsModalService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
  }

  openModalQR(modalTemplateRef: TemplateRef<any>) {
    this.modalRef = this.modalService.show(modalTemplateRef, this.modalOptions)
  }

}
