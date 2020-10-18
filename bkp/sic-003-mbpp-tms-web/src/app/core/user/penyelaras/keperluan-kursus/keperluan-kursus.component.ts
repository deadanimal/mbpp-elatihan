import { Component, OnInit, NgZone, OnDestroy } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { ToastrService } from 'ngx-toastr';
am4core.useTheme(am4themes_animated);

import {
  Assessment,
  Mingguan
} from '../../../../../assets/mock/penyelaras/keperluan-kursus';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';

@Component({
  selector: 'app-keperluan-kursus',
  templateUrl: './keperluan-kursus.component.html',
  styleUrls: ['./keperluan-kursus.component.scss']
})
export class KeperluanKursusComponent implements OnInit, OnDestroy {

  // Chart
  chartTNA: am4charts.XYChart
  chartMingguan: am4charts.XYChart
  chartBulanan: am4charts.XYChart
  dataTNA = Assessment
  dataMingguan = Mingguan

  constructor(
    private notifyService: NotifyService,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.initChartTNA()
    this.initChartMingguan()
    this.initChartBulanan()
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chartTNA) {
        this.chartTNA.dispose();
      }
      if (this.chartMingguan) {
        this.chartMingguan.dispose()
      }
      if (this.chartBulanan) {
        this.chartBulanan.dispose()
      }
    })
  }

  initChartTNA() {
    let chart = am4core.create("chartTNA", am4charts.XYChart);

    // Add data
    chart.data = this.dataTNA;

    // Create axes
    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.axisFills.template.disabled = false;
    categoryAxis.renderer.axisFills.template.fillOpacity = 0.05;


    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = -100;
    valueAxis.max = 100;
    valueAxis.renderer.minGridDistance = 50;
    valueAxis.renderer.ticks.template.length = 5;
    valueAxis.renderer.ticks.template.disabled = false;
    valueAxis.renderer.ticks.template.strokeOpacity = 0.4;
    valueAxis.renderer.labels.template.adapter.add("text", function (text) {
      return text == "Male" || text == "Female" ? text : text + "%";
    })

    // Legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = "right";
    chart.legend.width = 120

    // Use only absolute numbers
    chart.numberFormatter.numberFormat = "#.#s";

    // Create series
    function createSeries(field, name, color) {
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = field;
      series.dataFields.categoryY = "category";
      series.stacked = true;
      series.name = name;
      series.stroke = color;
      series.fill = color;

      let label = series.bullets.push(new am4charts.LabelBullet);
      label.label.text = "{valueX}%";
      label.label.fill = am4core.color("#fff");
      label.label.strokeWidth = 0;
      label.label.truncate = false;
      label.label.hideOversized = true;
      label.locationX = 0.5;
      return series;
    }

    let interfaceColors = new am4core.InterfaceColorSet();
    let positiveColor = interfaceColors.getFor("positive");
    let negativeColor = interfaceColors.getFor("negative");

    createSeries("negative2", "Tidak Diperlukan", negativeColor.lighten(0.5));
    createSeries("negative1", "Sederhana", negativeColor);
    createSeries("positive1", "Diperlukan", positiveColor.lighten(0.5));
    createSeries("positive2", "Amat Diperlukan", positiveColor);
  }

  initChartMingguan() {
    this.chartMingguan = am4core.create("chartMingguan", am4charts.XYChart);
    this.chartMingguan.paddingRight = 20;

    // Add data
    this.chartMingguan.data = this.dataMingguan;

    // Create axes
    let categoryAxis = this.chartMingguan.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "day";
    categoryAxis.renderer.minGridDistance = 50;
    categoryAxis.renderer.grid.template.location = 0.5;
    categoryAxis.startLocation = 0.5;
    categoryAxis.endLocation = 0.5;

    // Create value axis
    let valueAxis = this.chartMingguan.yAxes.push(new am4charts.ValueAxis());
    valueAxis.baseValue = 0;

    // Create series
    let series = this.chartMingguan.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "day";
    series.strokeWidth = 2;
    series.tensionX = 0.77;

    // bullet is added because we add tooltip to a bullet for it to change color
    let bullet = series.bullets.push(new am4charts.Bullet());
    bullet.tooltipText = "{valueY}";

    bullet.adapter.add("fill", function (fill, target) {
      /*if (target.dataItem. < 0) {
        return am4core.color("#FF0000");
      }*/
      return fill;
    })
    let range = valueAxis.createSeriesRange(series);
    range.value = 0;
    range.endValue = -1000;
    range.contents.stroke = am4core.color("#FF0000");
    range.contents.fill = range.contents.stroke;

    // Add scrollbar
    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    this.chartMingguan.scrollbarX = scrollbarX;

    this.chartMingguan.cursor = new am4charts.XYCursor();
  }

  initChartBulanan() {
    this.chartBulanan = am4core.create("chartBulanan", am4charts.XYChart);

    // let data = [];

    this.chartBulanan.data = [{
      "month": "Jan",
      "value": 235,
      "lineColor": this.chartBulanan.colors.next()
    }, {
      "month": "Feb",
      "value": 262,
    }, {
      "month": "Mac",
      "value": 301,
    }, {
      "month": "Apr",
      "value": 205,
    }, {
      "month": "Mei",
      "value": 306,
      "lineColor": this.chartBulanan.colors.next()
    }, {
      "month": "Jun",
      "value": 341,
    }, {
      "month": "Jul",
      "value": 341,
    }, {
      "month": "Ogo",
      "value": 351,
      "lineColor": this.chartBulanan.colors.next()
    }, {
      "month": "Sep",
      "value": 331,
    }, {
      "month": "Okt",
      "value": 251,
    }, {
      "month": "Nov",
      "value": 241,
    }, {
      "month": "Dis",
      "value": 220,
    }];

    let categoryAxis = this.chartBulanan.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.ticks.template.disabled = true;
    categoryAxis.renderer.line.opacity = 0;
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.dataFields.category = "month";
    categoryAxis.startLocation = 0.4;
    categoryAxis.endLocation = 0.6;


    let valueAxis = this.chartBulanan.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.line.opacity = 0;
    valueAxis.renderer.ticks.template.disabled = true;
    valueAxis.min = 0;

    let lineSeries = this.chartBulanan.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.categoryX = "month";
    lineSeries.dataFields.valueY = "value";
    lineSeries.tooltipText = "value: {valueY.value}";
    lineSeries.fillOpacity = 0.5;
    lineSeries.strokeWidth = 3;
    lineSeries.propertyFields.stroke = "lineColor";
    lineSeries.propertyFields.fill = "lineColor";

    let bullet = lineSeries.bullets.push(new am4charts.CircleBullet());
    bullet.circle.radius = 6;
    bullet.circle.fill = am4core.color("#fff");
    bullet.circle.strokeWidth = 3;

    this.chartBulanan.cursor = new am4charts.XYCursor();
    this.chartBulanan.cursor.behavior = "panX";
    this.chartBulanan.cursor.lineX.opacity = 0;
    this.chartBulanan.cursor.lineY.opacity = 0;

    this.chartBulanan.scrollbarX = new am4core.Scrollbar();
    this.chartBulanan.scrollbarX.parent = this.chartBulanan.bottomAxesContainer;

  }

  print() {
    let title = 'Berjaya'
    let message = 'Laporan penilaian berjaya dijana'
    this.notifyService.openToastr(title, message)
  }

}
