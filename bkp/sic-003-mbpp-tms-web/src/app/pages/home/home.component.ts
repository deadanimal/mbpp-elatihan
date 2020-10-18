import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { ExamApplicationsService } from 'src/app/shared/services/exam-applications/exam-applications.service';
import { ExamAttendancesService } from 'src/app/shared/services/exam-attendances/exam-attendances.service';
import { ExamResultsService } from 'src/app/shared/services/exam-results/exam-results.service';
import { ExamsService } from 'src/app/shared/services/exams/exams.service';
import { OrganisationsService } from 'src/app/shared/services/organisations/organisations.service';
import { OrganisationTypesService } from 'src/app/shared/services/organisation-types/organisation-types.service';
import { TrainingAbsencesService } from 'src/app/shared/services/training-absences/training-absences.service';
import { TrainingApplicationsService } from 'src/app/shared/services/training-applications/training-applications.service';
import { TrainingAssessmentAnswersService } from 'src/app/shared/services/training-assessment-answers/training-assessment-answers.service';
import { TrainingAssessmentQuestionsService } from 'src/app/shared/services/training-assessment-questions/training-assessment-questions.service';
import { TrainingAttendancesService } from 'src/app/shared/services/training-attendances/training-attendances.service';
import { TrainingNeedAnswersService } from 'src/app/shared/services/training-need-answers/training-need-answers.service';
import { TrainingNeedQuestionsService } from 'src/app/shared/services/training-need-questions/training-need-questions.service';
import { TrainingNotesService } from 'src/app/shared/services/training-notes/training-notes.service';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { LoadingBarService } from '@ngx-loading-bar/core';

const jadualList = [{
  "tajuk": "Kursus Programming",
  "tarikh": "24/11/2018",
  "lokasi": "Perak",
  "tempoh": "3 hari"
}, {
  "tajuk": "Kursus Programming",
  "tarikh": "22/09/2019",
  "lokasi": "Pulau Pinang",
  "tempoh": "2 hari"
}, {
  "tajuk": "Kursus Jati Diri",
  "tarikh": "20/06/2019",
  "lokasi": "Pulau Pinang",
  "tempoh": "3 hari"
}, {
  "tajuk": "Kursus Programming",
  "tarikh": "06/03/2019",
  "lokasi": "Perak",
  "tempoh": "3 hari"
}, {
  "tajuk": "Kursus Jati Diri",
  "tarikh": "16/04/2019",
  "lokasi": "Kedah",
  "tempoh": "3 hari"
}, {
  "tajuk": "Kursus Pengandalian",
  "tarikh": "24/03/2019",
  "lokasi": "Pulau Pinang",
  "tempoh": "1 hari"
}, {
  "tajuk": "Kursus Pengenalan Office",
  "tarikh": "04/05/2019",
  "lokasi": "Perak",
  "tempoh": "1 hari"
}, {
  "tajuk": "Kursus Programming",
  "tarikh": "14/06/2019",
  "lokasi": "Perak",
  "tempoh": "1 hari"
}, {
  "tajuk": "Kursus Pengandalian",
  "tarikh": "30/12/2018",
  "lokasi": "Pulau Pinang",
  "tempoh": "2 hari"
}, {
  "tajuk": "Kursus Pengenalan Office",
  "tarikh": "05/04/2019",
  "lokasi": "Pulau Pinang",
  "tempoh": "3 hari"
}]

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  test: Date = new Date()
  isCollapsed = true
  
  public tempTrainings
  public tempSelectedTraining

  defaultModal: BsModalRef;
  default = {
    keyboard: true,
    class: "modal-dialog-centered modal-lg"
  }
  
  constructor(
    private modalService: BsModalService,
    private examApplicationService: ExamApplicationsService,
    private examAttendanceService: ExamAttendancesService,
    private examResultService: ExamResultsService,
    private examService: ExamsService,
    private organisationService: OrganisationsService,
    private organisationTypeService: OrganisationTypesService,
    private trainingAbsenceService: TrainingAbsencesService,
    private trainingApplicationService: TrainingApplicationsService,
    private trainingAssessmentAnswerService: TrainingAssessmentAnswersService,
    private trainingAsessmentQuestionService: TrainingAssessmentQuestionsService,
    private trainingAttendanceService: TrainingAttendancesService,
    private trainingNeedAnswerService: TrainingNeedAnswersService,
    private trainingNeedQuestionService: TrainingNeedQuestionsService,
    private trainingNoteService: TrainingNotesService,
    private trainingService: TrainingsService,
    private userService: UsersService,
    private loadingBar: LoadingBarService
  ) { }

  ngOnInit() {
    this.initServices()
  }

  // Susun latihan ikut teras, functional pelanc

  initServices() {
    this.loadingBar.start()

    // this.examApplicationService.get().subscribe()
    // this.examAttendanceService.get().subscribe()
    // this.examResultService.get().subscribe()
    this.examService.get().subscribe()
    this.organisationService.get().subscribe()
    // this.organisationTypeService.get().subscribe()
    // this.trainingAbsenceService.get().subscribe()
    // this.trainingApplicationService.get().subscribe()
    // this.trainingAssessmentAnswerService.get().subscribe()
    // this.trainingAsessmentQuestionService.get().subscribe()
    // this.trainingAttendanceService.get().subscribe()
    // this.trainingNeedAnswerService.get().subscribe()
    // this.trainingNeedQuestionService.get().subscribe()
    this.trainingNoteService.get().subscribe()
    this.trainingService.get().subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.tempTrainings = this.trainingService.trainings
        console.log(this.tempTrainings)
      }

    )
    this.userService.get().subscribe()
  }

  openDefaultModal(modalDefault: TemplateRef<any>, selectedTraining) {
    this.defaultModal = this.modalService.show(modalDefault, this.default)
    this.tempSelectedTraining = selectedTraining
  }

  closeDefaultModal() {
    this.defaultModal.hide()
    this.tempSelectedTraining = null
  }

  initTable() {
    //this.jaduals = 
  }




}
