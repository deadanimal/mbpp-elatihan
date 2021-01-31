import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';

import { ApplicationSelfExtended } from 'src/app/shared/services/applications/applications.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ApplicationsService } from 'src/app/shared/services/applications/applications.service';

import * as moment from 'moment';

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
    private applicationService: ApplicationsService,
    private loadingBar: LoadingBarService,
    private router: Router
  ) { 
    this.getData()
  }

  ngOnInit() {
  }

  getData() {
    this.loadingBar.start()

    forkJoin([
      this.applicationService.getSelf()
    ]).subscribe(
      () => {
        this.loadingBar.complete()
        this.applications = this.applicationService.applicationsSelf
        this.tableRows = this.applications
        this.tableRows.forEach(
          (row) => {
            row.created_at = moment(row.created_at).format('DD/MM/YYYY')
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

  c(id) {
    let path = '/trainings/information'
    let extras = id
    let queryParams = {
      queryParams: {
        id: extras
      }
    }
    this.router.navigate([path], queryParams)
  }

}
