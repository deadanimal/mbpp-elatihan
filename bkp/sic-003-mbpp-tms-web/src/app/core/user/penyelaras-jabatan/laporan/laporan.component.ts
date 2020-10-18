import { Component, OnInit, NgZone } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-laporan',
  templateUrl: './laporan.component.html',
  styleUrls: ['./laporan.component.scss']
})
export class LaporanComponent implements OnInit {


  constructor(
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.initChartKeberkesanan()
    this.initPrestassi()
    this.initTahunan()
  }

  initChartKeberkesanan() {
    let chart = am4core.create("chartKeberkesanan", am4charts.PieChart3D);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.legend = new am4charts.Legend();

    chart.data = [
      {
        category: "Amat Berkesan",
        value: 80
      },
      {
        category: "Berkesan",
        value: 10
      },
      {
        category: "Sederhana",
        value: 9
      },
      {
        category: "Tidak Berkesan",
        value: 1
      }
    ];

    chart.innerRadius = 60;

    let series = chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = "value";
    series.dataFields.category = "category";
  }

  initTahunan() {
    let chart = am4core.create("chartTahunan", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

    chart.data = [{
      "month": "Jan",
      "value": 32
    }, {
      "month": "Feb",
      "value": 16
    }, {
      "month": "Mac",
      "value": 22
    }, {
      "month": "Apr",
      "value": 26
    }, {
      "month": "Mei",
      "value": 27
    }, {
      "month": "Jun",
      "value": 15
    }, {
      "month": "Jul",
      "value": 16
    }, {
      "month": "Ogo",
      "value": 22
    }, {
      "month": "Sep",
      "value": 12
    }, {
      "month": "Oct",
      "value": 17
    }, {
      "month": "Nov",
      "value": 9
    }, {
      "month": "Dis",
      "value": 2
    }];


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


  }

  initPrestassi() {

    let chart = am4core.create("chartPrestasi", am4charts.XYChart);

    let data = [];
    let value = 120;

    let names = ["Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Ogo",
      "Sep",
      "Oct",
      "Nov",
      "Dis"
    ];

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
    categoryAxis.renderer.labels.template.rotation = -90;
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
  }


  getPDF() {
    let fileURL = '/assets/MBPP_TMS_Laporan.pdf'
    window.open(fileURL, '_blank');
  }
}
