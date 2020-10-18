import { Component, OnInit, NgZone, OnDestroy } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

import {
  Keberkesanan,
  Prestasi,
  Tahunan
} from '../../../../../assets/mock/penyelaras/laporan';

@Component({
  selector: 'app-laporan',
  templateUrl: './laporan.component.html',
  styleUrls: ['./laporan.component.scss']
})
export class LaporanComponent implements OnInit, OnDestroy {

  // Chart
  private chartKeberkesanan: any
  private chartPrestasi: any
  private chartTahunan: any
  private dataKeberkesanan = Keberkesanan
  private dataPrestasi = Prestasi
  private dataTahunan = Tahunan

  constructor(
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.initChartKeberkesanan()
      this.initPrestasi()
      this.initTahunan()
    })
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chartKeberkesanan) {
        this.chartKeberkesanan.dispose()
      }
      if (this.chartPrestasi) {
        this.chartPrestasi.dispose()
      }
      if (this.chartTahunan) {
        this.chartTahunan.dispose()
      }
    })
  }

  initChartKeberkesanan() {
    let chart = am4core.create("chartKeberkesanan", am4charts.PieChart3D);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.legend = new am4charts.Legend();

    chart.data = this.dataKeberkesanan

    chart.innerRadius = 60;

    let series = chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = "value";
    series.dataFields.category = "category";

    this.chartKeberkesanan = chart
  }

  initTahunan() {
    let chart = am4core.create("chartTahunan", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

    chart.data = this.dataTahunan;


    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "month";
    categoryAxis.renderer.minGridDistance = 40;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    let series = chart.series.push(new am4charts.CurvedColumnSeries());
    series.dataFields.categoryX = "month";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY.value}"
    series.columns.template.strokeOpacity = 0;
    series.columns.template.tension = 1;

    series.columns.template.fillOpacity = 0.75;

    let hoverState = series.columns.template.states.create("hover");
    hoverState.properties.fillOpacity = 1;
    hoverState.properties.tension = 0.8;

    chart.cursor = new am4charts.XYCursor();

    // Add distinctive colors for each column using adapter
    series.columns.template.adapter.add("fill", function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarY = new am4core.Scrollbar();

    this.chartTahunan = chart
  }

  initPrestasi() {

    let chart = am4core.create("chartPrestasi", am4charts.XYChart);

    let data = [];
    let value = 120;

    let names = this.dataPrestasi

    for (var i = 0; i < names.length; i++) {
      value += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 5);
      data.push({ category: names[i], value: value });
    }

    chart.data = data;
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.minGridDistance = 15;
    categoryAxis.renderer.grid.template.location = 0.5;
    categoryAxis.renderer.grid.template.strokeDasharray = "1,3";
    // categoryAxis.renderer.labels.template.rotation = -90;
    categoryAxis.renderer.labels.template.horizontalCenter = "left";
    categoryAxis.renderer.labels.template.location = 0.5;

    categoryAxis.renderer.labels.template.adapter.add("dx", function (dx, target) {
      return -target.maxRight / 2;
    })

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.ticks.template.disabled = true;
    valueAxis.renderer.axisFills.template.disabled = true;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "category";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY.value}";
    series.sequencedInterpolation = true;
    series.fillOpacity = 0;
    series.strokeOpacity = 1;
    series.strokeDasharray = "1,3";
    series.columns.template.width = 0.01;
    series.tooltip.pointerOrientation = "horizontal";

    let bullet = series.bullets.create(am4charts.CircleBullet);

    chart.cursor = new am4charts.XYCursor();

    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarY = new am4core.Scrollbar();

    this.chartTahunan = chart
  }

  getPDF() {
    let fileURL = '/assets/MBPP_TMS_Laporan.pdf'
    window.open(fileURL, '_blank');
  }


}
