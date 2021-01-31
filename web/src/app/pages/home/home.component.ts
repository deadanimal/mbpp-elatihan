import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { ExamsService } from 'src/app/shared/services/exams/exams.service';
import { OrganisationsService } from 'src/app/shared/services/organisations/organisations.service';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Training } from 'src/app/shared/services/trainings/trainings.model';

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
  
  trainings: Training[] = []
  trainingSelected: Training
  
  defaultModal: BsModalRef;
  default = {
    keyboard: true,
    class: "modal-dialog-centered modal-lg"
  }
  
  constructor(
    private modalService: BsModalService,
    private examService: ExamsService,
    private organisationService: OrganisationsService,
    private trainingService: TrainingsService,
    private userService: UsersService,
    private loadingBar: LoadingBarService
  ) { }

  ngOnInit() {
    this.getData()
    // this.initServices()
  }

  getData() {
    this.loadingBar.start()
    this.trainingService.getLatest().subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.trainings = this.trainingService.trainings
      }
    )
  }

  // Susun latihan ikut teras, functional pelanc

  openDefaultModal(modalDefault: TemplateRef<any>, selectedTraining) {
    this.trainingSelected = selectedTraining
    this.defaultModal = this.modalService.show(modalDefault, this.default)
  }

  closeDefaultModal() {
    this.trainingSelected = null
    this.defaultModal.hide()
  }

  initTable() {
    //this.jaduals = 
  }

}
