import {
  Component,
  OnInit,
  TemplateRef,
  ElementRef,
  ViewChild
} from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import swal from "sweetalert2";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interaction from "@fullcalendar/interaction";
import * as moment from 'moment';
//import { KursusService } from 'src/app/shared/services/kursus/kursus.service';

@Component({
  selector: 'app-takwim-latihan',
  templateUrl: './takwim-latihan.component.html',
  styleUrls: ['./takwim-latihan.component.scss']
})
export class TakwimLatihanComponent implements OnInit {

  addModal: BsModalRef;
  editModal: BsModalRef;
  viewModal: BsModalRef
  
  @ViewChild("modalAdd", { static: false }) modalAdd: ElementRef;
  @ViewChild("modalEdit", { static: false }) modalEdit: ElementRef;
  @ViewChild("modalView", { static: false }) modalView: ElementRef

  default = {
    keyboard: true,
    class: "modal-dialog-centered modal-secondary"
  };
  radios = "bg-danger";
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
  
  events = [
    {
      id: 0,
      title: "Lunch meeting",
      start: "2018-11-21",
      end: "2018-11-22",
      className: "bg-orange"
    },
    {
      id: 1,
      title: "Kursus Jati Diri",
      start: new Date(this.y, this.m, 1),
      allDay: true,
      className: "bg-red",
      description:
        "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
    },

    {
      id: 2,
      title: "Kursus Mengenali Diri",
      start: new Date(this.y, this.m, this.d - 1, 10, 30),
      allDay: true,
      className: "bg-orange",
      description:
        "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
    },

    {
      id: 3,
      title: "Kursus Microsoft Office",
      start: new Date(this.y, this.m, this.d + 7, 12, 0),
      allDay: true,
      className: "bg-green",
      description:
        "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
    },

    {
      id: 4,
      title: "Kursus PHP",
      start: new Date(this.y, this.m, this.d - 2),
      allDay: true,
      className: "bg-blue",
      description:
        "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
    },

    {
      id: 5,
      title: "Kursus HTML",
      start: new Date(this.y, this.m, this.d + 1, 19, 0),
      allDay: true,
      className: "bg-red",
      description:
        "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
    },

    {
      id: 6,
      title: "Kursus Database",
      start: new Date(this.y, this.m, 21),
      allDay: true,
      className: "bg-warning",
      description:
        "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
    },

    {
      id: 7,
      title: "Kursus Python",
      start: new Date(this.y, this.m, 21),
      allDay: true,
      className: "bg-purple",
      description:
        "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
    },

    {
      id: 8,
      title: "Kursus Transformasi Minda",
      start: new Date(this.y, this.m, 19),
      allDay: true,
      className: "bg-red",
      description:
        "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
    },

    {
      id: 9,
      title: "Belajar Fotografi",
      start: new Date(this.y, this.m, 23),
      allDay: true,
      className: "bg-blue",
      description:
        "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
    },

    {
      id: 10,
      title: "Mengenali Diri Anda dengan Lebih Baik",
      start: new Date(this.y, this.m, 2),
      allDay: true,
      className: "bg-yellow",
      description:
        "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
    }
  ];


  // 2502020
  totalApplied: number
  targetGroup: string // terbuka semua benda tu

  constructor(
    //public restServ: KursusService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    //this.restServ.retrieveKursus()
    this.initCalendar()
  }

  changeView(newView) {
    this.calendar.changeView(newView)
    currentDate: this.calendar.view.title
  }

  initCalendar() {
    this.calendar = new Calendar(document.getElementById("calendar"), {
      plugins: [interaction, dayGridPlugin],
      header: {
        center: 'title',
      },
      defaultView: "dayGridMonth",
      selectable: true,
      editable: false,
      events: this.events,
      locale: 'ms',
      views: {
        month: {
          titleFormat: { month: "long", year: "numeric" }
        },
        agendaWeek: {
          titleFormat: { month: "long", year: "numeric", day: "numeric" }
        },
        agendaDay: {
          titleFormat: { month: "short", year: "numeric", day: "numeric" }
        }
      },
      // Edit calendar event action
      eventClick: ({ event }) => {
        this.eventId = event.id;
        this.eventTitle = event.title;
        this.eventDescription = event.extendedProps.description;
        this.radios = "bg-danger";
        this.event = event;
        this.viewModal = this.modalService.show(this.modalView, this.default)
        //this.editModal = this.modalService.show(this.modalEdit, this.default);
      }
    });
    //Display Current Date as Calendar widget header
    moment.locale('ms-my'); 
    var mYear = moment().format("YYYY");
    var mDay = moment().format("dddd, MMM D");
    document.getElementsByClassName(
      "widget-calendar-year"
    )[0].innerHTML = mYear;
    document.getElementsByClassName("widget-calendar-day")[0].innerHTML = mDay;
    this.calendar.render();
  }

  getNewEventTitle(e) {
    this.eventTitle = e.target.value
  }

  getNewEventDescription(e) {
    this.eventDescription = e.target.value
  }

  applyTraining() {
    console.log('Applying training..')
    this.viewModal.hide()
    swal.fire({
      title: "Adakah anda pasti untuk memohon kursus ini?",
      text: "Permohonan anda akan dihantar kepada Penyelaras Latihan",
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: "btn btn-primary",
      cancelButtonClass: "btn btn-secondary",
      confirmButtonText: "Pasti",
      cancelButtonText: "Batal",
      buttonsStyling: false
    })
    .then(result => {
      swal.fire({
        title: "Berjaya!",
        text: "Permohonan anda telah berjaya dihantar.",
        type: "success",
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: false
      })
    })
  }

}
