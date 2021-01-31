import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { 
  FormBuilder, 
  FormControl, 
  FormGroup, 
  Validators 
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';


import { Core } from 'src/app/shared/services/cores/cores.model';
import { Organisation } from 'src/app/shared/services/organisations/organisations.model';
import { TrainingExtended, TrainingType } from 'src/app/shared/services/trainings/trainings.model';
import { User } from 'src/app/shared/services/users/users.model';
import { CoresService } from 'src/app/shared/services/cores/cores.service';
import { OrganisationsService } from 'src/app/shared/services/organisations/organisations.service';
import { TrainersService } from 'src/app/shared/services/trainers/trainers.service';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
import { UsersService } from 'src/app/shared/services/users/users.service';

import * as moment from 'moment';
import swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import { AttendanceExtended } from 'src/app/shared/services/attendances/attendances.model';
import { AbsenceMemoExtended } from 'src/app/shared/services/absence-memos/absence-memos.model';
import { Note } from 'src/app/shared/services/notes/notes.model';
import { ApplicationExtended } from 'src/app/shared/services/applications/applications.model';
import { NotesService } from 'src/app/shared/services/notes/notes.service';
import { Domain } from 'src/app/shared/services/domains/domains.model';
import { DomainsService } from 'src/app/shared/services/domains/domains.service';
import { QuillViewHTMLComponent } from 'ngx-quill';

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

  // Data
  trainingID
  training: TrainingExtended
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

  // Form
  trainingForm: FormGroup
  noteForm: FormGroup

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
    { value: 'DT', text: 'Ditangguh'},
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
  
  // Checker
  isApplicationsEmpty: boolean = true
  isAttendancesEmpty: boolean = true
  isAbsencesEmpty: boolean = true
  isNotesEmpty: boolean = true

  // Icon
  iconEmpty = 'assets/img/icons/box.svg'

  // Datepicker
  dateToday: Date
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

  // Quill
  @ViewChild('scheduleNotes', {
    static: true
  }) headerEN: QuillViewHTMLComponent

  constructor(
    private coreService: CoresService,
    private domainService: DomainsService,
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
    private router: Router
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
  }

  getData() {
    this.loadingBar.start() 
    forkJoin([
      this.organisationService.getAll(),
      this.userService.getAll(),
      this.coreService.getAll(),
      this.trainingService.getOne(this.trainingID),
      this.trainingService.getTrainingTypes(),
      this.domainService.getDomains()
    ]).subscribe(
      () => {
        this.training = this.trainingService.trainingExtended
        this.applications = this.training['training_application']
        this.attendances = this.training['training_attendee']
        this.absences = this.training['training_absence_memo']
        this.notes = this.training['training_training_notes']
        this.trainingTypes = this.trainingService.trainingTypes
        this.domains = this.domainService.domains
        this.loadingBar.complete() 
      },
      () => {
        this.loadingBar.complete() 
      },
      () => {
        console.log('Training> ', this.training)
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
        this.trainingForm.controls['start_date'].setValue(moment(this.training['start_date']).format('DD-MM-YYYY'))
        // console.log('After ', this.trainingForm.controls['start_date'])

        this.trainingForm.controls['start_time'].setValue(this.training['start_time'])
        this.trainingForm.controls['end_date'].setValue(moment(this.training['end_date']).format('DD-MM-YYYY'))
        this.trainingForm.controls['end_time'].setValue(this.training['end_time'])
        this.trainingForm.controls['schedule_notes'].setValue(this.training['schedule_notes'])
        this.trainingForm.controls['cost'].setValue(this.training['cost'])
        this.trainingForm.controls['status'].setValue(this.training['status'])
        this.trainingForm.controls['attachment'].setValue(this.training['attachment'])
        this.trainingForm.controls['attachment_approval'].setValue(this.training['attachment_approval'])

        this.noteForm.controls['training'].setValue(this.training['id'])

        this.organisations = this.organisationService.organisations
        this.users = this.userService.users
        this.cores = this.coreService.cores
        this.domains = this.domainService.domains

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
          return {
            ...prop,
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
      attachment: new FormControl(null),
      attachment_approval: new FormControl(null),
      transportation: new FormControl(false, Validators.compose([
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
      note_code: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      note_file: new FormControl(null, Validators.compose([
        Validators.required
      ]))
    })

    // while (!this.isLogged) {
    //   this.currentUser = this.authService.userDetail
    //   if (this.currentUser) {
    //     this.trainingForm.controls['created_by'].setValue(this.currentUser['id'])
    //     this.isLogged = true
    //   }
    //   console.log('asfqw ', this.currentUser)
    // }
    
    // let todayDate = new Date()
    // let startDate = moment(new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 1)).format('DD-MM-YYYY')
    // let endDate = moment(new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 2)).format('DD-MM-YYYY')
    // this.trainingForm.controls['start_date'].setValue(startDate)
    // this.trainingForm.controls['end_date'].setValue(endDate)
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
    let startDate = moment(this.trainingForm.value.start_date, 'DD-MM-YYY').format('YYYY-MM-DD')
    let endDate = moment(this.trainingForm.value.end_date, 'DD-MM-YYY').format('YYYY-MM-DD')
    this.trainingForm.controls['start_date'].setValue(startDate)
    this.trainingForm.controls['end_date'].setValue(endDate)
    // console.log('After ', this.trainingForm.value)

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
    // console.log('add training')
    // console.log('Trainining: ', this.trainingForm.value)
    // console.log('Speaker ', this.trainerSpeakerForm.value)
    // console.log('Faci ', this.trainerFacilitatorForm.value)
    // console.log('Speaker Ar ', this.trainerSpeakerFormArray)
    // console.log('Faci Ar ', this.trainerFacilitatorFormArray)

    this.loadingBar.complete()

    this.trainingService.update(this.training['id'], this.trainingForm.value).subscribe(
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
      this.trainingForm.controls['is_group_KP_A'].patchValue(false)
      this.trainingForm.controls['is_group_KP_B'].patchValue(false)
      this.trainingForm.controls['is_group_KP_C'].patchValue(false)
      this.trainingForm.controls['is_group_KP_D'].patchValue(false)
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
      this.trainingForm.controls['is_ba19'].patchValue(false)
      this.trainingForm.controls['is_fa29'].patchValue(false)
      this.trainingForm.controls['is_fa32'].patchValue(false)
      this.trainingForm.controls['is_fa41'].patchValue(false)
      this.trainingForm.controls['is_fa44'].patchValue(false)
      this.trainingForm.controls['is_fa48'].patchValue(false)
      this.trainingForm.controls['is_ft19'].patchValue(false)
      this.trainingForm.controls['is_ga17'].patchValue(false)
      this.trainingForm.controls['is_ga19'].patchValue(false)
      this.trainingForm.controls['is_ga22'].patchValue(false)
      this.trainingForm.controls['is_ga26'].patchValue(false)
      this.trainingForm.controls['is_ga29'].patchValue(false)
      this.trainingForm.controls['is_ga32'].patchValue(false)
      this.trainingForm.controls['is_ga41'].patchValue(false)
      this.trainingForm.controls['is_gv41'].patchValue(false)
      this.trainingForm.controls['is_ha11'].patchValue(false)
      this.trainingForm.controls['is_ha14'].patchValue(false)
      this.trainingForm.controls['is_ha16'].patchValue(false)
      this.trainingForm.controls['is_ha19'].patchValue(false)
      this.trainingForm.controls['is_ha22'].patchValue(false)
      this.trainingForm.controls['is_ja19'].patchValue(false)
      this.trainingForm.controls['is_ja22'].patchValue(false)
      this.trainingForm.controls['is_ja29'].patchValue(false)
      this.trainingForm.controls['is_ja36'].patchValue(false)
      this.trainingForm.controls['is_ja38'].patchValue(false)
      this.trainingForm.controls['is_ja40'].patchValue(false)
      this.trainingForm.controls['is_ja41'].patchValue(false)
      this.trainingForm.controls['is_ja44'].patchValue(false)
      this.trainingForm.controls['is_ja48'].patchValue(false)
      this.trainingForm.controls['is_ja52'].patchValue(false)
      this.trainingForm.controls['is_ja54'].patchValue(false)
      this.trainingForm.controls['is_kp11'].patchValue(false)
      this.trainingForm.controls['is_kp14'].patchValue(false)
      this.trainingForm.controls['is_kp19'].patchValue(false)
      this.trainingForm.controls['is_kp22'].patchValue(false)
      this.trainingForm.controls['is_kp29'].patchValue(false)
      this.trainingForm.controls['is_kp32'].patchValue(false)
      this.trainingForm.controls['is_kp41'].patchValue(false)
      this.trainingForm.controls['is_la29'].patchValue(false)
      this.trainingForm.controls['is_la41'].patchValue(false)
      this.trainingForm.controls['is_la44'].patchValue(false)
      this.trainingForm.controls['is_la52'].patchValue(false)
      this.trainingForm.controls['is_la54'].patchValue(false)
      this.trainingForm.controls['is_na01'].patchValue(false)
      this.trainingForm.controls['is_na11'].patchValue(false)
      this.trainingForm.controls['is_na14'].patchValue(false)
      this.trainingForm.controls['is_na17'].patchValue(false)
      this.trainingForm.controls['is_na19'].patchValue(false)
      this.trainingForm.controls['is_na22'].patchValue(false)
      this.trainingForm.controls['is_na26'].patchValue(false)
      this.trainingForm.controls['is_na29'].patchValue(false)
      this.trainingForm.controls['is_na30'].patchValue(false)
      this.trainingForm.controls['is_na32'].patchValue(false)
      this.trainingForm.controls['is_na36'].patchValue(false)
      this.trainingForm.controls['is_na41'].patchValue(false)
      this.trainingForm.controls['is_na44'].patchValue(false)
      this.trainingForm.controls['is_na48'].patchValue(false)
      this.trainingForm.controls['is_na52'].patchValue(false)
      this.trainingForm.controls['is_na54'].patchValue(false)
      this.trainingForm.controls['is_ra01'].patchValue(false)
      this.trainingForm.controls['is_ra03'].patchValue(false)
      this.trainingForm.controls['is_ua11'].patchValue(false)
      this.trainingForm.controls['is_ua14'].patchValue(false)
      this.trainingForm.controls['is_ua17'].patchValue(false)
      this.trainingForm.controls['is_ua19'].patchValue(false)
      this.trainingForm.controls['is_ua24'].patchValue(false)
      this.trainingForm.controls['is_ua29'].patchValue(false)
      this.trainingForm.controls['is_ua32'].patchValue(false)
      this.trainingForm.controls['is_ua36'].patchValue(false)
      this.trainingForm.controls['is_ua41'].patchValue(false)
      this.trainingForm.controls['is_ud43'].patchValue(false)
      this.trainingForm.controls['is_ud48'].patchValue(false)
      this.trainingForm.controls['is_ud52'].patchValue(false)
      this.trainingForm.controls['is_vu06'].patchValue(false)
      this.trainingForm.controls['is_vu07'].patchValue(false)
      this.trainingForm.controls['is_wa17'].patchValue(false)
      this.trainingForm.controls['is_wa19'].patchValue(false)
      this.trainingForm.controls['is_wa22'].patchValue(false)
      this.trainingForm.controls['is_wa26'].patchValue(false)
      this.trainingForm.controls['is_wa28'].patchValue(false)
      this.trainingForm.controls['is_wa29'].patchValue(false)
      this.trainingForm.controls['is_wa32'].patchValue(false)
      this.trainingForm.controls['is_wa36'].patchValue(false)
      this.trainingForm.controls['is_wa41'].patchValue(false)
      this.trainingForm.controls['is_wa44'].patchValue(false)
      this.trainingForm.controls['is_wa48'].patchValue(false)
      this.trainingForm.controls['is_wa52'].patchValue(false)
      this.trainingForm.controls['is_wa54'].patchValue(false)
      this.trainingForm.controls['is_waa41'].patchValue(false)
      this.trainingForm.controls['is_waa44'].patchValue(false)
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
        if (type == 'notes') {
          this.noteForm.controls['note_file'].setValue(file)
          this.fileSizeInformation = this.fileSize
          this.fileNameInformation = this.fileName
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

  verifyAbsence(row) {

  }

  verifyAttendance(row) {

  }

  approveApplication(row) {
    
  }

  navigatePage(path: string) {
    // console.log(path)
    this.router.navigate([path])
  }

  viewForm() {
    console.log('form: ', this.trainingForm.value)
  }
  

}
