import { Component, NgZone, OnInit } from '@angular/core';

import { AnalysisExtended } from 'src/app/shared/services/analyses/analyses.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AnalysesService } from 'src/app/shared/services/analyses/analyses.service';

import { CoresService } from 'src/app/shared/services/cores/cores.service';
import { User } from 'src/app/shared/services/users/users.model';
import { Core } from 'src/app/shared/services/cores/cores.model';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { LoadingBarService } from '@ngx-loading-bar/core';

import swal from 'sweetalert2';
import * as moment from 'moment';

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
    let chart = am4core.create('chart-tc-need-analysis', am4charts.PieChart3D);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    chart.radius = am4core.percent(50);
    chart.innerRadius = 60;
    // chart.legend = new am4charts.Legend();

    chart.data = []
    this.statistics.forEach(
      (data_) => {
        chart.data.push({
          core: data_['core'],
          value: data_['value']
        })
      }
    )

    let series = chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = 'value';
    series.dataFields.category = 'core';
    series.labels.template.fontSize = 13;
    // series.alignLabels = false;

    // Export
    let todayDate = new Date()
    let todayDateFormat = moment(todayDate).format('YYYYMMDD')
    let fileNamePrefix = 'Laporan_TNA_' + todayDateFormat

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = fileNamePrefix; 

    this.chartOverall = chart
  }

}
