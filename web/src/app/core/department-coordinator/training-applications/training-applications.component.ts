import { Component, OnInit } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { Router } from '@angular/router';

import { ApplicationDepartmentExtended } from 'src/app/shared/services/applications/applications.model';
import { ApplicationsService } from 'src/app/shared/services/applications/applications.service';

import * as moment from 'moment';
import * as xlsx from 'xlsx';
import { forkJoin } from 'rxjs';
import { Section } from 'src/app/shared/code/user';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-training-applications',
  templateUrl: './training-applications.component.html',
  styleUrls: ['./training-applications.component.scss']
})
export class TrainingApplicationsComponent implements OnInit {

  // Data
  applications: ApplicationDepartmentExtended[] = []
  sections = Section

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
    private applicationService: ApplicationsService,
    private loadingBar: LoadingBarService,
    private notifyService: NotifyService,
    private router: Router
  ) { 
    this.getData()
  }

  ngOnInit() {
  }

  getData() {
    this.loadingBar.start()
    forkJoin([
      this.applicationService.getDepartmentCoordinatorList()
    ]).subscribe(
      () => {
        this.loadingBar.complete()
        this.applications = this.applicationService.applicationsDepartment
        this.tableRows = this.applications
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

  filterTable($event, type) {
    let val = $event.target.value.toLowerCase();
    if (type == 'name') {
      this.tableTemp = this.tableRows.filter(function(d) {
        return d.applicant.title.toLowerCase().indexOf(val) !== -1 || !val;
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
    let path = '/dc/trainings/information'
    let extras = selected['training']['id']
    let queryParams = {
      queryParams: {
        id: extras
      }
    }
    this.router.navigate([path], queryParams)
  }

  approveApplication(row) {
    this.loadingBar.start()
    let infoTitle = 'Sedang proses'
    let infoMessage = 'Permohonan sedang diterima'
    this.notifyService.openToastrInfo(infoTitle, infoMessage)

    // console.log('row id ', row.id)
    
    this.applicationService.approveLevel1(row['id']).subscribe(
      () => {
        this.loadingBar.complete()
        let successTitle = 'Berjaya'
        let successMessage = 'Permohonan berjaya diterima'
        this.notifyService.openToastr(successTitle, successMessage)
      },
      () => {
        this.loadingBar.complete()
        let failedTitle = 'Tidak Berjaya'
        let failedMessage = 'Permohonan tidak berjaya diterima. Sila cuba sekali lagi'
        this.notifyService.openToastrError(failedTitle, failedMessage)
      },
      () => {
        this.getData()
      }
    )
  }

  exportExcel() {
    let todayDate = new Date()
    let todayDateFormat = moment(todayDate).format('YYYYMMDD')
    let fileName = 'Ringkasan_Permohonan_Latihan_Jabatan_' + todayDateFormat + '.xlsx'
    let element = document.getElementById('summaryTable'); 
    const ws: xlsx.WorkSheet = xlsx.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    xlsx.writeFile(wb, fileName);
  }

  checkRow(row) {
    for (let i = 0; i < this.tableTemp.length; i++) {
      if (this.tableTemp[i].id == row.id) {
        this.tableTemp[i].isTick = row.isTick;
      }
      // console.log('row tick', this.tableTemp[i].isTick )
    }
  }

  selectAllRow(){
    if(this.tableTemp[0].isTick == true){
      for (let i=0; i < this.tableTemp.length; i++) {
        this.tableTemp[i].isTick = false
      }
    }
    else {
      for (let i=0; i < this.tableTemp.length; i++) {
        this.tableTemp[i].isTick = true
      }
    }
  }

  bulkTerimaPermohonan() {

    for (let i = 0; i < this.tableTemp.length; i++) {
      if (this.tableTemp[i].isTick == true) {
        // console.log('tick row',this.tableTemp[i].id)
        this.applicationService.approveLevel1(this.tableTemp[i].id).subscribe(
          () => {
            this.loadingBar.complete()
            let successTitle = 'Berjaya'
            let successMessage = 'Permohonan berjaya diterima'
            this.notifyService.openToastr(successTitle, successMessage)
          },
          () => {
            this.loadingBar.complete()
            let failedTitle = 'Tidak Berjaya'
            let failedMessage = 'Permohonan tidak berjaya diterima. Sila cuba sekali lagi'
            this.notifyService.openToastrError(failedTitle, failedMessage)
          },
          () => {
            this.getData()
          }
        )
      }
    }
  }

  // bulkTerimaPermohonanContoh() {
  //   // this.spinner.show();
  //   // console.log('no of row',this.tableApplicationsTemp.length)
  //   this.loadingBar.start()
  //   let infoTitle = 'Sedang proses'
  //   let infoMessage = 'Permohonan sedang diterima'
  //   this.notifyService.openToastrInfo(infoTitle, infoMessage)

  //   for (let i = 0; i < this.tableApplicationsTemp.length; i++) {
  //     if (this.tableApplicationsTemp[i].isTick == true) {

  //       this.applicationService.approveLevel3(this.tableApplicationsTemp[i].id).subscribe(
  //         () => {
  //           this.loadingBar.complete()
  //           let successTitle = 'Berjaya'
  //           let successMessage = 'Permohonan berjaya diterima'
  //           this.notifyService.openToastr(successTitle, successMessage)
  //         },
  //         () => {
  //           this.loadingBar.complete()
  //           let failedTitle = 'Tidak Berjaya'
  //           let failedMessage = 'Permohonan tidak berjaya diterima. Sila cuba sekali lagi'
  //           this.notifyService.openToastrError(failedTitle, failedMessage)
  //         },
  //         () => {
  //           this.getData()
  //         }
  //       )
        
  //     // console.log('tick row',this.tableApplicationsTemp[i].id)
  //     }
  //     // this.numRow = i
  //   }

  // }

}
