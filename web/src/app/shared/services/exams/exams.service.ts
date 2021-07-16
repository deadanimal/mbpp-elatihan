import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Form } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { 
  Exam, 
  ExamExtended, 
  ExamAttendee, 
  ExamAttendeeExtended 
} from './exams.model';

@Injectable({
  providedIn: 'root'
})
export class ExamsService {

  // URL
  public urlExams: string = environment.baseUrl + 'v1/exams/'
  public urlAttendees: string = environment.baseUrl + 'v1/exam-attendees/'

  // Data
  exam: Exam
  examExtended: ExamExtended
  exams: Exam[] = []
  examsExtended: ExamExtended[] = []
  attendee: ExamAttendee
  attendeeExtended: ExamAttendeeExtended
  attendees: ExamAttendeeExtended[] = []
  statistic: any

  constructor(
    private http: HttpClient
  ) { }

  createExam(body: any): Observable<Exam> {
    return this.http.post<any>(this.urlExams, body).pipe(
      tap((res) => {
        this.exam = res
        // console.log('Exam: ', this.exam)
      })
    )
  }

  getExamList(): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.urlExams).pipe(
      tap((res) => {
        this.exams = res
        // console.log('Exams: ', this.exams)
      })
    )
  }

  getExams(): Observable<ExamExtended[]> {
    let urlTemp = this.urlExams + 'extended_all'
    return this.http.get<ExamExtended[]>(urlTemp).pipe(
      tap((res) => {
        this.examsExtended = res
        // console.log('Exams: ', this.examsExtended)
      })
    )
  }

  getExam(id: string): Observable<ExamExtended> {
    let urlTemp = this.urlExams + id + '/extended'
    return this.http.get<ExamExtended>(urlTemp).pipe(
      tap((res) => {
        this.examExtended = res
        // console.log('Exam: ', this.examExtended)
      })
    )
  }

  updateExam(id: string, body: Form): Observable<Exam> {
    let urlTemp = this.urlExams + id + '/'
    return this.http.patch<Exam>(urlTemp, body).pipe(
      tap((res) => {
        this.exam = res
        // console.log('Exam', this.exam)
      })
    )
  }

  activate(id: string) {
    let urlTemp = this.urlExams + id + '/activate/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.exam = res
        // console.log('Exam: ', this.exam)
      })
    )
  }

  deactivate(id: string) {
    let urlTemp = this.urlExams + id + '/deactivate/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.exam = res
        // console.log('Exam: ', this.exam)
      })
    )
  }

  createAttendee(body: any): Observable<ExamAttendee> {
    return this.http.post<any>(this.urlAttendees, body).pipe(
      tap((res) => {
        this.attendee = res
        // console.log('Attendee: ', this.attendee)
      })
    )
  }

  getAttendees(): Observable<ExamAttendeeExtended[]> {
    let urlTemp = this.urlAttendees + 'extended_all'
    return this.http.get<ExamAttendeeExtended[]>(urlTemp).pipe(
      tap((res) => {
        this.attendees = res
        // console.log('Attendees: ', this.attendees)
      })
    )
  }

  getAttendeesDepartment(): Observable<ExamAttendeeExtended[]> {
    let urlTemp = this.urlAttendees + 'get_department_attendees'
    return this.http.get<ExamAttendeeExtended[]>(urlTemp).pipe(
      tap((res) => {
        this.attendees = res
        // console.log('Attendees: ', this.attendees)
      })
    )
  }

  getAttendee(id: string): Observable<ExamAttendeeExtended> {
    let urlTemp = this.urlAttendees + id + 'extended'
    return this.http.get<ExamAttendeeExtended>(urlTemp).pipe(
      tap((res) => {
        this.attendeeExtended = res
        // console.log('Attendee: ', this.attendeeExtended)
      })
    )
  }

  getSelf(): Observable<ExamAttendeeExtended[]> {
    let urlTemp = this.urlAttendees + 'get_self'
    return this.http.get<ExamAttendeeExtended[]>(urlTemp).pipe(
      tap((res) => {
        this.attendees = res
        // console.log('Attendees: ', this.attendees)
      })
    )
  }

  updateAttendee(id: string, body): Observable<Exam> {
    let urlTemp = this.urlAttendees + id + '/'
    return this.http.patch<Exam>(urlTemp, body).pipe(
      tap((res) => {
        this.exam = res
        // console.log('Attendee', this.exam)
      })
    )
  }

  getStatistics(): Observable<any> {
    let urlTemp = this.urlExams + 'get_statistics'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.statistic = res
        // console.log('Statistics', this.statistic)
      })
    )
  }

  getStatisticsDepartment(): Observable<any> {
    let urlTemp = this.urlExams + 'get_statistics_department'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.statistic = res
        // console.log('Statistics', this.statistic)
      })
    )
  }

}
