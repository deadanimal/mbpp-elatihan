import { Component, OnInit } from '@angular/core';
import { ExamsService } from 'src/app/shared/services/exams/exams.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Exam, ExamAttendee, ExamAttendeeExtended } from 'src/app/shared/services/exams/exams.model';

import * as moment from 'moment';
import { EvaluationsService } from 'src/app/shared/services/evaluations/evaluations.service';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.scss']
})
export class EvaluationsComponent implements OnInit {

  // Data
  exams: any[] = []

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
    private examService: ExamsService,
    private evaluationService: EvaluationsService,
    private loadingBar: LoadingBarService
  ) { 
    // this.getData()
  }

  ngOnInit() {
  }

  getData() {
    // console.log(filterField)
    // console.log('boom')
    this.loadingBar.start()
    this.examService.getSelf().subscribe(
      () => {
        this.loadingBar.complete()
        this.exams = this.examService.attendees
        this.tableRows = this.exams
        this.tableRows.forEach(
          (row) => {
            row.date = moment(row.date).format('DD/MM/YYYY')
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
      return d.title.toLowerCase().indexOf(val) !== -1 || !val;
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
