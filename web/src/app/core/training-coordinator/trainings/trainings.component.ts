import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Training, TrainingType } from 'src/app/shared/services/trainings/trainings.model';

import * as moment from 'moment';
import * as xlsx from 'xlsx';
import { forkJoin } from 'rxjs';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.scss']
})
export class TrainingsComponent implements OnInit {

  // Data
  trainings: Training[] = []
  trainingTypes: TrainingType[] = []
  yearSelection

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
  isSummaryTableHidden: boolean = true

  // Icon
  iconEmpty = 'assets/img/icons/box.svg'

  constructor(
    private authService: AuthService,
    private trainingService: TrainingsService,
    private loadingBar: LoadingBarService,
    private router: Router,
  ) { 
    this.getData()
  }

  ngOnInit() {
  }

  getData() {
    // let filterField = 'staff=' + this.authService.userID
    // console.log(filterField)
    // console.log('boom')
    this.loadingBar.start()
    let yearSelection_ = []
    forkJoin([
      this.trainingService.getAll(),
      this.trainingService.getTrainingTypes()
    ]).subscribe(
      () => {
        this.loadingBar.complete()
        this.trainings = this.trainingService.trainings
        this.trainingTypes = this.trainingService.trainingTypes
        this.tableRows = this.trainings
        this.tableRows.forEach(
          (row) => {
            row['start_date'] = moment(row.start_date, 'YYYY-MM-DD').format('DD/MM/YYYY')
            row['end_date'] = moment(row.end_date, 'YYYY-MM-DD').format('DD/MM/YYYY')
            row['start_date_year'] = moment(row.start_date, 'DD/MM/YYYY').format('YYYY')
            yearSelection_.push(row['start_date_year'])
          }
        )
        // console.log(yearSelection_)
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

        this.yearSelection = new Set(yearSelection_)
        // console.log('year:', this.yearSelection)
      }
    )
  }

  entriesChange($event) {
    this.tableEntries = $event.target.value;
  }

  filterTable($event, type) {
    let val = $event.target.value.toLowerCase();
    if (type == 'title') {
      this.tableTemp = this.tableRows.filter(function(d) {
        return d.title.toLowerCase().indexOf(val) !== -1 || !val;
      });
    }
    else if (type == 'organiser_type') {
      if (val == 'aa') {
        this.tableTemp = this.tableRows
      }
      else {
        this.tableTemp = this.tableRows.filter(function(d) {
          return d.organiser_type.toLowerCase().indexOf(val) !== -1 || !val;
        });
      }
    }
    else if (type == 'year') {
      if (val == 'aa') {
        this.tableTemp = this.tableRows
      }
      else {
        this.tableTemp = this.tableRows.filter(function(d) {
          return d.start_date_year.toLowerCase().indexOf(val) !== -1 || !val;
        });
      }
    }
  }

  onSelect({ selected }) {
    this.tableSelected.splice(0, this.tableSelected.length);
    this.tableSelected.push(...selected);
  }

  onActivate(event) {
    this.tableActiveRow = event.row;
  }

  view(selected) {
    let path = '/tc/trainings/details'
    let extras = selected['id']
    let queryParams = {
      queryParams: {
        id: extras
      }
    }
    this.router.navigate([path], queryParams)
  }

  exportExcel() {
    let todayDate = new Date()
    let todayDateFormat = moment(todayDate).format('YYYYMMDD')
    let fileName = 'Ringkasan_Latihan_' + todayDateFormat + '.xlsx'
    let element = document.getElementById('summaryTable'); 
    const ws: xlsx.WorkSheet = xlsx.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    xlsx.writeFile(wb, fileName);
  }

}
