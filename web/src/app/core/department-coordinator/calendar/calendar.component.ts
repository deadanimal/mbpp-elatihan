import {
  Component,
  OnInit,
  TemplateRef,
  ElementRef,
  ViewChild
} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import * as moment from 'moment';
import swal from 'sweetalert2';

import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interaction from '@fullcalendar/interaction';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { TrainingsService } from 'src/app/shared/services/trainings/trainings.service';
import { TrainingExtended } from 'src/app/shared/services/trainings/trainings.model';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { ApplicationsService } from 'src/app/shared/services/applications/applications.service';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  // Data
  trainings: TrainingExtended[] = []
  selectedTraining: any

  // Calendar
  viewModal: BsModalRef;
  @ViewChild('modalView') modalView: ElementRef;
  default = {
    keyboard: true,
    class: 'modal-dialog-centered modal-secondary modal-lg'
  };
  radios = 'bg-danger';
  eventTitle = undefined;
  eventDescription;
  eventId;
  event;
  startDate;
  endDate;
  calendar;
  today = new Date();
  y = this.today.getFullYear();
  m = this.today.getMonth();
  d = this.today.getDate();
  events = []
  dateToday

  // Form
  applyForm: FormGroup

  // Checker
  isApplied: boolean = false

  constructor(
    private applicationService: ApplicationsService,
    private trainingService: TrainingsService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private loadingBar: LoadingBarService,
    private notifyService: NotifyService,
    private router: Router
  ) { }

  ngOnInit() {
    // this.initCalendar()
    this.getData()
    this.initForm()
    this.dateToday = moment().format('YYYY-MM-DD')
    // console.log(this.dateToday)
  }

  getData() {
    this.loadingBar.start()
    this.trainingService.getDepartmentList().subscribe(
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.loadingBar.complete()
      },
      () => {
        this.trainings = this.trainingService.trainingsExtended
        this.trainings.forEach(
          (training: TrainingExtended) => {
            training['start'] = training['start_date']
            training['end'] = training['end_date']
            training['allDay'] = true
            training['className'] = 'bg-orange'
            if (training['organiser_type'] == 'DD') {
              training['className'] = 'bg-green'
            }
            else if (training['organiser_type'] == 'LL') {
              training['className'] = 'bg-blue'
            }
          }
        )
        this.initCalendar()
      }
    )
  }

  initForm() {
    this.applyForm = this.fb.group({
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
  }

  changeView(newView) {
    this.calendar.changeView(newView);
    currentDate: this.calendar.view.title;
  }

  initCalendar() {
    if (this.calendar) {
      delete this.calendar
    }
    this.calendar = new Calendar(document.getElementById('calendar'), {
      plugins: [interaction, dayGridPlugin],
      defaultView: 'dayGridMonth',
      selectable: true,
      editable: true,
      events: this.trainings,
      header: {
        left:   '',
        center: 'title',
        right:  ''
      },
      locale: 'ms',
      views: {
        month: {
          titleFormat: { month: 'long', year: 'numeric' }
        },
        agendaWeek: {
          titleFormat: { month: 'long', year: 'numeric', day: 'numeric' }
        },
        agendaDay: {
          titleFormat: { month: 'short', year: 'numeric', day: 'numeric' }
        }
      },
      // Edit calendar event action
      eventClick: ({ event }) => {
        this.eventId = event.id;
        this.eventTitle = event.title;
        this.eventDescription = event.extendedProps.description;
        this.radios = 'bg-danger';
        this.selectedTraining = event
        // console.log('aa', this.selectedTraining)
        this.viewModal = this.modalService.show(this.modalView, this.default);
      }
    });
    this.calendar.render();
  }

  closeModal() {
    this.viewModal.hide()
    delete this.selectedTraining
    this.isApplied = false
  }

  viewInformation(id) {
    let path = '/dc/trainings/information'
    let extras = id
    let queryParams = {
      queryParams: {
        id: extras
      }
    }
    this.router.navigate([path], queryParams)
    this.closeModal()
  }

}
