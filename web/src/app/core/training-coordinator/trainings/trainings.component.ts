import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Training } from 'src/app/shared/services/trainings/trainings.model';
import * as moment from 'moment';

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
    private loadingBar: LoadingBarService,
    private router: Router,
  ) { 
    this.getData()
  }

  ngOnInit() {
  }

  getData() {
    let filterField = 'staff=' + this.authService.userID
    // console.log(filterField)
    // console.log('boom')
    this.loadingBar.start()
    this.trainingService.filter(filterField).subscribe(
      () => {
        this.loadingBar.complete()
        this.trainings = this.trainingService.trainingsFiltered
        this.tableRows = this.trainings
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

  view(path: string, selected: Training) {
    
    this.router.navigate([path])
  }

}
