import {
  Component,
  OnInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interaction from "@fullcalendar/interaction";
import * as moment from 'moment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

// import { Events } from '../../../../../assets/mock/penyelaras/pelan-operasi';

@Component({
  selector: 'app-pelan-operasi',
  templateUrl: './pelan-operasi.component.html',
  styleUrls: ['./pelan-operasi.component.scss']
})
export class PelanOperasiComponent implements OnInit {

  // Modal
  addModal: BsModalRef;
  editModal: BsModalRef;
  viewModal: BsModalRef;

  @ViewChild("modalView", { static: false }) modalView: ElementRef;

  default = {
    keyboard: true,
    class: "modal-dialog-centered modal-secondary"
  };

  // Calendar
  eventTitle = undefined
  radios = "bg-danger";
  eventDescription
  eventId
  event
  startDate
  endDate
  calendar
  today = new Date()
  y = this.today.getFullYear()
  m = this.today.getMonth()
  d = this.today.getDate()

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
      title: "Jati Diri",
      start: new Date(this.y, this.m, 1),
      allDay: true,
      className: "bg-red",
      description:
        "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
    },

    {
      id: 2,
      title: "Microsoft Office",
      start: new Date(this.y, this.m, this.d - 1, 10, 30),
      allDay: true,
      className: "bg-orange",
      description:
        "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
    },

    {
      id: 3,
      title: "Leadership",
      start: new Date(this.y, this.m, this.d + 7, 12, 0),
      allDay: true,
      className: "bg-green",
      description:
        "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
    },

    {
      id: 4,
      title: "Teambuilding",
      start: new Date(this.y, this.m, this.d - 2),
      allDay: true,
      className: "bg-blue",
      description:
        "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
    },

    {
      id: 5,
      title: "Training Berjaya Bersama",
      start: new Date(this.y, this.m, this.d + 1, 19, 0),
      allDay: true,
      className: "bg-red",
      description:
        "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
    },

    {
      id: 6,
      title: "Workshop Penggunaan Kamera DSLR",
      start: new Date(this.y, this.m, 21),
      allDay: true,
      className: "bg-warning",
      description:
        "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
    },

    {
      id: 7,
      title: "Kursus Media Sosial",
      start: new Date(this.y, this.m, 21),
      allDay: true,
      className: "bg-purple",
      description:
        "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
    },

    {
      id: 8,
      title: "Kursus Meningkatkan Soft Skill",
      start: new Date(this.y, this.m, 19),
      allDay: true,
      className: "bg-red",
      description:
        "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
    },

    {
      id: 9,
      title: "Kursus Pengurusan Diri",
      start: new Date(this.y, this.m, 23),
      allDay: true,
      className: "bg-blue",
      description:
        "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
    },

    {
      id: 10,
      title: "Kursus Pengurusan Stres",
      start: new Date(this.y, this.m, 2),
      allDay: true,
      className: "bg-yellow",
      description:
        "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
    }
  ]

  constructor(
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.initCalendar()
  }

  changeView(newView) {
    this.calendar.changeView(newView)
    currentDate: this.calendar.view.title
  }

  initCalendar() {
    this.calendar = new Calendar(document.getElementById("calendar"), {
      plugins: [interaction, dayGridPlugin],
      defaultView: "dayGridMonth",
      selectable: true,
      editable: false,
      events: this.events,
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
    this.calendar.render();
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
    this.eventTitle = e.target.value;
  }

  getNewEventDescription(e) {
    this.eventDescription = e.target.value;
  }

}
