import { Component, OnInit } from '@angular/core';
import { Training } from 'src/app/shared/services/trainings/trainings.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
import { ApplicationsService } from 'src/app/shared/services/applications/applications.service';
import { LoadingBarService } from '@ngx-loading-bar/core';

import * as moment from 'moment';
import { Application } from 'src/app/shared/services/applications/applications.model';

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
  training: Training
  trainings: Training[] = []
  applications: Application[] = []
  totalTrainings: number = 0
  totalExams: number = 0
  totalDays: number = 0

  // Gauge
  gaugeType = 'full'
  gaugeMin = 0
  gaugeMax = 5
  gaugeLabel = 'Dihadiri'
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

  constructor(
    private authService: AuthService,
    private trainingService: TrainingsService,
    private applicationService: ApplicationsService,
    private loadingBar: LoadingBarService
  ) { }

  ngOnInit() {
  }

  getData() {
    let filterField = 'applicant=' + this.authService.userID + 'is_approved=1'
    this.loadingBar.start()
    this.applicationService.filter(filterField).subscribe(
      () => {
        this.loadingBar.complete()
        this.applications = this.applicationService.applicationsFiltered
        this.tableRows = this.applications
        this.tableRows.forEach(
          (row) => {
            row.date = moment(row.date).format('DD/MM/YYYY')
          }
        )
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
      }
    )
  }

  entriesChange($event) {
    this.tableEntries = $event.target.value;
  }

  filterTable($event) {
    let val = $event.target.value.toLowerCase();
    this.tableTemp = this.tableRows.filter(function(d) {
      return d.title.toLowerCase().indexOf(val) ! == -1 || !val;
    });
  }

  onSelect({ selected }) {
    this.tableSelected.splice(0, this.tableSelected.length);
    this.tableSelected.push(...selected);
  }

  onActivate(event) {
    this.tableActiveRow = event.row;
  }

}
