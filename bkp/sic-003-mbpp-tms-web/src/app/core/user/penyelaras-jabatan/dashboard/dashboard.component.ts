import { Component, OnInit, NgZone } from "@angular/core";
import { ExamsService } from 'src/app/shared/services/exams/exams.service';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  private chartKehadiranJabatan: any
  private chartCapaiMin: any
  private chartBelumCapaiMin: any
  private chartPrestasiSemasa: any

  public tempTotalCost: number = 0

  constructor(
    private trainingService: TrainingsService,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.initChartKehadiranJabatan()
    this.initChartCapaiMin()
    this.initChartBelumCapaiMin()
    this.initChartPrestasiSemasa()
    this.initStats()
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chartKehadiranJabatan) {
        this.chartKehadiranJabatan.dispose()
      }
      if (this.chartCapaiMin) {
        this.chartCapaiMin.dispose()
      }
      if (this.chartBelumCapaiMin) {
        this.chartBelumCapaiMin.dispose()
      }
      if (this.chartPrestasiSemasa) {
        this.chartPrestasiSemasa.dispose()
      }
    });
  }

  initStats() {
    this.tempTotalCost = 0
    this.trainingService.trainings.forEach(
      (training) => {
        this.tempTotalCost = this.tempTotalCost + training.cost
      }
    )
  }

  generatePDF(chart: string) {
    if (chart == 'prestasiSemasa') {
      console.log('Prestasi semasa')
      //this.chartPrestasiSemasa.exporting.pdfmake.print()
    }
  }

  initChartKehadiranJabatan() {
    this.zone.runOutsideAngular(() => {
      this.chartKehadiranJabatan = am4core.create("chartKehadiranJabatan", am4charts.PieChart);

      this.chartKehadiranJabatan.data = [
        {
          "department": "Skim A",
          "value": 19
        },
        {
          "department": "Skim B",
          "value": 24
        },
        {
          "department": "Skim C",
          "value": 27
        },
        {
          "department": "Skim D",
          "value": 30
        },
        {
          "department": "Skim E",
          "value": 29
        },
        {
          "department": "Skim F",
          "value": 15
        }
      ]

      let pieSeries = this.chartKehadiranJabatan.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "value";
      pieSeries.dataFields.category = "department";
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;
      pieSeries.radius = am4core.percent(60)

      // This creates initial animation
      pieSeries.hiddenState.properties.opacity = 1;
      pieSeries.hiddenState.properties.endAngle = -90;
      pieSeries.hiddenState.properties.startAngle = -90;
    })

  }

  initChartCapaiMin() {
    this.zone.runOutsideAngular(() => {
      this.chartCapaiMin = am4core.create("chartCapaiMin", am4charts.PieChart3D);
      this.chartCapaiMin.hiddenState.properties.opacity = 0; // this creates initial fade-in

      this.chartCapaiMin.data = [
        {
          "department": "Kursus 001",
          "value": 40
        },
        {
          "department": "Kursus 002",
          "value": 32
        },
        {
          "department": "Kursus 003",
          "value": 33
        },
        {
          "department": "Kursus 004",
          "value": 34
        },
        {
          "department": "Kursus 005",
          "value": 15
        },
        {
          "department": "Kursus 006",
          "value": 17
        }
      ]

      this.chartCapaiMin.innerRadius = am4core.percent(40);
      this.chartCapaiMin.depth = 120;

      this.chartCapaiMin.legend = new am4charts.Legend();

      let series = this.chartCapaiMin.series.push(new am4charts.PieSeries3D());
      series.dataFields.value = "value";
      series.dataFields.depthValue = "value";
      series.dataFields.category = "department";
      series.slices.template.cornerRadius = 5;
      series.colors.step = 3;
      series.ticks.template.disabled = true;
      series.labels.template.disabled = true;
      series.radius = am4core.percent(100)
    })
  }

  initChartBelumCapaiMin() {
    this.zone.runOutsideAngular(() => {
      this.chartBelumCapaiMin = am4core.create("chartBelumCapaiMin", am4charts.PieChart3D);
      this.chartBelumCapaiMin.hiddenState.properties.opacity = 0; // this creates initial fade-in

      this.chartBelumCapaiMin.legend = new am4charts.Legend()

      this.chartBelumCapaiMin.data = [
        {
          "department": "Kursus 001",
          "value": 12
        },
        {
          "department": "Kursus 002",
          "value": 5
        },
        {
          "department": "Kursus 003",
          "value": 6
        },
        {
          "department": "Kursus 004",
          "value": 5
        },
        {
          "department": "Kursus 005",
          "value": 10
        },
        {
          "department": "Kursus 006",
          "value": 1
        }
      ]

      this.chartBelumCapaiMin.innerRadius = 60;

      let series = this.chartBelumCapaiMin.series.push(new am4charts.PieSeries3D());
      series.dataFields.value = "value";
      series.dataFields.category = "department";
    })
  }

  initChartPrestasiSemasa() {
    this.zone.runOutsideAngular(() => {
      this.chartPrestasiSemasa = am4core.create("chartPrestasiSemasa", am4charts.XYChart);

      this.chartPrestasiSemasa.data = [
        {
          "month": "Jan",
          "value": 22
        },
        {
          "month": "Feb",
          "value": 54
        },
        {
          "month": "Mac",
          "value": 76
        },
        {
          "month": "Apr",
          "value": 56
        },
        {
          "month": "Mei",
          "value": 5
        },
        {
          "month": "Jun",
          "value": 99
        },
        {
          "month": "Jul",
          "value": 21
        },
        {
          "month": "Ogo",
          "value": 54
        },
        {
          "month": "Sep",
          "value": 101
        },
        {
          "month": "Okt",
          "value": 26
        },
        {
          "month": "Nov",
          "value": 68
        },
        {
          "month": "Dis",
          "value": 21
        }
      ]

      let categoryAxis = this.chartPrestasiSemasa.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "month";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 30;

      categoryAxis.renderer.labels.template.adapter.add("dy", function (dy, target) {
        if (target.dataItem && target.dataItem.index && 2 == 2) {
          return dy + 25;
        }
        return dy;
      });

      let valueAxis = this.chartPrestasiSemasa.yAxes.push(new am4charts.ValueAxis());

      let series = this.chartPrestasiSemasa.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "value";
      series.dataFields.categoryX = "month";
      series.name = "Bilangan";
      series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
      series.columns.template.fillOpacity = .8;

      let columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 2;
      columnTemplate.strokeOpacity = 1;
    })
  }

  getPDF() {
    let fileURL = '/assets/MBPP_TMS_Laporan.pdf'
    window.open(fileURL, '_blank');
  }

}


