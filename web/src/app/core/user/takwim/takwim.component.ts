import {
  Component,
  OnInit,
  TemplateRef,
  ElementRef,
  ViewChild
} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import swal from 'sweetalert2';

import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interaction from '@fullcalendar/interaction';

@Component({
  selector: 'app-takwim',
  templateUrl: './takwim.component.html',
  styleUrls: ['./takwim.component.scss']
})
export class TakwimComponent implements OnInit {

  addModal: BsModalRef;
  editModal: BsModalRef;
  @ViewChild('modalAdd') modalAdd: ElementRef;
  @ViewChild('modalEdit') modalEdit: ElementRef;
  default = {
    keyboard: true,
    class: 'modal-dialog-centered modal-secondary'
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

  constructor(
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.initCalendar()
  }

  changeView(newView) {
    this.calendar.changeView(newView);
    currentDate: this.calendar.view.title;
  }

  initCalendar() {
    this.calendar = new Calendar(document.getElementById('calendar'), {
      plugins: [interaction, dayGridPlugin],
      defaultView: 'dayGridMonth',
      selectable: true,
      editable: true,
      events: this.events,
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
      // Add new event
      select: info => {
        this.addModal = this.modalService.show(this.modalAdd, this.default);
        this.startDate = info.startStr;
        this.endDate = info.endStr;
      },
      // Edit calendar event action
      eventClick: ({ event }) => {
        this.eventId = event.id;
        this.eventTitle = event.title;
        this.eventDescription = event.extendedProps.description;
        this.radios = 'bg-danger';
        this.event = event;
        this.editModal = this.modalService.show(this.modalEdit, this.default);
      }
    });
    this.calendar.render();
  }

  getNewEventTitle(e) {
    this.eventTitle = e.target.value;
  }

  getNewEventDescription(e) {
    this.eventDescription = e.target.value;
  }

  addNewEvent() {
    this.events.push({
      title: this.eventTitle,
      start: this.startDate,
      end: this.endDate,
      className: this.radios,
      id: this.events.length
    });
    this.calendar.addEvent({
      title: this.eventTitle,
      start: this.startDate,
      end: this.endDate,
      className: this.radios,
      id: this.events.length
    });
    this.addModal.hide();
    this.radios = 'bg-danger';
    (this.eventTitle = undefined),
      (this.eventDescription = undefined),
      (this.eventId = undefined),
      (this.event = undefined);
  }

  deleteEventSweetAlert() {
    this.editModal.hide();
    swal
      .fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-danger',
        cancelButtonClass: 'btn btn-secondary',
        confirmButtonText: 'Yes, delete it!',
        buttonsStyling: false
      })
      .then(result => {
        if (result.value) {
          this.events = this.events.filter(
            prop => prop.id + '' !== this.eventId
          );
          this.initCalendar();
          swal.fire({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            type: 'success',
            confirmButtonClass: 'btn btn-primary',
            buttonsStyling: false
          });
        }
      });
    this.radios = 'bg-danger';
    (this.eventTitle = undefined),
      (this.eventDescription = undefined),
      (this.eventId = undefined),
      (this.event = undefined);
  }
  
  updateEvent() {
    this.events = this.events.map((prop, key) => {
      if (prop.id + '' === this.eventId + '') {
        return {
          ...prop,
          title: this.eventTitle,
          className: this.radios,
          description: this.eventDescription
        };
      } else {
        return prop;
      }
    });
    this.radios = 'bg-danger';
    (this.eventTitle = undefined),
      (this.eventDescription = undefined),
      (this.eventId = undefined),
      (this.event = undefined);
    this.initCalendar();
    this.editModal.hide();
  }

}
