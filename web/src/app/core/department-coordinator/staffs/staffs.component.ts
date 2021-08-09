import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { forkJoin } from 'rxjs';

import { Department, Section, ServiceStatus, UserType } from 'src/app/shared/code/user';
import { User } from 'src/app/shared/services/users/users.model';
import { UsersService } from 'src/app/shared/services/users/users.service';

import * as moment from 'moment';
import * as xlsx from 'xlsx';
import swal from 'sweetalert2';

export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox'
}

@Component({
  selector: 'app-staffs',
  templateUrl: './staffs.component.html',
  styleUrls: ['./staffs.component.scss']
})
export class StaffsComponent implements OnInit {

  // Data
  staffs: User[] = []

  // Predefined
  userTypes = UserType
  serviceStatus = ServiceStatus
  sections = Section
  departments = Department
  
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
    private userService: UsersService,
    private loadingBar: LoadingBarService,
    private router: Router,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.getData()
  }

  ngOnDestroy() {

  }

  getData() {
    this.loadingBar.start()
    forkJoin([
      this.userService.getDepartmentStaffs()
    ]).subscribe(
      () => {
        this.loadingBar.complete()
        this.staffs = this.userService.users
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.tableRows = this.staffs
        this.tableTemp = this.tableRows.map((prop, key) => {
          return {
            ...prop,
            id_index: key + 1
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
    this.tableTemp = this.tableRows.filter(function (d) {
      return d.full_name.toLowerCase().indexOf(val) !== -1 || !val;
    });
  }

  onSelect({ selected }) {
    this.tableSelected.splice(0, this.tableSelected.length);
    this.tableSelected.push(...selected);
  }

  onActivate(event) {
    this.tableActiveRow = event.row;
  }

  navigatePage(staffID) {
    // console.log(staffID)
  }

  exportExcel() {
    let todayDate = new Date()
    let todayDateFormat = moment(todayDate).format('YYYYMMDD')
    let fileName = 'Ringkasan_Kakitangan_Jabatan_' + todayDateFormat + '.xlsx'
    let element = document.getElementById('summaryTable'); 
    const ws: xlsx.WorkSheet = xlsx.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    xlsx.writeFile(wb, fileName);
  }

  view(row) {
    let path = '/dc/staffs/information'
    let extras = row.id
    let queryParams = {
      queryParams: {
        id: extras
      }
    }
    this.router.navigate([path], queryParams)
  }

}
