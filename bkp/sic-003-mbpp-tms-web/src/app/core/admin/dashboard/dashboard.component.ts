import { Component, OnInit, NgZone } from "@angular/core";
import { ExamsService } from 'src/app/shared/services/exams/exams.service';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
import { User } from 'src/app/shared/services/auth/auth.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
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

  public userInformation: User

  constructor(
    private authService: AuthService,
    private trainingService: TrainingsService,
    private zone: NgZone
  ) {
    this.userInformation = this.authService.userInformation
  }

  ngOnInit() {
    this.initChartKehadiranJabatan()
    this.initChartCapaiMin()
    this.initChartBelumCapaiMin()
    this.initChartPrestasiSemasa()
    this.initStats()
    this.checkIfFirstLogin()
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
      // this.chartPrestasiSemasa.exporting.pdfmake.then(
      //   () => {

      //   }
      // )
    }
  }

  initChartKehadiranJabatan() {
    this.zone.runOutsideAngular(() => {
      this.chartKehadiranJabatan = am4core.create("chartKehadiranJabatan", am4charts.PieChart);

      this.chartKehadiranJabatan.data = [
        {
          "department": "Kawalan Bangunan",
          "value": 1
        },
        {
          "department": "Kejuruteraan",
          "value": 1
        },
        {
          "department": "Kesihatan, Persekitaran & Pelesenan",
          "value": 1
        },
        {
          "department": "Perbendaharaan",
          "value": 1
        },
        {
          "department": "Penasihat Undang-undang",
          "value": 1
        },
        {
          "department": "Perancangan Pembangunan",
          "value": 1
        },
        {
          "department": "Khidmat Pengurusan",
          "value": 1
        },
        {
          "department": "Khidmat Kemasyarakatan",
          "value": 1
        },
        {
          "department": "Konservasi Warisan",
          "value": 1
        },
        {
          "department": "Pesuruhjaya Bangunan",
          "value": 1
        },
        {
          "department": "Penguatkuasaan",
          "value": 1
        },
        {
          "department": "Perkhidmatan Perbandaran",
          "value": 1
        },
        {
          "department": "Landskap",
          "value": 1
        },
        {
          "department": "Bahagian Pelesenan",
          "value": 1
        },
        {
          "department": "Unit Audit Dalam",
          "value": 1
        },
        {
          "department": "Unit OSC",
          "value": 1
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
          "department": "Kawalan Bangunan",
          "value": 11
        },
        {
          "department": "Kejuruteraan",
          "value": 2
        },
        {
          "department": "Kesihatan, Persekitaran & Pelesenan",
          "value": 2
        },
        {
          "department": "Perbendaharaan",
          "value": 2
        },
        {
          "department": "Penasihat Undang-undang",
          "value": 1
        },
        {
          "department": "Perancangan Pembangunan",
          "value": 2
        },
        {
          "department": "Khidmat Pengurusan",
          "value": 1
        },
        {
          "department": "Khidmat Kemasyarakatan",
          "value": 1
        },
        {
          "department": "Konservasi Warisan",
          "value": 1
        },
        {
          "department": "Pesuruhjaya Bangunan",
          "value": 1
        },
        {
          "department": "Penguatkuasaan",
          "value": 1
        },
        {
          "department": "Perkhidmatan Perbandaran",
          "value": 1
        },
        {
          "department": "Landskap",
          "value": 1
        },
        {
          "department": "Bahagian Pelesenan",
          "value": 1
        },
        {
          "department": "Unit Audit Dalam",
          "value": 1
        },
        {
          "department": "Unit OSC",
          "value": 1
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
          "department": "Kawalan Bangunan",
          "value": 1
        },
        {
          "department": "Kejuruteraan",
          "value": 1
        },
        {
          "department": "Kesihatan, Persekitaran & Pelesenan",
          "value": 1
        },
        {
          "department": "Perbendaharaan",
          "value": 2
        },
        {
          "department": "Penasihat Undang-undang",
          "value": 1        },
        {
          "department": "Perancangan Pembangunan",
          "value": 1
        },
        {
          "department": "Khidmat Pengurusan",
          "value": 1
        },
        {
          "department": "Khidmat Kemasyarakatan",
          "value": 1
        },
        {
          "department": "Konservasi Warisan",
          "value": 1
        },
        {
          "department": "Pesuruhjaya Bangunan",
          "value": 1
        },
        {
          "department": "Penguatkuasaan",
          "value": 1
        },
        {
          "department": "Perkhidmatan Perbandaran",
          "value": 1
        },
        {
          "department": "Landskap",
          "value": 1
        },
        {
          "department": "Bahagian Pelesenan",
          "value": 1
        },
        {
          "department": "Unit Audit Dalam",
          "value": 1
        },
        {
          "department": "Unit OSC",
          "value": 2
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
          "value": 1
        },
        {
          "month": "Feb",
          "value": 1
        },
        {
          "month": "Mac",
          "value": 1
        },
        {
          "month": "Apr",
          "value": 1
        },
        {
          "month": "Mei",
          "value": 1
        },
        {
          "month": "Jun",
          "value": 0
        },
        {
          "month": "Jul",
          "value": 0
        },
        {
          "month": "Ogo",
          "value": 0
        },
        {
          "month": "Sep",
          "value": 0
        },
        {
          "month": "Okt",
          "value": 0
        },
        {
          "month": "Nov",
          "value": 0
        },
        {
          "month": "Dis",
          "value": 0
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

  checkIfFirstLogin() {
    if (this.userInformation.is_first_login) {
      console.log('First login')
    }
    else {
      console.log('Not first login')
    }
  }

}


