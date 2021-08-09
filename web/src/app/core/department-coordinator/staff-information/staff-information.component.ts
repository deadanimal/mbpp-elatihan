import { Component, OnInit } from '@angular/core';
import { LoadingBarService } from "@ngx-loading-bar/core";
import { NotifyService } from "src/app/shared/handler/notify/notify.service";
import { ActivatedRoute, Router } from "@angular/router";

import { ApplicationDepartmentExtended } from "src/app/shared/services/applications/applications.model";
import { ApplicationsService } from "src/app/shared/services/applications/applications.service";
import { AttendancesService } from "src/app/shared/services/attendances/attendances.service";

import * as moment from "moment";
import * as xlsx from "xlsx";
import { forkJoin } from "rxjs";
import { Section } from "src/app/shared/code/user";

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}

@Component({
  selector: 'app-staff-information',
  templateUrl: './staff-information.component.html',
  styleUrls: ['./staff-information.component.scss']
})
export class StaffInformationComponent implements OnInit {
  // Data
  applications: ApplicationDepartmentExtended[] = [];
  sections = Section;

  // Table
  tableEntries: number = 5;
  tableSelected: any[] = [];
  tableTemp = [];
  tableActiveRow: any;
  tableRows: any = [];
  tableMessages = {
    emptyMessage: "Tiada rekod dijumpai",
    totalMessage: "rekod",
  };
  SelectionType = SelectionType;

  // Checker
  isEmpty: boolean = true;
  isSummaryTableHidden: boolean = true;

  // Icon
  iconEmpty = "assets/img/icons/box.svg";

  constructor(
    private applicationService: ApplicationsService,
    private attendanceService: AttendancesService,
    private loadingBar: LoadingBarService,
    private notifyService: NotifyService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.getData();
  }

  ngOnInit() {
  }

  getData() {
    let body = {
      applicant: this.route.snapshot.queryParamMap.get("id"),
    };

    this.loadingBar.start();
    forkJoin([
      this.applicationService.getDepartmentApplicantHistories(body),
    ]).subscribe(
      () => {
        this.loadingBar.complete();
        this.applications = this.applicationService.applicationsDepartment;
        this.tableRows = this.applications;
      },
      () => {
        this.loadingBar.complete();
      },
      () => {
        for (let i = 0; i < this.tableRows.length; i++) {
          this.attendanceService
            .filter(
              "training=" +
                this.tableRows[i].training.id +
                "&attendee=" +
                this.tableRows[i].applicant.id +
                "&is_attend=true"
            )
            .subscribe((res) => {
              this.tableRows[i].day_attend = res.length;
              if (this.tableRows.length == i + 1) {
                this.tableRows = [...this.tableRows] // Refresh the data
                setTimeout(() => {
                  this.tableTemp = this.tableRows.map((prop, key) => {
                    return {
                      ...prop,
                      id_index: key + 1,
                    };
                  });
  
                  if (this.tableTemp.length >= 1) {
                    this.isEmpty = false;
                  } else {
                    this.isEmpty = true;
                  }
                }, 1000)
              }
            });
        }

        // this.tableTemp = this.tableRows.map((prop, key) => {
        //   return {
        //     ...prop,
        //     id_index: key + 1,
        //   };
        // });

        // if (this.tableTemp.length >= 1) {
        //   this.isEmpty = false;
        // } else {
        //   this.isEmpty = true;
        // }
      }
    );
  }

  entriesChange($event) {
    this.tableEntries = $event.target.value;
  }

  filterTable($event, type) {
    let val = $event.target.value.toLowerCase();
    if (type == "name") {
      console.log("filter table", this.tableTemp);
      this.tableTemp = this.tableRows.filter(function (d) {
        return d.training.title.toLowerCase().indexOf(val) !== -1 || !val;
      });
    } else if (type == "organiser_type") {
      if (val == "aa") {
        this.tableTemp = this.tableRows;
      } else {
        this.tableTemp = this.tableRows.filter(function (d) {
          return d.organiser_type.toLowerCase().indexOf(val) !== -1 || !val;
        });
      }
    } else if (type == "year") {
      if (val == "aa") {
        this.tableTemp = this.tableRows;
      } else {
        this.tableTemp = this.tableRows.filter(function (d) {
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
    let path = "/dc/trainings/information";
    let extras = selected["training"]["id"];
    let queryParams = {
      queryParams: {
        id: extras,
      },
    };
    this.router.navigate([path], queryParams);
  }

  exportExcel() {
    let todayDate = new Date();
    let todayDateFormat = moment(todayDate).format("YYYYMMDD");
    let fileName =
      "Ringkasan_Permohonan_Latihan_Jabatan_" + todayDateFormat + ".xlsx";
    let element = document.getElementById("summaryTable");
    const ws: xlsx.WorkSheet = xlsx.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Sheet1");

    /* save to file */
    xlsx.writeFile(wb, fileName);
  }

}
