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
  attendancesReport: any

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
  // for update qr only and will be remove after 
  getTodayQR_hack(body) {
    let urlTemp = this.urlAttendances + 'check_today_hack/'
    return this.http.post<any>(urlTemp, body).pipe(
      tap((res) => {
        this.attendanceQRID = res
        // console.log('ID: ', this.attendanceQRID)
      })
    )
  }

  signAttendance(body) {
    // let urlTemp = this.urlAttendances + id + '/sign/'
    let urlTemp = this.urlAttendances +'sign/'
    return this.http.post<any>(urlTemp, body).pipe(
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

  getDashboardTC(): Observable<any[]> {
    return this.http.get<any[]>(this.urlAttendances + 'get_dashboard_tc').pipe(
      tap((res) => {
        // console.log('Attendances: ', this.attendances)
      })
    )
  }

  getDashboardTC1(): Observable<any[]> {
    return this.http.get<any[]>(this.urlAttendances + 'get_dashboard_tc1').pipe(
      tap((res) => {
        // console.log('Attendances: ', this.attendances)
      })
    )
  }

  getDashboardTC2(): Observable<any[]> {
    return this.http.get<any[]>(this.urlAttendances + 'get_dashboard_tc2').pipe(
      tap((res) => {
        // console.log('Attendances: ', this.attendances)
      })
    )
  }

  getDashboardDC2(body: any): Observable<any[]> {
    return this.http.post<any[]>(this.urlAttendances + 'get_dashboard_dc2/', body).pipe(
      tap((res) => {
        // console.log('Attendances: ', this.attendances)
      })
    )
  }

  getReportAttendanceByDay(training: string): Observable<any[]> {
    let body = {
      training
    }
    return this.http.post<any[]>(this.urlAttendances + 'get_report_attendance_by_day/', body).pipe(
      tap((res) => {
        this.attendancesReport = res
        // console.log('Attendances: ', this.attendances)
      })
    )
  }

}
