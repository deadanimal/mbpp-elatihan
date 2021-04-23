import { Component, OnInit, TemplateRef, OnDestroy, NgZone } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Department, Section, ServiceStatus, UserType } from 'src/app/shared/code/user';

import { forkJoin } from 'rxjs';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { User } from 'src/app/shared/services/users/users.model';
import { UsersService } from 'src/app/shared/services/users/users.service';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

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
  selector: 'app-management-user',
  templateUrl: './management-user.component.html',
  styleUrls: ['./management-user.component.scss']
})
export class ManagementUserComponent implements OnInit, OnDestroy {

  //  Data
  users: User[] = []
  selectedUser: User
  departments = Department
  sections = Section
  serviceStatus = ServiceStatus
  userType = UserType

  // Form
  userForm: FormGroup

  // Table
  tableEntries: number = 5
  tableSelected: any[] = []
  tableTemp = []
  staff_sementara = []
  staff_kontrak = []
  staff_tetap = []
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

  // Modal
  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: 'modal-dialog-centered'
  };

  // Icon
  iconEmpty = 'assets/img/icons/box.svg'

  // Chart
  chart: any

  constructor(
    private userService: UsersService,
    private fb: FormBuilder,
    private loadingBar: LoadingBarService,
    private modalService: BsModalService,
    private notifyService: NotifyService,
    private zone: NgZone
  ) {
    this.getData()
    this.getChartData()
  }

  ngOnInit() {
    this.initForm()
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose()
      }
    })
  }

  getChartData() {
    let data = "service_status=T"
    this.userService.filter(data).subscribe(
      (res) => {
        this.staff_tetap = res
      }
    )

    let data2 = "service_status=S"
    this.userService.filter(data2).subscribe(
      (res) => {
        this.staff_sementara = res
      }
    )

    let data3 = "service_status=K"
    this.userService.filter(data3).subscribe(
      (res) => {
        this.staff_kontrak = res
      }
    )
  }

  getData() {
    this.loadingBar.start()
    forkJoin([
      this.userService.getAll()
    ]).subscribe(
      () => {
        this.loadingBar.complete()
        this.users = this.userService.users
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.tableRows = this.users
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

  initForm() {
    this.userForm = this.fb.group({
      user_type: new FormControl(null, Validators.compose([
        Validators.required
      ]))
    })
  }

  getCharts() {
    this.zone.runOutsideAngular(() => {
      this.getChart()
    })
  }

  getChart() {
    let chart = am4core.create("chartdiv", am4charts.XYChart);

    // Add data
  //   chart.data = [{
  //     "month": "Jan",
  //     "count": this.chartJan
  //   }, {
  //     "month": "Feb",
  //     "count": this.chartFeb
  //   }, {
  //     "month": "Mar",
  //     "count": this.chartMar
  //   }, {
  //     "month": "Apr",
  //     "count": this.chartApr
  //   }, {
  //     "month": "May",
  //     "count": this.chartMar
  //   }, {
  //     "month": "Jun",
  //     "count": this.chartJun
  //   }, {
  //     "month": "Jul",
  //     "count": this.chartJul
  //   }, {
  //     "month": "Aug",
  //     "count": this.chartAug
  //   }, {
  //     "month": "Sep",
  //     "count": this.chartSep
  //   }, {
  //     "month": "Oct",
  //     "count": this.chartOct
  //   }, {
  //     "month": "Nov",
  //     "count": this.chartNov
  //   }, {
  //     "month": "Dec",
  //     "count": this.chartDec
  //   }
  // ];

    // Create axes

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "month";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    categoryAxis.renderer.labels.template.adapter.add("dy", function (dy, target) {
      if (target.dataItem && target.dataItem.index && 2 == 2) {
        return dy + 25;
      }
      return dy;
    });

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "count";
    series.dataFields.categoryX = "month";
    series.name = "count";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

    this.chart = chart
  }

  // calculateCharts() {
  //   this.chartJan = 0
  //   this.chartFeb = 0
  //   this.chartMar = 0
  //   this.chartApr = 0
  //   this.chartMay = 0
  //   this.chartJun = 0
  //   this.chartJul = 0
  //   this.chartAug = 0
  //   this.chartSep = 0
  //   this.chartOct = 0
  //   this.chartNov = 0
  //   this.chartDec = 0
  //   this.tableRows.forEach(
  //     ((row) => {
  //       let checkerDate = moment(row.joined_at)
  //       let checkerDateMonth = checkerDate.month()
  //       if (checkerDateMonth == 0) {
  //         this.chartJan += 1
  //       }
  //       else if (checkerDateMonth == 1) {
  //         this.chartFeb += 1
  //       }
  //       else if (checkerDateMonth == 2) {
  //         this.chartMar += 1
  //       }
  //       else if (checkerDateMonth == 3) {
  //         this.chartApr += 1
  //       }
  //       else if (checkerDateMonth == 4) {
  //         this.chartMay += 1
  //       }
  //       else if (checkerDateMonth == 5) {
  //         this.chartJun += 1
  //       }
  //       else if (checkerDateMonth == 6) {
  //         this.chartJul += 1
  //       }
  //       else if (checkerDateMonth == 7) {
  //         this.chartAug += 1
  //       }
  //       else if (checkerDateMonth == 8) {
  //         this.chartSep += 1
  //       }
  //       else if (checkerDateMonth == 9) {
  //         this.chartOct += 1
  //       }
  //       else if (checkerDateMonth == 10) {
  //         this.chartNov += 1
  //       }
  //       else if (checkerDateMonth == 11) {
  //         this.chartDec += 1
  //       }
  //     })
  //   )
  // }

  patch() {
    this.loadingBar.start()
    let infoTitle = 'Sedang proses'
    let infoMessage = 'Pengguna sedang dikemaskini'
    this.notifyService.openToastrInfo(infoTitle, infoMessage)

    this.userService.update(this.selectedUser['id'], this.userForm.value).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
        let title = 'Tidak berjaya'
        let message = 'Anda tidak berjaya untuk mengemaskini pengguna. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.closeModal()
      },
      () => {
        let title = 'Berjaya'
        let message = 'Pengguna berjaya dikemaskini.'
        this.notifyService.openToastr(title, message)
        this.success()
        this.closeModal()
        this.getData()
      }
    )
  }

  openModal(modalRef: TemplateRef<any>, row) {
    this.selectedUser = row
    this.userForm.controls['user_type'].setValue(this.selectedUser['user_type'])

    this.modal = this.modalService.show(modalRef, this.modalConfig);
    // console.log('Wee', this.userForm.value)
  }

  closeModal() {
    this.modal.hide()
    this.userForm.reset()
  }

  confirm() {
    // console.log('Wee', this.examForm.value)
    swal.fire({
      title: 'Pengesahan',
      text: 'Anda pasti untuk mengemaskini pengguna ini?',
      type: 'info',
      buttonsStyling: false,
      showCancelButton: true,
      confirmButtonClass: 'btn btn-info',
      confirmButtonText: 'Pasti',
      cancelButtonClass: 'btn btn-outline-info',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.value) {
        this.patch()
      }
    })
  }

  success() {
    swal.fire({
      title: 'Berjaya',
      text: 'Pengguna berjaya dikemaskini',
      type: 'success',
      buttonsStyling: false,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonClass: 'btn btn-outline-success',
      cancelButtonText: 'Tutup'
    })
  }

  entriesChange($event) {
    this.tableEntries = $event.target.value;
  }

  filterTable($event, type) {
    let val = $event.target.value.toLowerCase();
    if (type == 'name') {
      this.tableTemp = this.tableRows.filter(function (d) {
        return d.full_name.toLowerCase().indexOf(val) !== -1 || !val;
      });
    }
    else if (type == 'user_type') {
      if (val == 'aa') {
        this.tableTemp = this.tableRows
      }
      else {
        this.tableTemp = this.tableRows.filter(function (d) {
          return d.user_type.toLowerCase().indexOf(val) !== -1 || !val;
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

  exportExcel() {
    let todayDate = new Date()
    let todayDateFormat = moment(todayDate).format('YYYYMMDD')
    let fileName = 'Ringkasan_Pengguna_' + todayDateFormat + '.xlsx'
    let element = document.getElementById('summaryTable'); 
    const ws: xlsx.WorkSheet = xlsx.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    xlsx.writeFile(wb, fileName);
  }


}
