import { Component, NgZone, OnInit } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { forkJoin } from 'rxjs';

import { ApplicationsService } from 'src/app/shared/services/applications/applications.service';

import * as moment from 'moment';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.scss']
})
export class TrainingsComponent implements OnInit {

  // Data
  statistics

  // Chart
  chartCore

  constructor(
    private applicationService: ApplicationsService,
    private loadingBar: LoadingBarService,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.getData()
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(
      () => {
        if (this.chartCore) {
          this.chartCore.dispose()
        }
      }
    )
  }

  getData() {
    this.loadingBar.start()
    forkJoin([
      this.applicationService.getStatisticsSelf()
    ]).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.statistics = this.applicationService.statisticSelf['statistics']
        this.getCharts()
      }
    )
  }

  getCharts() {
    this.zone.runOutsideAngular(
      () => {
        this.getChartCore()
      }
    )
  }

  getChartCore() {
     // Create chart instance
    let chart = am4core.create('chart-st-training-core', am4charts.XYChart3D);

    // Add data
    chart.data = []
    this.statistics.forEach(
      (data_) => {
        chart.data.push({
          core: data_['core'],
          value: data_['value'],
          color: chart.colors.next()
        })
      }
    )

    // Create axes
    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'core';
    categoryAxis.renderer.inversed = true;

    let  valueAxis = chart.xAxes.push(new am4charts.ValueAxis()); 
    valueAxis.min = 0;

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries3D());
    series.dataFields.valueX = 'value';
    series.dataFields.categoryY = 'core';
    series.name = 'Teras';
    series.columns.template.propertyFields.fill = 'color';
    series.columns.template.tooltipText = '{categoryY}: {valueX}';
    series.columns.template.column3D.stroke = am4core.color('#fff');
    series.columns.template.column3D.strokeOpacity = 0.2;

    // Export
    let todayDate = new Date()
    let todayDateFormat = moment(todayDate).format('YYYYMMDD')
    let fileNamePrefix = 'Laporan_Latihan_Kakitangan_' + todayDateFormat

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = fileNamePrefix; 

    this.chartCore = chart
  }

}
