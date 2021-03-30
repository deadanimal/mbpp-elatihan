import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
import { AttendancesService } from 'src/app/shared/services/attendances/attendances.service';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Training } from 'src/app/shared/services/trainings/trainings.model';
import { Attendance } from 'src/app/shared/services/attendances/attendances.model';

import * as moment from 'moment';
import { ApplicationsService } from 'src/app/shared/services/applications/applications.service';
import { Application, ApplicationExtended, ApplicationSelfExtended } from 'src/app/shared/services/applications/applications.model';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-training-history',
  templateUrl: './training-history.component.html',
  styleUrls: ['./training-history.component.scss']
})
export class TrainingHistoryComponent implements OnInit {

  // Data
  applications: ApplicationSelfExtended[] = []
  attendance: Attendance[] = []

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
    private attendanceService: AttendancesService,
    private loadingBar: LoadingBarService,
    private router: Router
  ) { 
    this.getData()
  }

  ngOnInit() {
  }

  getData() {
    this.loadingBar.start()
    this.applicationService.getSelfHistory().subscribe(
      () => {
        this.loadingBar.complete()
        this.applications = this.applicationService.applicationsHistory
        this.tableRows = this.applications
        this.tableRows.forEach(
          (row) => {
            row.start_date = moment(row.start_date).format('DD/MM/YYYY')
            row.end_date = moment(row.end_date).format('DD/MM/YYYY')
          }
        )
        // console.log(this.tableRows)
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

  view(training) {
    let path = '/trainings/evaluate'
    let extras = training['id']
    let organiser_type = 'DD'

    if (training['organiser_type'] == 'DD') {
      organiser_type = 'DD'
    }
    else {
      organiser_type = 'LL'
    }
    let queryParams = {
      queryParams: {
        id: extras,
        type: organiser_type
      }
    }
    this.router.navigate([path], queryParams)
  }

  navigatePage(path: string) {
    this.router.navigate([path])
  }

}
