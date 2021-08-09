import { Component, NgZone, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Department, Month } from 'src/app/shared/code/report';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { LevelsService } from 'src/app/shared/services/levels/levels.service';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';

import * as moment from 'moment';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  selectedReportType = 'LK'
  selectedDepartment = 'ALL'
  selectedMonthType = 'ALL'
  selectedMonth = 1
  selectedMonthStart: Date
  selectedMonthEnd: Date

  // Choices
  reports = [
    { text: 'LAPORAN KEHADIRAN', value: 'LK' },
    // { text: 'LAPORAN OBB', value: 'LO' }
  ]
  departments = Department
  monthTypes = [
    { text: 'KESELURUHAN', value: 'ALL' },
    { text: 'JULAT BULAN', value: 'RANGE' },
    { text: 'SATU BULAN', value: 'SINGLE' }
  ]
  months = Month

  // Datepicker
  dateStart: Date
  dateEnd: Date
  dateConfig = { 
    isAnimated: true, 
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-dark-blue' 
  }

  // Subscriber
  subscription: Subscription

  constructor(
    private levelService: LevelsService,
    private trainingService: TrainingsService,
    private loadingBar: LoadingBarService,
    private notifyService: NotifyService,
    private router: Router,
    private zone: NgZone
  ) { 
    this.getData()
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  getData() {
    this.loadingBar.start()

    this.subscription = this.levelService.checkReportConfig().subscribe(
      (res) => {
        this.loadingBar.complete()

        let plan = res['plan']
        let level = res['level']

        if (!plan && !level) {
          swal.fire({
            title: 'Notis',
            text: 'Anda perlu menambah konfigurasi Aras Asas dan Pelan Pemantauan bagi tahun ini',
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-warning',
            confirmButtonText: 'Tambah konfigurasi',
            allowOutsideClick: false
          }).then((result) => {
            if (result.value) {
              this.navigatePage('/tc/report/configuration')
            }
          })
        }
      },
      () => {
        this.loadingBar.complete()
      },
      () => {}
    )
  }

  generateReport() {
    // Kedatangan keseluruhan
    if (
      this.selectedReportType == 'LK' &&
      this.selectedMonthType == 'ALL'
    ) {
      let attendanceAll = {
        'department': this.selectedDepartment,
        'month_type': this.selectedMonthType
      }
      this.reportState(attendanceAll)
    }
    // Kedatangan range
    else if (
      this.selectedReportType == 'LK' &&
      this.selectedMonthType == 'RANGE'
    ) {
      // let startDate = moment(this.selectedMonthStart).format('YYYY-MM-DD')
      // let endDate = moment(this.selectedMonthEnd).format('YYYY-MM-DD')
      let attendanceRange = {
        'department': this.selectedDepartment,
        'month_type': this.selectedMonthType,
        'month_from':  moment(this.selectedMonthStart).format('YYYY-MM-DD'),
        'month_to': moment(this.selectedMonthEnd).format('YYYY-MM-DD'),
      }
      this.reportState(attendanceRange)
    }
    // Kedatangan single
    else if (
      this.selectedReportType == 'LK' &&
      this.selectedMonthType == 'SINGLE'
    ) {
      let attendanceMonth = {
        'department': this.selectedDepartment,
        'month_type': this.selectedMonthType,
        'month': this.selectedMonth
      }
      this.reportState(attendanceMonth)
    }
    // OBB keseluruhan
    else if (
      this.selectedReportType == 'LO' &&
      this.selectedMonthType == 'ALL'
    ) {
      let attendanceAll = {
        'department': this.selectedDepartment,
        'month_type': this.selectedMonthType
      }
      this.reportOBB(attendanceAll)
    }
    // OBB range
    else if (
      this.selectedReportType == 'LO' &&
      this.selectedMonthType == 'RANGE'
    ) {
      let attendanceRange = {
        'department': this.selectedDepartment,
        'month_type': this.selectedMonthType,
        'month_from': this.selectedMonthStart,
        'month_to': this.selectedMonthEnd,
      }
      this.reportOBB(attendanceRange)
    }
    // OBB single
    else if (
      this.selectedReportType == 'LO' &&
      this.selectedMonthType == 'SINGLE'
    ) {
      let attendanceMonth = {
        'department': this.selectedDepartment,
        'month_type': this.selectedMonthType,
        'month': this.selectedMonth
      }
      this.reportOBB(attendanceMonth)
    }
  }

  reportState(body) {
    let title = 'Tunggu sebentar'
    let message = 'Laporan sedang dijana'
    this.notifyService.openToastrInfo(title, message)

    this.loadingBar.start()
    this.trainingService.getReportAttendance(body).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        window.open(this.trainingService.reportUrl, '_blank');
      }
    )
    // console.log(body)
  }

  reportOBB(body) {
    let title = 'Tunggu sebentar'
    let message = 'Laporan sedang dijana'
    this.notifyService.openToastrInfo(title, message)
    
    this.loadingBar.start()
    this.trainingService.getReportOBB(body).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        window.open(this.trainingService.reportUrl, '_blank');
      }
    )
    // console.log(body)
  }

  navigatePage(path: string) {
    return this.router.navigate([path])
  }

}
