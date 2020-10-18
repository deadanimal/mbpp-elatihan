import { Component, OnInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Exam } from 'src/app/shared/services/exams/exams.model';
import { ExamsService } from 'src/app/shared/services/exams/exams.service';
import { LoadingBarService } from '@ngx-loading-bar/core';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-peperiksaan-overview',
  templateUrl: './peperiksaan-overview.component.html',
  styleUrls: ['./peperiksaan-overview.component.scss']
})
export class PeperiksaanOverviewComponent implements OnInit, OnDestroy {

  // Table
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  tableColumns: string[] = ['code', 'title', 'date']
  tableSource: MatTableDataSource<any>
  public focusSearch: boolean

  // Data
  public exams: Exam[] = []

  // Amchart
  public examChart: am4charts.XYChart

  // Refresh
  public refresher: any

  constructor(
    private examService: ExamsService,

    private loadingBar: LoadingBarService,
    private router: Router,
    private zone: NgZone
  ) { 
    this.exams = this.examService.exams
  }

  ngOnInit() {
    this.getTableData()
    this.zone.runOutsideAngular(() => {
      this.initExamChart()
    })
    this.refresher = setInterval(
      () => {
        this.refreshTableData()
      },
      30000
    )
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.examChart) {
        this.examChart.dispose()
      }
    })
    if (this.refresher) {
      clearInterval(this.refresher)
    }
  }

  getTableData() {
    this.tableSource = new MatTableDataSource<Exam>(this.exams)
    this.tableSource.paginator = this.paginator;
    this.tableSource.sort = this.sort;
  }

  refreshTableData() {
    this.loadingBar.start()
    this.examService.get().subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.exams = this.examService.exams
        this.getTableData()
      }
    )
  }

  filterTable(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.tableSource.filter = filterValue.trim().toLowerCase()
    console.log(this.tableSource.filter)
  }

  initExamChart() {
    let chart = am4core.create("examChart", am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();

    // Add data
    chart.data = [{
      "month": "Jan",
      "value": 25
    }, {
      "month": "Feb",
      "value": 17
    }, {
      "month": "Mac",
      "value": 33
    }, {
      "month": "Apr",
      "value": 12
    }, {
      "month": "Mei",
      "value": 21
    }, {
      "month": "Jun",
      "value": 14
    }, {
      "month": "Jul",
      "value": 16
    }, {
      "month": "Ogo",
      "value": 19
    }, {
      "month": "Sep",
      "value": 25
    }, {
      "month": "Okt",
      "value": 22
    }, {
      "month": "Nov",
      "value": 24
    }, {
      "month": "Dis",
      "value": 21
    }];

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "month";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    // categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minWidth = 50;

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "month";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    let hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();

    this.examChart = chart
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
