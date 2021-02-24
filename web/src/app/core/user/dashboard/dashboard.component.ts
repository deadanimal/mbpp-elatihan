import { Component, OnInit, TemplateRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';

import { ApplicationSelfExtended } from 'src/app/shared/services/applications/applications.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ApplicationsService } from 'src/app/shared/services/applications/applications.service';

import * as moment from 'moment';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { User } from 'src/app/shared/services/users/users.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { SecurityService } from 'src/app/shared/services/security/security.service';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // Data
  // training: Training
  // trainings: Training[] = []
  applications: ApplicationSelfExtended[] = []
  summary: any
  totalTrainings: number = 0
  totalExams: number = 0
  totalDays: number = 0
  user: User

  // Gauge
  gaugeType = 'full'
  gaugeMin = 0
  gaugeMax = 5
  gaugeLabel = 'Dihadiri'
  gaugeLabelApplied = 'Didaftar'
  gaugeTrainingsAppend = 'kursus'
  gaugeExamsAppend = 'peperiksaan'
  gaugeDaysAppend = 'hari'
  gaugeConfig = {
    '0': { color: 'red' },
    '3': { color: 'orange' },
    '5': { color: 'green' }
  }

  // Table
  tableEntries: number = 5
  tableSelected: any[] = []
  tableTemp = []
  tableActiveRow: any
  tableRows: any = []
  tableMessages = { 
    emptyMessage: 'Tiada rekod dijumpai',
    totalMessage: 'rekod'
  }
  SelectionType = SelectionType;

  // Checker
  isEmpty: boolean = true

  // Icon
  iconEmpty = 'assets/img/icons/box.svg'
  iconTraining = 'assets/img/icons/training.svg'
  iconExam = 'assets/img/icons/exam.svg'
  iconError = 'assets/img/icons/error.svg'

  // Modal
  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered"
  };

  constructor(
    private authService: AuthService,
    private applicationService: ApplicationsService,
    private securityService: SecurityService,
    private userService: UsersService,
    private loadingBar: LoadingBarService,
    private modalService: BsModalService,
    private router: Router
  ) { 
    this.getData()
  }

  ngOnInit() {
  }

  getData() {
    this.loadingBar.start()

    forkJoin([
      this.applicationService.getSelf(),
      this.userService.getSummarySelf(),
      this.securityService.checker()
    ]).subscribe(
      () => {
        this.loadingBar.complete()
        this.applications = this.applicationService.applicationsSelf
        this.summary = this.userService.summary
        this.tableRows = this.applications
        // this.tableRows.forEach(
        //   (row) => {
        //     row.created_at = moment(row.created_at).format('DD/MM/YYYY')
        //   }
        // )
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.tableTemp = this.tableRows.map((prop, key) => {
          return {
            ...prop,
            id_index: key+1
          };
        });

        if (this.tableTemp.length >= 1) {
          this.isEmpty = false
        }
        else {
          this.isEmpty = true
        }

        this.totalTrainings = this.summary['trainings']
        this.totalExams = this.summary['exams']
        this.totalDays = this.summary['attendances']
        this.user = this.authService.userDetail
      }
    )
  }

  entriesChange($event) {
    this.tableEntries = $event.target.value;
  }

  filterTable($event) {
    let val = $event.target.value.toLowerCase();
    this.tableTemp = this.tableRows.filter(function(d) {
      return d.training.title.toLowerCase().indexOf(val) !== -1 || !val;
    });
  }

  onSelect({ selected }) {
    this.tableSelected.splice(0, this.tableSelected.length);
    this.tableSelected.push(...selected);
  }

  onActivate(event) {
    this.tableActiveRow = event.row;
  }

  view(id, status) {
    let pathApproved = '/trainings/detail'
    let pathNotApproved = '/trainings/information'
    let extras = id
    let queryParams = {
      queryParams: {
        id: extras
      }
    }

    if (status == 'AP') {
      this.router.navigate([pathApproved], queryParams)
    }
    else {
      this.router.navigate([pathNotApproved], queryParams)
    }
  }

  openModal(modalRef: TemplateRef<any>) {
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  closeModal() {
    this.modal.hide()
  }

}
