import { Component, NgZone, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { LoadingBarService } from '@ngx-loading-bar/core';

import { AnalysisExtended } from 'src/app/shared/services/analyses/analyses.model';
import { Core } from 'src/app/shared/services/cores/cores.model';
import { User } from 'src/app/shared/services/users/users.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AnalysesService } from 'src/app/shared/services/analyses/analyses.service';
import { CoresService } from 'src/app/shared/services/cores/cores.service';

import swal from 'sweetalert2';
import * as moment from 'moment';
import * as xlsx from 'xlsx';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
am4core.useTheme(am4themes_animated);

export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox'
}

@Component({
  selector: 'app-need-analysis',
  templateUrl: './need-analysis.component.html',
  styleUrls: ['./need-analysis.component.scss']
})
export class NeedAnalysisComponent implements OnInit {

  // Data
  analyses: AnalysisExtended[] = []
  currentUser: User
  cores: Core[] = []
  coresTemp: Core[] = []
  coresParentTemp = 'GN'
  statistics

  // Table
  tableEntries: number = 5
  tableSelected: any[] = []
  tableTemp = []
  tableActiveRow: any
  tableRows: any = []
  tableMessages = { 
    emptyMessage: 'Tiada rekod dijumpai',
    totalMessage: 'rekod'
  }
  SelectionType = SelectionType;

  // Checker
  isEmpty: boolean = true
  isRegister: boolean = false
  isSummaryTableHidden: boolean = true
  // Icon
  iconEmpty = 'assets/img/icons/box.svg'

  // Form
  analysisForm: FormGroup

  // Chart
  chartOverall

  constructor(
    private authService: AuthService,
    private analysisService: AnalysesService,
    private coreService: CoresService,
    private fb: FormBuilder,
    private loadingBar: LoadingBarService,
    private notifyService: NotifyService,
    private zone: NgZone
  ) { 
    this.getData()
  }

  ngOnInit() {
    this.initForm()
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(
      () => {
        if (this.chartOverall) {
          this.chartOverall.dispose()
        }
      }
    )
  }

  getData() {
    this.loadingBar.start()

    forkJoin([
      this.authService.getDetailByToken(),
      this.analysisService.getAll(),
      this.coreService.getAll(),
      this.analysisService.getStatistics()
    ]).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.currentUser = this.authService.userDetail
        this.analyses = this.analysisService.analysesExtended
        this.cores = this.coreService.cores
        this.statistics = this.analysisService.statistics['statistics']

        this.tableRows = this.analyses
        this.tableTemp = this.tableRows.map((prop, key) => {
          return {
            ...prop,
            id_index: key+1
          };
        });

        if (this.tableTemp.length >= 1) {
          this.isEmpty = false
        }
        else {
          this.isEmpty = true
        }

        this.analysisForm.controls['staff'].setValue(this.currentUser['id'])

        this.cores.forEach(
          (core: Core) => {
            if (
              core['parent'] == 'GN' &&
              core['active']
            ) {
              this.coresTemp.push(core)
              if (!this.analysisForm.value['core']) {
                this.analysisForm.controls['core'].setValue(core['id'])
              }
            }
          }
        )

        this.getCharts()
      }
    )
  }

  initForm() {
    this.analysisForm = this.fb.group({
      staff: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      core: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      suggested_title: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      suggested_facilitator: new FormControl(null, Validators.compose([
        Validators.required
      ])),
    })
  }

  confirm() {
    swal.fire({
      title: 'Pengesahan',
      text: 'Anda pasti untuk mendaftar keperluan latihan ini?',
      type: 'info',
      buttonsStyling: false,
      showCancelButton: true,
      confirmButtonClass: 'btn btn-info',
      confirmButtonText: 'Pasti',
      cancelButtonClass: 'btn btn-outline-info',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.value) {
        this.add()
      }
    })
  }

  add() {
    this.loadingBar.start()
    let infoTitle = 'Sedang proses'
    let infoMessage = 'Keperluan latihan sedang ditambah'
    this.notifyService.openToastrInfo(infoTitle, infoMessage)
    // console.log(this.analysisForm.value)
    this.analysisService.post(this.analysisForm.value).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        let title = 'Tidak berjaya'
        let message = 'Anda tidak berjaya untuk menambah keperluan latihan. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        let title = 'Berjaya'
        let message = 'Keperluan latihan berjaya ditambah.'
        this.notifyService.openToastr(title, message)
        this.success()
      }
    )
  }

  success() {
    swal.fire({
      title: 'Berjaya',
      text: 'Peperiksaan telah ditambah. Tambah lagi?',
      type: 'success',
      buttonsStyling: false,
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      confirmButtonText: 'Tambah',
      cancelButtonClass: 'btn btn-success-info',
      cancelButtonText: 'Tidak'
    }).then((result) => {
      if (result.value) {
        this.analysisForm.reset()
        this.initForm()
        this.getData()
      }
      else {
        this.isRegister = false
        this.initForm()
        this.getData()
      }
    })
  }

  enableRegister() {
    this.isRegister = true
  }

  disableRegister() {
    this.isRegister = false
  }

  entriesChange($event) {
    this.tableEntries = $event.target.value;
  }

  filterTable($event) {
    let val = $event.target.value.toLowerCase();
    this.tableTemp = this.tableRows.filter(function(d) {
      return d.title.toLowerCase().indexOf(val) !== -1 || !val;
    });
  }

  onSelect({ selected }) {
    this.tableSelected.splice(0, this.tableSelected.length);
    this.tableSelected.push(...selected);
  }

  onActivate(event) {
    this.tableActiveRow = event.row;
  }

  onChangeCoreParent(value) {
    if (value == 'GN') {
      this.coresTemp = []
      this.cores.forEach(
        (core: Core) => {
          if (
            core['parent'] == 'GN' &&
            core['active']
          ) {
            this.coresTemp.push(core)
          }
        }
      )
    }
    else if (value == 'FN') {
      this.coresTemp = []
      this.cores.forEach(
        (core: Core) => {
          if (
            core['parent'] == 'FN' &&
            core['active']
          ) {
            this.coresTemp.push(core)
          }
        }
      )
    }
  }

  getCharts() {
    this.zone.runOutsideAngular(
      () => {
        this.getChartOverall()
      }
    )
  }

  getChartOverall() {
    let container = am4core.create('chart-tc-need-analysis', am4core.Container);
    container.width = am4core.percent(100);
    container.height = am4core.percent(100);
    container.layout = 'horizontal';

    let chart = container.createChild(am4charts.PieChart);
    chart.radius = am4core.percent(50);
    chart.innerRadius = 60;
    // chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    // chart.radius = am4core.percent(50);
    // chart.innerRadius = 60;
    // // chart.legend = new am4charts.Legend();

    chart.data = this.statistics

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = 'value';
    pieSeries.dataFields.category = 'type';
    pieSeries.slices.template.states.getKey('active').properties.shiftRadius = 0;
    //pieSeries.labels.template.text = '{category}\n{value.percent.formatNumber('#.#')}%';

    pieSeries.slices.template.events.on('hit', function(event) {
      selectSlice(event.target.dataItem);
    })

    let chart2 = container.createChild(am4charts.PieChart);
    chart2.width = am4core.percent(30);
    chart2.radius = am4core.percent(80);

    // Add and configure Series
    let pieSeries2 = chart2.series.push(new am4charts.PieSeries());
    pieSeries2.dataFields.value = 'value';
    pieSeries2.dataFields.category = 'name';
    pieSeries2.slices.template.states.getKey('active').properties.shiftRadius = 0;
    //pieSeries2.labels.template.radius = am4core.percent(50);
    //pieSeries2.labels.template.inside = true;
    //pieSeries2.labels.template.fill = am4core.color('#ffffff');
    pieSeries2.labels.template.disabled = true;
    pieSeries2.ticks.template.disabled = true;
    pieSeries2.alignLabels = false;
    pieSeries2.events.on('positionchanged', updateLines);

    let interfaceColors = new am4core.InterfaceColorSet();

    let line1 = container.createChild(am4core.Line);
    line1.strokeDasharray = '2,2';
    line1.strokeOpacity = 0.5;
    line1.stroke = interfaceColors.getFor('alternativeBackground');
    line1.isMeasured = false;

    let line2 = container.createChild(am4core.Line);
    line2.strokeDasharray = '2,2';
    line2.strokeOpacity = 0.5;
    line2.stroke = interfaceColors.getFor('alternativeBackground');
    line2.isMeasured = false;

    let selectedSlice;

    function selectSlice(dataItem) {

      selectedSlice = dataItem.slice;

      let fill = selectedSlice.fill;

      let count = dataItem.dataContext.subData.length;
      pieSeries2.colors.list = [];
      for (var i = 0; i < count; i++) {
        if (fill) {
          pieSeries2.colors.list.push(fill.brighten(i * 2 / count));
        }
      }

      chart2.data = dataItem.dataContext.subData;
      pieSeries2.appear();

      let middleAngle = selectedSlice.middleAngle;
      let firstAngle = pieSeries.slices.getIndex(0).startAngle;
      let animation = pieSeries.animate([{ property: 'startAngle', to: firstAngle - middleAngle }, { property: 'endAngle', to: firstAngle - middleAngle + 360 }], 600, am4core.ease.sinOut);
      animation.events.on('animationprogress', updateLines);

      selectedSlice.events.on('transformed', updateLines);

    //  var animation = chart2.animate({property:'dx', from:-container.pixelWidth / 2, to:0}, 2000, am4core.ease.elasticOut)
    //  animation.events.on('animationprogress', updateLines)
    }


    function updateLines() {
      if (selectedSlice) {
        let p11 = { x: selectedSlice.radius * am4core.math.cos(selectedSlice.startAngle), y: selectedSlice.radius * am4core.math.sin(selectedSlice.startAngle) };
        let p12 = { x: selectedSlice.radius * am4core.math.cos(selectedSlice.startAngle + selectedSlice.arc), y: selectedSlice.radius * am4core.math.sin(selectedSlice.startAngle + selectedSlice.arc) };

        p11 = am4core.utils.spritePointToSvg(p11, selectedSlice);
        p12 = am4core.utils.spritePointToSvg(p12, selectedSlice);

        let p21 = { x: 0, y: -pieSeries2.pixelRadius };
        let p22 = { x: 0, y: pieSeries2.pixelRadius };

        p21 = am4core.utils.spritePointToSvg(p21, pieSeries2);
        p22 = am4core.utils.spritePointToSvg(p22, pieSeries2);

        line1.x1 = p11.x;
        line1.x2 = p21.x;
        line1.y1 = p11.y;
        line1.y2 = p21.y;

        line2.x1 = p12.x;
        line2.x2 = p22.x;
        line2.y1 = p12.y;
        line2.y2 = p22.y;
      }
    }

    chart.events.on('datavalidated', function() {
      setTimeout(function() {
        selectSlice(pieSeries.dataItems.getIndex(0));
      }, 1000);
    });

    // Export
    let todayDate = new Date()
    let todayDateFormat = moment(todayDate).format('YYYYMMDD')
    let fileNamePrefix = 'Laporan_TNA_' + todayDateFormat

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = fileNamePrefix; 

    this.chartOverall = chart
  }

  exportExcel() {
    let todayDate = new Date()
    let todayDateFormat = moment(todayDate).format('YYYYMMDD')
    let fileName = 'Ringkasan_Analisa_Keperluan_Latihan_' + todayDateFormat + '.xlsx'
    let element = document.getElementById('summaryTable'); 
    const ws: xlsx.WorkSheet = xlsx.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    xlsx.writeFile(wb, fileName);
  }

}
