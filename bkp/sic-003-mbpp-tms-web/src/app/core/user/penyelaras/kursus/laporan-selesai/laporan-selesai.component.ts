import { Component, OnInit, NgZone } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-laporan-selesai',
  templateUrl: './laporan-selesai.component.html',
  styleUrls: ['./laporan-selesai.component.scss']
})
export class LaporanSelesaiComponent implements OnInit {

  public chartObjektif: am4charts.PieChart
  public chartKaitan: am4charts.XYChart
  public chartKemudahan: am4charts.XYChart
  public chartPengajar: am4charts.XYChart

  constructor(
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.initObjektifKursus()
    this.initKaitan()
    this.initKemudahan()
    this.initPengajar()
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chartObjektif) {
        this.chartObjektif.dispose();
      }
    });
  }

  initObjektifKursus() {
    let chart = am4core.create("chartObjektif", am4charts.PieChart);

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "value";
    pieSeries.dataFields.category = "objective";

    // Let's cut a hole in our Pie chart the size of 30% the radius
    chart.innerRadius = am4core.percent(30);

    // Put a thick white border around each Slice
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template
      // change the cursor on hover to make it apparent the object can be interacted with
      .cursorOverStyle = [
        {
          "property": "cursor",
          "value": "pointer"
        }
      ];

    pieSeries.alignLabels = true;
    pieSeries.labels.template.bent = true;
    pieSeries.labels.template.radius = 3;
    pieSeries.labels.template.padding(0, 0, 0, 0);

    pieSeries.ticks.template.disabled = true;

    // Create a base filter effect (as if it's not there) for the hover to return to
    let shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
    shadow.opacity = 0;

    // Create hover state
    let hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists

    // Slightly shift the shadow and make it more prominent on hover
    let hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
    hoverShadow.opacity = 0.7;
    hoverShadow.blur = 5;

    // Add a legend
    //chart.legend = new am4charts.Legend();

    chart.data = [{
      "objective": "Cemerlang",
      "value": 20
    }, {
      "objective": "Bagus",
      "value": 2
    }, {
      "objective": "Memuaskan",
      "value": 3
    }, {
      "objective": "Sederhana",
      "value": 1
    }, {
      "objective": "Lemah",
      "value": 2
    }];

    this.chartObjektif = chart
  }

  initKaitan() {
    let chart = am4core.create("chartKaitan", am4charts.XYChart);

    // Add data
    chart.data = [
      {
        "tajuk": "Tugas",
        "membantu": 83,
        "berkaitan": 17,
        "tidak berkaitan": 0,
      }, 
      {
        "tajuk": "Nilai Positif",
        "membantu": 80,
        "berkaitan": 20,
        "tidak_berkaitan": 0,
      }
    ];

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "tajuk";
    categoryAxis.title.text = "Soalan";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.title.text = "Peratusan (%)";

    // Create series
    function createSeries(field, name, stacked) {
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "tajuk";
      series.name = name;
      series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
      series.stacked = stacked;
      series.columns.template.width = am4core.percent(95);
    }

    createSeries("membantu", "Membantu", false);
    createSeries("berkaitan", "Berkaitan", true);
    createSeries("tidak_membantu", "Tidak Membantu", false);

    // Add legend
    chart.legend = new am4charts.Legend();

  }

  initKemudahan(){
    let chart = am4core.create("chartKemudahan", am4charts.XYChart);

    // Add data
    chart.data = [
      {
        "tajuk": "Penginapan",
        "cemerlang": 66,
        "bagus": 34,
        "memuaskan": 0,
        "sederhana": 0,
        "lemah": 0
      }, 
      {
        "tajuk": "Bilik Kuliah",
        "cemerlang": 72,
        "bagus": 28,
        "memuaskan": 0,
        "sederhana": 0,
        "lemah": 0
      },
      {
        "tajuk": "Jamuan Makan Minum",
        "cemerlang": 72,
        "bagus": 28,
        "memuaskan": 0,
        "sederhana": 0,
        "lemah": 0
      }
    ];

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "tajuk";
    categoryAxis.title.text = "Soalan";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.title.text = "Peratusan (%)";

    // Create series
    function createSeries(field, name, stacked) {
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "tajuk";
      series.name = name;
      series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
      series.stacked = stacked;
      series.columns.template.width = am4core.percent(95);
    }

    createSeries("cemerlang", "Cemerlang", false);
    createSeries("bagus", "Bagus", true);
    createSeries("memuaskan", "Memuaskan", false);
    createSeries("sederhana", "Sederhana", false);
    createSeries("lemah", "Lemah", false);

    // Add legend
    chart.legend = new am4charts.Legend();

  }

  initPengajar(){
    let chart = am4core.create("chartPengajar", am4charts.XYChart);

    // Add data
    chart.data = [
      {
        "tajuk": "Isi Kandungan",
        "cemerlang": 49,
        "bagus": 50,
        "memuaskan": 1,
        "sederhana": 0,
        "lemah": 0
      }, 
      {
        "tajuk": "Persembahan",
        "cemerlang": 58,
        "bagus": 41,
        "memuaskan": 1,
        "sederhana": 0,
        "lemah": 0
      },
      {
        "tajuk": "Kaitan",
        "cemerlang": 57,
        "bagus": 43,
        "memuaskan": 0,
        "sederhana": 0,
        "lemah": 0
      }
    ];

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "tajuk";
    categoryAxis.title.text = "Soalan";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.title.text = "Peratusan (%)";

    // Create series
    function createSeries(field, name, stacked) {
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "tajuk";
      series.name = name;
      series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
      series.stacked = stacked;
      series.columns.template.width = am4core.percent(95);
    }

    createSeries("cemerlang", "Cemerlang", false);
    createSeries("bagus", "Bagus", true);
    createSeries("memuaskan", "Memuaskan", false);
    createSeries("sederhana", "Sederhana", false);
    createSeries("lemah", "Lemah", false);

    // Add legend
    chart.legend = new am4charts.Legend();
  }

}
