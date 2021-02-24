import { Component, NgZone, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ExamsService } from 'src/app/shared/services/exams/exams.service';
import { AttendancesService } from 'src/app/shared/services/attendances/attendances.service';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { forkJoin } from 'rxjs';
import { Training } from 'src/app/shared/services/trainings/trainings.model';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
am4core.useTheme(am4themes_animated);

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

  // Chart
  chart1: any // Kehadiran Kursus Kakitangan Jabatan
  chart2: any // Kakitangan Jabatan Belum Mencapai 5 Hari Berkursus

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
  }

  ngOnInit() {
  }

  ngOnDestroy() {
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

  getData() {
    forkJoin([
      this.trainingService.getStatisticsDepartment()
    ]).subscribe(
      () => {},
      () => {},
      () => {
        this.statistics = this.trainingService.trainingStatistics
        this.totalAttendanceInternal = this.statistics['attendance_internal']
        this.totalAttendanceExternal = this.statistics['attendance_external']
        this.attendanceByMonth = this.statistics['attendance_by_month']

        this.getCharts()
      }
    )
  }

  getCharts() {
    this.zone.runOutsideAngular(
      () => {
        this.getChart1()
        this.getChart2()
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

      // console.log(chart.data)

    this.chart1 = chart
  }

  getChart2() {
    let chart = am4core.create('chart-dc-dashboard-chart2', am4charts.PieChart3D);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    // chart.legend = new am4charts.Legend();

    // Add data
    chart.data = [{
      'department': 'JABATAN KHIDMAT PENGURUSAN',
      'value': 0
    }, {
      'department': 'JABATAN PENGUATKUASAAN',
      'value': 0
    }, {
      'department': 'JABATAN PERBENDAHARAAN',
      'value': 0
    }, {
      'department': 'JABATAN KEJURUTERAAN',
      'value': 0
    }, {
      'department': 'JABATAN KESIHATAN PERSEKITARAN DAN PELESENAN',
      'value': 0
    }, {
      'department': 'JABATAN KESIHATAN PERSEKITARAN DAN PELESENAN - PELESENAN',
      'value': 0
    }, {
      'department': 'JABATAN PERKHIDMATAN DAN PERBANDARAAN',
      'value': 0
    }, {
      'department': 'JABATAN KAWALAN BANGUNAN',
      'value': 0
    }, {
      'department': 'JABATAN KONSERVASI WARISAN',
      'value': 0
    }, {
      'department': 'JABATAN PENILAIAN DAN PENGURUSAN HARTA',
      'value': 0
    }, {
      'department': 'JABATAN PESURUHJAYA BANGUNAN',
      'value': 0
    }, {
      'department': 'JABATAN PERANCANGAN PEMBANGUNAN',
      'value': 0
    }, {
      'department': 'JABATAN KHIDMAT KEMASYARAKATAN',
      'value': 0
    }, {
      'department': 'JABATAN LANDSKAP',
      'value': 0
    }, {
      'department': 'PEJABAT DATUK BANDAR',
      'value': 0
    }, {
      'department': 'PEJABAT DATUK BANDAR - UNDANG - UNDANG',
      'value': 0
    }, {
      'department': 'PEJABAT DATUK BANDAR - PENYELARASAN PEMBANGUNAN',
      'value': 0
    }, {
      'department': 'PEJABAT DATUK BANDAR - AUDIT DALAM',
      'value': 0
    }, {
      'department': 'PEJABAT DATUK BANDAR - OSC',
      'value': 0
    }];

    let series = chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = 'value';
    series.dataFields.category = 'department';

    this.chart2 = chart
  }

}
