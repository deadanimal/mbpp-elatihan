import { Component, OnInit, NgZone, TemplateRef } from '@angular/core';
import { ExamsService } from 'src/app/shared/services/exams/exams.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Exam, ExamTemp } from 'src/app/shared/services/exams/exams.model';

import * as moment from 'moment';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { User } from 'src/app/shared/services/users/users.model';
import { forkJoin } from 'rxjs';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
am4core.useTheme(am4themes_animated);

import swal from 'sweetalert2';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.scss']
})
export class ExamsComponent implements OnInit {

  // Data
  exams: ExamTemp[] = []
  staffs: User[] = []
  selectedExam: Exam

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

  // Icon
  iconEmpty = 'assets/img/icons/box.svg'

  // Form
  examForm: FormGroup

  // Datepicker
  dateValue: Date
  dateConfig = { 
    isAnimated: true, 
    dateInputFormate: 'YYYY-MM-DDTHH:mm:ss.SSSSZ',
    containerClass: 'theme-dark-blue' 
  }

  // Choices
  choicesResult = [
    { text: 'Lulus', value: 'PA' },
    { text: 'Gagal', value: 'FA' }
  ]
  choicesClassification = [
    { text: 'Faedah Kewangan', value: 'FKW' },
    { text: 'Pengesahan Dalam Perkhidmatan', value: 'PDP' },
    { text: 'Peperiksaan Peningkatan Secara Lantikan (PSL)', value: 'PSL' }
  ]

  // Modal
  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered"
  };

  // Chart
  chartMonth: any
  chartDep: any
  chartResult: any

  chartMonthJan: number = 0
  chartMonthFeb: number = 0
  chartMonthMar: number = 0
  chartMonthApr: number = 0
  chartMonthMay: number = 0
  chartMonthJun: number = 0
  chartMonthJul: number = 0
  chartMonthAug: number = 0
  chartMonthSep: number = 0
  chartMonthOct: number = 0
  chartMonthNov: number = 0
  chartMonthDec: number = 0

  chartDepPDB: number = 0 // Pejabat Datuk Bandar
  chartDepUUU: number = 0 // Pejabat Datuk Bandar ; Unit Undang-undang
  chartDepUAD: number = 0 // Pejabat Datuk Bandar ; Unit Audit Dalam
  chartDepUPP: number = 0 // Pejabat Datuk Bandar ; Unit Penyelarasan Pembangunan
  chartDepUPS: number = 0 // Pejabat Datuk Bandar ; Unit Pusat Sehenti
  chartDepJKP: number = 0 // Jabatan Khidmat Pengurusan
  chartDepJPD: number = 0 // Jabatan Perbendaharaan
  chartDepJPH: number = 0 // Jabatan Penilaian Pengurusan Harta
  chartDepJPP: number = 0 // Jabatan Perancangan Pembangunan
  chartDepJKJ: number = 0 // Jabatan Kejuruteraan
  chartDepJKB: number = 0 // Jabatan Kawalan Bangunan
  chartDepJKEA: number = 0 // Jabatan Kesihatan Persekitaran dan Pelesenan ; Bahagian Kesihatan Awam
  chartDepJKEB: number = 0 // Jabatan Kesihatan Persekitaran dan Pelesenan ; Bahagian Pelesenan
  chartDepJPR: number = 0 // Jabatan Perkhidmatan Perbandaraan
  chartDepJKK: number = 0 // Jabatan Khidmat Kemasyarakatan
  chartDepJKW: number = 0 // Jabatan Konservasi Warisan
  chartDepJLK: number = 0 // Jabatan Lanskap
  chartDepJPU: number = 0 // Jabatan Penguatkuasaan
  chartDepJPB: number = 0 // Jabatan Pesuruhjaya Bangunan

  chartResultPass: number = 0
  chartResultFail: number = 0

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private examService: ExamsService,
    private loadingBar: LoadingBarService,
    private zone: NgZone,
    private formBuilder: FormBuilder,
    private modalService: BsModalService
  ) {
    this.getData()
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(
      () => {
        if (this.chartMonth) {
          this.chartMonth.dispose()
        }
        if (this.chartDep) {
          this.chartDep.dispose()
        }
        if (this.chartResult) {
          this.chartResult.dispose()
        }
      }
    )
  }

  getData() {
    forkJoin([
      this.examService.getAll(),
      this.userService.getAll()
    ]).subscribe(
      (res) => {
        // console.log('all', res)
        this.filterData()
      }
    );
  }

  filterData() {
    let filtering = new Promise<void> (
      (resolve, reject) => {
        this.examService.exams.forEach(
          (exam: Exam, index, array) => {
            // console.log('ex', exam)
            this.userService.users.forEach(
              (staff: User) => {
                // console.log('st', staff)
                if (exam.staff === staff.id) {
                  this.exams.push(
                    {
                      id: exam.id,
                      staff: exam.staff,
                      staff_name: staff.full_name,
                      department: staff.department,
                      title: exam.title,
                      code: exam.code,
                      date: moment(exam.date).format('DD/MM/YYYY'),
                      document_copy: exam.document_copy,
                      result: exam.result,
                      classification: exam.classification,
                      note: exam.note,
                      created_at: exam.created_at,
                      modified_at: exam.modified_at
                    }
                  )
                  // console.log('For', this.exams)
                }
              }
            )
            if (index == array.length - 1) resolve();
          }
        )
      }
    )

    filtering.then(
      () => {
        this.tableRows = this.exams
        this.tableTemp = this.tableRows.map((prop, key) => {
          return {
            ...prop,
            id_index: key + 1
          };
        });

        if (this.tableTemp.length >= 1) {
          this.isEmpty = false
        }
        else {
          this.isEmpty = true
        }
        this.calculateChartData()
      }
    )
  }

  calculateChartData() {
    this.chartMonthJan = 0
    this.chartMonthFeb = 0
    this.chartMonthMar = 0
    this.chartMonthApr = 0
    this.chartMonthMay = 0
    this.chartMonthJun = 0
    this.chartMonthJul = 0
    this.chartMonthAug = 0
    this.chartMonthSep = 0
    this.chartMonthOct = 0
    this.chartMonthNov = 0
    this.chartMonthDec = 0

    this.chartDepPDB = 0
    this.chartDepUUU = 0
    this.chartDepUAD = 0
    this.chartDepUPP = 0
    this.chartDepUPS = 0
    this.chartDepJKP = 0
    this.chartDepJPD = 0
    this.chartDepJPH = 0
    this.chartDepJPP = 0
    this.chartDepJKJ = 0
    this.chartDepJKB = 0
    this.chartDepJKEA = 0
    this.chartDepJKEB = 0
    this.chartDepJPR = 0
    this.chartDepJKK = 0
    this.chartDepJKW = 0
    this.chartDepJLK = 0
    this.chartDepJPU = 0
    this.chartDepJPB = 0

    this.exams.forEach(
      (exam: ExamTemp) => {
        let checkerDate = moment(exam.date, 'DD/MM/YYYY')
        let checkerMonth = checkerDate.month()
        //console.log(checkerDate)
        //console.log(exam.date)
        //console.log(moment().year())
        // Chart month
        if (checkerDate.year() == moment().year()) {
          if (checkerMonth == 0) {
            this.chartMonthJan += 1
          }
          else if (checkerMonth == 1) {
            this.chartMonthFeb += 1
          }
          else if (checkerMonth == 2) {
            this.chartMonthMar += 1
          }
          else if (checkerMonth == 3) {
            this.chartMonthApr += 1
          }
          else if (checkerMonth == 4) {
            this.chartMonthMay += 1
          }
          else if (checkerMonth == 5) {
            this.chartMonthJun += 1
          }
          else if (checkerMonth == 6) {
            this.chartMonthJul += 1
          }
          else if (checkerMonth == 7) {
            this.chartMonthAug += 1
          }
          else if (checkerMonth == 8) {
            this.chartMonthSep += 1
          }
          else if (checkerMonth == 9) {
            this.chartMonthOct += 1
          }
          else if (checkerMonth == 10) {
            this.chartMonthNov += 1
          }
          else if (checkerMonth == 11) {
            this.chartMonthDec += 1
          }
        }

        // Chart department

        if (exam.department == 'PDB') {
          this.chartDepPDB += 1
        }
        else if (exam.department == 'UUU') {
          this.chartDepUUU += 1
        }
        else if (exam.department == 'UAD') {
          this.chartDepUAD += 1
        }
        else if (exam.department == 'UPP') {
          this.chartDepUPP += 1
        }
        else if (exam.department == 'UPS') {
          this.chartDepUPS += 1
        }
        else if (exam.department == 'JKP') {
          this.chartDepJKP += 1
        }
        else if (exam.department == 'JPD') {
          this.chartDepJPD += 1
        }
        else if (exam.department == 'JPH') {
          this.chartDepJPH += 1
        }
        else if (exam.department == 'JPP') {
          this.chartDepJPP += 1
        }
        else if (exam.department == 'JKJ') {
          this.chartDepJKJ += 1
        }
        else if (exam.department == 'JKB') {
          this.chartDepJKB += 1
        }
        else if (exam.department == 'JKEA') {
          this.chartDepJKEA += 1
        }
        else if (exam.department == 'JKEB') {
          this.chartDepJKEB += 1
        }
        else if (exam.department == 'JPR') {
          this.chartDepJPR += 1
        }
        else if (exam.department == 'JKK') {
          this.chartDepJKK += 1
        }
        else if (exam.department == 'JKW') {
          this.chartDepJKW += 1
        }
        else if (exam.department == 'JLK') {
          this.chartDepJLK += 1
        }
        else if (exam.department == 'JPU') {
          this.chartDepJPU += 1
        }

        if (exam.result == 'PA') {
          this.chartResultPass += 1
        }
        else if (exam.result == 'FA') {
          this.chartResultFail += 1
        }
      }
    )
    this.getCharts()
  }

  entriesChange($event) {
    this.tableEntries = $event.target.value;
  }

  filterTable($event) {
    let val = $event.target.value.toLowerCase();
    this.tableTemp = this.tableRows.filter(function (d) {
      return d.staff_name.toLowerCase().indexOf(val)!== -1 || !val;
    });
  }

  onSelect({ selected }) {
    this.tableSelected.splice(0, this.tableSelected.length);
    this.tableSelected.push(...selected);
  }

  onActivate(event) {
    this.tableActiveRow = event.row;
  }

  initChartMonth() {
    let chart = am4core.create("chart-tc-month", am4charts.XYChart);
    // chart.scrollbarX = new am4core.Scrollbar();

    // Add data
    chart.data = [{
      "month": "Jan",
      "total": this.chartMonthJan
    }, {
      "month": "Feb",
      "total": this.chartMonthFeb
    }, {
      "month": "Mac",
      "total": this.chartMonthMar
    }, {
      "month": "Apr",
      "total": this.chartMonthApr
    }, {
      "month": "Mei",
      "total": this.chartMonthMay
    }, {
      "month": "Jun",
      "total": this.chartMonthJun
    }, {
      "month": "Jul",
      "total": this.chartMonthJul
    }, {
      "month": "Ogs",
      "total": this.chartMonthAug
    }, {
      "month": "Sep",
      "total": this.chartMonthSep
    }, {
      "month": "Okt",
      "total": this.chartMonthOct
    }, {
      "month": "Nov",
      "total": this.chartMonthNov
    }, {
      "month": "Dis",
      "total": this.chartMonthDec
    }];

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "month";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    // categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minWidth = 50;

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "total";
    series.dataFields.categoryX = "month";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    let hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();

    // Export
    chart.exporting.menu = new am4core.ExportMenu();

    this.chartMonth = chart
  }

  initChartDepartment() {
    let chart = am4core.create("chart-tc-department", am4charts.PieChart);

    // Add data
    chart.data = [{
      "department": "Pejabat Datuk Bandar",
      "total": this.chartDepPDB
    }, {
      "department": "Unit Undang-undang",
      "total": this.chartDepUUU
    }, {
      "department": "Unit Audit Dalaman",
      "total": this.chartDepUAD
    }, {
      "department": "Unit Penyelarasan Pembangunan",
      "total": this.chartDepUPP
    }, {
      "department": "Unit Pusat Sehenti",
      "total": this.chartDepUPS
    }, {
      "department": "Jabatan Khidmat Pengurusan",
      "total": this.chartDepJKP
    }, {
      "department": "Jabatan Perbendaharaan",
      "total": this.chartDepJPD
    }, {
      "department": "Jabatan Penilaian Pengurusan Harta",
      "total": this.chartDepJPH
    }, {
      "department": "Jabatan Perancangan Pembangunan",
      "total": this.chartDepJPP
    }, {
      "department": "Jabatan Kejuruteraan",
      "total": this.chartDepJKJ
    }, {
      "department": "Jabatan Kawalan Bangunan",
      "total": this.chartDepJKB
    }, {
      "department": "Bahagian Kesihatan Awam",
      "total": this.chartDepJKEA
    }, {
      "department": "Bahagian Pelesenan",
      "total": this.chartDepJKEB
    }, {
      "department": "Jabatan Perkhidmatan Perbandaraan",
      "total": this.chartDepJPR
    }, {
      "department": "Jabatan Khidmat Kemasyarakatan",
      "total": this.chartDepJKK
    }, {
      "department": "Jabatan Konservasi Warisan",
      "total": this.chartDepJKW
    }, {
      "department": "Jabatan Lanskap",
      "total": this.chartDepJLK
    }, {
      "department": "Jabatan Penguatkuasaan",
      "total": this.chartDepJPU
    }, {
      "department": "Jabatan Pesuruhjaya Bangunan",
      "total": this.chartDepJPB
    }
    ];

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "total";
    pieSeries.dataFields.category = "department";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeOpacity = 1;

    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;

    chart.hiddenState.properties.radius = am4core.percent(0);

    // Export
    chart.exporting.menu = new am4core.ExportMenu();

    this.chartDep = chart
  }

  initChartResult() {
    let chart = am4core.create("chart-tc-result", am4charts.PieChart3D);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.legend = new am4charts.Legend();

    chart.data = [
      {
        result: "Lulus",
        total: this.chartResultPass
      },
      {
        result: "Gagal",
        total: this.chartResultFail
      }
    ];

    let series = chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = "total";
    series.dataFields.category = "result";

    // Export
    chart.exporting.menu = new am4core.ExportMenu();

    this.chartResult = chart
  }

  getCharts() {
    this.zone.runOutsideAngular(
      () => {
        this.initChartMonth()
        this.initChartDepartment()
        this.initChartResult()
      }
    )
  }

  openModal(modalRef: TemplateRef<any>, selectedRow) {
    this.selectedExam = selectedRow
    this.examForm = this.formBuilder.group({
      title: new FormControl(this.selectedExam.title, Validators.compose([
        Validators.required
      ])),
      code: new FormControl(this.selectedExam.code, Validators.compose([
        Validators.required
      ])),
      date: new FormControl(this.selectedExam.date, Validators.compose([
        Validators.required
      ])),
      result: new FormControl(this.selectedExam.result, Validators.compose([
        Validators.required
      ])),
      staff: new FormControl(this.selectedExam.staff, Validators.compose([
        Validators.required
      ])),
      document_copy: new FormControl(this.selectedExam.document_copy),
      classification: new FormControl(this.selectedExam.classification, Validators.compose([
        Validators.required
      ])),
      note: new FormControl(this.selectedExam.note)
    })
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  closeModal() {
    this.modal.hide()
    delete this.selectedExam
    this.examForm.reset()
  }

  confirm() {
    let examDate = moment(this.dateValue).format('YYYY-MM-DDTHH:mm:ss.SSSSZ')
    this.examForm.controls['date'].setValue(examDate)
    // this.examForm.controls['staff'].setValue()
    // console.log(examDate)
    // console.log(this.examForm.value)
    swal.fire({
      title: 'Pengesahan',
      text: 'Anda pasti untuk menyunting peperiksaan ini?',
      type: 'info',
      buttonsStyling: false,
      showCancelButton: true,
      confirmButtonClass: 'btn btn-info',
      confirmButtonText: 'Pasti',
      cancelButtonClass: 'btn btn-outline-info',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.value) {
        this.update()
      }
    })
  }

  update() {
    this.loadingBar.start()
    this.examService.update(this.selectedExam.id, this.examForm.value).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.success()
        this.getData()
        this.examForm.reset()
      }
    )
  }

  success() {
    swal.fire({
      title: 'Berjaya',
      text: 'Peperiksaan berjaya disunting',
      type: 'success',
      buttonsStyling: false,
      showCancelButton: true,
      cancelButtonClass: 'btn btn-outline-success',
      cancelButtonText: 'Tutup'
    })
  }

}
