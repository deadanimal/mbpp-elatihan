import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Training } from 'src/app/shared/services/trainings/trainings.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // Data
  trainings: Training[] = []
  trainingSelected: Training
  currentDate: Date = new Date();
  
  // Checker
  isCollapsed = true
  
  // Modal
  defaultModal: BsModalRef;
  default = {
    keyboard: true,
    class: "modal-dialog-centered modal-lg"
  }

  // Subscriber
  subscription: Subscription
  
  constructor(
    private modalService: BsModalService,
    private trainingService: TrainingsService,
    private loadingBar: LoadingBarService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getData()
    // this.initServices()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  getData() {
    this.loadingBar.start()
    this.subscription = this.trainingService.getLatest().subscribe(
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

  openModal(modalDefault: TemplateRef<any>, selectedTraining) {
    this.trainingSelected = selectedTraining
    this.defaultModal = this.modalService.show(modalDefault, this.default)
  }

  closeModal() {
    this.trainingSelected = null
    this.defaultModal.hide()
  }

  navigatePage(id: string) {
    let path = '/auth/login'
    let queryParams = {
      queryParams: {
        redirect: true,
        id: id
      }
    }
    this.router.navigate([path], queryParams)
    this.closeModal()
  }

}
