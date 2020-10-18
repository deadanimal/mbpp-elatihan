import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { Training } from 'src/app/shared/services/trainings/trainings.model';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';

@Component({
  selector: 'app-kursus-sejarah',
  templateUrl: './kursus-sejarah.component.html',
  styleUrls: ['./kursus-sejarah.component.scss']
})
export class KursusSejarahComponent implements OnInit {
  
  // kod
  // tajuk
  // tarikh mula
  // tarikh tamat
  // status

  public trainingHistories: any[] = []
  public trainings: Training[] = []
  
  // table

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  tableColumns: string[] = ['code', 'title', 'start_date', 'end_date', 'status', 'id']
  tableSource: MatTableDataSource<any>


  constructor(
    private router: Router,
    private trainingService: TrainingsService,

    private loadingBar: LoadingBarService
  ) { }

  ngOnInit() {
    this.initData()
  }

  getTrainingHistory() {
    //
    this.trainingHistories // =
  }

  initData() {
    this.tableSource = new MatTableDataSource<Training>(this.trainings)
    this.tableSource.paginator = this.paginator;
    this.tableSource.sort = this.sort;
    //console.log(this.tableSource)
  }

  refreshData() {
    this.loadingBar.start()
    //this.userService.retrieveAllUsers().subscribe(
      // (res) => {
        //this.tempAllUsers = res
        //this.tableSource = new MatTableDataSource<User>(res)
        //this.tableSource.paginator = this.paginator;
        //this.tableSource.sort = this.sort;
        //this.loadingBar.complete()
        //this.successfulRefreshToastr()
        //console.log('updt', res)
      //}
    //)
  }

  applyFilter(filterValue: string) {
    this.tableSource.filter = filterValue.trim().toLowerCase()
    console.log(this.tableSource.filter)
  }

  viewDetails(id: string) {
    // With data from traiing
    this.router.navigate(['/kakitangan/kursus/kursus-laporan'])
  }

  reporting() {
    this.router.navigate(['/kakitangan/kursus/laporan-penilaian'])
  }

  printHistory() {
    console.log('Print service')
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
