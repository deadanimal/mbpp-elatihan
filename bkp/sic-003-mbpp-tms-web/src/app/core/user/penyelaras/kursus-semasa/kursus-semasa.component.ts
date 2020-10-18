import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
import { Training } from 'src/app/shared/services/trainings/trainings.model';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kursus-semasa',
  templateUrl: './kursus-semasa.component.html',
  styleUrls: ['./kursus-semasa.component.scss']
})
export class KursusSemasaComponent implements OnInit, OnDestroy {

  // Data
  trainings: Training[] = []
  users: Training[] = []
  refresher: any
  focusSearch: any

  // Table
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  tableColumns: string[] = ['course_code', 'title', 'start_date', 'organiser_type', 'max_participant', 'id']
  tableSource: MatTableDataSource<any>

  constructor(
    private modalService: BsModalService,
    private trainingService: TrainingsService,
    private userService: UsersService,
    private loadingBar: LoadingBarService,

    private router: Router
  ) { 
    this.trainingService.get().subscribe(
      () => {},
      () => {},
      () => {
        this.trainings = this.trainingService.trainings
        this.getTableData()
      }
    )
    
  }

  ngOnInit() {
    this.getTableData()
    this.refresher = setInterval(
      () => {
        this.refreshTableData()
      },
      30000
    )
  }

  ngOnDestroy() {
    if (this.refresher) {
      clearInterval(this.refresher)
    }
  }

  getTableData() {
    this.tableSource = new MatTableDataSource<Training>(this.trainings)
    this.tableSource.paginator = this.paginator;
    this.tableSource.sort = this.sort;
  }

  refreshTableData() {
    this.loadingBar.start()
    this.trainingService.get().subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.trainings = this.trainingService.trainings
        this.getTableData()
      }
    )
  }

  filterTable(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.tableSource.filter = filterValue.trim().toLowerCase()
    console.log(this.tableSource.filter)
  }

  viewTrainingDetails(training) {
    this.router.navigate(['/penyelaras/kursus/butiran'], training)
  }

  openSearch() {
    document.body.classList.add("g-navbar-search-showing");
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-showing");
      document.body.classList.add("g-navbar-search-show");
    }, 150);
    setTimeout(function () {
      document.body.classList.add("g-navbar-search-shown");
    }, 300);
  }

  closeSearch() {
    document.body.classList.remove("g-navbar-search-shown");
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-show");
      document.body.classList.add("g-navbar-search-hiding");
    }, 150);
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-hiding");
      document.body.classList.add("g-navbar-search-hidden");
    }, 300);
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-hidden");
    }, 500);
  }

}
