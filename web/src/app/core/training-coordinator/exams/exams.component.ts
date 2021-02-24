import { Component, OnInit, NgZone, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';

import * as moment from 'moment';
import * as xlsx from 'xlsx';
import swal from 'sweetalert2';

import { ExamExtended, 
  ExamAttendeeExtended, 
  ExamAttendee, 
  Exam 
} from 'src/app/shared/services/exams/exams.model';
import { ExamsService } from 'src/app/shared/services/exams/exams.service';

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
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.scss']
})
export class ExamsComponent implements OnInit {

  // Data
  exams: ExamExtended[] = []
  selectedExam: ExamExtended
  selectedAttendee: ExamAttendee
  attendees: ExamAttendeeExtended[] = []
  statistics: any
  examsOption: Exam[] = []
  examsTemp: Exam[] = []
  examTypeTemp = 'FKW'

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
  isSummaryTableHidden: boolean = true
  
  // Icon
  iconEmpty = 'assets/img/icons/box.svg'

  // Form
  examForm: FormGroup

  // Datepicker
  dateValue: Date
  dateConfig = { 
    isAnimated: true, 
    dateInputFormate: 'YYYY-MM-DDTHH:mm:ss.SSSSZ',
    containerClass: 'theme-dark-blue modal-lg' 
  }

  // Choices
  choicesResult = [
    { text: 'LULUS', value: 'PA' },
    { text: 'GAGAL', value: 'FA' }
  ]
  choicesType = [
    { text: 'FAEDAH KEWANGAN', value: 'FKW' },
    { text: 'PENGESAHAN DALAM PERKHIDMATAN', value: 'PDP' },
    { text: 'PEPERIKSAAN PENINGKATAN SECARA LANTIKAN (PSL)', value: 'PSL' }
  ]

  // Modal
  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: 'modal-dialog-centered'
  };

  // Chart
  chartMonth: any
  chartDep: any
  chartResult: any

  // File
  fileName
  fileSize
  fileNameInformation
  fileSizeInformation
  
  constructor(
    private examService: ExamsService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private loadingBar: LoadingBarService,
    private modalService: BsModalService,
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
    this.loadingBar.start()
    forkJoin([
      this.examService.getExams(),
      this.examService.getAttendees(),
      this.examService.getStatistics(),
      this.examService.getExamList()
    ]).subscribe(
      (res) => {
        this.loadingBar.complete()
        // console.log('all', res)
        this.examsOption = this.examService.exams
        this.exams = this.examService.examsExtended
        this.attendees = this.examService.attendees
        this.statistics = this.examService.statistic
        // console.log('Ehh', this.statistics)
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.tableRows = this.attendees
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

        this.examsOption.forEach(
          (exam: Exam) => {
            if (
              exam['classification'] == 'FKW' &&
              exam['active']
            ) {
              this.examsTemp.push(exam)
              if (!this.examForm.value['exam']) {
                this.examForm.controls['exam'].setValue(this.examsTemp[0]['id'])
              }
            }
          }
        )
        this.getCharts()
      }
    );
  }

  initForm() {
    this.examForm = this.formBuilder.group({
      exam: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      staff: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      date: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      result: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      note: new FormControl(null),
      document_copy: new FormControl(null, Validators.compose([
        Validators.required
      ])),
    })
  }

  entriesChange($event) {
    this.tableEntries = $event.target.value;
  }

  filterTable($event) {
    let val = $event.target.value.toLowerCase();
    this.tableTemp = this.tableRows.filter(function (d) {
      return d.staff_name.toLowerCase().indexOf(val) !== -1 || !val;
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
    let chart = am4core.create('chart-tc-exam-month', am4charts.XYChart);
    // chart.scrollbarX = new am4core.Scrollbar();

    // Add data
    chart.data = [
      {
        'month': 'Jan',
        'total': this.statistics['months']['january']
      }, 
      {
        'month': 'Feb',
        'total': this.statistics['months']['february']
      },
      {
        'month': 'Mac',
        'total': this.statistics['months']['march']
        }, 
        {
        'month': 'Apr',
        'total': this.statistics['months']['april']
      }, 
      {
        'month': 'Mei',
        'total': this.statistics['months']['may']
      }, 
      {
        'month': 'Jun',
        'total': this.statistics['months']['june']
      }, 
      {
        'month': 'Jul',
        'total': this.statistics['months']['july']
      }, 
      {
        'month': 'Ogs',
        'total': this.statistics['months']['august']
      }, 
      {
        'month': 'Sep',
        'total': this.statistics['months']['september']
      }, 
      {
        'month': 'Okt',
        'total': this.statistics['months']['october']
      }, 
      {
        'month': 'Nov',
        'total': this.statistics['months']['november']
      }, 
      {
        'month': 'Dis',
        'total': this.statistics['months']['december']
      }
    ];

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'month';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = 'right';
    categoryAxis.renderer.labels.template.verticalCenter = 'middle';
    // categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minWidth = 50;

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = 'total';
    series.dataFields.categoryX = 'month';
    series.tooltipText = '[{categoryX}: bold]{valueY}[/]';
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = 'vertical';

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    let hoverState = series.columns.template.column.states.create('hover');
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add('fill', function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();

    // Export
    let todayDate = new Date()
    let todayDateFormat = moment(todayDate).format('YYYYMMDD')
    let fileNamePrefix = 'Laporan_Peperiksaan_Mengikut_Bulan_' + todayDateFormat

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = fileNamePrefix; 

    this.chartMonth = chart
  }

  initChartDepartment() {
    let container = am4core.create('chart-tc-exam-department', am4core.Container);
    container.width = am4core.percent(100);
    container.height = am4core.percent(100);
    container.layout = 'horizontal';

    let chart = container.createChild(am4charts.PieChart);
    chart.radius = am4core.percent(50);
    chart.innerRadius = 60;

    // Add data
    chart.data = [
      {
        'department': 'Pejabat Datuk Bandar',
        'total': this.statistics['departments']['dep_90']['total'],
        'subData': [
          { name: 'Lulus', value: this.statistics['departments']['dep_90']['passed'] }, 
          { name: 'Gagal', value: this.statistics['departments']['dep_90']['failed'] }
        ]
      },
      {
        'department': 'Pejabat Datuk Bandar: Undang-undang',
        'total': this.statistics['departments']['dep_91']['total'],
        'subData': [
          { name: 'Lulus', value: this.statistics['departments']['dep_91']['passed'] }, 
          { name: 'Gagal', value: this.statistics['departments']['dep_91']['failed'] }
        ]
      },
      {
        'department': 'Pejabat Datuk Bandar: Audit Dalaman',
        'total': this.statistics['departments']['dep_92']['total'],
        'subData': [
          { name: 'Lulus', value: this.statistics['departments']['dep_92']['passed'] }, 
          { name: 'Gagal', value: this.statistics['departments']['dep_92']['failed'] }
        ]
      },
      {
        'department': 'Pejabat Datuk Bandar: Penyelarasan Pembangunan',
        'total': this.statistics['departments']['dep_93']['total'],
        'subData': [
          { name: 'Lulus', value: this.statistics['departments']['dep_93']['passed'] }, 
          { name: 'Gagal', value: this.statistics['departments']['dep_93']['failed'] }
        ]
      },
      {
        'department': 'Pejabat Datuk Bandar: OSC',
        'total': this.statistics['departments']['dep_94']['total'],
        'subData': [
          { name: 'Lulus', value: this.statistics['departments']['dep_94']['passed'] }, 
          { name: 'Gagal', value: this.statistics['departments']['dep_94']['failed'] }
        ]
      },
      {
        'department': 'Pejabat Datuk Bandar',
        'total': this.statistics['departments']['dep_90']['total'],
        'subData': [
          { name: 'Lulus', value: this.statistics['departments']['dep_90']['passed'] }, 
          { name: 'Gagal', value: this.statistics['departments']['dep_90']['failed'] }
        ]
      },
      {
        'department': 'Jabatan Landskap',
        'total': this.statistics['departments']['dep_86']['total'],
        'subData': [
          { name: 'Lulus', value: this.statistics['departments']['dep_86']['passed'] }, 
          { name: 'Gagal', value: this.statistics['departments']['dep_86']['failed'] }
        ]
      },
      {
        'department': 'Jabatan Khidmat Kemasyarakatan',
        'total': this.statistics['departments']['dep_81']['total'],
        'subData': [
          { name: 'Lulus', value: this.statistics['departments']['dep_81']['passed'] }, 
          { name: 'Gagal', value: this.statistics['departments']['dep_81']['failed'] }
        ]
      },
      {
        'department': 'Jabatan Perancangan Pembangunan',
        'total': this.statistics['departments']['dep_71']['total'],
        'subData': [
          { name: 'Lulus', value: this.statistics['departments']['dep_71']['passed'] }, 
          { name: 'Gagal', value: this.statistics['departments']['dep_71']['failed'] }
        ]
      },
      {
        'department': 'Jabatan Pesuruhjaya Bangunan',
        'total': this.statistics['departments']['dep_63']['total'],
        'subData': [
          { name: 'Lulus', value: this.statistics['departments']['dep_63']['passed'] }, 
          { name: 'Gagal', value: this.statistics['departments']['dep_63']['failed'] }
        ]
      },
      {
        'department': 'Jabatan Penilaian dan Pengurusan Harta',
        'total': this.statistics['departments']['dep_61']['total'],
        'subData': [
          { name: 'Lulus', value: this.statistics['departments']['dep_61']['passed'] }, 
          { name: 'Gagal', value: this.statistics['departments']['dep_61']['failed'] }
        ]
      },
      {
        'department': 'Jabatan Konservasi Warisan',
        'total': this.statistics['departments']['dep_55']['total'],
        'subData': [
          { name: 'Lulus', value: this.statistics['departments']['dep_55']['passed'] }, 
          { name: 'Gagal', value: this.statistics['departments']['dep_55']['failed'] }
        ]
      },
      {
        'department': 'Jabatan Kawalan Bangunan',
        'total': this.statistics['departments']['dep_51']['total'],
        'subData': [
          { name: 'Lulus', value: this.statistics['departments']['dep_51']['passed'] }, 
          { name: 'Gagal', value: this.statistics['departments']['dep_51']['failed'] }
        ]
      },
      {
        'department': 'Jabatan Kesihatan dan Pelesenan - Pelesenan',
        'total': this.statistics['departments']['dep_47']['total'],
        'subData': [
          { name: 'Lulus', value: this.statistics['departments']['dep_47']['passed'] }, 
          { name: 'Gagal', value: this.statistics['departments']['dep_47']['failed'] }
        ]
      },
      {
        'department': 'Jabatan Perkhidmatan dan Perbandaraan',
        'total': this.statistics['departments']['dep_45']['total'],
        'subData': [
          { name: 'Lulus', value: this.statistics['departments']['dep_45']['passed'] }, 
          { name: 'Gagal', value: this.statistics['departments']['dep_45']['failed'] }
        ]
      },
      {
        'department': 'Jabatan Kesihatan dan Pelesenan',
        'total': this.statistics['departments']['dep_41']['total'],
        'subData': [
          { name: 'Lulus', value: this.statistics['departments']['dep_41']['passed'] }, 
          { name: 'Gagal', value: this.statistics['departments']['dep_41']['failed'] }
        ]
      },
      {
        'department': 'Jabatan Kejuruteraan',
        'total': this.statistics['departments']['dep_31']['total'],
        'subData': [
          { name: 'Lulus', value: this.statistics['departments']['dep_31']['passed'] }, 
          { name: 'Gagal', value: this.statistics['departments']['dep_31']['failed'] }
        ]
      },
      {
        'department': 'Jabatan Perbendaharaan',
        'total': this.statistics['departments']['dep_21']['total'],
        'subData': [
          { name: 'Lulus', value: this.statistics['departments']['dep_21']['passed'] }, 
          { name: 'Gagal', value: this.statistics['departments']['dep_21']['failed'] }
        ]
      },
      {
        'department': 'Jabatan Penguatkuasaan',
        'total': this.statistics['departments']['dep_15']['total'],
        'subData': [
          { name: 'Lulus', value: this.statistics['departments']['dep_15']['passed'] }, 
          { name: 'Gagal', value: this.statistics['departments']['dep_15']['failed'] }
        ]
      },
      {
        'department': 'Jabatan Khidmat Pengurusan',
        'total': this.statistics['departments']['dep_11']['total'],
        'subData': [
          { name: 'Lulus', value: this.statistics['departments']['dep_11']['passed'] }, 
          { name: 'Gagal', value: this.statistics['departments']['dep_11']['failed'] }
        ]
      }
    ];

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = 'total';
    pieSeries.dataFields.category = 'department';
    pieSeries.labels.template.fontSize = 13;
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
    let fileNamePrefix = 'Laporan_Peperiksaan_Mengikut_Jabatan_' + todayDateFormat

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = fileNamePrefix; 

    this.chartDep = container
  }

  // initChartResult() {
  //   let chart = am4core.create('chart-tc-exam-result', am4charts.PieChart3D);
  //   chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

  //   chart.legend = new am4charts.Legend();

  //   chart.data = [
  //     {
  //       result: 'Lulus',
  //       total: this.statistics['results']['passed']
  //     },
  //     {
  //       result: 'Gagal',
  //       total: this.statistics['results']['failed']
  //     }
  //   ];

  //   let series = chart.series.push(new am4charts.PieSeries3D());
  //   series.dataFields.value = 'total';
  //   series.dataFields.category = 'result';

  //   // Export
  //   let todayDate = new Date()
  //   let todayDateFormat = moment(todayDate).format('YYYYMMDD')
  //   let fileNamePrefix = 'Laporan_Peperiksaan_Mengikut_Keputusan_' + todayDateFormat

  //   chart.exporting.menu = new am4core.ExportMenu();
  //   chart.exporting.filePrefix = fileNamePrefix; 

  //   this.chartResult = chart
  // }

  getCharts() {
    this.zone.runOutsideAngular(
      () => {
        this.initChartMonth()
        this.initChartDepartment()
        // this.initChartResult()
      }
    )
  }

  openModal(modalRef: TemplateRef<any>, row) {
    this.selectedAttendee = row
    this.examForm.controls['exam'].setValue(this.selectedAttendee['exam']['id'])
    this.examForm.controls['staff'].setValue(this.selectedAttendee['staff']['id'])
    this.examForm.controls['document_copy'].setValue(this.selectedAttendee['document_copy'])
    this.examForm.controls['result'].setValue(this.selectedAttendee['result'])
    this.examForm.controls['note'].setValue(this.selectedAttendee['note'])
    this.examForm.controls['date'].setValue(this.selectedAttendee['date'])
    this.dateValue = moment(this.selectedAttendee['date'], 'YYYY-MM-DDTHH:mm:ss.SSSSZ').toDate()
    this.examTypeTemp = this.selectedAttendee['exam']['classification']

    this.examsOption.forEach(
      (exam: Exam) => {
        if (
          exam['classification'] == this.examTypeTemp &&
          exam['active']
        ) {
          this.examsTemp.push(exam)
        }
      }
    )

    this.modal = this.modalService.show(modalRef, this.modalConfig);
    // console.log('Wee', this.examForm.value)
  }

  closeModal() {
    this.modal.hide()
    delete this.selectedExam
    this.examForm.reset()
  }

  confirm() {
    let examDate = moment(this.dateValue).format('YYYY-MM-DDTHH:mm:ss.SSSSZ')
    this.examForm.controls['date'].setValue(examDate)
    // console.log(typeof this.examForm.value['document_copy'])
    if (typeof this.examForm.value['document_copy'] == 'string') {
      this.examForm.removeControl('document_copy')
    }
    if (this.examForm.value['note'] === '') {
      this.examForm.controls['note'].patchValue(null)
    }
    // console.log('Wee', this.examForm.value)
    swal.fire({
      title: 'Pengesahan',
      text: 'Anda pasti untuk mengemaskini peperiksaan ini?',
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
    let infoTitle = 'Sedang proses'
    let infoMessage = 'Peperiksaan sedang dikemaskini'
    this.notifyService.openToastrInfo(infoTitle, infoMessage)

    this.examService.updateAttendee(this.selectedAttendee.id, this.examForm.value).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        let title = 'Tidak berjaya'
        let message = 'Anda tidak berjaya untuk mengemaskini peperiksaan. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        let title = 'Berjaya'
        let message = 'Peperiksaan berjaya dikemaskini.'
        this.notifyService.openToastr(title, message)
        this.success()
        this.getData()
        this.examForm.reset()
        this.closeModal()
        this.initForm()
      }
    )
  }

  success() {
    swal.fire({
      title: 'Berjaya',
      text: 'Peperiksaan berjaya dikemaskini',
      type: 'success',
      buttonsStyling: false,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonClass: 'btn btn-outline-success',
      cancelButtonText: 'Tutup'
    })
  }

  onFileChange(event) {
    let reader = new FileReader();
    this.fileSize = event.target.files[0].size
    this.fileName = event.target.files[0].name
    
    if (
      event.target.files && 
      event.target.files.length &&
      this.fileSize < 5000000
    ) {
      
      
      const [file] = event.target.files;
      reader.readAsDataURL(file)
      // readAsDataURL(file);
      // console.log(event.target)
      // console.log(reader)
      
      
      reader.onload = () => {
        // console.log(reader['result'])
        this.examForm.controls['document_copy'].setValue(file)
        this.fileSizeInformation = this.fileSize
        this.fileNameInformation = this.fileName
        // console.log(this.registerForm.value)
        // console.log('he', this.registerForm.valid)
        // console.log(this.isAgree)
        // !registerForm.valid || !isAgree
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

  removeFile() {
    this.fileSize = 0;
    this.fileName = null;
    this.examForm.controls['document_copy'].patchValue(null);
    this.fileSizeInformation = null
    this.fileNameInformation = null
  }

  onClassificationChange(value) {
    this.examsTemp = []
    if (value == 'FKW') {
      this.exams.forEach(
        (exam: Exam) => {
          if (
            exam['classification'] == 'FKW' &&
            exam['active']
          ) {
            this.examsTemp.push(exam)
            this.examForm.controls['exam'].setValue(this.examsTemp[0]['id'])
          }
        }
      )
    }
    else if (value == 'PDP') {
      this.exams.forEach(
        (exam: Exam) => {
          if (
            exam['classification'] == 'PDP' &&
            exam['active']
          ) {
            this.examsTemp.push(exam)
            this.examForm.controls['exam'].setValue(this.examsTemp[0]['id'])
          }
        }
      )
    }
    else if (value == 'PSL') {
      this.exams.forEach(
        (exam: Exam) => {
          if (
            exam['classification'] == 'PSL' &&
            exam['active']
          ) {
            this.examsTemp.push(exam)
            this.examForm.controls['exam'].setValue(this.examsTemp[0]['id'])
          }
        }
      )
    }
  }

  exportExcel() {
    let todayDate = new Date()
    let todayDateFormat = moment(todayDate).format('YYYYMMDD')
    let fileName = 'Ringkasan_Peperiksaan_' + todayDateFormat + '.xlsx'
    let element = document.getElementById('summaryTable'); 
    const ws: xlsx.WorkSheet = xlsx.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    xlsx.writeFile(wb, fileName);
  }

  viewDocument() {
    let url = this.selectedAttendee['document_copy']
    window.open(url, '_blank');
  }

}
