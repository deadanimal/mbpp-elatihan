import { ChangeDetectorRef, Component, OnInit, NgZone, TemplateRef, ViewChild } from '@angular/core';
import { 
  FormBuilder, 
  FormControl, 
  FormGroup, 
  Validators 
} from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';
import { environment } from "src/environments/environment";

import { ActivatedRoute, Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { QuillViewHTMLComponent } from 'ngx-quill';

import { AbsenceMemoExtended } from 'src/app/shared/services/absence-memos/absence-memos.model';
import { ApplicationExtended } from 'src/app/shared/services/applications/applications.model';
import { AttendanceExtended } from 'src/app/shared/services/attendances/attendances.model';
import { Core } from 'src/app/shared/services/cores/cores.model';
import { Domain } from 'src/app/shared/services/domains/domains.model';
import { Organisation } from 'src/app/shared/services/organisations/organisations.model';
import { Note } from 'src/app/shared/services/notes/notes.model';
import { TrainingExtended, TrainingType } from 'src/app/shared/services/trainings/trainings.model';
import { Trainer } from 'src/app/shared/services/trainers/trainers.model';
import { User } from 'src/app/shared/services/users/users.model';

import { ApplicationsService } from 'src/app/shared/services/applications/applications.service';
import { AttendancesService } from 'src/app/shared/services/attendances/attendances.service';
import { CertificatesService } from 'src/app/shared/services/certificates/certificates.service';
import { CoresService } from 'src/app/shared/services/cores/cores.service';
import { DomainsService } from 'src/app/shared/services/domains/domains.service';
import { EvaluationsService } from 'src/app/shared/services/evaluations/evaluations.service';
import { NotesService } from 'src/app/shared/services/notes/notes.service';
import { OrganisationsService } from 'src/app/shared/services/organisations/organisations.service';
import { TrainersService } from 'src/app/shared/services/trainers/trainers.service';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
import { UsersService } from 'src/app/shared/services/users/users.service';

import * as moment from 'moment';
import * as xlsx from 'xlsx';
import swal from 'sweetalert2';
import { Department, Section } from 'src/app/shared/code/user';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);
am4core.addLicense("ch-custom-attribution");

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-training-details',
  templateUrl: './training-details.component.html',
  styleUrls: ['./training-details.component.scss']
})
export class TrainingDetailsComponent implements OnInit {
  // Chart
  chart_2: am4charts.XYChart
  chart_21: am4charts.XYChart
  chart_22: am4charts.XYChart
  chart_23: am4charts.XYChart
  chart_24: am4charts.XYChart

  // Data
  arrayChart23 = []
  arrayKriteriaChart23 = [{
    'five': {
      kriteria: 'Cemerlang',
      color: '#AB4543'
    },
    'four': {
      kriteria: 'Bagus',
      color: '#89A155'
    },
    'three': {
      kriteria: 'Memuaskan',
      color: '#71568F'
    },
    'two': {
      kriteria: 'Sederhana',
      color: '#4195B6'
    },
    'one': {
      kriteria: 'Lemah',
      color: '#DB823D'
    },
  }]
  arrayChart24 = []
  arrayKriteriaChart24 = [{
    'five': {
      kriteria: 'Cemerlang',
      color: '#517BB6'
    },
    'four': {
      kriteria: 'Bagus',
      color: '#BC5057'
    },
    'three': {
      kriteria: 'Memuaskan',
      color: '#9EB55D'
    },
    'two': {
      kriteria: 'Sederhana',
      color: '#776299'
    },
    'one': {
      kriteria: 'Lemah',
      color: '#51A3B7'
    },
  }]
  internalFiltered
  trainingID
  training: TrainingExtended
  trainer: Trainer
  trainingReportAttendances: any
  organisations: Organisation[] = []
  currentUser: User
  users: User[] = []
  cores: Core[] = []
  coresTemp: Core[] = []
  coresParentTemp = 'GN'
  applications: ApplicationExtended[] = []
  attendances: AttendanceExtended[] = []
  absences: AbsenceMemoExtended[] = []
  notes: Note[] = []
  domains: Domain[] = []
  trainingTypes: TrainingType[] = []
  qrID
  qrElementType = 'url'
  qrValue: string
  qrValueCheckIn: string
  qrValueCheckOut: string
  staffs: User[] = []
  selectedStaffs: User[]
  departments = Department
  sections = Section
  selectedGrp = []
  selectedDep = []
  selectedPos = []
  selectedSch = []

  // Form
  trainingForm: FormGroup
  trainingFormData: FormData
  noteForm: FormGroup
  applyForm: FormGroup

  // Choices
  organiserChoices = [
    { value: 'LL', text: 'Luaran' },
    { value: 'DD', text: 'Dalaman' }
  ]
  courseTypeChoices = [
    { value: 'BB', text: 'Bengkel' },
    { value: 'KK', text: 'Kursus' },
    { value: 'LK', text: 'Lawatan Kerja' },
    { value: 'PP', text: 'Persidangan' },
    { value: 'SP', text: 'Sesi Perjumpaan' },
    { value: 'SS', text: 'Seminar' },
    { value: 'TT', text: 'Taklimat' }
  ]
  targetGroupTypeChoices = [
    { value: 'TB', text: 'Terbuka' },
    { value: 'TH', text: 'Terhad' }
  ]
  methodChoices = [
    { value: 'BS', text: 'Bersemuka'},
    { value: 'TB', text: 'Tidak Bersemuka (online)'}
  ]
  countryChoices = [
    { value: 'DN', text: 'Dalam Negara'},
    { value: 'LN', text: 'Luar Negara'}
  ]
  statusChoices = [
    { value: 'DB', text: 'Dibuka'},
    { value: 'OT', text: 'Lain-lain'},
    { value: 'PN', text: 'Penuh'},
    { value: 'SL', text: 'Selesai'},
    { value: 'DT', text: 'Ditutup'},
    { value: 'TN', text: 'Tangguh'}
  ]

  // Table
  SelectionType = SelectionType;
  tableMessages = { 
    emptyMessage: 'Tiada rekod dijumpai',
    totalMessage: 'rekod'
  }
  // Applications
  tableApplicationsEntries: number = 5
  tableApplicationsSelected: any[] = []
  tableApplicationsTemp = []
  tableApplicationsActiveRow: any
  tableApplicationsRows: any = []
  // Attendances
  tableAttendancesEntries: number = 5
  tableAttendancesSelected: any[] = []
  tableAttendancesTemp = []
  tableAttendancesActiveRow: any
  tableAttendancesRows: any = []
  // Absences
  tableAbsencesEntries: number = 5
  tableAbsencesSelected: any[] = []
  tableAbsencesTemp = []
  tableAbsencesActiveRow: any
  tableAbsencesRows: any = []
  // Notes
  tableNotesEntries: number = 5
  tableNotesSelected: any[] = []
  tableNotesTemp = []
  tableNotesActiveRow: any
  tableNotesRows: any = []
  // Staffs
  tableStaffsEntries: number = 5
  tableStaffsSelected: any[] = []
  tableStaffsTemp = []
  tableStaffsActiveRow: any
  tableStaffsRows: any = []
  
  // Checker
  isApplicationsEmpty: boolean = true
  isAttendancesEmpty: boolean = true
  isAbsencesEmpty: boolean = true
  isNotesEmpty: boolean = true
  isStaffsEmpty: boolean = true
  isQREmpty: boolean = true
  isSameBefore: boolean = false
  isHidden: boolean = true
  isApplying: boolean = false
  isTargetLocked: boolean = true

  // Icon
  iconEmpty = 'assets/img/icons/box.svg'

  // Datepicker
  dateToday
  dateMinStart: Date
  dateMinEnd: Date
  dateStart: Date
  dateEnd: Date
  dateConfig = { 
    isAnimated: true, 
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-dark-blue' 
  }

  // Modal
  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered"
  };

  // File
  fileSize: any
  fileName: any
  fileSizeInformation = null
  fileNameInformation = null

  // File
  fileSizeAttachment: any
  fileNameAttachment: any
  fileSizeInformationAttachment = null
  fileNameInformationAttachment = null

  // File
  fileSizeAttachmentApproval: any
  fileNameAttachmentApproval: any
  fileSizeInformationAttachmentApproval = null
  fileNameInformationAttachmentApproval = null

  // Predefined
  targetGrpOpts = [
    { 'form': 'is_group_KP_A', 'name': 'Kumpulan A (Gred 41 dan ke atas)' },
    { 'form': 'is_group_KP_B', 'name': 'Kumpulan B (Gred 27 - 40)' },
    { 'form': 'is_group_KP_C', 'name': 'Kumpulan C (Gred 17 - 26)' },
    { 'form': 'is_group_KP_D', 'name': 'Kumpulan D (Gred 1 - 16)' }
  ]
  targetDepOpts = [
    { 'form': 'is_department_11', 'name': 'Jabatan Khidmat Pengurusan' },
    { 'form': 'is_department_15', 'name': 'Jabatan Penguatkuasaan' },
    { 'form': 'is_department_21', 'name': 'Jabatan Perbendaharaan' },
    { 'form': 'is_department_31', 'name': 'Jabatan Kejuruteraan' },
    { 'form': 'is_department_41', 'name': 'Jabatan Kesihatan Persekitaran dan Pelesenan' },
    { 'form': 'is_department_45', 'name': 'Jabatan Perkhidmatan dan Perbandaraan' },
    { 'form': 'is_department_47', 'name': 'Jabatan Kesihatan Persekitaran dan Pelesenan - Pelesenan' },
    { 'form': 'is_department_51', 'name': 'Jabatan Kawalan Bangunan' },
    { 'form': 'is_department_55', 'name': 'Jabatan Konservasi Warisan' },
    { 'form': 'is_department_61', 'name': 'Jabatan Penilaian dan Pengurusan Harta' },
    { 'form': 'is_department_63', 'name': 'Jabatan Pesuruhjaya Bangunan' },
    { 'form': 'is_department_71', 'name': 'Jabatan Perancangan Pembangunan' },
    { 'form': 'is_department_81', 'name': 'Jabatan Khidmat Kemasyarakatan' },
    { 'form': 'is_department_86', 'name': 'Jabatan Landskap' },
    { 'form': 'is_department_90', 'name': 'Pejabat Datuk Bandar' },
    { 'form': 'is_department_91', 'name': 'Pejabat Datuk Bandar - Undang-undang' },
    { 'form': 'is_department_92', 'name': 'Pejabat Datuk Bandar - Penyelarasan Pembangunan' },
    { 'form': 'is_department_93', 'name': 'Pejabat Datuk Bandar - Audit Dalam' },
    { 'form': 'is_department_94', 'name': 'Pejabat Datuk Bandar - OSC' }
  ]
  targetPosOpts = [
    { 'form': 'is_position_01', 'name': 'Akauntan' },
    { 'form': 'is_position_02', 'name': 'Arkitek' },
    { 'form': 'is_position_03', 'name': 'Arkitek Landskap' },
    { 'form': 'is_position_04', 'name': 'Datuk Bandar' },
    { 'form': 'is_position_05', 'name': 'Juruaudio Visual' },
    { 'form': 'is_position_06', 'name': 'Juruaudit' },
    { 'form': 'is_position_07', 'name': 'Jururawat' },
    { 'form': 'is_position_08', 'name': 'Jururawat Masyarakat' },
    { 'form': 'is_position_09', 'name': 'Juruteknik Komputer' },
    { 'form': 'is_position_10', 'name': 'Jurutera' },
    { 'form': 'is_position_11', 'name': 'Juruukur Bahan' },
    { 'form': 'is_position_12', 'name': 'Pegawai Keselamatan' },
    { 'form': 'is_position_13', 'name': 'Pegawai Kesihatan Persekitaran' },
    { 'form': 'is_position_14', 'name': 'Pegawai Khidmat Pelanggan' },
    { 'form': 'is_position_15', 'name': 'Pegawai Penilaian' },
    { 'form': 'is_position_16', 'name': 'Pegawai Perancang Bandar dan Desa' },
    { 'form': 'is_position_17', 'name': 'Pegawai Pertanian' },
    { 'form': 'is_position_18', 'name': 'Pegawai Perubatan' },
    { 'form': 'is_position_19', 'name': 'Pegawai Tadbir' },
    { 'form': 'is_position_20', 'name': 'Pegawai Teknologi Maklumat' },
    { 'form': 'is_position_21', 'name': 'Pegawai Undang-undang' },
    { 'form': 'is_position_22', 'name': 'Pegawai Veterinar' },
    { 'form': 'is_position_23', 'name': 'Pegawai Pekerja Awam' },
    { 'form': 'is_position_24', 'name': 'Pelukis Pelan' },
    { 'form': 'is_position_25', 'name': 'Pelukis Pelan (Kejuruteraan Awam) / Penolong Jurutera' },
    { 'form': 'is_position_26', 'name': 'Pelukis Pelan (Seni Bina) / Penolong Pegawai Seni Bina' },
    { 'form': 'is_position_27', 'name': 'Pemandu Kenderaan' },
    { 'form': 'is_position_28', 'name': 'Pemandu Kenderaan Bermotor' },
    { 'form': 'is_position_29', 'name': 'Pembantu Awam' },
    { 'form': 'is_position_30', 'name': 'Pembantu Kemahiran' },
    { 'form': 'is_position_31', 'name': 'Pembantu Kesihatan Awam' },
    { 'form': 'is_position_32', 'name': 'Pembantu Operasi' },
    { 'form': 'is_position_33', 'name': 'Pembantu Penguatkuasa' },
    { 'form': 'is_position_34', 'name': 'Pembantu Penguatkuasa Rendah' },
    { 'form': 'is_position_35', 'name': 'Pembantu Penilaian' },
    { 'form': 'is_position_36', 'name': 'Pembantu Perawatan Kesihatan' },
    { 'form': 'is_position_37', 'name': 'Pembantu Setiausaha Pejabat / Setiausaha Pejabat' },
    { 'form': 'is_position_38', 'name': 'Pembantu Tadbir (Perkeranian / Operasi' },
    { 'form': 'is_position_39', 'name': 'Pembantu Tadbir Kewangan' },
    { 'form': 'is_position_40', 'name': 'Pembantu Veterinar' },
    { 'form': 'is_position_41', 'name': 'Pembantu Keselamatan' },
    { 'form': 'is_position_42', 'name': 'Penghantar Notis' },
    { 'form': 'is_position_43', 'name': 'Penolong Akauntan' },
    { 'form': 'is_position_44', 'name': 'Penolong Arkitek Landskap' },
    { 'form': 'is_position_45', 'name': 'Penolong Pegawai Juruaudit' },
    { 'form': 'is_position_46', 'name': 'Penolong Pegawai Kesihatan Persekitaran' },
    { 'form': 'is_position_47', 'name': 'Penolong Pegawai Penguatkuasa' },
    { 'form': 'is_position_48', 'name': 'Penolong Penolong Penilaian' },
    { 'form': 'is_position_49', 'name': 'Penolong Pegawai Perancang Bandar dan Desa' },
    { 'form': 'is_position_50', 'name': 'Penolong Pegawai Pertanian' },
    { 'form': 'is_position_51', 'name': 'Penolong Pegawai Tadbir' },
    { 'form': 'is_position_52', 'name': 'Penolong Pegawai Teknologi Maklumat' },
    { 'form': 'is_position_53', 'name': 'Penolong Pegawai Undang-undang' },
    { 'form': 'is_position_54', 'name': 'Penolong Pegawai Veterinar' },
    { 'form': 'is_position_55', 'name': 'Pereka' },
    { 'form': 'is_position_60', 'name': 'Setiausaha' }
  ]
  targetSchOpts = [
    { 'form': 'is_ba19', 'name': 'BA19' },
    { 'form': 'is_fa29', 'name': 'FA29' },
    { 'form': 'is_fa32', 'name': 'FA32' },
    { 'form': 'is_fa41', 'name': 'FA41' },
    { 'form': 'is_fa44', 'name': 'FA44' },
    { 'form': 'is_fa48', 'name': 'FA48' },
    { 'form': 'is_ft19', 'name': 'FT19' },
    { 'form': 'is_ga17', 'name': 'GA17' },
    { 'form': 'is_ga19', 'name': 'GA19' },
    { 'form': 'is_ga22', 'name': 'GA22' },
    { 'form': 'is_ga26', 'name': 'GA26' },
    { 'form': 'is_ga29', 'name': 'GA29' },
    { 'form': 'is_ga32', 'name': 'GA32' },
    { 'form': 'is_ga41', 'name': 'GA41' },
    { 'form': 'is_gv41', 'name': 'GV41' },
    { 'form': 'is_ha11', 'name': 'HA11' },
    { 'form': 'is_ha14', 'name': 'HA14' },
    { 'form': 'is_ha16', 'name': 'HA16' },
    { 'form': 'is_ha19', 'name': 'HA19' },
    { 'form': 'is_ha22', 'name': 'HA22' },
    { 'form': 'is_ja19', 'name': 'JA19' },
    { 'form': 'is_ja22', 'name': 'JA22' },
    { 'form': 'is_ja29', 'name': 'JA29' },
    { 'form': 'is_ja36', 'name': 'JA36' },
    { 'form': 'is_ja38', 'name': 'JA38' },
    { 'form': 'is_ja40', 'name': 'JA40' },
    { 'form': 'is_ja41', 'name': 'JA41' },
    { 'form': 'is_ja44', 'name': 'JA44' },
    { 'form': 'is_ja48', 'name': 'JA48' },
    { 'form': 'is_ja52', 'name': 'JA52' },
    { 'form': 'is_ja54', 'name': 'JA54' },
    { 'form': 'is_kp11', 'name': 'KP11' },
    { 'form': 'is_kp14', 'name': 'KP14' },
    { 'form': 'is_kp19', 'name': 'KP19' },
    { 'form': 'is_kp22', 'name': 'KP22' },
    { 'form': 'is_kp29', 'name': 'KP29' },
    { 'form': 'is_kp32', 'name': 'KP32' },
    { 'form': 'is_kp41', 'name': 'KP41' },
    { 'form': 'is_la29', 'name': 'LA29' },
    { 'form': 'is_la41', 'name': 'LA41' },
    { 'form': 'is_la44', 'name': 'LA44' },
    { 'form': 'is_la52', 'name': 'LA52' },
    { 'form': 'is_la54', 'name': 'LA54' },
    { 'form': 'is_na01', 'name': 'NA01' },
    { 'form': 'is_na11', 'name': 'NA11' },
    { 'form': 'is_na14', 'name': 'NA14' },
    { 'form': 'is_na17', 'name': 'NA17' },
    { 'form': 'is_na19', 'name': 'NA19' },
    { 'form': 'is_na22', 'name': 'NA22' },
    { 'form': 'is_na26', 'name': 'NA26' },
    { 'form': 'is_na29', 'name': 'NA29' },
    { 'form': 'is_na30', 'name': 'NA30' },
    { 'form': 'is_na32', 'name': 'NA32' },
    { 'form': 'is_na36', 'name': 'NA36' },
    { 'form': 'is_na41', 'name': 'NA41' },
    { 'form': 'is_na44', 'name': 'NA44' },
    { 'form': 'is_na48', 'name': 'NA48' },
    { 'form': 'is_na52', 'name': 'NA52' },
    { 'form': 'is_na54', 'name': 'NA54' },
    { 'form': 'is_ra01', 'name': 'RA01' },
    { 'form': 'is_ra03', 'name': 'RA03' },
    { 'form': 'is_ua11', 'name': 'UA11' },
    { 'form': 'is_ua14', 'name': 'UA14' },
    { 'form': 'is_ua17', 'name': 'UA17' },
    { 'form': 'is_ua19', 'name': 'UA19' },
    { 'form': 'is_ua24', 'name': 'UA24' },
    { 'form': 'is_ua29', 'name': 'UA29' },
    { 'form': 'is_ua32', 'name': 'UA32' },
    { 'form': 'is_ua36', 'name': 'UA36' },
    { 'form': 'is_ua41', 'name': 'UA41' },
    { 'form': 'is_ud43', 'name': 'UD43' },
    { 'form': 'is_ud48', 'name': 'UD48' },
    { 'form': 'is_ud52', 'name': 'UD52' },
    { 'form': 'is_vu06', 'name': 'VU06' },
    { 'form': 'is_vu07', 'name': 'VU07' },
    { 'form': 'is_wa17', 'name': 'WA17' },
    { 'form': 'is_wa19', 'name': 'WA19' },
    { 'form': 'is_wa22', 'name': 'WA22' },
    { 'form': 'is_wa26', 'name': 'WA26' },
    { 'form': 'is_wa28', 'name': 'WA28' },
    { 'form': 'is_wa29', 'name': 'WA29' },
    { 'form': 'is_wa32', 'name': 'WA32' },
    { 'form': 'is_wa36', 'name': 'WA36' },
    { 'form': 'is_wa41', 'name': 'WA41' },
    { 'form': 'is_wa44', 'name': 'WA44' },
    { 'form': 'is_wa48', 'name': 'WA48' },
    { 'form': 'is_wa52', 'name': 'WA52' },
    { 'form': 'is_wa54', 'name': 'WA54' },
    { 'form': 'is_waa41', 'name': 'WAA41' },
    { 'form': 'is_waa44', 'name': 'WAA44' }
  ]

  // Quill
  @ViewChild('scheduleNotes', {
    static: true
  }) headerEN: QuillViewHTMLComponent

  // Subscriber
  subscription: Subscription;

  constructor(
    private applicationService: ApplicationsService,
    private attendanceService: AttendancesService,
    private certificateService: CertificatesService,
    private coreService: CoresService,
    private domainService: DomainsService,
    private evaluationService: EvaluationsService,
    private organisationService: OrganisationsService,
    private trainingService: TrainingsService,
    private noteService: NotesService,
    private trainerService: TrainersService,
    private userService: UsersService,
    private loadingBar: LoadingBarService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private notifyService: NotifyService,
    private route: ActivatedRoute,
    private router: Router,
    private zone: NgZone
  ) { 
    this.trainingID = this.route.snapshot.queryParamMap.get('id')
    // console.log('Training ID', this.trainingID)
    if (!this.trainingID) {
      this.router.navigate(['/tc/trainings/summary'])
    }

    if (
      this.trainingID && (
        typeof this.trainingID === 'string' || 
        this.trainingID instanceof String
      )
    ) {
      this.getData()
      this.initForm()
    }
    else {
      this.navigatePage('/tc/trainings/summary')
    }
  }

  ngOnInit() {
    this.dateToday = moment().format('D/M/YYYY')
    this.initForm()
    // console.log(this.dateToday)
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.zone.runOutsideAngular(() => {
      if (this.chart_21) this.chart_21.dispose();
      if (this.chart_22) this.chart_22.dispose();
      if (this.chart_23) this.chart_23.dispose();
      if (this.chart_24) this.chart_24.dispose();
      if (this.chart_2) this.chart_2.dispose();
    });
  }

  getData() {
    this.loadingBar.start() 
    this.subscription = forkJoin([
      this.organisationService.getAll(),
      this.userService.getAll(),
      this.coreService.getAll(),
      this.trainingService.getOne(this.trainingID),
      this.trainingService.getTrainingTypes(),
      this.domainService.getDomains(),
      this.trainerService.filter("training="+this.trainingID),
      this.attendanceService.getReportAttendanceByDay(this.trainingID),
    ]).subscribe(
      () => {
        this.training = this.trainingService.trainingExtended
        this.trainer = this.trainerService.trainerFiltered[0]
        this.trainingReportAttendances = this.attendanceService.attendancesReport
        this.applications = this.training['training_application']
        this.attendances = this.training['training_attendee']
        this.absences = this.training['training_absence_memo']
        this.notes = this.training['training_training_notes']
        this.trainingTypes = this.trainingService.trainingTypes
        this.domains = this.domainService.domains
        this.staffs = this.trainingService.applicableStaffs
        this.applyForm.controls['training'].setValue(this.training['id'])
        this.loadingBar.complete() 
      },
      () => {
        this.loadingBar.complete() 
      },
      () => {
        // console.log('Training> ', this.training)
        this.trainingForm.controls['title'].setValue(this.training['title'])
        this.trainingForm.controls['description'].setValue(this.training['description'])
        this.trainingForm.controls['method'].setValue(this.training['method'])
        this.trainingForm.controls['country'].setValue(this.training['country'])
        this.trainingForm.controls['organiser_type'].setValue(this.training['organiser_type'])
        this.trainingForm.controls['organiser'].setValue(this.training['organiser']['id'])
        this.trainingForm.controls['core'].setValue(this.training['core']['id'])
        this.trainingForm.controls['domain'].setValue(this.training['domain']['id'])
        this.trainingForm.controls['training_type'].setValue(this.training['training_type']['id'])
        this.trainingForm.controls['course_code'].setValue(this.training['course_code'])
        this.trainingForm.controls['target_group_type'].setValue(this.training['target_group_type'])
       
        this.trainingForm.controls['is_group_KP_A'].setValue(this.training['is_group_KP_A'])
        this.trainingForm.controls['is_group_KP_B'].setValue(this.training['is_group_KP_B'])
        this.trainingForm.controls['is_group_KP_C'].setValue(this.training['is_group_KP_C'])
        this.trainingForm.controls['is_group_KP_D'].setValue(this.training['is_group_KP_D'])
        this.trainingForm.controls['is_department_11'].setValue(this.training['is_department_11'])
        this.trainingForm.controls['is_department_15'].setValue(this.training['is_department_15'])
        this.trainingForm.controls['is_department_21'].setValue(this.training['is_department_21'])
        this.trainingForm.controls['is_department_31'].setValue(this.training['is_department_31'])
        this.trainingForm.controls['is_department_41'].setValue(this.training['is_department_41'])
        this.trainingForm.controls['is_department_45'].setValue(this.training['is_department_45'])
        this.trainingForm.controls['is_department_47'].setValue(this.training['is_department_47'])
        this.trainingForm.controls['is_department_51'].setValue(this.training['is_department_51'])
        this.trainingForm.controls['is_department_55'].setValue(this.training['is_department_55'])
        this.trainingForm.controls['is_department_61'].setValue(this.training['is_department_61'])
        this.trainingForm.controls['is_department_63'].setValue(this.training['is_department_63'])
        this.trainingForm.controls['is_department_71'].setValue(this.training['is_department_71'])
        this.trainingForm.controls['is_department_81'].setValue(this.training['is_department_81'])
        this.trainingForm.controls['is_department_86'].setValue(this.training['is_department_86'])
        this.trainingForm.controls['is_department_90'].setValue(this.training['is_department_90'])
        this.trainingForm.controls['is_department_91'].setValue(this.training['is_department_91'])
        this.trainingForm.controls['is_department_92'].setValue(this.training['is_department_92'])
        this.trainingForm.controls['is_department_93'].setValue(this.training['is_department_93'])
        this.trainingForm.controls['is_department_94'].setValue(this.training['is_department_94'])
        this.trainingForm.controls['is_position_01'].setValue(this.training['is_position_01'])
        this.trainingForm.controls['is_position_02'].setValue(this.training['is_position_02'])
        this.trainingForm.controls['is_position_03'].setValue(this.training['is_position_03'])
        this.trainingForm.controls['is_position_04'].setValue(this.training['is_position_04'])
        this.trainingForm.controls['is_position_05'].setValue(this.training['is_position_05'])
        this.trainingForm.controls['is_position_06'].setValue(this.training['is_position_06'])
        this.trainingForm.controls['is_position_07'].setValue(this.training['is_position_07'])
        this.trainingForm.controls['is_position_08'].setValue(this.training['is_position_08'])
        this.trainingForm.controls['is_position_09'].setValue(this.training['is_position_09'])
        this.trainingForm.controls['is_position_10'].setValue(this.training['is_position_10'])
        this.trainingForm.controls['is_position_11'].setValue(this.training['is_position_11'])
        this.trainingForm.controls['is_position_12'].setValue(this.training['is_position_12'])
        this.trainingForm.controls['is_position_13'].setValue(this.training['is_position_13'])
        this.trainingForm.controls['is_position_14'].setValue(this.training['is_position_14'])
        this.trainingForm.controls['is_position_15'].setValue(this.training['is_position_15'])
        this.trainingForm.controls['is_position_16'].setValue(this.training['is_position_16'])
        this.trainingForm.controls['is_position_17'].setValue(this.training['is_position_17'])
        this.trainingForm.controls['is_position_18'].setValue(this.training['is_position_18'])
        this.trainingForm.controls['is_position_19'].setValue(this.training['is_position_19'])
        this.trainingForm.controls['is_position_20'].setValue(this.training['is_position_20'])
        this.trainingForm.controls['is_position_21'].setValue(this.training['is_position_21'])
        this.trainingForm.controls['is_position_22'].setValue(this.training['is_position_22'])
        this.trainingForm.controls['is_position_23'].setValue(this.training['is_position_23'])
        this.trainingForm.controls['is_position_24'].setValue(this.training['is_position_24'])
        this.trainingForm.controls['is_position_25'].setValue(this.training['is_position_25'])
        this.trainingForm.controls['is_position_26'].setValue(this.training['is_position_26'])
        this.trainingForm.controls['is_position_27'].setValue(this.training['is_position_27'])
        this.trainingForm.controls['is_position_28'].setValue(this.training['is_position_28'])
        this.trainingForm.controls['is_position_29'].setValue(this.training['is_position_29'])
        this.trainingForm.controls['is_position_30'].setValue(this.training['is_position_30'])
        this.trainingForm.controls['is_position_31'].setValue(this.training['is_position_31'])
        this.trainingForm.controls['is_position_32'].setValue(this.training['is_position_32'])
        this.trainingForm.controls['is_position_33'].setValue(this.training['is_position_33'])
        this.trainingForm.controls['is_position_34'].setValue(this.training['is_position_34'])
        this.trainingForm.controls['is_position_35'].setValue(this.training['is_position_35'])
        this.trainingForm.controls['is_position_36'].setValue(this.training['is_position_36'])
        this.trainingForm.controls['is_position_37'].setValue(this.training['is_position_37'])
        this.trainingForm.controls['is_position_38'].setValue(this.training['is_position_38'])
        this.trainingForm.controls['is_position_39'].setValue(this.training['is_position_39'])
        this.trainingForm.controls['is_position_40'].setValue(this.training['is_position_40'])
        this.trainingForm.controls['is_position_41'].setValue(this.training['is_position_41'])
        this.trainingForm.controls['is_position_42'].setValue(this.training['is_position_42'])
        this.trainingForm.controls['is_position_43'].setValue(this.training['is_position_43'])
        this.trainingForm.controls['is_position_44'].setValue(this.training['is_position_44'])
        this.trainingForm.controls['is_position_45'].setValue(this.training['is_position_45'])
        this.trainingForm.controls['is_position_46'].setValue(this.training['is_position_46'])
        this.trainingForm.controls['is_position_47'].setValue(this.training['is_position_47'])
        this.trainingForm.controls['is_position_48'].setValue(this.training['is_position_48'])
        this.trainingForm.controls['is_position_49'].setValue(this.training['is_position_49'])
        this.trainingForm.controls['is_position_50'].setValue(this.training['is_position_50'])
        this.trainingForm.controls['is_position_51'].setValue(this.training['is_position_51'])
        this.trainingForm.controls['is_position_52'].setValue(this.training['is_position_52'])
        this.trainingForm.controls['is_position_53'].setValue(this.training['is_position_53'])
        this.trainingForm.controls['is_position_54'].setValue(this.training['is_position_54'])
        this.trainingForm.controls['is_position_55'].setValue(this.training['is_position_55'])
        this.trainingForm.controls['is_position_60'].setValue(this.training['is_position_60'])
        this.trainingForm.controls['is_ba19'].setValue(this.training['is_ba19'])
        this.trainingForm.controls['is_fa29'].setValue(this.training['is_fa29'])
        this.trainingForm.controls['is_fa32'].setValue(this.training['is_fa32'])
        this.trainingForm.controls['is_fa41'].setValue(this.training['is_fa41'])
        this.trainingForm.controls['is_fa44'].setValue(this.training['is_fa44'])
        this.trainingForm.controls['is_fa48'].setValue(this.training['is_fa48'])
        this.trainingForm.controls['is_ft19'].setValue(this.training['is_ft19'])
        this.trainingForm.controls['is_ga17'].setValue(this.training['is_ga17'])
        this.trainingForm.controls['is_ga19'].setValue(this.training['is_ga19'])
        this.trainingForm.controls['is_ga22'].setValue(this.training['is_ga22'])
        this.trainingForm.controls['is_ga26'].setValue(this.training['is_ga26'])
        this.trainingForm.controls['is_ga29'].setValue(this.training['is_ga29'])
        this.trainingForm.controls['is_ga32'].setValue(this.training['is_ga32'])
        this.trainingForm.controls['is_ga41'].setValue(this.training['is_ga41'])
        this.trainingForm.controls['is_gv41'].setValue(this.training['is_gv41'])
        this.trainingForm.controls['is_ha11'].setValue(this.training['is_ha11'])
        this.trainingForm.controls['is_ha14'].setValue(this.training['is_ha14'])
        this.trainingForm.controls['is_ha16'].setValue(this.training['is_ha16'])
        this.trainingForm.controls['is_ha19'].setValue(this.training['is_ha19'])
        this.trainingForm.controls['is_ha22'].setValue(this.training['is_ha22'])
        this.trainingForm.controls['is_ja19'].setValue(this.training['is_ja19'])
        this.trainingForm.controls['is_ja22'].setValue(this.training['is_ja22'])
        this.trainingForm.controls['is_ja29'].setValue(this.training['is_ja29'])
        this.trainingForm.controls['is_ja36'].setValue(this.training['is_ja36'])
        this.trainingForm.controls['is_ja38'].setValue(this.training['is_ja38'])
        this.trainingForm.controls['is_ja40'].setValue(this.training['is_ja40'])
        this.trainingForm.controls['is_ja41'].setValue(this.training['is_ja41'])
        this.trainingForm.controls['is_ja44'].setValue(this.training['is_ja44'])
        this.trainingForm.controls['is_ja48'].setValue(this.training['is_ja48'])
        this.trainingForm.controls['is_ja52'].setValue(this.training['is_ja52'])
        this.trainingForm.controls['is_ja54'].setValue(this.training['is_ja54'])
        this.trainingForm.controls['is_kp11'].setValue(this.training['is_kp11'])
        this.trainingForm.controls['is_kp14'].setValue(this.training['is_kp14'])
        this.trainingForm.controls['is_kp19'].setValue(this.training['is_kp19'])
        this.trainingForm.controls['is_kp22'].setValue(this.training['is_kp22'])
        this.trainingForm.controls['is_kp29'].setValue(this.training['is_kp29'])
        this.trainingForm.controls['is_kp32'].setValue(this.training['is_kp32'])
        this.trainingForm.controls['is_kp41'].setValue(this.training['is_kp41'])
        this.trainingForm.controls['is_la29'].setValue(this.training['is_la29'])
        this.trainingForm.controls['is_la41'].setValue(this.training['is_la41'])
        this.trainingForm.controls['is_la44'].setValue(this.training['is_la44'])
        this.trainingForm.controls['is_la52'].setValue(this.training['is_la52'])
        this.trainingForm.controls['is_la54'].setValue(this.training['is_la54'])
        this.trainingForm.controls['is_na01'].setValue(this.training['is_na01'])
        this.trainingForm.controls['is_na11'].setValue(this.training['is_na11'])
        this.trainingForm.controls['is_na14'].setValue(this.training['is_na14'])
        this.trainingForm.controls['is_na17'].setValue(this.training['is_na17'])
        this.trainingForm.controls['is_na19'].setValue(this.training['is_na19'])
        this.trainingForm.controls['is_na22'].setValue(this.training['is_na22'])
        this.trainingForm.controls['is_na26'].setValue(this.training['is_na26'])
        this.trainingForm.controls['is_na29'].setValue(this.training['is_na29'])
        this.trainingForm.controls['is_na30'].setValue(this.training['is_na30'])
        this.trainingForm.controls['is_na32'].setValue(this.training['is_na32'])
        this.trainingForm.controls['is_na36'].setValue(this.training['is_na36'])
        this.trainingForm.controls['is_na41'].setValue(this.training['is_na41'])
        this.trainingForm.controls['is_na44'].setValue(this.training['is_na44'])
        this.trainingForm.controls['is_na48'].setValue(this.training['is_na48'])
        this.trainingForm.controls['is_na52'].setValue(this.training['is_na52'])
        this.trainingForm.controls['is_na54'].setValue(this.training['is_na54'])
        this.trainingForm.controls['is_ra01'].setValue(this.training['is_ra01'])
        this.trainingForm.controls['is_ra03'].setValue(this.training['is_ra03'])
        this.trainingForm.controls['is_ua11'].setValue(this.training['is_ua11'])
        this.trainingForm.controls['is_ua14'].setValue(this.training['is_ua14'])
        this.trainingForm.controls['is_ua17'].setValue(this.training['is_ua17'])
        this.trainingForm.controls['is_ua19'].setValue(this.training['is_ua19'])
        this.trainingForm.controls['is_ua24'].setValue(this.training['is_ua24'])
        this.trainingForm.controls['is_ua29'].setValue(this.training['is_ua29'])
        this.trainingForm.controls['is_ua32'].setValue(this.training['is_ua32'])
        this.trainingForm.controls['is_ua36'].setValue(this.training['is_ua36'])
        this.trainingForm.controls['is_ua41'].setValue(this.training['is_ua41'])
        this.trainingForm.controls['is_ud43'].setValue(this.training['is_ud43'])
        this.trainingForm.controls['is_ud48'].setValue(this.training['is_ud48'])
        this.trainingForm.controls['is_ud52'].setValue(this.training['is_ud52'])
        this.trainingForm.controls['is_vu06'].setValue(this.training['is_vu06'])
        this.trainingForm.controls['is_vu07'].setValue(this.training['is_vu07'])
        this.trainingForm.controls['is_wa17'].setValue(this.training['is_wa17'])
        this.trainingForm.controls['is_wa19'].setValue(this.training['is_wa19'])
        this.trainingForm.controls['is_wa22'].setValue(this.training['is_wa22'])
        this.trainingForm.controls['is_wa26'].setValue(this.training['is_wa26'])
        this.trainingForm.controls['is_wa28'].setValue(this.training['is_wa28'])
        this.trainingForm.controls['is_wa29'].setValue(this.training['is_wa29'])
        this.trainingForm.controls['is_wa32'].setValue(this.training['is_wa32'])
        this.trainingForm.controls['is_wa36'].setValue(this.training['is_wa36'])
        this.trainingForm.controls['is_wa41'].setValue(this.training['is_wa41'])
        this.trainingForm.controls['is_wa44'].setValue(this.training['is_wa44'])
        this.trainingForm.controls['is_wa48'].setValue(this.training['is_wa48'])
        this.trainingForm.controls['is_wa52'].setValue(this.training['is_wa52'])
        this.trainingForm.controls['is_wa54'].setValue(this.training['is_wa54'])
        this.trainingForm.controls['is_waa41'].setValue(this.training['is_waa41'])
        this.trainingForm.controls['is_waa44'].setValue(this.training['is_waa44'])

        this.trainingForm.controls['max_participant'].setValue(this.training['max_participant'])
        this.trainingForm.controls['venue'].setValue(this.training['venue'])
        this.trainingForm.controls['address'].setValue(this.training['address'])

        // console.log('Before ', moment(this.training['start_date']))
        this.trainingForm.controls['start_date'].setValue(moment(this.training['start_date'], 'YYYY-MM-DD').format('DD-MM-YYYY'))
        // console.log('After ', this.trainingForm.controls['start_date'])

        this.trainingForm.controls['start_time'].setValue(this.training['start_time'])
        this.trainingForm.controls['end_date'].setValue(moment(this.training['end_date'], 'YYYY-MM-DD').format('DD-MM-YYYY'))
        this.trainingForm.controls['end_time'].setValue(this.training['end_time'])
        this.trainingForm.controls['schedule_notes'].setValue(this.training['schedule_notes'])
        this.trainingForm.controls['cost'].setValue(this.training['cost'])
        this.trainingForm.controls['status'].setValue(this.training['status'])
        this.trainingForm.controls['attachment'].setValue(this.training['attachment'])
        this.trainingForm.controls['attachment_approval'].setValue(this.training['attachment_approval'])

        this.noteForm.controls['training'].setValue(this.training['id'])

        this.organisations = this.organisationService.organisations
        this.users = this.userService.users
        this.staffs = this.users
        this.cores = this.coreService.cores
        this.domains = this.domainService.domains

        if (this.training.organiser_type == 'DD') {
          this.evaluationService.filterInternal("training="+this.trainingID).subscribe((res) => {
            // console.log("res", res);
            this.internalFiltered = res;
          }, (err) => {
            console.error("err", err);
          })
        }

        this.coresParentTemp = this.training['core']['parent']
        this.cores.forEach(
          (core: Core) => {
            if (this.training['core']['parent'] == core['parent']) {
              this.coresTemp.push(core)
            }
          }
        )
        
        this.tableApplicationsRows = this.applications
        this.tableApplicationsTemp = this.tableApplicationsRows.map((prop, key) => {
          let result = this.departments.find((obj) => {
            return obj.value == prop.applicant.department_code
          })
          return {
            ...prop,
            department: result.text,
            id_index: key+1
          };
        });
        
        if (this.tableApplicationsTemp.length >= 1) {
          this.isApplicationsEmpty = false
        }
        else {
          this.isApplicationsEmpty = true
        }

        this.tableAttendancesRows = this.attendances
        this.tableAttendancesTemp = this.tableAttendancesRows.map((prop, key) => {
          return {
            ...prop,
            id_index: key+1
          };
        });

        if (this.tableAttendancesTemp.length >= 1) {
          this.isAttendancesEmpty = false
        }
        else {
          this.isAttendancesEmpty = true
        }

        this.tableAbsencesRows = this.absences
        this.tableAbsencesTemp = this.tableAbsencesRows.map((prop, key) => {
          return {
            ...prop,
            id_index: key+1
          };
        });

        if (this.tableAbsencesTemp.length >= 1) {
          this.isAbsencesEmpty = false
        }
        else {
          this.isAbsencesEmpty = true
        }
        
        this.tableNotesRows = this.notes
        this.tableNotesTemp = this.tableNotesRows.map((prop, key) => {
          return {
            ...prop,
            id_index: key+1
          };
        });

        if (this.tableNotesTemp.length >= 1) {
          this.isNotesEmpty = false
        }
        else {
          this.isNotesEmpty = true
        }

        this.staffs.forEach(
          (staff) => {
            staff['applied'] = false
            
            this.training.training_application.forEach(
              (application) => {
                // console.log(application)
                if (application['applicant']['id'] == staff['id']) {
                  staff['applied'] = true
                }
              }
            )
          }
        )

        // this.getQRID()

        // Get live / before
        let today = moment().toDate()
        let end_date = moment(this.training['end_date'], 'YYYY-MM-DD').toDate()

        // Set QR code value for check in and check out
        this.qrValueCheckIn = this.training['id']+'|check_in|'+moment(today).format('YYYY-MM-DD')
        this.qrValueCheckOut = this.training['id']+'|check_out|'+moment(today).format('YYYY-MM-DD')
        
        // Same day
        if (moment(today).isSameOrBefore(end_date)) {
          this.isSameBefore = true
          this.isQREmpty = false
          this.qrValue = this.training['id']
        }
        else {
          this.isSameBefore = false
        }

        this.getCharts();
      }
    )
  }

  getCharts() {
    this.zone.runOutsideAngular(() => {
      if (this.training.organiser_type == 'DD') {
        this.getDataChart21();
        this.getDataChart22();
        this.getDataChart23();
        this.getDataChart24();
      } else if (this.training.organiser_type == 'LL') {
        this.getDataChart2();
      }
    });
  }

  sumObjectValues( obj ) {
    var sum = 0;
    for( var el in obj ) {
      if( obj.hasOwnProperty( el ) ) {
        sum += parseFloat( obj[el] );
      }
    }
    return sum;
  }

  getDataChart2() {
    let body = {
      training: this.trainingID
    }
    this.evaluationService.getChart2(body).subscribe(
      (res) => {
        // console.log("res", res)
        let arrayRes = []
        var sum = this.sumObjectValues(res)
        
        for (let obj in res) {
          if (obj === "one") {
            arrayRes.push({
              kriteria: "Kurang berkaitan",
              jumlah: Math.round((res[obj] / sum) * 100),
              color: am4core.color("#7A6C9E")
            })
          }
          else if (obj === "two") {
            arrayRes.push({
              kriteria: "Berkaitan",
              jumlah: Math.round((res[obj] / sum) * 100),
              color: am4core.color("#9BB062")
            })
          }
          else if (obj === "three") {
            arrayRes.push({
              kriteria: "Sangat berkaitan",
              jumlah: Math.round((res[obj] / sum) * 100),
              color: am4core.color("#B15154")
            })
          }
        }
        this.getChart2(arrayRes)
      },
      (err) => {
        console.error("err", err)
      })
  }

  getChart2(data) {
    let chart = am4core.create("chart_2", am4charts.XYChart);

    // Add data
    chart.data = data;

    // Create axes

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "kriteria";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.labels.template.disabled = true;

    categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
      if (target.dataItem && target.dataItem.index & 1) {
        return dy + 25;
      }
      return dy;
    });

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "[bold]Penilaian Peserta[/]";
    valueAxis.renderer.labels.template.adapter.add("text", function(text) {
      return text + "%";
    });

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "jumlah";
    series.dataFields.categoryX = "kriteria";
    series.name = "Jumlah";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]%";
    series.columns.template.fillOpacity = .8;
    series.columns.template.propertyFields.stroke = "color";
    series.columns.template.propertyFields.fill = "color";
    series.columns.template.width = am4core.percent(100);

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

    var legend = new am4charts.Legend();
    legend.parent = chart.chartContainer;
    legend.itemContainers.template.togglable = false;
    legend.marginTop = 20;

    series.events.on("ready", function(ev) {
      let legenddata = [];
      series.columns.each(function(column) {
        let col = column as any;
        legenddata.push({
          name: col.dataItem.categoryX,
          fill: column.fill
        })
      });
      legend.data = legenddata;
    });

    // Export
    let todayDate = new Date()
    let todayDateFormat = moment(todayDate).format('YYYYMMDD')
    let fileNamePrefix = 'Keberkesanan_Kursus_Luaran_' + todayDateFormat

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = fileNamePrefix;
    chart.exporting.adapter.add("data", function(data) {
      for (var i = 0; i < data.data.length; i++) {
        data.data[i].kriteria = data.data[i].kriteria;
        data.data[i].jumlah = data.data[i].jumlah;
      }
      return data;
    })
    chart.exporting.dataFields = {
      'kriteria': 'Kriteria',
      'jumlah': 'Jumlah'
    }

    this.chart_21 = chart;
  }

  getDataChart21() {
    let body = {
      training: this.trainingID
    }
    this.evaluationService.getChart21(body).subscribe(
      (res) => {
        // console.log("res", res)
        let arrayRes = []
        var sum = this.sumObjectValues(res)
        
        for (let obj in res) {
          if (obj === "one") {
            arrayRes.push({
              kriteria: "Lemah",
              jumlah: Math.round((res[obj] / sum) * 100),
              color: am4core.color("#D7803C")
            })
          }
          else if (obj === "two") {
            arrayRes.push({
              kriteria: "Sederhana",
              jumlah: Math.round((res[obj] / sum) * 100),
              color: am4core.color("#4197B1")
            })
          }
          else if (obj === "three") {
            arrayRes.push({
              kriteria: "Memuaskan",
              jumlah: Math.round((res[obj] / sum) * 100),
              color: am4core.color("#6B578E")
            })
          }
          else if (obj === "four") {
            arrayRes.push({
              kriteria: "Bagus",
              jumlah: Math.round((res[obj] / sum) * 100),
              color: am4core.color("#89A24F")
            })
          }
          else if (obj === "five") {
            arrayRes.push({
              kriteria: "Cemerlang",
              jumlah: Math.round((res[obj] / sum) * 100),
              color: am4core.color("#AD424D")
            })
          }
        }
        this.getChart21(arrayRes)
      },
      (err) => {
        console.error("err", err)
      })
  }

  getChart21(data) {
    let chart = am4core.create("chart_21", am4charts.XYChart);

    // Add data
    chart.data = data;

    // Create axes

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "kriteria";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.labels.template.disabled = true;

    categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
      if (target.dataItem && target.dataItem.index & 1) {
        return dy + 25;
      }
      return dy;
    });

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "[bold]Penilaian Peserta[/]";
    valueAxis.renderer.labels.template.adapter.add("text", function(text) {
      return text + "%";
    });

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "jumlah";
    series.dataFields.categoryX = "kriteria";
    series.name = "Jumlah";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]%";
    series.columns.template.fillOpacity = .8;
    series.columns.template.propertyFields.stroke = "color";
    series.columns.template.propertyFields.fill = "color";
    series.columns.template.width = am4core.percent(100);

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

    var legend = new am4charts.Legend();
    legend.parent = chart.chartContainer;
    legend.itemContainers.template.togglable = false;
    legend.marginTop = 20;

    series.events.on("ready", function(ev) {
      let legenddata = [];
      series.columns.each(function(column) {
        let col = column as any;
        legenddata.push({
          name: col.dataItem.categoryX,
          fill: column.fill
        })
      });
      legend.data = legenddata;
    });

    // Export
    let todayDate = new Date()
    let todayDateFormat = moment(todayDate).format('YYYYMMDD')
    let fileNamePrefix = 'Pencapaian_Objektif_Kursus_' + todayDateFormat

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = fileNamePrefix;
    chart.exporting.adapter.add("data", function(data) {
      for (var i = 0; i < data.data.length; i++) {
        data.data[i].kriteria = data.data[i].kriteria;
        data.data[i].jumlah = data.data[i].jumlah;
      }
      return data;
    })
    chart.exporting.dataFields = {
      'kriteria': 'Kriteria',
      'jumlah': 'Jumlah'
    }

    this.chart_21 = chart;
  }

  getDataChart22() {
    let body = {
      training: this.trainingID
    }
    this.evaluationService.getChart22(body).subscribe(
      (res) => {
        // console.log("res", res)
        let arrayRes = []
        var sum2 = this.sumObjectValues(res['soalan2'])
        var sum3 = this.sumObjectValues(res['soalan3'])

        arrayRes.push({
          'soalan': 'Adakah kursus/latihan ini berkaitan untuk anda menjalankan tugas-tugas harian',
          'three': Math.round((res['soalan2']['three'] / sum2) * 100),
          'two': Math.round((res['soalan2']['two'] / sum2) * 100),
          'one': Math.round((res['soalan2']['one'] / sum2) * 100),
        })

        arrayRes.push({
          'soalan': 'Apakah nilai-nilai positif anda perolehi dari kursus/latihan ini dapat membantu anda ketika balik bertugas',
          'three': Math.round((res['soalan3']['three'] / sum3) * 100),
          'two': Math.round((res['soalan3']['two'] / sum3) * 100),
          'one': Math.round((res['soalan3']['one'] / sum3) * 100),
        })
        
        this.getChart22(arrayRes)
      },
      (err) => {
        console.error("err", err)
      })
  }

  getChart22(data) {
    let chart = am4core.create('chart_22', am4charts.XYChart)
    chart.colors.step = 2;

    chart.legend = new am4charts.Legend()
    chart.legend.position = 'bottom'
    chart.legend.paddingBottom = 20
    chart.legend.labels.template.maxWidth = 95

    let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
    xAxis.dataFields.category = 'soalan'
    xAxis.renderer.cellStartLocation = 0.1
    xAxis.renderer.cellEndLocation = 0.9
    xAxis.renderer.grid.template.location = 0;
    let label = xAxis.renderer.labels.template;
    label.wrap = true;
    label.maxWidth = 300;
    label.textAlign = 'middle';

    let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.title.text = "[bold]Penilaian Peserta[/]";
    yAxis.renderer.labels.template.adapter.add("text", function(text) {
      return text + "%";
    });
    yAxis.min = 0;

    function createSeries(value, name, color) {
      let series = chart.series.push(new am4charts.ColumnSeries())
      series.dataFields.valueY = value
      series.dataFields.categoryX = 'soalan'
      series.name = name
      series.columns.template.stroke = am4core.color(color)
      series.columns.template.fill = am4core.color(color)
      series.columns.template.width = am4core.percent(100);
      series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]%";

      series.events.on("hidden", arrangeColumns);
      series.events.on("shown", arrangeColumns);

      // let bullet = series.bullets.push(new am4charts.LabelBullet())
      // bullet.interactionsEnabled = false
      // bullet.dy = 30;
      // bullet.label.text = '{valueY}'
      // bullet.label.fill = am4core.color('#ffffff')

      return series;
    }

    chart.data = data;

    createSeries('three', 'Sangat Berkaitan/Membantu', am4core.color("#B15154"));
    createSeries('two', 'Berkaitan/Kurang Membantu', am4core.color("#9BB062"));
    createSeries('one', 'Kurang berkaitan/Tidak Membantu', am4core.color("#7A6C9E"));

    function arrangeColumns() {

      let series = chart.series.getIndex(0);

      let w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
      if (series.dataItems.length > 1) {
        let x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
        let x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
        let delta = ((x1 - x0) / chart.series.length) * w;
        if (am4core.isNumber(delta)) {
          let middle = chart.series.length / 2;

          let newIndex = 0;
          chart.series.each(function(series) {
            if (!series.isHidden && !series.isHiding) {
                series.dummyData = newIndex;
                newIndex++;
            }
            else {
                series.dummyData = chart.series.indexOf(series);
            }
          })
          let visibleCount = newIndex;
          let newMiddle = visibleCount / 2;

          chart.series.each(function(series) {
            let trueIndex = chart.series.indexOf(series);
            let newIndex = series.dummyData;

            let dx = (newIndex - trueIndex + middle - newMiddle) * delta

            series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
            series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
          })
        }
      }
    }

    // Export
    let todayDate = new Date()
    let todayDateFormat = moment(todayDate).format('YYYYMMDD')
    let fileNamePrefix = 'Kaitan_dengan_tugas_harian_dan_membantu_untuk_tugas_harian_' + todayDateFormat

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = fileNamePrefix;
    chart.exporting.adapter.add("data", function(data) {
      for (var i = 0; i < data.data.length; i++) {
        data.data[i].soalan = data.data[i].soalan;
        data.data[i].three = data.data[i].three;
        data.data[i].two = data.data[i].two;
        data.data[i].one = data.data[i].one;
      }
      return data;
    })
    chart.exporting.dataFields = {
      'soalan': 'Soalan',
      'three': 'Sangat Berkaitan/Membantu',
      'two': 'Berkaitan/Kurang Membantu',
      'one': 'Kurang berkaitan/Tidak Membantu'
    }

    this.chart_22 = chart;
  }

  getDataChart23() {
    let body = {
      training: this.trainingID
    }
    this.evaluationService.getChart23(body).subscribe(
      (res) => {
        // console.log("res", res)
        let arrayRes = []
        var sum4a = this.sumObjectValues(res['soalan4a'])
        var sum4b = this.sumObjectValues(res['soalan4b'])
        var sum4c = this.sumObjectValues(res['soalan4c'])

        arrayRes.push({
          'kriteria': 'Penginapan',
          'five': Math.round((res['soalan4a']['five'] / sum4a) * 100),
          'four': Math.round((res['soalan4a']['four'] / sum4a) * 100),
          'three': Math.round((res['soalan4a']['three'] / sum4a) * 100),
          'two': Math.round((res['soalan4a']['two'] / sum4a) * 100),
          'one': Math.round((res['soalan4a']['one'] / sum4a) * 100),
        })

        arrayRes.push({
          'kriteria': 'Bilik Kuliah',
          'five': Math.round((res['soalan4b']['five'] / sum4b) * 100),
          'four': Math.round((res['soalan4b']['four'] / sum4b) * 100),
          'three': Math.round((res['soalan4b']['three'] / sum4b) * 100),
          'two': Math.round((res['soalan4b']['two'] / sum4b) * 100),
          'one': Math.round((res['soalan4b']['one'] / sum4b) * 100),
        })

        arrayRes.push({
          'kriteria': 'Jamuan Makan Minum',
          'five': Math.round((res['soalan4c']['five'] / sum4c) * 100),
          'four': Math.round((res['soalan4c']['four'] / sum4c) * 100),
          'three': Math.round((res['soalan4c']['three'] / sum4c) * 100),
          'two': Math.round((res['soalan4c']['two'] / sum4c) * 100),
          'one': Math.round((res['soalan4c']['one'] / sum4c) * 100),
        })
        
        this.arrayChart23 = arrayRes
        this.getChart23(arrayRes)
      },
      (err) => {
        console.error("err", err)
      })
  }

  getChart23(data) {
    let chart = am4core.create('chart_23', am4charts.XYChart)
    chart.colors.step = 2;

    // chart.legend = new am4charts.Legend()
    // chart.legend.position = 'bottom'
    // chart.legend.paddingBottom = 20
    // chart.legend.labels.template.maxWidth = 95

    let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
    xAxis.dataFields.category = 'kriteria'
    xAxis.renderer.cellStartLocation = 0.1
    xAxis.renderer.cellEndLocation = 0.9
    xAxis.renderer.grid.template.location = 0;
    let label = xAxis.renderer.labels.template;
    label.wrap = true;
    label.maxWidth = 300;
    label.textAlign = 'middle';

    let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.title.text = "[bold]Penilaian Peserta[/]";
    yAxis.renderer.labels.template.adapter.add("text", function(text) {
      return text + "%";
    });
    yAxis.min = 0;

    function createSeries(value, name, color) {
      let series = chart.series.push(new am4charts.ColumnSeries())
      series.dataFields.valueY = value
      series.dataFields.categoryX = 'kriteria'
      series.name = name
      series.columns.template.stroke = am4core.color(color)
      series.columns.template.fill = am4core.color(color)
      series.columns.template.width = am4core.percent(100);
      series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]%";

      series.events.on("hidden", arrangeColumns);
      series.events.on("shown", arrangeColumns);

      // let bullet = series.bullets.push(new am4charts.LabelBullet())
      // bullet.interactionsEnabled = false
      // bullet.dy = 30;
      // bullet.label.text = '{valueY}'
      // bullet.label.fill = am4core.color('#ffffff')

      return series;
    }

    chart.data = data

    createSeries('five', 'Cemerlang', am4core.color("#AB4543"));
    createSeries('four', 'Bagus', am4core.color("#89A155"));
    createSeries('three', 'Memuaskan', am4core.color("#71568F"));
    createSeries('two', 'Sederhana', am4core.color("#4195B6"));
    createSeries('one', 'Lemah', am4core.color("#DB823D"));

    function arrangeColumns() {

      let series = chart.series.getIndex(0);

      let w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
      if (series.dataItems.length > 1) {
        let x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
        let x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
        let delta = ((x1 - x0) / chart.series.length) * w;
        if (am4core.isNumber(delta)) {
          let middle = chart.series.length / 2;

          let newIndex = 0;
          chart.series.each(function(series) {
            if (!series.isHidden && !series.isHiding) {
                series.dummyData = newIndex;
                newIndex++;
            }
            else {
                series.dummyData = chart.series.indexOf(series);
            }
          })
          let visibleCount = newIndex;
          let newMiddle = visibleCount / 2;

          chart.series.each(function(series) {
            let trueIndex = chart.series.indexOf(series);
            let newIndex = series.dummyData;

            let dx = (newIndex - trueIndex + middle - newMiddle) * delta

            series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
            series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
          })
        }
      }
    }

    // Export
    let todayDate = new Date()
    let todayDateFormat = moment(todayDate).format('YYYYMMDD')
    let fileNamePrefix = 'Kemudahan_Fasiliti_Makanan_' + todayDateFormat

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = fileNamePrefix;
    chart.exporting.adapter.add("data", function(data) {
      for (var i = 0; i < data.data.length; i++) {
        data.data[i].kriteria = data.data[i].kriteria;
        data.data[i].five = data.data[i].five;
        data.data[i].four = data.data[i].four;
        data.data[i].three = data.data[i].three;
        data.data[i].two = data.data[i].two;
        data.data[i].one = data.data[i].one;
      }
      return data;
    })
    chart.exporting.dataFields = {
      'kriteria': 'Kriteria',
      'five': 'Cemerlang',
      'four': 'Bagus',
      'three': 'Memuaskan',
      'two': 'Sederhana',
      'one': 'Lemah'
    }

    this.chart_23 = chart;
  }

  getDataChart24() {
    let body = {
      training: this.trainingID
    }
    this.evaluationService.getChart24(body).subscribe(
      (res) => {
        // console.log("res", res)
        let arrayRes = []
        var sumisikandungan = this.sumObjectValues(res['soalanisikandungan'])
        var sumpersembahan = this.sumObjectValues(res['soalanpersembahan'])
        var sumkaitan = this.sumObjectValues(res['soalankaitan'])

        arrayRes.push({
          'kriteria': 'Isi kandungan',
          'five': Math.round((res['soalanisikandungan']['five'] / sumisikandungan) * 100),
          'four': Math.round((res['soalanisikandungan']['four'] / sumisikandungan) * 100),
          'three': Math.round((res['soalanisikandungan']['three'] / sumisikandungan) * 100),
          'two': Math.round((res['soalanisikandungan']['two'] / sumisikandungan) * 100),
          'one': Math.round((res['soalanisikandungan']['one'] / sumisikandungan) * 100),
        })

        arrayRes.push({
          'kriteria': 'Persembahan',
          'five': Math.round((res['soalanpersembahan']['five'] / sumpersembahan) * 100),
          'four': Math.round((res['soalanpersembahan']['four'] / sumpersembahan) * 100),
          'three': Math.round((res['soalanpersembahan']['three'] / sumpersembahan) * 100),
          'two': Math.round((res['soalanpersembahan']['two'] / sumpersembahan) * 100),
          'one': Math.round((res['soalanpersembahan']['one'] / sumpersembahan) * 100),
        })

        arrayRes.push({
          'kriteria': 'Kaitan dengan Kursus',
          'five': Math.round((res['soalankaitan']['five'] / sumkaitan) * 100),
          'four': Math.round((res['soalankaitan']['four'] / sumkaitan) * 100),
          'three': Math.round((res['soalankaitan']['three'] / sumkaitan) * 100),
          'two': Math.round((res['soalankaitan']['two'] / sumkaitan) * 100),
          'one': Math.round((res['soalankaitan']['one'] / sumkaitan) * 100),
        })
        
        this.arrayChart24 = arrayRes
        this.getChart24(arrayRes)
      },
      (err) => {
        console.error("err", err)
      })
  }

  getChart24(data) {
    let chart = am4core.create('chart_24', am4charts.XYChart)
    chart.colors.step = 2;

    // chart.legend = new am4charts.Legend()
    // chart.legend.position = 'bottom'
    // chart.legend.paddingBottom = 20
    // chart.legend.labels.template.maxWidth = 95

    let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
    xAxis.dataFields.category = 'kriteria'
    xAxis.renderer.cellStartLocation = 0.1
    xAxis.renderer.cellEndLocation = 0.9
    xAxis.renderer.grid.template.location = 0;
    let label = xAxis.renderer.labels.template;
    label.wrap = true;
    label.maxWidth = 300;
    label.textAlign = 'middle';

    let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.title.text = "[bold]Penilaian Peserta[/]";
    yAxis.renderer.labels.template.adapter.add("text", function(text) {
      return text + "%";
    });
    yAxis.min = 0;

    function createSeries(value, name, color) {
      let series = chart.series.push(new am4charts.ColumnSeries())
      series.dataFields.valueY = value
      series.dataFields.categoryX = 'kriteria'
      series.name = name
      series.columns.template.stroke = am4core.color(color)
      series.columns.template.fill = am4core.color(color)
      series.columns.template.width = am4core.percent(100);
      series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]%";

      series.events.on("hidden", arrangeColumns);
      series.events.on("shown", arrangeColumns);

      // let bullet = series.bullets.push(new am4charts.LabelBullet())
      // bullet.interactionsEnabled = false
      // bullet.dy = 30;
      // bullet.label.text = '{valueY}'
      // bullet.label.fill = am4core.color('#ffffff')

      return series;
    }

    chart.data = data

    createSeries('five', 'Cemerlang', am4core.color("#517BB6"));
    createSeries('four', 'Bagus', am4core.color("#BC5057"));
    createSeries('three', 'Memuaskan', am4core.color("#9EB55D"));
    createSeries('two', 'Sederhana', am4core.color("#776299"));
    createSeries('one', 'Lemah', am4core.color("#51A3B7"));

    function arrangeColumns() {

      let series = chart.series.getIndex(0);

      let w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
      if (series.dataItems.length > 1) {
        let x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
        let x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
        let delta = ((x1 - x0) / chart.series.length) * w;
        if (am4core.isNumber(delta)) {
          let middle = chart.series.length / 2;

          let newIndex = 0;
          chart.series.each(function(series) {
            if (!series.isHidden && !series.isHiding) {
                series.dummyData = newIndex;
                newIndex++;
            }
            else {
                series.dummyData = chart.series.indexOf(series);
            }
          })
          let visibleCount = newIndex;
          let newMiddle = visibleCount / 2;

          chart.series.each(function(series) {
            let trueIndex = chart.series.indexOf(series);
            let newIndex = series.dummyData;

            let dx = (newIndex - trueIndex + middle - newMiddle) * delta

            series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
            series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
          })
        }
      }
    }

    // Export
    let todayDate = new Date()
    let todayDateFormat = moment(todayDate).format('YYYYMMDD')
    let fileNamePrefix = 'Penilaian_terhadap_tenaga_pengajar_' + todayDateFormat

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = fileNamePrefix;
    chart.exporting.adapter.add("data", function(data) {
      for (var i = 0; i < data.data.length; i++) {
        data.data[i].kriteria = data.data[i].kriteria;
        data.data[i].five = data.data[i].five;
        data.data[i].four = data.data[i].four;
        data.data[i].three = data.data[i].three;
        data.data[i].two = data.data[i].two;
        data.data[i].one = data.data[i].one;
      }
      return data;
    })
    chart.exporting.dataFields = {
      'kriteria': 'Kriteria',
      'five': 'Cemerlang',
      'four': 'Bagus',
      'three': 'Memuaskan',
      'two': 'Sederhana',
      'one': 'Lemah'
    }

    this.chart_24 = chart;
  }

  getQRID() {
    let body = {
      'training': this.training['id']
    }
    this.attendanceService.getTodayQR(body).subscribe(
      () => {},
      () => {},
      () => {
        this.qrID =this.attendanceService.attendanceQRID
        if (this.qrID) {
          this.isQREmpty = false
          this.qrElementType = this.qrID
        }
      }
    )
  }

  initForm() {
    this.trainingForm = this.formBuilder.group({
      title: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      description: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      method: new FormControl('BS', Validators.compose([
        Validators.required
      ])),
      country: new FormControl('DN', Validators.compose([
        Validators.required
      ])),
      organiser_type: new FormControl('DD', Validators.compose([
        Validators.required
      ])),
      organiser: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      core: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      domain: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      training_type: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      course_code: new FormControl({value: null, disabled: true}),
      target_group_type: new FormControl('TB', Validators.compose([
        Validators.required
      ])),
      is_group_KP_A: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_group_KP_B: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_group_KP_C: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_group_KP_D: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_11: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_15: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_21: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_31: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_41: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_45: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_47: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_51: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_55: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_61: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_63: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_71: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_81: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_86: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_90: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_91: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_92: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_93: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_department_94: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_01: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_02: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_03: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_04: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_05: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_06: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_07: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_08: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_09: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_10: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_11: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_12: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_13: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_14: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_15: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_16: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_17: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_18: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_19: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_20: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_21: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_22: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_23: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_24: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_25: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_26: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_27: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_28: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_29: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_30: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_31: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_32: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_33: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_34: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_35: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_36: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_37: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_38: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_39: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_40: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_41: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_42: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_43: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_44: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_45: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_46: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_47: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_48: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_49: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_50: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_51: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_52: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_53: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_54: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_55: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_position_60: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ba19: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_fa29: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_fa32: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_fa41: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_fa44: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_fa48: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ft19: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ga17: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ga19: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ga22: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ga26: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ga29: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ga32: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ga41: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_gv41: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ha11: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ha14: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ha16: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ha19: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ha22: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ja19: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ja22: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ja29: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ja36: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ja38: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ja40: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ja41: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ja44: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ja48: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ja52: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ja54: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_kp11: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_kp14: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_kp19: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_kp22: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_kp29: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_kp32: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_kp41: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_la29: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_la41: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_la44: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_la52: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_la54: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na01: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na11: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na14: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na17: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na19: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na22: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na26: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na29: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na30: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na32: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na36: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na41: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na44: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na48: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na52: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_na54: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ra01: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ra03: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ua11: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ua14: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ua17: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ua19: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ua24: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ua29: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ua32: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ua36: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ua41: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ud43: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ud48: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_ud52: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_vu06: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_vu07: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_wa17: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_wa19: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_wa22: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_wa26: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_wa28: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_wa29: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_wa32: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_wa36: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_wa41: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_wa44: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_wa48: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_wa52: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_wa54: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_waa41: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      is_waa44: new FormControl(true, Validators.compose([
        Validators.required
      ])),
      max_participant: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      venue: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      address: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      start_date: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      start_time: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      end_date: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      end_time: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      schedule_notes: new FormControl(null),
      status: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      cost: new FormControl(0, Validators.compose([
        Validators.required
      ])),
      transportation: new FormControl(false, Validators.compose([
        Validators.required
      ])),
      attachment: new FormControl(""),
      attachment_approval: new FormControl(""),
    })

    this.applyForm = this.formBuilder.group({
      training: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      applicant: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      application_type: new FormControl('PS', Validators.compose([
        Validators.required
      ]))
    })

    this.noteForm = this.formBuilder.group({
      training: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      title: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      note_file: new FormControl(null, Validators.compose([
        Validators.required
      ]))
    })

    // Predefined
    this.targetGrpOpts.forEach(
      (target) => {
        this.selectedGrp.push(target['form'])
      }
    )

    // this.targetDepOpts.forEach(
    //   (target) => {
    //     this.selectedDep.push(target['form'])
    //   }
    // )

    // this.targetPosOpts.forEach(
    //   (target) => {
    //     this.selectedPos.push(target['form'])
    //   }
    // )

    this.targetSchOpts.forEach(
      (target) => {
        this.selectedSch.push(target['form'])
      }
    )
  }

  onChangeSelect($event) {
    this.tableStaffsRows = this.selectedStaffs
    this.tableStaffsTemp = this.tableStaffsRows.map((prop, key) => {
      return {
        ...prop,
        id_index: key+1
      };
    });

    if (this.tableStaffsTemp.length >= 1) {
      this.isStaffsEmpty = false
    }
    else {
      this.isStaffsEmpty = true
    }
  }

  onChangeCoreParent(value) {
    if (value == 'GN') {
      this.coresTemp = []
      this.cores.forEach(
        (core: Core) => {
          if (core['parent'] == 'GN') {
            this.coresTemp.push(core)
          }
        }
      )
    }
    else if (value == 'FN') {
      this.coresTemp = []
      this.cores.forEach(
        (core: Core) => {
          if (core['parent'] == 'FN') {
            this.coresTemp.push(core)
          }
        }
      )
    }
  }

  onChangeOrganiserType(value) {
    if (value == 'DD') {
      this.organisations.forEach(
        (organisation) => {
          if (organisation['shortname'] == 'MBPP') {
            this.trainingForm.controls['organiser'].setValue(organisation['id'])
            // console.log('Type found D: ', organisation['shortname'])
          }
        }
      )
    }
    else if (value == 'LL') {
      this.trainingForm.controls['organiser'].setValue(this.organisations[0]['id'])
      // console.log('Type found L: ', this.organisations[0]['id'])
    }
  }

  onChangeOrganiser(value) {
    let isDD = false
    this.organisations.forEach(
      (organisation) => {
        if (organisation['shortname'] == 'MBPP') {
          if (organisation['id'] == value) {
            this.trainingForm.controls['organiser_type'].setValue('DD')
            isDD = true
          }
          else if (isDD == false) {
            this.trainingForm.controls['organiser_type'].setValue('LL')
          }
        }
      }
    )
  }

  confirm() {
    // Date YYYY-MM-DD
    // Time hh:mm[:ss[.uuuuuu]]

    // console.log('Before ', this.trainingForm.value)
    let startDate = moment(this.trainingForm.value.start_date, 'DD-MM-YYYY').format('YYYY-MM-DD')
    let endDate = moment(this.trainingForm.value.end_date, 'DD-MM-YYYY').format('YYYY-MM-DD')
    this.trainingForm.controls['start_date'].setValue(startDate)
    this.trainingForm.controls['end_date'].setValue(endDate)
    // console.log('After ', this.trainingForm.value)

    this.trainingFormData = new FormData()
    Object.keys(this.trainingForm.controls).forEach(key => {
      if (key == 'attachment' || key == 'attachment_approval') {
        if (typeof this.trainingForm.get("attachment").value != "string") {
          this.trainingFormData.append(
            "attachment",
            this.trainingForm.get("attachment").value
          );
        }
        if (typeof this.trainingForm.get("attachment_approval").value != "string") {
          this.trainingFormData.append(
            "attachment_approval",
            this.trainingForm.get("attachment_approval").value
          );
        }
      }
      else this.trainingFormData.append(key, this.trainingForm.value[key])
    })

    swal.fire({
      title: 'Pengesahan',
      text: 'Anda pasti untuk mengemaskini latihan ini?',
      type: 'info',
      buttonsStyling: false,
      showCancelButton: true,
      confirmButtonClass: 'btn btn-info',
      confirmButtonText: 'Pasti',
      cancelButtonClass: 'btn btn-outline-info',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.value) {
        this.patch()
      }
    })
  }

  patch() {
    this.loadingBar.start()
    let infoTitle = 'Sedang proses'
    let infoMessage = 'Latihan sedang ditambah'
    this.notifyService.openToastrInfo(infoTitle, infoMessage)

    this.loadingBar.complete()

    this.trainingService.update(this.training['id'], this.trainingFormData).subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        let title = 'Tidak berjaya'
        let message = 'Anda tidak berjaya untuk mengemaskini latihan. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        let title = 'Berjaya'
        let message = 'Latihan berjaya dikemaskini.'
        this.notifyService.openToastr(title, message)
        this.getData()
        // this.addTrainer()
        // this.success()
      }
    )
  }

  onChangeTargetType(event) {
    if (event == 'TB') {
      this.isTargetLocked = true
      this.trainingForm.controls['is_group_KP_A'].patchValue(true)
      this.trainingForm.controls['is_group_KP_B'].patchValue(true)
      this.trainingForm.controls['is_group_KP_C'].patchValue(true)
      this.trainingForm.controls['is_group_KP_D'].patchValue(true)
      this.trainingForm.controls['is_department_11'].patchValue(true)
      this.trainingForm.controls['is_department_15'].patchValue(true)
      this.trainingForm.controls['is_department_21'].patchValue(true)
      this.trainingForm.controls['is_department_31'].patchValue(true)
      this.trainingForm.controls['is_department_41'].patchValue(true)
      this.trainingForm.controls['is_department_45'].patchValue(true)
      this.trainingForm.controls['is_department_47'].patchValue(true)
      this.trainingForm.controls['is_department_51'].patchValue(true)
      this.trainingForm.controls['is_department_55'].patchValue(true)
      this.trainingForm.controls['is_department_61'].patchValue(true)
      this.trainingForm.controls['is_department_63'].patchValue(true)
      this.trainingForm.controls['is_department_71'].patchValue(true)
      this.trainingForm.controls['is_department_81'].patchValue(true)
      this.trainingForm.controls['is_department_86'].patchValue(true)
      this.trainingForm.controls['is_department_90'].patchValue(true)
      this.trainingForm.controls['is_department_91'].patchValue(true)
      this.trainingForm.controls['is_department_92'].patchValue(true)
      this.trainingForm.controls['is_department_93'].patchValue(true)
      this.trainingForm.controls['is_department_94'].patchValue(true)
      this.trainingForm.controls['is_position_01'].patchValue(true)
      this.trainingForm.controls['is_position_02'].patchValue(true)
      this.trainingForm.controls['is_position_03'].patchValue(true)
      this.trainingForm.controls['is_position_04'].patchValue(true)
      this.trainingForm.controls['is_position_05'].patchValue(true)
      this.trainingForm.controls['is_position_06'].patchValue(true)
      this.trainingForm.controls['is_position_07'].patchValue(true)
      this.trainingForm.controls['is_position_08'].patchValue(true)
      this.trainingForm.controls['is_position_09'].patchValue(true)
      this.trainingForm.controls['is_position_10'].patchValue(true)
      this.trainingForm.controls['is_position_11'].patchValue(true)
      this.trainingForm.controls['is_position_12'].patchValue(true)
      this.trainingForm.controls['is_position_13'].patchValue(true)
      this.trainingForm.controls['is_position_14'].patchValue(true)
      this.trainingForm.controls['is_position_15'].patchValue(true)
      this.trainingForm.controls['is_position_16'].patchValue(true)
      this.trainingForm.controls['is_position_17'].patchValue(true)
      this.trainingForm.controls['is_position_18'].patchValue(true)
      this.trainingForm.controls['is_position_19'].patchValue(true)
      this.trainingForm.controls['is_position_20'].patchValue(true)
      this.trainingForm.controls['is_position_21'].patchValue(true)
      this.trainingForm.controls['is_position_22'].patchValue(true)
      this.trainingForm.controls['is_position_23'].patchValue(true)
      this.trainingForm.controls['is_position_24'].patchValue(true)
      this.trainingForm.controls['is_position_25'].patchValue(true)
      this.trainingForm.controls['is_position_26'].patchValue(true)
      this.trainingForm.controls['is_position_27'].patchValue(true)
      this.trainingForm.controls['is_position_28'].patchValue(true)
      this.trainingForm.controls['is_position_29'].patchValue(true)
      this.trainingForm.controls['is_position_30'].patchValue(true)
      this.trainingForm.controls['is_position_31'].patchValue(true)
      this.trainingForm.controls['is_position_32'].patchValue(true)
      this.trainingForm.controls['is_position_33'].patchValue(true)
      this.trainingForm.controls['is_position_34'].patchValue(true)
      this.trainingForm.controls['is_position_35'].patchValue(true)
      this.trainingForm.controls['is_position_36'].patchValue(true)
      this.trainingForm.controls['is_position_37'].patchValue(true)
      this.trainingForm.controls['is_position_38'].patchValue(true)
      this.trainingForm.controls['is_position_39'].patchValue(true)
      this.trainingForm.controls['is_position_40'].patchValue(true)
      this.trainingForm.controls['is_position_41'].patchValue(true)
      this.trainingForm.controls['is_position_42'].patchValue(true)
      this.trainingForm.controls['is_position_43'].patchValue(true)
      this.trainingForm.controls['is_position_44'].patchValue(true)
      this.trainingForm.controls['is_position_45'].patchValue(true)
      this.trainingForm.controls['is_position_46'].patchValue(true)
      this.trainingForm.controls['is_position_47'].patchValue(true)
      this.trainingForm.controls['is_position_48'].patchValue(true)
      this.trainingForm.controls['is_position_49'].patchValue(true)
      this.trainingForm.controls['is_position_50'].patchValue(true)
      this.trainingForm.controls['is_position_51'].patchValue(true)
      this.trainingForm.controls['is_position_52'].patchValue(true)
      this.trainingForm.controls['is_position_53'].patchValue(true)
      this.trainingForm.controls['is_position_54'].patchValue(true)
      this.trainingForm.controls['is_position_55'].patchValue(true)
      this.trainingForm.controls['is_position_60'].patchValue(true)
      this.trainingForm.controls['is_ba19'].patchValue(true)
      this.trainingForm.controls['is_fa29'].patchValue(true)
      this.trainingForm.controls['is_fa32'].patchValue(true)
      this.trainingForm.controls['is_fa41'].patchValue(true)
      this.trainingForm.controls['is_fa44'].patchValue(true)
      this.trainingForm.controls['is_fa48'].patchValue(true)
      this.trainingForm.controls['is_ft19'].patchValue(true)
      this.trainingForm.controls['is_ga17'].patchValue(true)
      this.trainingForm.controls['is_ga19'].patchValue(true)
      this.trainingForm.controls['is_ga22'].patchValue(true)
      this.trainingForm.controls['is_ga26'].patchValue(true)
      this.trainingForm.controls['is_ga29'].patchValue(true)
      this.trainingForm.controls['is_ga32'].patchValue(true)
      this.trainingForm.controls['is_ga41'].patchValue(true)
      this.trainingForm.controls['is_gv41'].patchValue(true)
      this.trainingForm.controls['is_ha11'].patchValue(true)
      this.trainingForm.controls['is_ha14'].patchValue(true)
      this.trainingForm.controls['is_ha16'].patchValue(true)
      this.trainingForm.controls['is_ha19'].patchValue(true)
      this.trainingForm.controls['is_ha22'].patchValue(true)
      this.trainingForm.controls['is_ja19'].patchValue(true)
      this.trainingForm.controls['is_ja22'].patchValue(true)
      this.trainingForm.controls['is_ja29'].patchValue(true)
      this.trainingForm.controls['is_ja36'].patchValue(true)
      this.trainingForm.controls['is_ja38'].patchValue(true)
      this.trainingForm.controls['is_ja40'].patchValue(true)
      this.trainingForm.controls['is_ja41'].patchValue(true)
      this.trainingForm.controls['is_ja44'].patchValue(true)
      this.trainingForm.controls['is_ja48'].patchValue(true)
      this.trainingForm.controls['is_ja52'].patchValue(true)
      this.trainingForm.controls['is_ja54'].patchValue(true)
      this.trainingForm.controls['is_kp11'].patchValue(true)
      this.trainingForm.controls['is_kp14'].patchValue(true)
      this.trainingForm.controls['is_kp19'].patchValue(true)
      this.trainingForm.controls['is_kp22'].patchValue(true)
      this.trainingForm.controls['is_kp29'].patchValue(true)
      this.trainingForm.controls['is_kp32'].patchValue(true)
      this.trainingForm.controls['is_kp41'].patchValue(true)
      this.trainingForm.controls['is_la29'].patchValue(true)
      this.trainingForm.controls['is_la41'].patchValue(true)
      this.trainingForm.controls['is_la44'].patchValue(true)
      this.trainingForm.controls['is_la52'].patchValue(true)
      this.trainingForm.controls['is_la54'].patchValue(true)
      this.trainingForm.controls['is_na01'].patchValue(true)
      this.trainingForm.controls['is_na11'].patchValue(true)
      this.trainingForm.controls['is_na14'].patchValue(true)
      this.trainingForm.controls['is_na17'].patchValue(true)
      this.trainingForm.controls['is_na19'].patchValue(true)
      this.trainingForm.controls['is_na22'].patchValue(true)
      this.trainingForm.controls['is_na26'].patchValue(true)
      this.trainingForm.controls['is_na29'].patchValue(true)
      this.trainingForm.controls['is_na30'].patchValue(true)
      this.trainingForm.controls['is_na32'].patchValue(true)
      this.trainingForm.controls['is_na36'].patchValue(true)
      this.trainingForm.controls['is_na41'].patchValue(true)
      this.trainingForm.controls['is_na44'].patchValue(true)
      this.trainingForm.controls['is_na48'].patchValue(true)
      this.trainingForm.controls['is_na52'].patchValue(true)
      this.trainingForm.controls['is_na54'].patchValue(true)
      this.trainingForm.controls['is_ra01'].patchValue(true)
      this.trainingForm.controls['is_ra03'].patchValue(true)
      this.trainingForm.controls['is_ua11'].patchValue(true)
      this.trainingForm.controls['is_ua14'].patchValue(true)
      this.trainingForm.controls['is_ua17'].patchValue(true)
      this.trainingForm.controls['is_ua19'].patchValue(true)
      this.trainingForm.controls['is_ua24'].patchValue(true)
      this.trainingForm.controls['is_ua29'].patchValue(true)
      this.trainingForm.controls['is_ua32'].patchValue(true)
      this.trainingForm.controls['is_ua36'].patchValue(true)
      this.trainingForm.controls['is_ua41'].patchValue(true)
      this.trainingForm.controls['is_ud43'].patchValue(true)
      this.trainingForm.controls['is_ud48'].patchValue(true)
      this.trainingForm.controls['is_ud52'].patchValue(true)
      this.trainingForm.controls['is_vu06'].patchValue(true)
      this.trainingForm.controls['is_vu07'].patchValue(true)
      this.trainingForm.controls['is_wa17'].patchValue(true)
      this.trainingForm.controls['is_wa19'].patchValue(true)
      this.trainingForm.controls['is_wa22'].patchValue(true)
      this.trainingForm.controls['is_wa26'].patchValue(true)
      this.trainingForm.controls['is_wa28'].patchValue(true)
      this.trainingForm.controls['is_wa29'].patchValue(true)
      this.trainingForm.controls['is_wa32'].patchValue(true)
      this.trainingForm.controls['is_wa36'].patchValue(true)
      this.trainingForm.controls['is_wa41'].patchValue(true)
      this.trainingForm.controls['is_wa44'].patchValue(true)
      this.trainingForm.controls['is_wa48'].patchValue(true)
      this.trainingForm.controls['is_wa52'].patchValue(true)
      this.trainingForm.controls['is_wa54'].patchValue(true)
      this.trainingForm.controls['is_waa41'].patchValue(true)
      this.trainingForm.controls['is_waa44'].patchValue(true)
    }
    else {
      this.isTargetLocked = false
      this.trainingForm.controls['is_group_KP_A'].patchValue(true)
      this.trainingForm.controls['is_group_KP_B'].patchValue(true)
      this.trainingForm.controls['is_group_KP_C'].patchValue(true)
      this.trainingForm.controls['is_group_KP_D'].patchValue(true)
      this.trainingForm.controls['is_department_11'].patchValue(false)
      this.trainingForm.controls['is_department_15'].patchValue(false)
      this.trainingForm.controls['is_department_21'].patchValue(false)
      this.trainingForm.controls['is_department_31'].patchValue(false)
      this.trainingForm.controls['is_department_41'].patchValue(false)
      this.trainingForm.controls['is_department_45'].patchValue(false)
      this.trainingForm.controls['is_department_47'].patchValue(false)
      this.trainingForm.controls['is_department_51'].patchValue(false)
      this.trainingForm.controls['is_department_55'].patchValue(false)
      this.trainingForm.controls['is_department_61'].patchValue(false)
      this.trainingForm.controls['is_department_63'].patchValue(false)
      this.trainingForm.controls['is_department_71'].patchValue(false)
      this.trainingForm.controls['is_department_81'].patchValue(false)
      this.trainingForm.controls['is_department_86'].patchValue(false)
      this.trainingForm.controls['is_department_90'].patchValue(false)
      this.trainingForm.controls['is_department_91'].patchValue(false)
      this.trainingForm.controls['is_department_92'].patchValue(false)
      this.trainingForm.controls['is_department_93'].patchValue(false)
      this.trainingForm.controls['is_department_94'].patchValue(false)
      this.trainingForm.controls['is_position_01'].patchValue(false)
      this.trainingForm.controls['is_position_02'].patchValue(false)
      this.trainingForm.controls['is_position_03'].patchValue(false)
      this.trainingForm.controls['is_position_04'].patchValue(false)
      this.trainingForm.controls['is_position_05'].patchValue(false)
      this.trainingForm.controls['is_position_06'].patchValue(false)
      this.trainingForm.controls['is_position_07'].patchValue(false)
      this.trainingForm.controls['is_position_08'].patchValue(false)
      this.trainingForm.controls['is_position_09'].patchValue(false)
      this.trainingForm.controls['is_position_10'].patchValue(false)
      this.trainingForm.controls['is_position_11'].patchValue(false)
      this.trainingForm.controls['is_position_12'].patchValue(false)
      this.trainingForm.controls['is_position_13'].patchValue(false)
      this.trainingForm.controls['is_position_14'].patchValue(false)
      this.trainingForm.controls['is_position_15'].patchValue(false)
      this.trainingForm.controls['is_position_16'].patchValue(false)
      this.trainingForm.controls['is_position_17'].patchValue(false)
      this.trainingForm.controls['is_position_18'].patchValue(false)
      this.trainingForm.controls['is_position_19'].patchValue(false)
      this.trainingForm.controls['is_position_20'].patchValue(false)
      this.trainingForm.controls['is_position_21'].patchValue(false)
      this.trainingForm.controls['is_position_22'].patchValue(false)
      this.trainingForm.controls['is_position_23'].patchValue(false)
      this.trainingForm.controls['is_position_24'].patchValue(false)
      this.trainingForm.controls['is_position_25'].patchValue(false)
      this.trainingForm.controls['is_position_26'].patchValue(false)
      this.trainingForm.controls['is_position_27'].patchValue(false)
      this.trainingForm.controls['is_position_28'].patchValue(false)
      this.trainingForm.controls['is_position_29'].patchValue(false)
      this.trainingForm.controls['is_position_30'].patchValue(false)
      this.trainingForm.controls['is_position_31'].patchValue(false)
      this.trainingForm.controls['is_position_32'].patchValue(false)
      this.trainingForm.controls['is_position_33'].patchValue(false)
      this.trainingForm.controls['is_position_34'].patchValue(false)
      this.trainingForm.controls['is_position_35'].patchValue(false)
      this.trainingForm.controls['is_position_36'].patchValue(false)
      this.trainingForm.controls['is_position_37'].patchValue(false)
      this.trainingForm.controls['is_position_38'].patchValue(false)
      this.trainingForm.controls['is_position_39'].patchValue(false)
      this.trainingForm.controls['is_position_40'].patchValue(false)
      this.trainingForm.controls['is_position_41'].patchValue(false)
      this.trainingForm.controls['is_position_42'].patchValue(false)
      this.trainingForm.controls['is_position_43'].patchValue(false)
      this.trainingForm.controls['is_position_44'].patchValue(false)
      this.trainingForm.controls['is_position_45'].patchValue(false)
      this.trainingForm.controls['is_position_46'].patchValue(false)
      this.trainingForm.controls['is_position_47'].patchValue(false)
      this.trainingForm.controls['is_position_48'].patchValue(false)
      this.trainingForm.controls['is_position_49'].patchValue(false)
      this.trainingForm.controls['is_position_50'].patchValue(false)
      this.trainingForm.controls['is_position_51'].patchValue(false)
      this.trainingForm.controls['is_position_52'].patchValue(false)
      this.trainingForm.controls['is_position_53'].patchValue(false)
      this.trainingForm.controls['is_position_54'].patchValue(false)
      this.trainingForm.controls['is_position_55'].patchValue(false)
      this.trainingForm.controls['is_position_60'].patchValue(false)
      this.trainingForm.controls['is_ba19'].patchValue(true)
      this.trainingForm.controls['is_fa29'].patchValue(true)
      this.trainingForm.controls['is_fa32'].patchValue(true)
      this.trainingForm.controls['is_fa41'].patchValue(true)
      this.trainingForm.controls['is_fa44'].patchValue(true)
      this.trainingForm.controls['is_fa48'].patchValue(true)
      this.trainingForm.controls['is_ft19'].patchValue(true)
      this.trainingForm.controls['is_ga17'].patchValue(true)
      this.trainingForm.controls['is_ga19'].patchValue(true)
      this.trainingForm.controls['is_ga22'].patchValue(true)
      this.trainingForm.controls['is_ga26'].patchValue(true)
      this.trainingForm.controls['is_ga29'].patchValue(true)
      this.trainingForm.controls['is_ga32'].patchValue(true)
      this.trainingForm.controls['is_ga41'].patchValue(true)
      this.trainingForm.controls['is_gv41'].patchValue(true)
      this.trainingForm.controls['is_ha11'].patchValue(true)
      this.trainingForm.controls['is_ha14'].patchValue(true)
      this.trainingForm.controls['is_ha16'].patchValue(true)
      this.trainingForm.controls['is_ha19'].patchValue(true)
      this.trainingForm.controls['is_ha22'].patchValue(true)
      this.trainingForm.controls['is_ja19'].patchValue(true)
      this.trainingForm.controls['is_ja22'].patchValue(true)
      this.trainingForm.controls['is_ja29'].patchValue(true)
      this.trainingForm.controls['is_ja36'].patchValue(true)
      this.trainingForm.controls['is_ja38'].patchValue(true)
      this.trainingForm.controls['is_ja40'].patchValue(true)
      this.trainingForm.controls['is_ja41'].patchValue(true)
      this.trainingForm.controls['is_ja44'].patchValue(true)
      this.trainingForm.controls['is_ja48'].patchValue(true)
      this.trainingForm.controls['is_ja52'].patchValue(true)
      this.trainingForm.controls['is_ja54'].patchValue(true)
      this.trainingForm.controls['is_kp11'].patchValue(true)
      this.trainingForm.controls['is_kp14'].patchValue(true)
      this.trainingForm.controls['is_kp19'].patchValue(true)
      this.trainingForm.controls['is_kp22'].patchValue(true)
      this.trainingForm.controls['is_kp29'].patchValue(true)
      this.trainingForm.controls['is_kp32'].patchValue(true)
      this.trainingForm.controls['is_kp41'].patchValue(true)
      this.trainingForm.controls['is_la29'].patchValue(true)
      this.trainingForm.controls['is_la41'].patchValue(true)
      this.trainingForm.controls['is_la44'].patchValue(true)
      this.trainingForm.controls['is_la52'].patchValue(true)
      this.trainingForm.controls['is_la54'].patchValue(true)
      this.trainingForm.controls['is_na01'].patchValue(true)
      this.trainingForm.controls['is_na11'].patchValue(true)
      this.trainingForm.controls['is_na14'].patchValue(true)
      this.trainingForm.controls['is_na17'].patchValue(true)
      this.trainingForm.controls['is_na19'].patchValue(true)
      this.trainingForm.controls['is_na22'].patchValue(true)
      this.trainingForm.controls['is_na26'].patchValue(true)
      this.trainingForm.controls['is_na29'].patchValue(true)
      this.trainingForm.controls['is_na30'].patchValue(true)
      this.trainingForm.controls['is_na32'].patchValue(true)
      this.trainingForm.controls['is_na36'].patchValue(true)
      this.trainingForm.controls['is_na41'].patchValue(true)
      this.trainingForm.controls['is_na44'].patchValue(true)
      this.trainingForm.controls['is_na48'].patchValue(true)
      this.trainingForm.controls['is_na52'].patchValue(true)
      this.trainingForm.controls['is_na54'].patchValue(true)
      this.trainingForm.controls['is_ra01'].patchValue(true)
      this.trainingForm.controls['is_ra03'].patchValue(true)
      this.trainingForm.controls['is_ua11'].patchValue(true)
      this.trainingForm.controls['is_ua14'].patchValue(true)
      this.trainingForm.controls['is_ua17'].patchValue(true)
      this.trainingForm.controls['is_ua19'].patchValue(true)
      this.trainingForm.controls['is_ua24'].patchValue(true)
      this.trainingForm.controls['is_ua29'].patchValue(true)
      this.trainingForm.controls['is_ua32'].patchValue(true)
      this.trainingForm.controls['is_ua36'].patchValue(true)
      this.trainingForm.controls['is_ua41'].patchValue(true)
      this.trainingForm.controls['is_ud43'].patchValue(true)
      this.trainingForm.controls['is_ud48'].patchValue(true)
      this.trainingForm.controls['is_ud52'].patchValue(true)
      this.trainingForm.controls['is_vu06'].patchValue(true)
      this.trainingForm.controls['is_vu07'].patchValue(true)
      this.trainingForm.controls['is_wa17'].patchValue(true)
      this.trainingForm.controls['is_wa19'].patchValue(true)
      this.trainingForm.controls['is_wa22'].patchValue(true)
      this.trainingForm.controls['is_wa26'].patchValue(true)
      this.trainingForm.controls['is_wa28'].patchValue(true)
      this.trainingForm.controls['is_wa29'].patchValue(true)
      this.trainingForm.controls['is_wa32'].patchValue(true)
      this.trainingForm.controls['is_wa36'].patchValue(true)
      this.trainingForm.controls['is_wa41'].patchValue(true)
      this.trainingForm.controls['is_wa44'].patchValue(true)
      this.trainingForm.controls['is_wa48'].patchValue(true)
      this.trainingForm.controls['is_wa52'].patchValue(true)
      this.trainingForm.controls['is_wa54'].patchValue(true)
      this.trainingForm.controls['is_waa41'].patchValue(true)
      this.trainingForm.controls['is_waa44'].patchValue(true)
    }
  }

  entriesChange(type, $event) {
    if (type == 'applications') {
      this.tableApplicationsEntries = $event.target.value;
    }
    else if (type == 'attendances') {
      this.tableAttendancesEntries = $event.target.value;
    }
    else if (type == 'absences') {
      this.tableAbsencesEntries = $event.target.value;
    }
    else if (type == 'notes') {
      this.tableNotesEntries = $event.target.value;
    }
  }

  filterTable(type, $event) {
    let val = $event.target.value.toLowerCase();
    
    if (type == 'applications') {
      this.tableApplicationsTemp = this.tableApplicationsRows.filter(function(d) {
        return d.applicant.toLowerCase().indexOf(val) !== -1 || !val;
      });
    }
    else if (type == 'attendances') {
      this.tableApplicationsTemp = this.tableApplicationsRows.filter(function(d) {
        return d.attendee.full_name.toLowerCase().indexOf(val) !== -1 || !val;
      });
    }
    else if (type == 'absences') {
      this.tableAbsencesTemp = this.tableAbsencesRows.filter(function(d) {
        return d.attendee.full_name.toLowerCase().indexOf(val) !== -1 || !val;
      });
    }
    else if (type == 'notes') {
      this.tableApplicationsTemp = this.tableApplicationsRows.filter(function(d) {
        return d.title.toLowerCase().indexOf(val) !== -1 || !val;
      });
    }
  }

  onSelect(type, { selected }) {
    if (type == 'applications') {
      this.tableApplicationsSelected.splice(0, this.tableApplicationsSelected.length);
      this.tableApplicationsSelected.push(...selected);
    }
    else if (type == 'attendances') {
      this.tableAttendancesSelected.splice(0, this.tableAttendancesSelected.length);
      this.tableAttendancesSelected.push(...selected);
    }
    else if (type == 'absences') {
      this.tableAbsencesSelected.splice(0, this.tableAbsencesSelected.length);
      this.tableAbsencesSelected.push(...selected);
    }
    else if (type == 'notes') {
      this.tableNotesSelected.splice(0, this.tableNotesSelected.length);
      this.tableNotesSelected.push(...selected);
    }
  }

  onActivate(type, event) {
    if (type == 'applications') {
      this.tableApplicationsActiveRow = event.row;
    }
    else if (type == 'attendances') {
      this.tableAttendancesActiveRow = event.row;
    }
    else if (type == 'absences') {
      this.tableAbsencesActiveRow = event.row;
    }
    else if (type == 'notes') {
      this.tableNotesActiveRow = event.row;
    }
  }

  openModal(modalRef: TemplateRef<any>) {
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  closeModal(type) {
    this.modal.hide()
    if (type == 'notes') {
      this.noteForm.reset()
    }
  }

  addNote() {
    this.loadingBar.start()
    let infoTitle = 'Sedang proses'
    let infoMessage = 'Nota sedang ditambah'
    this.notifyService.openToastrInfo(infoTitle, infoMessage)

    const noteFormData = new FormData()
    let noteFormDataKey = []
    for (let key in this.noteForm.value) {
      noteFormDataKey.push(key)
    }
    noteFormDataKey.forEach(
      (key) => {
        noteFormData.append(key, this.noteForm.value[key])
      }
    )
    
    this.noteService.post(noteFormData).subscribe(
      () => {
        this.loadingBar.complete()
        let successTitle = 'Berjaya'
        let successMessage = 'Nota berjaya ditambah'
        this.notifyService.openToastr(successTitle, successMessage)
      },
      () => {
        this.loadingBar.complete()
        let failedTitle = 'Tidak Berjaya'
        let failedMessage = 'Nota tidak berjaya ditambah. Sila cuba sekali lagi'
        this.notifyService.openToastrError(failedTitle, failedMessage)
      },
      () => {
        this.closeModal('notes')
        this.getData()
      }
    )
  }

  onFileChange(event, type) {
    let reader = new FileReader();
    let fileSize = event.target.files[0].size
    let fileName = event.target.files[0].name
    
    if (
      event.target.files && 
      event.target.files.length &&
      fileSize < 5000000
    ) {
      const [file] = event.target.files;
      reader.readAsDataURL(file)
      // readAsDataURL(file);
      // console.log(event.target)
      // console.log(reader)
      
      reader.onload = () => {
        // console.log(reader['result'])
        console.log('event.target', event.target)
        if (type == 'notes') {
          this.noteForm.controls['note_file'].setValue(file)
          this.fileSize = event.target.files[0].size
          this.fileName = event.target.files[0].name
          this.fileSizeInformation = this.fileSize
          this.fileNameInformation = this.fileName
        }
        else if (type == 'attachment') {
          this.trainingForm.controls['attachment'].setValue(file)
          this.fileSizeAttachment = event.target.files[0].size
          this.fileNameAttachment = event.target.files[0].name
          this.fileSizeInformationAttachment = this.fileSize
          this.fileNameInformationAttachment = this.fileName
        }
        else if (type == 'attachment_approval') {
          this.trainingForm.controls['attachment_approval'].setValue(file)
          this.fileSizeAttachmentApproval = event.target.files[0].size
          this.fileNameAttachmentApproval = event.target.files[0].name
          this.fileSizeInformationAttachmentApproval = this.fileSize
          this.fileNameInformationAttachmentApproval = this.fileName
        }
        // console.log(this.registerForm.value)
        // console.log('he', this.registerForm.valid)
        // console.log(this.isAgree)
        // !registerForm.valid || !isAgree
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

  removeFile(type) {
    if (type == 'notes') {
      this.fileSize = 0;
      this.fileName = null;
      this.noteForm.value['note_file'] = null;
      this.fileSizeInformation = null
      this.fileNameInformation = null
      //this.cd.markForCheck();
      //this.cd.detectChanges();
    }
    else if (type == 'attachment') {
      this.fileSizeAttachment = 0;
      this.fileNameAttachment = null;
      this.trainingForm.value['attachment'] = null;
      this.fileSizeInformationAttachment = null
      this.fileNameInformationAttachment = null
      //this.cd.markForCheck();
      //this.cd.detectChanges();
    }
    else if (type == 'attachment_approval') {
      this.fileSizeAttachmentApproval = 0;
      this.fileNameAttachmentApproval = null;
      this.trainingForm.value['attachment_approval'] = null;
      this.fileSizeInformationAttachmentApproval = null
      this.fileNameInformationAttachmentApproval = null
      //this.cd.markForCheck();
      //this.cd.detectChanges();
    }
    this.fileName = null
    this.fileSize = null
  }

  downloadNote(row) {
    let url = row['note_file']
    window.open(url, '_blank');
  }

  downloadAttachment(type) {
    if (type == 'attachment') {
      let url = this.training['attachment']
      window.open(url, '_blank');
    }
    else if (type == 'attachment_approval') {
      let url = this.training['attachment_approval']
      window.open(url, '_blank');
    }

  }

  downloadAbsence(row) {
    window.open(row, '_blank');
  }

  verifyAbsence(row) {
    
  }

  verifyAttendance(row) {
    this.loadingBar.start()
    let infoTitle = 'Sedang proses'
    let infoMessage = 'Kehadiran sedang disahkan'
    this.notifyService.openToastrInfo(infoTitle, infoMessage)
    
    this.attendanceService.verify(row['id']).subscribe(
      () => {
        this.loadingBar.complete()
        let successTitle = 'Berjaya'
        let successMessage = 'Kehadiran berjaya disahkan'
        this.notifyService.openToastr(successTitle, successMessage)
      },
      () => {
        this.loadingBar.complete()
        let failedTitle = 'Tidak Berjaya'
        let failedMessage = 'Kehadiran tidak berjaya disahkan. Sila cuba sekali lagi'
        this.notifyService.openToastrError(failedTitle, failedMessage)
      },
      () => {
        this.getData()
      }
    )
  }

  signinAttendance(row) {
    this.loadingBar.start()
    let infoTitle = 'Sedang proses'
    let infoMessage = 'Kehadiran waktu masuk sedang dilog'
    this.notifyService.openToastrInfo(infoTitle, infoMessage)
    
    this.attendanceService.signInCoordinator(row['id']).subscribe(
      () => {
        this.loadingBar.complete()
        let successTitle = 'Berjaya'
        let successMessage = 'Kehadiran waktu masuk berjaya dilog'
        this.notifyService.openToastr(successTitle, successMessage)
      },
      () => {
        this.loadingBar.complete()
        let failedTitle = 'Tidak Berjaya'
        let failedMessage = 'Kehadiran waktu masuk tidak berjaya dilog. Sila cuba sekali lagi'
        this.notifyService.openToastrError(failedTitle, failedMessage)
      },
      () => {
        this.getData()
      }
    )
  }

  signoutAttendance(row) {
    this.loadingBar.start()
    let infoTitle = 'Sedang proses'
    let infoMessage = 'Kehadiran waktu keluar sedang dilog'
    this.notifyService.openToastrInfo(infoTitle, infoMessage)
    
    this.attendanceService.signOutCoordinator(row['id']).subscribe(
      () => {
        this.loadingBar.complete()
        let successTitle = 'Berjaya'
        let successMessage = 'Kehadiran waktu keluar berjaya dilog'
        this.notifyService.openToastr(successTitle, successMessage)
      },
      () => {
        this.loadingBar.complete()
        let failedTitle = 'Tidak Berjaya'
        let failedMessage = 'Kehadiran waktu keluar tidak berjaya dilog. Sila cuba sekali lagi'
        this.notifyService.openToastrError(failedTitle, failedMessage)
      },
      () => {
        this.getData()
      }
    )
  }

  approveApplication(row) {
    this.loadingBar.start()
    let infoTitle = 'Sedang proses'
    let infoMessage = 'Permohonan sedang diterima'
    this.notifyService.openToastrInfo(infoTitle, infoMessage)
    
    this.applicationService.approveLevel3(row['id']).subscribe(
      () => {
        this.loadingBar.complete()
        let successTitle = 'Berjaya'
        let successMessage = 'Permohonan berjaya diterima'
        this.notifyService.openToastr(successTitle, successMessage)
      },
      () => {
        this.loadingBar.complete()
        let failedTitle = 'Tidak Berjaya'
        let failedMessage = 'Permohonan tidak berjaya diterima. Sila cuba sekali lagi'
        this.notifyService.openToastrError(failedTitle, failedMessage)
      },
      () => {
        this.getData()
      }
    )
  }

  rejectApplication(row) {
    this.loadingBar.start()
    let infoTitle = 'Sedang proses'
    let infoMessage = 'Permohonan sedang ditolak'
    this.notifyService.openToastrInfo(infoTitle, infoMessage)
    
    this.applicationService.reject(row['id']).subscribe(
      () => {
        this.loadingBar.complete()
        let successTitle = 'Berjaya'
        let successMessage = 'Permohonan berjaya ditolak'
        this.notifyService.openToastr(successTitle, successMessage)
      },
      () => {
        this.loadingBar.complete()
        let failedTitle = 'Tidak Berjaya'
        let failedMessage = 'Permohonan tidak berjaya ditolak. Sila cuba sekali lagi'
        this.notifyService.openToastrError(failedTitle, failedMessage)
      },
      () => {
        this.getData()
      }
    )
  }

  reserveApplication(row) {
    console.log("row = ",row)
    this.loadingBar.start()
    let infoTitle = 'Sedang proses'
    let infoMessage = 'Permohonan sedang disimpan'
    this.notifyService.openToastrInfo(infoTitle, infoMessage)
    
    this.applicationService.reserve(row['id']).subscribe(
      () => {
        this.loadingBar.complete()
        let successTitle = 'Berjaya'
        let successMessage = 'Permohonan berjaya disimpan'
        this.notifyService.openToastr(successTitle, successMessage)
      },
      () => {
        this.loadingBar.complete()
        let failedTitle = 'Tidak Berjaya'
        let failedMessage = 'Permohonan tidak berjaya disimpan. Sila cuba sekali lagi'
        this.notifyService.openToastrError(failedTitle, failedMessage)
      },
      () => {
        this.getData()
      }
    )
  }

  confirmApply() {
    swal.fire({
      title: 'Pengesahan',
      text: 'Anda pasti untuk mencalonkan kakitangan berikut ke dalam latihan ini?',
      type: 'info',
      buttonsStyling: false,
      showCancelButton: true,
      confirmButtonClass: 'btn btn-info',
      confirmButtonText: 'Pasti',
      cancelButtonClass: 'btn btn-outline-info',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.value) {
        this.apply()
      }
    })
  }

  apply() {
    this.loadingBar.start()
    let body = {
      'training': this.training['id'],
      'applicants': this.selectedStaffs
    }
    console.log("body", body)
    let infoTitle = 'Sedang proses'
    let infoMessage = 'Pencalonan sedang diproses'
    this.notifyService.openToastrInfo(infoTitle, infoMessage)

    this.applicationService.postBatch(body).subscribe(
      (res) => {
        console.log("res", res);
        this.loadingBar.complete()
        let title = 'Berjaya'
        let message = 'Anda berjaya mencalonkan kakitangan berikut ke dalam latihan ini'
        this.notifyService.openToastr(title, message)
      },
      (err) => {
        console.log("err", err);
        this.loadingBar.complete()
        let title = 'Tidak berjaya'
        let message = 'Anda tidak berjaya untuk mencalonkan kakitangan berikut ke dalam latihan. Sila cuba sekali lagi'
        this.notifyService.openToastrError(title, message)
        this.loadingBar.complete()
      },
      () => {
        // this.navigatePage('/dc/dashboard')
        this.selectedStaffs = []
        this.applyForm.reset()
        this.getData()
      }
    )
  }

  navigatePage(path: string) {
    // console.log(path)
    this.router.navigate([path])
  }

  viewForm() {
    console.log('form: ', this.trainingForm.value)
  }

  exportExcel(type) {
    let todayDate = new Date()
    let todayDateFormat = moment(todayDate).format('YYYYMMDD')
    let fileName = ''
    let element

    if (type == 'applications') {
      element = document.getElementById('summaryApplicationsTable'); 
      fileName = 'Ringkasan_Permohonan_' + todayDateFormat + '.xlsx'
    }
    else if (type == 'attendances') {
      element = document.getElementById('summaryAttendancesTable'); 
      fileName = 'Ringkasan_Kehadiran_' + todayDateFormat + '.xlsx'
    }
    else if (type == 'absences') {
      element = document.getElementById('summaryAbsencesTable'); 
      fileName = 'Ringkasan_Ketidakhadiran_' + todayDateFormat + '.xlsx'
    }
    else {
      element = document.getElementById('summaryApplicationsTable'); 
      fileName = 'Ringkasan_' + todayDateFormat + '.xlsx'
    }
    const ws: xlsx.WorkSheet = xlsx.utils.table_to_sheet(element);

    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    xlsx.writeFile(wb, fileName);
  }

  openApplyForm() {
    this.isApplying = !this.isApplying
  }

  // Kumpulan sasaran
  onAddTargetGrp($event) {
    let add = $event['form']
    // console.log('add ', add)
    this.trainingForm.controls[add].patchValue(true)
    let groupD = [
      'is_ha11',
      'is_ha14',
      'is_ha16',
      'is_kp11',
      'is_kp14',
      'is_na01',
      'is_na11',
      'is_na14',
      'is_ra01',
      'is_ra03',
      'is_ua11',
      'is_ua14',
      'is_vu06',
      'is_vu07',
    ]
    let groupC = [
      'is_ba19',
      'is_ga29',
      'is_ft19',
      'is_fa29',
      'is_ga17',
      'is_ga19',
      'is_ga22',
      'is_ga26',
      'is_ha19',
      'is_ha22',
      'is_ja19',
      'is_ja22',
      'is_kp19',
      'is_kp22',
      'is_na17',
      'is_na19',
      'is_na22',
      'is_na26',
      'is_ua17',
      'is_ua19',
      'is_ua24',
      'is_wa17',
      'is_wa19',
      'is_wa22',
      'is_wa26',
    ]
    let groupB = [
      'is_fa32',
      'is_ga29',
      'is_ga32',
      'is_ja29',
      'is_ja36',
      'is_ja38',
      'is_ja40',
      'is_kp29',
      'is_kp32',
      'is_la29',
      'is_na26',
      'is_na29',
      'is_na30',
      'is_na32',
      'is_na36',
      'is_ua29',
      'is_ua32',
      'is_ua36',
      'is_wa28',
      'is_wa29',
      'is_wa32',
      'is_wa36'
    ]
    let groupA = [
      'is_fa41',
      'is_fa44',
      'is_fa48',
      'is_ga41',
      'is_gv41',
      'is_ja41',
      'is_ja44',
      'is_ja48',
      'is_ja52',
      'is_ja54',
      'is_kp41',
      'is_la41',
      'is_la44',
      'is_la52',
      'is_la54',
      'is_na41',
      'is_na44',
      'is_na48',
      'is_na52',
      'is_na54',
      'is_ua41',
      'is_ud43',
      'is_ud48',
      'is_ud52',
      'is_wa41',
      'is_wa44',
      'is_wa48',
      'is_wa52',
      'is_wa54',
      'is_waa41',
      'is_waa44'
    ]

    if (add == 'is_group_KP_D') {
      this.trainingForm.controls['is_ha11'].patchValue(true)
      this.trainingForm.controls['is_ha14'].patchValue(true)
      this.trainingForm.controls['is_ha16'].patchValue(true)
      this.trainingForm.controls['is_kp11'].patchValue(true)
      this.trainingForm.controls['is_kp14'].patchValue(true)
      this.trainingForm.controls['is_na01'].patchValue(true)
      this.trainingForm.controls['is_na11'].patchValue(true)
      this.trainingForm.controls['is_na14'].patchValue(true)
      this.trainingForm.controls['is_ra01'].patchValue(true)
      this.trainingForm.controls['is_ra03'].patchValue(true)
      this.trainingForm.controls['is_ua11'].patchValue(true)
      this.trainingForm.controls['is_ua14'].patchValue(true)
      this.trainingForm.controls['is_vu06'].patchValue(true)
      this.trainingForm.controls['is_vu07'].patchValue(true)
      
      groupD.forEach(
        (grp_sch) => {
          // console.log('gr: ', grp_sch)
          // console.log('sch: ', sch)
          // console.log(this.selectedSch.find(sch => sch === grp_sch))
          if (this.selectedSch.find(sch => sch === grp_sch) == undefined) {
            this.selectedSch.push(grp_sch)
            // console.log('masuke ke')
          }
        }
      )
    }
    else if (add == 'is_group_KP_C') {
      this.trainingForm.controls['is_ba19'].patchValue(true)
      this.trainingForm.controls['is_ga29'].patchValue(true)
      this.trainingForm.controls['is_ft19'].patchValue(true)
      this.trainingForm.controls['is_fa29'].patchValue(true)
      this.trainingForm.controls['is_ga17'].patchValue(true)
      this.trainingForm.controls['is_ga19'].patchValue(true)
      this.trainingForm.controls['is_ga22'].patchValue(true)
      this.trainingForm.controls['is_ga26'].patchValue(true)
      this.trainingForm.controls['is_ha19'].patchValue(true)
      this.trainingForm.controls['is_ha22'].patchValue(true)
      this.trainingForm.controls['is_ja19'].patchValue(true)
      this.trainingForm.controls['is_ja22'].patchValue(true)
      this.trainingForm.controls['is_kp19'].patchValue(true)
      this.trainingForm.controls['is_kp22'].patchValue(true)
      this.trainingForm.controls['is_na17'].patchValue(true)
      this.trainingForm.controls['is_na19'].patchValue(true)
      this.trainingForm.controls['is_na22'].patchValue(true)
      this.trainingForm.controls['is_na26'].patchValue(true)
      this.trainingForm.controls['is_ua17'].patchValue(true)
      this.trainingForm.controls['is_ua19'].patchValue(true)
      this.trainingForm.controls['is_ua24'].patchValue(true)
      this.trainingForm.controls['is_wa17'].patchValue(true)
      this.trainingForm.controls['is_wa19'].patchValue(true)
      this.trainingForm.controls['is_wa22'].patchValue(true)
      this.trainingForm.controls['is_wa26'].patchValue(true)

      groupC.forEach(
        (grp_sch) => {
          // console.log('gr: ', grp_sch)
          // console.log('sch: ', sch)
          // console.log(this.selectedSch.find(sch => sch === grp_sch))
          if (this.selectedSch.find(sch => sch === grp_sch) == undefined) {
            this.selectedSch.push(grp_sch)
            // console.log('masuke ke')
          }
        }
      )
    }
    else if (add == 'is_group_KP_B') {
      this.trainingForm.controls['is_fa32'].patchValue(true)
      this.trainingForm.controls['is_ga29'].patchValue(true)
      this.trainingForm.controls['is_ga32'].patchValue(true)
      this.trainingForm.controls['is_ja29'].patchValue(true)
      this.trainingForm.controls['is_ja36'].patchValue(true)
      this.trainingForm.controls['is_ja38'].patchValue(true)
      this.trainingForm.controls['is_ja40'].patchValue(true)
      this.trainingForm.controls['is_kp29'].patchValue(true)
      this.trainingForm.controls['is_kp32'].patchValue(true)
      this.trainingForm.controls['is_la29'].patchValue(true)
      this.trainingForm.controls['is_na26'].patchValue(true)
      this.trainingForm.controls['is_na29'].patchValue(true)
      this.trainingForm.controls['is_na30'].patchValue(true)
      this.trainingForm.controls['is_na32'].patchValue(true)
      this.trainingForm.controls['is_na36'].patchValue(true)
      this.trainingForm.controls['is_ua29'].patchValue(true)
      this.trainingForm.controls['is_ua32'].patchValue(true)
      this.trainingForm.controls['is_ua36'].patchValue(true)
      this.trainingForm.controls['is_wa28'].patchValue(true)
      this.trainingForm.controls['is_wa29'].patchValue(true)
      this.trainingForm.controls['is_wa32'].patchValue(true)
      this.trainingForm.controls['is_wa36'].patchValue(true)

      groupB.forEach(
        (grp_sch) => {
          // console.log('gr: ', grp_sch)
          // console.log('sch: ', sch)
          // console.log(this.selectedSch.find(sch => sch === grp_sch))
          if (this.selectedSch.find(sch => sch === grp_sch) == undefined) {
            this.selectedSch.push(grp_sch)
            // console.log('masuke ke')
          }
        }
      )
    }
    else if (add == 'is_group_KP_A') {
      this.trainingForm.controls['is_fa41'].patchValue(true)
      this.trainingForm.controls['is_fa44'].patchValue(true)
      this.trainingForm.controls['is_fa48'].patchValue(true)
      this.trainingForm.controls['is_ga41'].patchValue(true)
      this.trainingForm.controls['is_gv41'].patchValue(true)
      this.trainingForm.controls['is_ja41'].patchValue(true)
      this.trainingForm.controls['is_ja44'].patchValue(true)
      this.trainingForm.controls['is_ja48'].patchValue(true)
      this.trainingForm.controls['is_ja52'].patchValue(true)
      this.trainingForm.controls['is_ja54'].patchValue(true)
      this.trainingForm.controls['is_kp41'].patchValue(true)
      this.trainingForm.controls['is_la41'].patchValue(true)
      this.trainingForm.controls['is_la44'].patchValue(true)
      this.trainingForm.controls['is_la52'].patchValue(true)
      this.trainingForm.controls['is_la54'].patchValue(true)
      this.trainingForm.controls['is_na41'].patchValue(true)
      this.trainingForm.controls['is_na44'].patchValue(true)
      this.trainingForm.controls['is_na48'].patchValue(true)
      this.trainingForm.controls['is_na52'].patchValue(true)
      this.trainingForm.controls['is_na54'].patchValue(true)
      this.trainingForm.controls['is_ua41'].patchValue(true)
      this.trainingForm.controls['is_ud43'].patchValue(true)
      this.trainingForm.controls['is_ud48'].patchValue(true)
      this.trainingForm.controls['is_ud52'].patchValue(true)
      this.trainingForm.controls['is_wa41'].patchValue(true)
      this.trainingForm.controls['is_wa44'].patchValue(true)
      this.trainingForm.controls['is_wa48'].patchValue(true)
      this.trainingForm.controls['is_wa52'].patchValue(true)
      this.trainingForm.controls['is_wa54'].patchValue(true)
      this.trainingForm.controls['is_waa41'].patchValue(true)
      this.trainingForm.controls['is_waa44'].patchValue(true)

      groupA.forEach(
        (grp_sch) => {
          // console.log('gr: ', grp_sch)
          // console.log('sch: ', sch)
          // console.log(this.selectedSch.find(sch => sch === grp_sch))
          if (this.selectedSch.find(sch => sch === grp_sch) == undefined) {
            this.selectedSch.push(grp_sch)
            // console.log('masuke ke')
          }
        }
      )
    }
  }

  onClearTargetGrp($event) {
    let clear = $event
    this.targetGrpOpts.forEach(
      (target) => {
        this.trainingForm.controls[target['form']].patchValue(false)
      }
    )

    this.trainingForm.controls['is_ha11'].patchValue(false)
    this.trainingForm.controls['is_ha14'].patchValue(false)
    this.trainingForm.controls['is_ha16'].patchValue(false)
    this.trainingForm.controls['is_kp11'].patchValue(false)
    this.trainingForm.controls['is_kp14'].patchValue(false)
    this.trainingForm.controls['is_na01'].patchValue(false)
    this.trainingForm.controls['is_na11'].patchValue(false)
    this.trainingForm.controls['is_na14'].patchValue(false)
    this.trainingForm.controls['is_ra01'].patchValue(false)
    this.trainingForm.controls['is_ra03'].patchValue(false)
    this.trainingForm.controls['is_ua11'].patchValue(false)
    this.trainingForm.controls['is_ua14'].patchValue(false)
    this.trainingForm.controls['is_vu06'].patchValue(false)
    this.trainingForm.controls['is_vu07'].patchValue(false) 
    this.trainingForm.controls['is_ba19'].patchValue(false)
    this.trainingForm.controls['is_ga29'].patchValue(false)
    this.trainingForm.controls['is_ft19'].patchValue(false)
    this.trainingForm.controls['is_ga17'].patchValue(false)
    this.trainingForm.controls['is_ga19'].patchValue(false)
    this.trainingForm.controls['is_ga22'].patchValue(false)
    this.trainingForm.controls['is_ga26'].patchValue(false)
    this.trainingForm.controls['is_ha19'].patchValue(false)
    this.trainingForm.controls['is_ha22'].patchValue(false)
    this.trainingForm.controls['is_ja19'].patchValue(false)
    this.trainingForm.controls['is_ja22'].patchValue(false)
    this.trainingForm.controls['is_kp19'].patchValue(false)
    this.trainingForm.controls['is_kp22'].patchValue(false)
    this.trainingForm.controls['is_na17'].patchValue(false)
    this.trainingForm.controls['is_na19'].patchValue(false)
    this.trainingForm.controls['is_na22'].patchValue(false)
    this.trainingForm.controls['is_na26'].patchValue(false)
    this.trainingForm.controls['is_ua17'].patchValue(false)
    this.trainingForm.controls['is_ua19'].patchValue(false)
    this.trainingForm.controls['is_ua24'].patchValue(false)
    this.trainingForm.controls['is_wa17'].patchValue(false)
    this.trainingForm.controls['is_wa19'].patchValue(false)
    this.trainingForm.controls['is_wa22'].patchValue(false)
    this.trainingForm.controls['is_wa26'].patchValue(false)
    this.trainingForm.controls['is_fa32'].patchValue(false)
    this.trainingForm.controls['is_ga29'].patchValue(false)
    this.trainingForm.controls['is_ga32'].patchValue(false)
    this.trainingForm.controls['is_ja29'].patchValue(false)
    this.trainingForm.controls['is_ja36'].patchValue(false)
    this.trainingForm.controls['is_ja38'].patchValue(false)
    this.trainingForm.controls['is_ja40'].patchValue(false)
    this.trainingForm.controls['is_kp29'].patchValue(false)
    this.trainingForm.controls['is_kp32'].patchValue(false)
    this.trainingForm.controls['is_la29'].patchValue(false)
    this.trainingForm.controls['is_na26'].patchValue(false)
    this.trainingForm.controls['is_na29'].patchValue(false)
    this.trainingForm.controls['is_na30'].patchValue(false)
    this.trainingForm.controls['is_na32'].patchValue(false)
    this.trainingForm.controls['is_na36'].patchValue(false)
    this.trainingForm.controls['is_ua29'].patchValue(false)
    this.trainingForm.controls['is_ua32'].patchValue(false)
    this.trainingForm.controls['is_ua36'].patchValue(false)
    this.trainingForm.controls['is_wa28'].patchValue(false)
    this.trainingForm.controls['is_wa29'].patchValue(false)
    this.trainingForm.controls['is_wa32'].patchValue(false)
    this.trainingForm.controls['is_wa36'].patchValue(false)
    this.trainingForm.controls['is_fa41'].patchValue(false)
    this.trainingForm.controls['is_fa44'].patchValue(false)
    this.trainingForm.controls['is_fa48'].patchValue(false)
    this.trainingForm.controls['is_ga41'].patchValue(false)
    this.trainingForm.controls['is_gv41'].patchValue(false)
    this.trainingForm.controls['is_ja41'].patchValue(false)
    this.trainingForm.controls['is_ja44'].patchValue(false)
    this.trainingForm.controls['is_ja48'].patchValue(false)
    this.trainingForm.controls['is_ja52'].patchValue(false)
    this.trainingForm.controls['is_ja54'].patchValue(false)
    this.trainingForm.controls['is_kp41'].patchValue(false)
    this.trainingForm.controls['is_la41'].patchValue(false)
    this.trainingForm.controls['is_la44'].patchValue(false)
    this.trainingForm.controls['is_la52'].patchValue(false)
    this.trainingForm.controls['is_la54'].patchValue(false)
    this.trainingForm.controls['is_na41'].patchValue(false)
    this.trainingForm.controls['is_na44'].patchValue(false)
    this.trainingForm.controls['is_na48'].patchValue(false)
    this.trainingForm.controls['is_na52'].patchValue(false)
    this.trainingForm.controls['is_na54'].patchValue(false)
    this.trainingForm.controls['is_ua41'].patchValue(false)
    this.trainingForm.controls['is_ud43'].patchValue(false)
    this.trainingForm.controls['is_ud48'].patchValue(false)
    this.trainingForm.controls['is_ud52'].patchValue(false)
    this.trainingForm.controls['is_wa41'].patchValue(false)
    this.trainingForm.controls['is_wa44'].patchValue(false)
    this.trainingForm.controls['is_wa48'].patchValue(false)
    this.trainingForm.controls['is_wa52'].patchValue(false)
    this.trainingForm.controls['is_wa54'].patchValue(false)
    this.trainingForm.controls['is_waa41'].patchValue(false)
    this.trainingForm.controls['is_waa44'].patchValue(false)

    this.selectedSch = []
  }

  onRemoveTargetGrp($event) {
    let remove = $event['value']['form']
    // console.log('remove ', remove)
    this.trainingForm.controls[remove].patchValue(false)
    let groupD = [
      'is_ha11',
      'is_ha14',
      'is_ha16',
      'is_kp11',
      'is_kp14',
      'is_na01',
      'is_na11',
      'is_na14',
      'is_ra01',
      'is_ra03',
      'is_ua11',
      'is_ua14',
      'is_vu06',
      'is_vu07',
    ]
    let groupC = [
      'is_ba19',
      'is_ga29',
      'is_ft19',
      'is_fa29',
      'is_ga17',
      'is_ga19',
      'is_ga22',
      'is_ga26',
      'is_ha19',
      'is_ha22',
      'is_ja19',
      'is_ja22',
      'is_kp19',
      'is_kp22',
      'is_na17',
      'is_na19',
      'is_na22',
      'is_na26',
      'is_ua17',
      'is_ua19',
      'is_ua24',
      'is_wa17',
      'is_wa19',
      'is_wa22',
      'is_wa26',
    ]
    let groupB = [
      'is_fa32',
      'is_ga29',
      'is_ga32',
      'is_ja29',
      'is_ja36',
      'is_ja38',
      'is_ja40',
      'is_kp29',
      'is_kp32',
      'is_la29',
      'is_na26',
      'is_na29',
      'is_na30',
      'is_na32',
      'is_na36',
      'is_ua29',
      'is_ua32',
      'is_ua36',
      'is_wa28',
      'is_wa29',
      'is_wa32',
      'is_wa36'
    ]
    let groupA = [
      'is_fa41',
      'is_fa44',
      'is_fa48',
      'is_ga41',
      'is_gv41',
      'is_ja41',
      'is_ja44',
      'is_ja48',
      'is_ja52',
      'is_ja54',
      'is_kp41',
      'is_la41',
      'is_la44',
      'is_la52',
      'is_la54',
      'is_na41',
      'is_na44',
      'is_na48',
      'is_na52',
      'is_na54',
      'is_ua41',
      'is_ud43',
      'is_ud48',
      'is_ud52',
      'is_wa41',
      'is_wa44',
      'is_wa48',
      'is_wa52',
      'is_wa54',
      'is_waa41',
      'is_waa44'
    ]

    if (remove == 'is_group_KP_D') {
      this.trainingForm.controls['is_ha11'].patchValue(false)
      this.trainingForm.controls['is_ha14'].patchValue(false)
      this.trainingForm.controls['is_ha16'].patchValue(false)
      this.trainingForm.controls['is_kp11'].patchValue(false)
      this.trainingForm.controls['is_kp14'].patchValue(false)
      this.trainingForm.controls['is_na01'].patchValue(false)
      this.trainingForm.controls['is_na11'].patchValue(false)
      this.trainingForm.controls['is_na14'].patchValue(false)
      this.trainingForm.controls['is_ra01'].patchValue(false)
      this.trainingForm.controls['is_ra03'].patchValue(false)
      this.trainingForm.controls['is_ua11'].patchValue(false)
      this.trainingForm.controls['is_ua14'].patchValue(false)
      this.trainingForm.controls['is_vu06'].patchValue(false)
      this.trainingForm.controls['is_vu07'].patchValue(false)

      groupD.forEach(
        (grp_sch) => {
          this.selectedSch = this.selectedSch.filter(sch => sch !== grp_sch )
        }
      )
    }
    else if (remove == 'is_group_KP_C') {
      this.trainingForm.controls['is_ba19'].patchValue(false)
      this.trainingForm.controls['is_ga29'].patchValue(false)
      this.trainingForm.controls['is_ft19'].patchValue(false)
      this.trainingForm.controls['is_fa29'].patchValue(false)
      this.trainingForm.controls['is_ga17'].patchValue(false)
      this.trainingForm.controls['is_ga19'].patchValue(false)
      this.trainingForm.controls['is_ga22'].patchValue(false)
      this.trainingForm.controls['is_ga26'].patchValue(false)
      this.trainingForm.controls['is_ha19'].patchValue(false)
      this.trainingForm.controls['is_ha22'].patchValue(false)
      this.trainingForm.controls['is_ja19'].patchValue(false)
      this.trainingForm.controls['is_ja22'].patchValue(false)
      this.trainingForm.controls['is_kp19'].patchValue(false)
      this.trainingForm.controls['is_kp22'].patchValue(false)
      this.trainingForm.controls['is_na17'].patchValue(false)
      this.trainingForm.controls['is_na19'].patchValue(false)
      this.trainingForm.controls['is_na22'].patchValue(false)
      this.trainingForm.controls['is_na26'].patchValue(false)
      this.trainingForm.controls['is_ua17'].patchValue(false)
      this.trainingForm.controls['is_ua19'].patchValue(false)
      this.trainingForm.controls['is_ua24'].patchValue(false)
      this.trainingForm.controls['is_wa17'].patchValue(false)
      this.trainingForm.controls['is_wa19'].patchValue(false)
      this.trainingForm.controls['is_wa22'].patchValue(false)
      this.trainingForm.controls['is_wa26'].patchValue(false)

      groupC.forEach(
        (grp_sch) => {
          this.selectedSch = this.selectedSch.filter(sch => sch !== grp_sch )
        }
      )
    }
    else if (remove == 'is_group_KP_B') {
      this.trainingForm.controls['is_fa32'].patchValue(false)
      this.trainingForm.controls['is_ga29'].patchValue(false)
      this.trainingForm.controls['is_ga32'].patchValue(false)
      this.trainingForm.controls['is_ja29'].patchValue(false)
      this.trainingForm.controls['is_ja36'].patchValue(false)
      this.trainingForm.controls['is_ja38'].patchValue(false)
      this.trainingForm.controls['is_ja40'].patchValue(false)
      this.trainingForm.controls['is_kp29'].patchValue(false)
      this.trainingForm.controls['is_kp32'].patchValue(false)
      this.trainingForm.controls['is_la29'].patchValue(false)
      this.trainingForm.controls['is_na26'].patchValue(false)
      this.trainingForm.controls['is_na29'].patchValue(false)
      this.trainingForm.controls['is_na30'].patchValue(false)
      this.trainingForm.controls['is_na32'].patchValue(false)
      this.trainingForm.controls['is_na36'].patchValue(false)
      this.trainingForm.controls['is_ua29'].patchValue(false)
      this.trainingForm.controls['is_ua32'].patchValue(false)
      this.trainingForm.controls['is_ua36'].patchValue(false)
      this.trainingForm.controls['is_wa28'].patchValue(false)
      this.trainingForm.controls['is_wa29'].patchValue(false)
      this.trainingForm.controls['is_wa32'].patchValue(false)
      this.trainingForm.controls['is_wa36'].patchValue(false)

      groupB.forEach(
        (grp_sch) => {
          this.selectedSch = this.selectedSch.filter(sch => sch !== grp_sch )
        }
      )
    }
    else if (remove == 'is_group_KP_A') {
      this.trainingForm.controls['is_fa41'].patchValue(false)
      this.trainingForm.controls['is_fa44'].patchValue(false)
      this.trainingForm.controls['is_fa48'].patchValue(false)
      this.trainingForm.controls['is_ga41'].patchValue(false)
      this.trainingForm.controls['is_gv41'].patchValue(false)
      this.trainingForm.controls['is_ja41'].patchValue(false)
      this.trainingForm.controls['is_ja44'].patchValue(false)
      this.trainingForm.controls['is_ja48'].patchValue(false)
      this.trainingForm.controls['is_ja52'].patchValue(false)
      this.trainingForm.controls['is_ja54'].patchValue(false)
      this.trainingForm.controls['is_kp41'].patchValue(false)
      this.trainingForm.controls['is_la41'].patchValue(false)
      this.trainingForm.controls['is_la44'].patchValue(false)
      this.trainingForm.controls['is_la52'].patchValue(false)
      this.trainingForm.controls['is_la54'].patchValue(false)
      this.trainingForm.controls['is_na41'].patchValue(false)
      this.trainingForm.controls['is_na44'].patchValue(false)
      this.trainingForm.controls['is_na48'].patchValue(false)
      this.trainingForm.controls['is_na52'].patchValue(false)
      this.trainingForm.controls['is_na54'].patchValue(false)
      this.trainingForm.controls['is_ua41'].patchValue(false)
      this.trainingForm.controls['is_ud43'].patchValue(false)
      this.trainingForm.controls['is_ud48'].patchValue(false)
      this.trainingForm.controls['is_ud52'].patchValue(false)
      this.trainingForm.controls['is_wa41'].patchValue(false)
      this.trainingForm.controls['is_wa44'].patchValue(false)
      this.trainingForm.controls['is_wa48'].patchValue(false)
      this.trainingForm.controls['is_wa52'].patchValue(false)
      this.trainingForm.controls['is_wa54'].patchValue(false)
      this.trainingForm.controls['is_waa41'].patchValue(false)
      this.trainingForm.controls['is_waa44'].patchValue(false)

      groupA.forEach(
        (grp_sch) => {
          this.selectedSch = this.selectedSch.filter(sch => sch !== grp_sch )
        }
      )
    }
  }

  // Jabatan sasaram
  onAddTargetDep($event) {
    let add = $event['form']
    // console.log('add ', add)
    this.trainingForm.controls[add].patchValue(true)
  }

  onClearTargetDep($event) {
    let clear = $event
    this.targetDepOpts.forEach(
      (target) => {
        this.trainingForm.controls[target['form']].patchValue(false)
      }
    )
  }

  onRemoveTargetDep($event) {
    let remove = $event['value']['form']
    // console.log('remove ', remove)
    this.trainingForm.controls[remove].patchValue(false)
  }

  // Jawatan sasaran
  onAddTargetPos($event) {
    let add = $event['form']
    // console.log('add ', add)
    this.trainingForm.controls[add].patchValue(true)
  }

  onClearTargetPos($event) {
    let clear = $event
    this.targetPosOpts.forEach(
      (target) => {
        this.trainingForm.controls[target['form']].patchValue(false)
      }
    )
  }

  onRemoveTargetPos($event) {
    let remove = $event['value']['form']
    // console.log('remove ', remove)
    this.trainingForm.controls[remove].patchValue(false)
  }

  // Skema sasaran
  onAddTargetSch($event) {
    let add = $event['form']
    let grade = add.slice(-2)
    // console.log('add ', add)
    this.trainingForm.controls[add].patchValue(true)
    if (Number(grade) >= 1 && Number(grade) <= 16) {
      if (
        this.trainingForm.value['is_ha11'] == true &&
        this.trainingForm.value['is_ha14'] == true &&
        this.trainingForm.value['is_ha16'] == true &&
        this.trainingForm.value['is_kp11'] == true &&
        this.trainingForm.value['is_kp14'] == true &&
        this.trainingForm.value['is_na01'] == true &&
        this.trainingForm.value['is_na11'] == true &&
        this.trainingForm.value['is_na14'] == true &&
        this.trainingForm.value['is_ra01'] == true &&
        this.trainingForm.value['is_ra03'] == true &&
        this.trainingForm.value['is_ua11'] == true &&
        this.trainingForm.value['is_ua14'] == true &&
        this.trainingForm.value['is_vu06'] == true &&
        this.trainingForm.value['is_vu07'] == true 
      ) {
        this.trainingForm.controls['is_group_KP_D'].patchValue(true)
        this.selectedGrp.push('is_group_KP_D')
      }
    }
    else if (Number(grade) >= 17 && Number(grade) <= 26) {
      if (
        this.trainingForm.value['is_ba19'] == true &&
        this.trainingForm.value['is_ga29'] == true &&
        this.trainingForm.value['is_ft19'] == true &&
        this.trainingForm.value['is_ga17'] == true &&
        this.trainingForm.value['is_ga19'] == true &&
        this.trainingForm.value['is_ga22'] == true &&
        this.trainingForm.value['is_ga26'] == true &&
        this.trainingForm.value['is_ha19'] == true &&
        this.trainingForm.value['is_ha22'] == true &&
        this.trainingForm.value['is_ja19'] == true &&
        this.trainingForm.value['is_ja22'] == true &&
        this.trainingForm.value['is_kp19'] == true &&
        this.trainingForm.value['is_kp22'] == true &&
        this.trainingForm.value['is_na17'] == true &&
        this.trainingForm.value['is_na19'] == true &&
        this.trainingForm.value['is_na22'] == true &&
        this.trainingForm.value['is_na26'] == true &&
        this.trainingForm.value['is_ua17'] == true &&
        this.trainingForm.value['is_ua19'] == true &&
        this.trainingForm.value['is_ua24'] == true &&
        this.trainingForm.value['is_wa17'] == true &&
        this.trainingForm.value['is_wa19'] == true &&
        this.trainingForm.value['is_wa22'] == true &&
        this.trainingForm.value['is_wa26'] == true
      ) {
        this.trainingForm.controls['is_group_KP_C'].patchValue(true)
        this.selectedGrp.push('is_group_KP_C')
      }
    }
    else if (Number(grade) >= 27 && Number(grade) <= 40) {
      if (
        this.trainingForm.value['is_fa32'] == true &&
        this.trainingForm.value['is_ga29'] == true &&
        this.trainingForm.value['is_ga32'] == true &&
        this.trainingForm.value['is_ja29'] == true &&
        this.trainingForm.value['is_ja36'] == true &&
        this.trainingForm.value['is_ja38'] == true &&
        this.trainingForm.value['is_ja40'] == true &&
        this.trainingForm.value['is_kp29'] == true &&
        this.trainingForm.value['is_kp32'] == true &&
        this.trainingForm.value['is_la29'] == true &&
        this.trainingForm.value['is_na26'] == true &&
        this.trainingForm.value['is_na29'] == true &&
        this.trainingForm.value['is_na30'] == true &&
        this.trainingForm.value['is_na32'] == true &&
        this.trainingForm.value['is_na36'] == true &&
        this.trainingForm.value['is_ua29'] == true &&
        this.trainingForm.value['is_ua32'] == true &&
        this.trainingForm.value['is_ua36'] == true &&
        this.trainingForm.value['is_wa28'] == true &&
        this.trainingForm.value['is_wa29'] == true &&
        this.trainingForm.value['is_wa32'] == true &&
        this.trainingForm.value['is_wa36'] == true
      ) {
        this.trainingForm.controls['is_group_KP_B'].patchValue(true)
        this.selectedGrp.push('is_group_KP_B')
      }
    }
    else if (Number(grade) >= 41) {
      if (        
        this.trainingForm.value['is_fa41'] == true &&
        this.trainingForm.value['is_fa44'] == true &&
        this.trainingForm.value['is_fa48'] == true &&
        this.trainingForm.value['is_ga41'] == true &&
        this.trainingForm.value['is_gv41'] == true &&
        this.trainingForm.value['is_ja41'] == true &&
        this.trainingForm.value['is_ja44'] == true &&
        this.trainingForm.value['is_ja48'] == true &&
        this.trainingForm.value['is_ja52'] == true &&
        this.trainingForm.value['is_ja54'] == true &&
        this.trainingForm.value['is_kp41'] == true &&
        this.trainingForm.value['is_la41'] == true &&
        this.trainingForm.value['is_la44'] == true &&
        this.trainingForm.value['is_la52'] == true &&
        this.trainingForm.value['is_la54'] == true &&
        this.trainingForm.value['is_na41'] == true &&
        this.trainingForm.value['is_na44'] == true &&
        this.trainingForm.value['is_na48'] == true &&
        this.trainingForm.value['is_na52'] == true &&
        this.trainingForm.value['is_na54'] == true &&
        this.trainingForm.value['is_ua41'] == true &&
        this.trainingForm.value['is_ud43'] == true &&
        this.trainingForm.value['is_ud48'] == true &&
        this.trainingForm.value['is_ud52'] == true &&
        this.trainingForm.value['is_wa41'] == true &&
        this.trainingForm.value['is_wa44'] == true &&
        this.trainingForm.value['is_wa48'] == true &&
        this.trainingForm.value['is_wa52'] == true &&
        this.trainingForm.value['is_wa54'] == true &&
        this.trainingForm.value['is_waa41'] == true &&
        this.trainingForm.value['is_waa44'] == true
      ) {
        this.trainingForm.controls['is_group_KP_A'].patchValue(true)
        this.selectedGrp.push('is_group_KP_A')
      }
    }
  }

  onClearTargetSch($event) {
    let clear = $event
    this.targetSchOpts.forEach(
      (target) => {
        this.trainingForm.controls[target['form']].patchValue(false)
      }
    )
    this.trainingForm.controls['is_group_KP_D'].patchValue(false)
    this.trainingForm.controls['is_group_KP_C'].patchValue(false)
    this.trainingForm.controls['is_group_KP_B'].patchValue(false)
    this.trainingForm.controls['is_group_KP_A'].patchValue(false)
    this.selectedGrp = []
  }

  onRemoveTargetSch($event) {
    let remove = $event['value']['form']
    let grade = remove.slice(-2)
    // console.log('remove ', remove)
    this.trainingForm.controls[remove].patchValue(false)
    if (Number(grade) >= 1 && Number(grade) <= 16) {
      this.trainingForm.controls['is_group_KP_D'].patchValue(false)
      this.selectedGrp = this.selectedGrp.filter(grp => grp !== 'is_group_KP_D' )
    }
    else if (Number(grade) >= 17 && Number(grade) <= 26) {
      this.trainingForm.controls['is_group_KP_C'].patchValue(false)
      this.selectedGrp = this.selectedGrp.filter(grp => grp !== 'is_group_KP_C' )
    }
    else if (Number(grade) >= 27 && Number(grade) <= 40) {
      this.trainingForm.controls['is_group_KP_B'].patchValue(false)
      this.selectedGrp = this.selectedGrp.filter(grp => grp !== 'is_group_KP_B' )
    }
    else if (Number(grade) >= 41) {
      this.trainingForm.controls['is_group_KP_A'].patchValue(false)
      this.selectedGrp = this.selectedGrp.filter(grp => grp !== 'is_group_KP_A' )
    }
  }

  removeDups(names) {
    let unique = {};
    names.forEach(function(i) {
      if(!unique[i]) {
        unique[i] = true;
      }
    });
    return Object.keys(unique);
  }
  
  printCertificate() {
    let title = 'Tunggu sebentar'
    let message = 'Sijil sedang dijana'
    this.notifyService.openToastrInfo(title, message)

    this.loadingBar.start()
    let arrayAttendee = []
    this.attendances.forEach((a) => {
      arrayAttendee.push(a.attendee.id) 
    })
    
    let body = {
      training: this.training.id,
      attendees: this.removeDups(arrayAttendee)
    }
    this.certificateService.generateBulk(body).subscribe(
      (res) => {
        res.forEach((obj) => {
          window.open(environment.baseUrl.slice(0, environment.baseUrl.length - 1) + obj.cert, '_blank')
        })
        // let url = window.URL.createObjectURL(res);
        // let a = document.createElement('a');
        // document.body.appendChild(a);
        // a.setAttribute('style', 'display: none');
        // a.href = url;
        // a.download = "Sijil-Kursus-"+moment(new Date()).format('YYYY-MM-DD');
        // a.click();
        // window.URL.revokeObjectURL(url);
        // a.remove();
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {})
    
  }
}
