import { Component, OnInit, NgZone, OnDestroy, TemplateRef, ViewChild } from "@angular/core";
import { ExamsService } from 'src/app/shared/services/exams/exams.service';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
import { User } from 'src/app/shared/services/auth/auth.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import {
  BelumCapaiMin,
  CapaiMin,
  KehadiranJabatan,
  PrestasiSemasa
} from '../../../../../assets/mock/penyelaras/dashboard';
import { UsersService } from 'src/app/shared/services/users/users.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  @ViewChild('firstLogin', {static: true}) modalTemplate : TemplateRef<any>;

  // Chart
  private chartKehadiranJabatan: any
  private chartCapaiMin: any
  private chartBelumCapaiMin: any
  private chartPrestasiSemasa: any
  private dataBelumCapaiMin = BelumCapaiMin
  private dataCapaiMin = CapaiMin
  private dataKehadiranJabatan = KehadiranJabatan
  private dataPrestasiSemasa = PrestasiSemasa

  // Stats
  public kursusDirancang: number = 0
  public kursusDalaman: number = 0
  public bajetSemasa: number = 0
  public kursusLuaran: number = 0
  public kehadiranKursusDalaman: number = 0
  public pesertaKursusDalaman: number = 0
  public perbelanjaanSemasa: number = 0
  public tempTotalCost: number = 0

  // Data
  public userInformation: User

  // Modal
  public modal: BsModalRef;
  public modalConfig = {
    keyboard: false,
    class: "modal-dialog-centered"
  };

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private trainingService: TrainingsService,
    private modalService: BsModalService,
    private zone: NgZone
  ) { 
    this.userInformation = this.authService.userInformation
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.initChartKehadiranJabatan()
      this.initChartCapaiMin()
      this.initChartBelumCapaiMin()
      this.initChartPrestasiSemasa()
    })
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
      //this.chartPrestasiSemasa.exporting.pdfmake.print()
    }
  }

  initChartKehadiranJabatan() {
    this.chartKehadiranJabatan = am4core.create("chartKehadiranJabatan", am4charts.PieChart);

    this.chartKehadiranJabatan.data = this.dataKehadiranJabatan

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

  }

  initChartCapaiMin() {
    this.chartCapaiMin = am4core.create("chartCapaiMin", am4charts.PieChart3D);
    this.chartCapaiMin.hiddenState.properties.opacity = 0; // this creates initial fade-in

    this.chartCapaiMin.data = this.dataCapaiMin

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
  }

  initChartBelumCapaiMin() {
    this.chartBelumCapaiMin = am4core.create("chartBelumCapaiMin", am4charts.PieChart3D);
    this.chartBelumCapaiMin.hiddenState.properties.opacity = 0; // this creates initial fade-in

    this.chartBelumCapaiMin.legend = new am4charts.Legend()

    this.chartBelumCapaiMin.data = this.dataBelumCapaiMin

    this.chartBelumCapaiMin.innerRadius = 60;

    let series = this.chartBelumCapaiMin.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = "value";
    series.dataFields.category = "department";
  }

  initChartPrestasiSemasa() {
    this.chartPrestasiSemasa = am4core.create("chartPrestasiSemasa", am4charts.XYChart);

    this.chartPrestasiSemasa.data = this.dataPrestasiSemasa

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
  }

  checkIfFirstLogin() {
    if (this.userInformation.is_first_login) {
      console.log('First login')
      this.openmodal(this.modalTemplate)
    }
    else {
      console.log('Not first login')
    }
  }

  openmodal(modalRef: TemplateRef<any>) {
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  submitFirstLoginForms() {
    this.userInformation.is_first_login = false
    this.userService.complete(this.authService.userID).subscribe(
      () => {},
      () => {},
      () => {}
    )
    this.modal.hide()
  }

  getPDF() {
    let fileURL = '/assets/MBPP_TMS_Laporan.pdf'
    window.open(fileURL, '_blank');
  }

  generateStatKehadiranJabatan() {
    let valueJan = 0
    let valueFeb = 0
    let valueMar = 0
    let valueApr = 0
    let valueMay = 0
    let valueJun = 0
    let valueJul = 0
    let valueAug = 0
    let valueSep = 0
    let valueOct = 0
    let valueNov = 0
    let valueDec = 0
  }

  generateJabatan5Hari() {
    let valueJan = 0
    let valueFeb = 0
    let valueMar = 0
    let valueApr = 0
    let valueMay = 0
    let valueJun = 0
    let valueJul = 0
    let valueAug = 0
    let valueSep = 0
    let valueOct = 0
    let valueNov = 0
    let valueDec = 0
  }

  generateJabatanBelum5Hari() {
    let valueJan = 0
    let valueFeb = 0
    let valueMar = 0
    let valueApr = 0
    let valueMay = 0
    let valueJun = 0
    let valueJul = 0
    let valueAug = 0
    let valueSep = 0
    let valueOct = 0
    let valueNov = 0
    let valueDec = 0
  }

  generatePrestasiLatihan() {
    let valueJan = 0
    let valueFeb = 0
    let valueMar = 0
    let valueApr = 0
    let valueMay = 0
    let valueJun = 0
    let valueJul = 0
    let valueAug = 0
    let valueSep = 0
    let valueOct = 0
    let valueNov = 0
    let valueDec = 0
  }
  
}


