import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TrainingAttendancesService } from 'src/app/shared/services/training-attendances/training-attendances.service';
import { TrainingApplicationsService } from 'src/app/shared/services/training-applications/training-applications.service';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('notify', {static: true}) modalTemplate : TemplateRef<any>;

  //Gauge
  gaugeTrainingType = "arch"
  gaugeTrainingValue = "1"
  gaugeTraningLabel = "Kursus"
  gaugeTrainingText = "jumlah"
  gaugeTrainingMax = "5"

  gaugeExamType = "arch"
  gaugeExamValue = "1"
  gaugeExamLabel = "Peperiksaan"
  gaugeExamText = "jumlah"
  gaugeExamMax = "5"

  gaugeDayType = "arch"
  gaugeDayValue = "1"
  gaugeDayLabel = "Hari Berkursus"
  gaugeDayText = "jumlah"
  gaugeDayMax = "5"

  gaugethresholdConfig = {
    '0': { color: 'red' },
    '3': { color: 'orange' },
    '5': { color: 'green' }
  };

  // New

  totalTrainings: number = 0
  totalExams: number = 0
  totalDays: number = 0

  isAdaPenilaian: boolean = true

  // Modal
  modal: BsModalRef;
  modalConfig = {
    keyboard: false,
    class: "modal-dialog-centered"
  };
  
  constructor(
    private trainingAttendanceService: TrainingAttendancesService,
    private trainingApplicationService: TrainingApplicationsService,

    private modalService: BsModalService,
    private router: Router
  ) { }

  ngOnInit() {
    this.checkPenilaian()
    this.getStats()
  }

  getStats() {
    // Senang buat trainings history, + yang approved
    console.log('Get trainings')
    // Sama macam atas
    console.log('Get exams')
    // Get trainings history, totalkan semua duration dalam training
    console.log('Get days')
  }

  viewNotes() {
    this.router.navigate(['/kakitangan/kursus/nota'])
    console.log('test')
  }

  viewInformation() {
    this.router.navigate(['/kakitangan/kursus/butiran'])
  }

  rateTraining() {
    this.modal.hide()
    this.isAdaPenilaian = false
    this.router.navigate(['/kakitangan/kursus/penilaian'])
  }

  attendance() {
    this.router.navigate(['/kakitangan/kursus/kehadiran'])
  }

  checkPenilaian() {
    if (this.isAdaPenilaian) {
      this.openModal(this.modalTemplate)
    }
    else {
      console.log('Not first login')
    }
  }

  openModal(modalRef: TemplateRef<any>) {
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

}
