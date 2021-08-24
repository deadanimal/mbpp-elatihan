import { Component, NgZone, OnInit } from "@angular/core";
import { AuthService } from "src/app/shared/services/auth/auth.service";
import { ExamsService } from "src/app/shared/services/exams/exams.service";
import { AttendancesService } from "src/app/shared/services/attendances/attendances.service";
import { TrainingsService } from "src/app/shared/services/trainings/trainings.service";
import { UsersService } from "src/app/shared/services/users/users.service";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { forkJoin, Subscription } from "rxjs";
import { Department } from 'src/app/shared/code/user';
import { Training } from "src/app/shared/services/trainings/trainings.model";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  // Data
  departments = Department

  // Stats
  statistics: any;
  totalTrainingPlanned: number = 0;
  totalTrainingInternal: number = 0;
  totalTrainingExternal: number = 0;
  totalBudgetCurrent: number = 0;
  totalAttendanceInternal: number = 0;
  totalAttendanceExternal: number = 0;
  totalExpensesCurrent: number = 0;

  // Chart
  chart1: any; // Kehadiran Kursus Mengikut Jabatan
  chart2: any; // Jabatan Mencapai 5 Hari Berkursus
  chart3: any; // Jabatan Belum Mencapai 5 Hari Berkursus
  chart4: any; // Prestasi Latihan Semasa

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
    this.getData();
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.zone.runOutsideAngular(() => {
      if (this.chart1) {
        this.chart1.dispose();
      }
      if (this.chart2) {
        this.chart2.dispose();
      }
      if (this.chart3) {
        this.chart3.dispose();
      }
      if (this.chart4) {
        this.chart4.dispose();
      }
    });
  }

  getData() {
    this.subscription = forkJoin([
      this.attendanceService.getAll(),
      this.examService.getExams(),
      this.trainingService.getAll(),
      this.userService.getAll(),
      this.trainingService.getStatistics(),
    ]).subscribe(
      () => {},
      () => {},
      () => {
        this.statistics = this.trainingService.trainingStatistics;
        this.totalTrainingPlanned = this.statistics["planned_training"];
        this.totalTrainingInternal = this.statistics["internal_training"];
        this.totalTrainingExternal = this.statistics["external_training"];
        this.totalBudgetCurrent = this.statistics["current_budget"];
        this.totalAttendanceInternal = this.statistics["attendance_internal"];
        this.totalAttendanceExternal = this.statistics["attendance_external"];
        this.totalExpensesCurrent = this.statistics["current_expenses"];

        this.getCharts();

        this.getChartData1();
      }
    );
  }

  getCharts() {
    this.zone.runOutsideAngular(() => {
      this.getChartData1();
      this.getChart2();
      this.getChartData3();
      this.getChartData4();
    });
  }

  getChartData1() {
    this.attendanceService.getDashboardTC().subscribe(
      (res) => {
        // console.log("res", res);

        res.forEach(obj => {
          let result = this.departments.find(value => {
            return value.value == obj.attendee__department_code;
          });

          obj['department'] = result.text;
          obj['value'] = obj.count;
        });
        this.getChart1(res);
      },
      (err) => {
        console.error("err", err);
      }
    );
  }

  getChart1(data) {
    let chart = am4core.create(
      "chart-tc-dashboard-chart1",
      am4charts.XYChart3D
    );

    // Add data
    chart.data = data;

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "department";
    categoryAxis.renderer.labels.template.rotation = 0;
    categoryAxis.renderer.labels.template.hideOversized = true;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.disabled = true;
    categoryAxis.tooltip.label.rotation = 270;
    categoryAxis.tooltip.label.horizontalCenter = "right";
    categoryAxis.tooltip.label.verticalCenter = "middle";
    categoryAxis.tooltip.disabled = true;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Jabatan";
    valueAxis.title.fontWeight = "bold";

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries3D());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "department";
    series.name = "value";
    series.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 0.8;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color("#FFFFFF");

    columnTemplate.adapter.add("fill", function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    columnTemplate.adapter.add("stroke", function (stroke, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineY.strokeOpacity = 0;

    this.chart1 = chart;
  }

  getChart2() {}

  getChartData3() {
    this.attendanceService.getDashboardTC1().subscribe(
      (res) => {
        // console.log("res", res);
        var result = []

        res.forEach(obj => {
          let result = this.departments.find(value => {
            return value.value == obj.attendee__department_code;
          });

          obj['department'] = result.text;
          obj['value'] = obj.count;
        });

        res.forEach((a) => {
          if (!res[a.department]) {
            res[a.department] = {department: a.department, value: 0}
            result.push(res[a.department])
          }
          res[a.department].value += 1
        }, Object.create(null))

        this.getChart3(result);
      },
      (err) => {
        console.error("err", err);
      }
    );
  }

  getChart3(data) {
    let chart = am4core.create(
      "chart-tc-dashboard-chart3",
      am4charts.PieChart3D
    );

    // Add data
    chart.data = data

    let series = chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = "value";
    series.dataFields.category = "department";

    this.chart3 = chart;
  }

  getChartData4() {
    this.attendanceService.getDashboardTC2().subscribe(
      (res) => {
        // console.log("res", res);
        var result = []

        res.forEach(obj => {
          let result = this.departments.find(value => {
            return value.value == obj.attendee__department_code;
          });

          obj['department'] = result.text;
          obj['value'] = obj.count;
        });

        res.forEach((a) => {
          if (!res[a.department]) {
            res[a.department] = {department: a.department, value: 0}
            result.push(res[a.department])
          }
          res[a.department].value += 1
        }, Object.create(null))

        this.getChart4(result);
      },
      (err) => {
        console.error("err", err);
      }
    );
  }

  getChart4(data) {
    let chart = am4core.create(
      "chart-tc-dashboard-chart4",
      am4charts.PieChart3D
    );

    // Add data
    chart.data = data

    let series = chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = "value";
    series.dataFields.category = "department";

    this.chart4 = chart;
  }

  // calculateStats() {
  //   this.totalTrainingPlanned = 0 //
  //   this.totalTrainingInternal = 0 //
  //   this.totalTrainingExternal = 0 //
  //   this.totalBudgetCurrent = 0
  //   this.totalAttendanceInternal = 0
  //   this.totalAttendanceExternal = 0
  //   this.totalExpensesCurrent = 0 //

  //   this.totalTrainingPlanned = this.trainingService.trainings.length

  //   this.trainingService.trainings.forEach(
  //     (training: Training) => {
  //       this.totalExpensesCurrent += training.cost

  //       if (training.organiser_type == 'DD') {
  //         this.totalTrainingInternal += 1
  //       }
  //       else if (training.organiser_type == 'LL') {
  //         this.totalTrainingExternal += 1
  //       }
  //     }
  //   )
  // }
}
