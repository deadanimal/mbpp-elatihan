import { Component, NgZone, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ExamsService } from 'src/app/shared/services/exams/exams.service';
import { AttendancesService } from 'src/app/shared/services/attendances/attendances.service';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { forkJoin, Subscription } from 'rxjs';
import { Department, Section, ServiceStatus } from 'src/app/shared/code/user';
import { Training } from 'src/app/shared/services/trainings/trainings.model';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
am4core.useTheme(am4themes_animated);

import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // Stats
  statistics: any
  totalAttendanceInternal: number = 0
  totalAttendanceExternal: number = 0
  attendanceByMonth: any

  user: any
  users: any
  departments = Department
  sections = Section
  serviceStatus = ServiceStatus

  // Chart
  chart1: any // Kehadiran Kursus Kakitangan Jabatan
  chart2: any // Kakitangan Jabatan Belum Mencapai 5 Hari Berkursus

  // Subscriber
  subscription: Subscription;

  constructor(
    private authService: AuthService,
    private examService: ExamsService,
    private attendanceService: AttendancesService,
    private trainingService: TrainingsService,
    private userService: UsersService,
    private loadingBar: LoadingBarService,
    private zone: NgZone
  ) { 
    this.getData()
    this.getData2()
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.zone.runOutsideAngular(
      () => {
        if (this.chart1) {
          this.chart1.dispose()
        }
        if (this.chart2) {
          this.chart2.dispose()
        }
      }
    )
  }

  getData2() {
    this.loadingBar.start()
    this.authService.getDetailByToken().subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.user = this.authService.userDetail
        this.user['department'] = ''
        this.user['section'] = ''
        this.user['age'] = 0
        this.user['role'] = 'KAKITANGAN'

        this.departments.forEach(
          (department) => {
            if (this.user['department_code'] == department['value']) {
              this.user['department'] = department['text']
            }
          }
        )

        this.sections.forEach(
          (section) => {
            if (this.user['section_code'] == section['value']) {
              this.user['section'] = section['text']
            }
          }
        )

        this.serviceStatus.forEach(
          (status) => {
            if (this.user['service_status'] == status['value']) {
              this.user['service_status'] = status['text']
            }
          }
        )

        let firstTwoNRIC = this.user['nric'].substring(0,2);
        if (Number(firstTwoNRIC) >= 40) {
          let genYear = 1900 + Number(firstTwoNRIC)
          this.user['age'] = moment().year() - genYear
        }
        else {
          let genYear = 2000 + Number(firstTwoNRIC)
          this.user['age'] = moment().year() - genYear
        }

        if (this.user['user_type'] == 'DC') {
          this.user['role'] = 'PENYELARAS JABATAN'
        }
        else if (this.user['user_type'] == 'TC') {
          this.user['role'] = 'PENYELARAS LATIHAN'
        }
        else if (this.user['user_type'] == 'DH') {
          this.user['role'] = 'KETUA JABATAN'
        }
        else if (this.user['user_type'] == 'AD') {
          this.user['role'] = 'PENTADBIR SISTEM'
        }
        else {
          this.user['role'] = 'KAKITANGAN'
        }
      }
    )
  }

  getData() {
    this.subscription = forkJoin([
      this.trainingService.getStatisticsDepartment(),
      this.userService.getDepartmentStaffs()
    ]).subscribe(
      () => {},
      () => {},
      () => {
        this.statistics = this.trainingService.trainingStatistics
        this.totalAttendanceInternal = this.statistics['attendance_internal']
        this.totalAttendanceExternal = this.statistics['attendance_external']
        this.attendanceByMonth = this.statistics['attendance_by_month']
        this.users = this.userService.users

        this.getCharts()
      }
    )
  }

  getCharts() {
    this.zone.runOutsideAngular(
      () => {
        this.getChart1()
        this.getChartData2();
      }
    )
  }

  getChart1() {

    let chart = am4core.create('chart-dc-dashboard-chart1', am4charts.XYChart);
    chart.padding(40, 40, 40, 40);

    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = 'month';
    categoryAxis.renderer.minGridDistance = 1;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.disabled = true;

    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryY = 'month';
    series.dataFields.valueX = 'value';
    series.tooltipText = '{valueX.value}'
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusBottomRight = 5;
    series.columns.template.column.cornerRadiusTopRight = 5;

    let labelBullet = series.bullets.push(new am4charts.LabelBullet())
    labelBullet.label.horizontalCenter = 'left';
    labelBullet.label.dx = 10;
    labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
    labelBullet.locationX = 1;

    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    series.columns.template.adapter.add('fill', function(fill, target){
      return chart.colors.getIndex(target.dataItem.index);
    });

    categoryAxis.sortBySeries = series;
    chart.data = [
        {
          'month': 'Jan',
          'value': this.attendanceByMonth['january']
        },
        {
          'month': 'Feb',
          'value': this.attendanceByMonth['february']
        },
        {
          'month': 'Mac',
          'value': this.attendanceByMonth['march']
        },
        {
          'month': 'Apr',
          'value': this.attendanceByMonth['april']
        },
        {
          'month': 'Mei',
          'value': this.attendanceByMonth['may']
        },
        {
          'month': 'Jun',
          'value': this.attendanceByMonth['june']
        },
        {
          'month': 'Jul',
          'value': this.attendanceByMonth['july']
        },
        {
          'month': 'Ogo',
          'value': this.attendanceByMonth['august']
        },
        {
          'month': 'Sep',
          'value': this.attendanceByMonth['september']
        },
        {
          'month': 'Okt',
          'value': this.attendanceByMonth['october']
        },
        {
          'month': 'Nov',
          'value': this.attendanceByMonth['november']
        },
        {
          'month': 'Dis',
          'value': this.attendanceByMonth['december']
        }
      ]

    // Export
    let todayDate = new Date()
    let todayDateFormat = moment(todayDate).format('YYYYMMDD')
    let fileNamePrefix = 'Kehadiran_Kursus_Kakitangan_Jabatan_' + todayDateFormat

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = fileNamePrefix; 
    chart.exporting.adapter.add("data", function(data) {
      for (var i = 0; i < data.data.length; i++) {
        data.data[i].core = data.data[i].core;
        data.data[i].value = data.data[i].value;
      }
      return data;
    })
    chart.exporting.dataFields = {
      'month': 'Bulan',
      'value': 'Jumlah'
    }

    this.chart1 = chart
  }

  getChartData2() {
    let body = {
      department_code: this.user.department_code,
      // section_code: this.user.section_code
    }
    this.attendanceService.getDashboardDC2(body).subscribe(
      (res) => {
        // console.log("res", res);
        var result = []

        res.forEach(obj => {
          let result = this.sections.find(value => {
            return value.value == obj.attendee__section_code;
          });

          obj['section'] = result.text;
          obj['value'] = obj.count;
        });

        res.forEach((a) => {
          if (!res[a.section]) {
            res[a.section] = {section: a.section, value: 0}
            result.push(res[a.section])
          }
          res[a.section].value += a.value
        }, Object.create(null))

        this.getChart2(result);
      },
      (err) => {
        console.error("err", err);
      }
    );
  }

  getChart2(data) {
    let chart = am4core.create('chart-dc-dashboard-chart2', am4charts.PieChart3D);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    // chart.legend = new am4charts.Legend();

    // Add data
    chart.data = data;

    let series = chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = 'value';
    series.dataFields.category = 'section';

    // Export
    let todayDate = new Date()
    let todayDateFormat = moment(todayDate).format('YYYYMMDD')
    let fileNamePrefix = 'Kakitangan_Jabatan_Belum_Mencapai_5Hari_Berkursus_' + todayDateFormat

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = fileNamePrefix; 
    chart.exporting.adapter.add("data", function(data) {
      for (var i = 0; i < data.data.length; i++) {
        data.data[i].core = data.data[i].core;
        data.data[i].value = data.data[i].value;
      }
      return data;
    })
    chart.exporting.dataFields = {
      'section': 'Bahagian',
      'value': 'Jumlah'
    }

    this.chart2 = chart
  }

}
