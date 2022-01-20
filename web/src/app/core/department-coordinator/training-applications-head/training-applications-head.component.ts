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
  selector: 'app-training-applications-head',
  templateUrl: './training-applications-head.component.html',
  styleUrls: ['./training-applications-head.component.scss']
})
export class TrainingApplicationsHeadComponent implements OnInit {

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
      this.applicationService.getDepartmentHeadList()
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
        return d.applicant.full_name.toLowerCase().indexOf(val) !== -1 || !val;
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
    
    this.applicationService.approveLevel2(row['id']).subscribe(
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

  rejectApplication(row) {
    this.loadingBar.start()
    let infoTitle = 'Sedang proses'
    let infoMessage = 'Permohonan sedang ditolak'
    this.notifyService.openToastrInfo(infoTitle, infoMessage)
    
    this.applicationService.reject(row['id']).subscribe(
      () => {
        this.loadingBar.complete()
        let successTitle = 'Berjaya'
        let successMessage = 'Permohonan berjaya ditolak'
        this.notifyService.openToastr(successTitle, successMessage)
      },
      () => {
        this.loadingBar.complete()
        let failedTitle = 'Tidak Berjaya'
        let failedMessage = 'Permohonan tidak berjaya ditolak. Sila cuba sekali lagi'
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

}
