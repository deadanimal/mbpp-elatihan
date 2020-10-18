import { Component, OnInit, NgZone, OnDestroy } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_continentsLow from "@amcharts/amcharts4-geodata/continentsLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  // Chart
  private chart: any
  private chart1: any
  private chart2: any
  private clicked: any = true
  private clicked1: any = false

  constructor(
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.getCharts()
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(
      () => {
        if (this.chart) {
          console.log('Chart disposed')
          this.chart.dispose()
        }
        if (this.chart1) {
          console.log('Chart disposed')
          this.chart1.dispose()
        }
      }
    )
  }

  getCharts() {
    this.zone.runOutsideAngular(() => {
      this.getChart()
      this.getChart1()
    })
  }

  getChart() {
    let container = am4core.create("chartdiv", am4core.Container);
    container.layout = "grid";
    container.fixedWidthGrid = false;
    container.width = am4core.percent(100);
    container.height = am4core.percent(100);

    // Color set
    let colors = new am4core.ColorSet();

    // Functions that create various sparklines
    function createLine(title, data, color) {

      let chart = container.createChild(am4charts.XYChart);
      chart.width = am4core.percent(45);
      chart.height = 70;

      chart.data = data;

      chart.titles.template.fontSize = 10;
      chart.titles.template.textAlign = "start";
      chart.titles.template.isMeasured = false;
      chart.titles.create().text = title;

      chart.padding(20, 5, 2, 5);

      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.disabled = true;
      dateAxis.renderer.labels.template.disabled = true;
      dateAxis.startLocation = 0.5;
      dateAxis.endLocation = 0.7;
      dateAxis.cursorTooltipEnabled = false;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      valueAxis.renderer.grid.template.disabled = true;
      valueAxis.renderer.baseGrid.disabled = true;
      valueAxis.renderer.labels.template.disabled = true;
      valueAxis.cursorTooltipEnabled = false;

      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineY.disabled = true;
      chart.cursor.behavior = "none";

      let series = chart.series.push(new am4charts.LineSeries());
      series.tooltipText = "{date}: [bold]{value}";
      series.dataFields.dateX = "date";
      series.dataFields.valueY = "value";
      series.tensionX = 0.8;
      series.strokeWidth = 2;
      series.stroke = color;

      // render data points as bullets
      let bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.opacity = 0;
      bullet.circle.fill = color;
      bullet.circle.propertyFields.opacity = "opacity";
      bullet.circle.radius = 3;

      return chart;
    }

    function createColumn(title, data, color) {

      let chart = container.createChild(am4charts.XYChart);
      chart.width = am4core.percent(45);
      chart.height = 70;

      chart.data = data;

      chart.titles.template.fontSize = 10;
      chart.titles.template.textAlign = "start";
      chart.titles.template.isMeasured = false;
      chart.titles.create().text = title;

      chart.padding(20, 5, 2, 5);

      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.disabled = true;
      dateAxis.renderer.labels.template.disabled = true;
      dateAxis.cursorTooltipEnabled = false;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      valueAxis.renderer.grid.template.disabled = true;
      valueAxis.renderer.baseGrid.disabled = true;
      valueAxis.renderer.labels.template.disabled = true;
      valueAxis.cursorTooltipEnabled = false;

      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineY.disabled = true;

      let series = chart.series.push(new am4charts.ColumnSeries());
      series.tooltipText = "{date}: [bold]{value}";
      series.dataFields.dateX = "date";
      series.dataFields.valueY = "value";
      series.strokeWidth = 0;
      series.fillOpacity = 0.5;
      series.columns.template.propertyFields.fillOpacity = "opacity";
      series.columns.template.fill = color;

      return chart;
    }

    function createPie(data, color) {

      let chart = container.createChild(am4charts.PieChart);
      chart.width = am4core.percent(10);
      chart.height = 70;
      chart.padding(20, 0, 2, 0);

      chart.data = data;

      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "value";
      pieSeries.dataFields.category = "category";
      pieSeries.labels.template.disabled = true;
      pieSeries.ticks.template.disabled = true;
      pieSeries.slices.template.fill = color;
      pieSeries.slices.template.adapter.add("fill", function (fill: any, target) {
        return fill.lighten(0.1 * target.dataItem.index);
      });
      pieSeries.slices.template.stroke = am4core.color("#fff");

      // chart.chartContainer.minHeight = 40;
      // chart.chartContainer.minWidth = 40;

      return chart;
    }


    createLine("(Price)", [
      { "date": new Date(2018, 0, 1, 8, 0, 0), "value": 57 },
      { "date": new Date(2018, 0, 1, 9, 0, 0), "value": 27 },
      { "date": new Date(2018, 0, 1, 10, 0, 0), "value": 24 },
      { "date": new Date(2018, 0, 1, 11, 0, 0), "value": 59 },
      { "date": new Date(2018, 0, 1, 12, 0, 0), "value": 33 },
      { "date": new Date(2018, 0, 1, 13, 0, 0), "value": 46 },
      { "date": new Date(2018, 0, 1, 14, 0, 0), "value": 20 },
      { "date": new Date(2018, 0, 1, 15, 0, 0), "value": 42 },
      { "date": new Date(2018, 0, 1, 16, 0, 0), "value": 59, "opacity": 1 }
    ], colors.getIndex(0));

    createColumn("(Turnover)", [
      { "date": new Date(2018, 0, 1, 8, 0, 0), "value": 22 },
      { "date": new Date(2018, 0, 1, 9, 0, 0), "value": 25 },
      { "date": new Date(2018, 0, 1, 10, 0, 0), "value": 40 },
      { "date": new Date(2018, 0, 1, 11, 0, 0), "value": 35 },
      { "date": new Date(2018, 0, 1, 12, 0, 0), "value": 29 },
      { "date": new Date(2018, 0, 1, 13, 0, 0), "value": 1 },
      { "date": new Date(2018, 0, 1, 14, 0, 0), "value": 15 },
      { "date": new Date(2018, 0, 1, 15, 0, 0), "value": 29 },
      { "date": new Date(2018, 0, 1, 16, 0, 0), "value": 33, "opacity": 1 }
    ], colors.getIndex(0));

    createPie([
      { "category": "Marketing", "value": 501 },
      { "category": "Research", "value": 301 },
      { "category": "Sales", "value": 201 },
      { "category": "HR", "value": 165 }
    ], colors.getIndex(0));

    createLine("(Price)", [
      { "date": new Date(2018, 0, 1, 8, 0, 0), "value": 22 },
      { "date": new Date(2018, 0, 1, 9, 0, 0), "value": 25 },
      { "date": new Date(2018, 0, 1, 10, 0, 0), "value": 40 },
      { "date": new Date(2018, 0, 1, 11, 0, 0), "value": 35 },
      { "date": new Date(2018, 0, 1, 12, 0, 0), "value": 29 },
      { "date": new Date(2018, 0, 1, 13, 0, 0), "value": 1 },
      { "date": new Date(2018, 0, 1, 14, 0, 0), "value": 15 },
      { "date": new Date(2018, 0, 1, 15, 0, 0), "value": 29 },
      { "date": new Date(2018, 0, 1, 16, 0, 0), "value": 33, "opacity": 1 }
    ], colors.getIndex(1));

    createColumn("(Turnover)", [
      { "date": new Date(2018, 0, 1, 8, 0, 0), "value": 57 },
      { "date": new Date(2018, 0, 1, 9, 0, 0), "value": 27 },
      { "date": new Date(2018, 0, 1, 10, 0, 0), "value": 24 },
      { "date": new Date(2018, 0, 1, 11, 0, 0), "value": 59 },
      { "date": new Date(2018, 0, 1, 12, 0, 0), "value": 33 },
      { "date": new Date(2018, 0, 1, 13, 0, 0), "value": 46 },
      { "date": new Date(2018, 0, 1, 14, 0, 0), "value": 20 },
      { "date": new Date(2018, 0, 1, 15, 0, 0), "value": 42 },
      { "date": new Date(2018, 0, 1, 16, 0, 0), "value": 59, "opacity": 1 }
    ], colors.getIndex(1));

    createPie([
      { "category": "Data 1", "value": 130 },
      { "category": "Data 2", "value": 450 },
      { "category": "Data 3", "value": 400 },
      { "category": "Data 4", "value": 200 }
    ], colors.getIndex(1));

    createLine("(Price)", [
      { "date": new Date(2018, 0, 1, 8, 0, 0), "value": 16 },
      { "date": new Date(2018, 0, 1, 9, 0, 0), "value": 62 },
      { "date": new Date(2018, 0, 1, 10, 0, 0), "value": 55 },
      { "date": new Date(2018, 0, 1, 11, 0, 0), "value": 34 },
      { "date": new Date(2018, 0, 1, 12, 0, 0), "value": 29 },
      { "date": new Date(2018, 0, 1, 13, 0, 0), "value": 29 },
      { "date": new Date(2018, 0, 1, 14, 0, 0), "value": 28 },
      { "date": new Date(2018, 0, 1, 15, 0, 0), "value": 32 },
      { "date": new Date(2018, 0, 1, 16, 0, 0), "value": 30, "opacity": 1 }
    ], colors.getIndex(2));

    createColumn("(Turnover)", [
      { "date": new Date(2018, 0, 1, 8, 0, 0), "value": 50 },
      { "date": new Date(2018, 0, 1, 9, 0, 0), "value": 51 },
      { "date": new Date(2018, 0, 1, 10, 0, 0), "value": 62 },
      { "date": new Date(2018, 0, 1, 11, 0, 0), "value": 60 },
      { "date": new Date(2018, 0, 1, 12, 0, 0), "value": 25 },
      { "date": new Date(2018, 0, 1, 13, 0, 0), "value": 20 },
      { "date": new Date(2018, 0, 1, 14, 0, 0), "value": 70 },
      { "date": new Date(2018, 0, 1, 15, 0, 0), "value": 42 },
      { "date": new Date(2018, 0, 1, 16, 0, 0), "value": 33, "opacity": 1 }
    ], colors.getIndex(2));

    createPie([
      { "category": "Data 1", "value": 220 },
      { "category": "Data 2", "value": 200 },
      { "category": "Data 3", "value": 150 },
      { "category": "Data 4", "value": 125 }
    ], colors.getIndex(2));

    // FB

    createLine("(Price)", [
      { "date": new Date(2018, 0, 1, 8, 0, 0), "value": 52 },
      { "date": new Date(2018, 0, 1, 9, 0, 0), "value": 55 },
      { "date": new Date(2018, 0, 1, 10, 0, 0), "value": 35 },
      { "date": new Date(2018, 0, 1, 11, 0, 0), "value": 34 },
      { "date": new Date(2018, 0, 1, 12, 0, 0), "value": 39 },
      { "date": new Date(2018, 0, 1, 13, 0, 0), "value": 42 },
      { "date": new Date(2018, 0, 1, 14, 0, 0), "value": 29 },
      { "date": new Date(2018, 0, 1, 15, 0, 0), "value": 22 },
      { "date": new Date(2018, 0, 1, 16, 0, 0), "value": 15, "opacity": 1 }
    ], colors.getIndex(3));

    createColumn("(Turnover)", [
      { "date": new Date(2018, 0, 1, 8, 0, 0), "value": 20 },
      { "date": new Date(2018, 0, 1, 9, 0, 0), "value": 20 },
      { "date": new Date(2018, 0, 1, 10, 0, 0), "value": 25 },
      { "date": new Date(2018, 0, 1, 11, 0, 0), "value": 26 },
      { "date": new Date(2018, 0, 1, 12, 0, 0), "value": 29 },
      { "date": new Date(2018, 0, 1, 13, 0, 0), "value": 27 },
      { "date": new Date(2018, 0, 1, 14, 0, 0), "value": 25 },
      { "date": new Date(2018, 0, 1, 15, 0, 0), "value": 32 },
      { "date": new Date(2018, 0, 1, 16, 0, 0), "value": 30, "opacity": 1 }
    ], colors.getIndex(3));

    createPie([
      { "category": "Data 1", "value": 120 },
      { "category": "Data 2", "value": 150 },
      { "category": "Data 3", "value": 125 },
      { "category": "Data 4", "value": 250 }
    ], colors.getIndex(3));

    this.chart = container
  }

  getChart1() {
    let chart = am4core.create("chartdiv1", am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = [
      {
        item: "Lights",
        value: 40
      },
      {
        item: "Fridge",
        value: 30
      },
      {
        item: "TV",
        value: 20
      },
      {
        item: "Washing Machine",
        value: 16
      }
    ];
    chart.radius = am4core.percent(70);
    chart.innerRadius = am4core.percent(40);
    chart.startAngle = 180;
    chart.endAngle = 360;


    let series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = "value";
    series.dataFields.category = "item";
    series.ticks.template.disabled = true;
    series.labels.template.disabled = true;

    series.slices.template.cornerRadius = 10;
    series.slices.template.innerCornerRadius = 7;
    series.slices.template.draggable = true;
    series.slices.template.inert = true;
    series.alignLabels = false;

    series.hiddenState.properties.startAngle = 90;
    series.hiddenState.properties.endAngle = 90;

    //chart.legend = new am4charts.Legend();
    this.chart1 = chart
  }

}
