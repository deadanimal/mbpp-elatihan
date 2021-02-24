import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Form } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Attendance } from './attendances.model';

@Injectable({
  providedIn: 'root'
})
export class AttendancesService {

  // URL
  public urlAttendances: string = environment.baseUrl + 'v1/training-attendees/'

  // Data
  attendance: Attendance
  attendances: Attendance[] = []
  attendancesFiltered: Attendance[] = []

  attendanceQRID: any

  constructor(
    private http: HttpClient
  ) { }

  post(body: Form): Observable<Attendance> {
    return this.http.post<any>(this.urlAttendances, body).pipe(
      tap((res) => {
        this.attendance = res
        // console.log('Attendance: ', this.attendance)
      })
    )
  }

  getAll(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(this.urlAttendances).pipe(
      tap((res) => {
        this.attendances = res
        // console.log('Attendances: ', this.attendances)
      })
    )
  }

  getOne(id: String): Observable<Attendance> {
    let urlTemp = this.urlAttendances + id + '/'
    return this.http.get<Attendance>(urlTemp).pipe(
      tap((res) => {
        this.attendance = res
        // console.log('Attendance: ', this.attendance)
      })
    )
  }

  getAttendances(body: any): Observable<Attendance[]> {
    let urlTemp = this.urlAttendances + 'get_attendances/'
    return this.http.post<Attendance[]>(urlTemp, body).pipe(
      tap((res) => {
        this.attendances = res
        // console.log('Atendances: ', this.attendances)
      })
    )
  }

  update(id: String, body: Form): Observable<Attendance> {
    let urlTemp = this.urlAttendances + id + '/'
    return this.http.put<Attendance>(urlTemp, body).pipe(
      tap((res) => {
        this.attendance = res
        // console.log('Attendance', this.attendance)
      })
    )
  }

  filter(field: String): Observable<Attendance[]> {
    let urlTemp = this.urlAttendances + '?' + field
    return this.http.get<Attendance[]>(urlTemp).pipe(
      tap((res) => {
        this.attendancesFiltered = res
        // console.log('Attendances', this.attendancesFiltered)
      })
    )
  }

  activate(id: string) {
    let urlTemp = this.urlAttendances + id + '/activate/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.attendance = res
        // console.log('Attendance: ', this.attendance)
      })
    )
  }

  deactivate(id: string) {
    let urlTemp = this.urlAttendances + id + '/deactivate/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.attendance = res
        // console.log('Attendance: ', this.attendance)
      })
    )
  }

  getTodayQR(body) {
    let urlTemp = this.urlAttendances + 'check_today/'
    return this.http.post<any>(urlTemp, body).pipe(
      tap((res) => {
        this.attendanceQRID = res
        // console.log('ID: ', this.attendanceQRID)
      })
    )
  }

  signAttendance(id: string) {
    let urlTemp = this.urlAttendances + id + '/sign/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.attendance = res
        // console.log('Attendance: ', this.attendance)
      })
    )
  }

  verify(id: string) {
    let urlTemp = this.urlAttendances + id + '/verify/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.attendance = res
        // console.log('Attendance: ', this.attendance)
      })
    )
  }

  signInCoordinator(id: string) {
    let urlTemp = this.urlAttendances + id + '/sign_coordinator_in/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.attendance = res
        // console.log('Attendance: ', this.attendance)
      })
    )
  }

  signOutCoordinator(id: string) {
    let urlTemp = this.urlAttendances + id + '/sign_coordinator_out/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.attendance = res
        // console.log('Attendance: ', this.attendance)
      })
    )
  }

}
