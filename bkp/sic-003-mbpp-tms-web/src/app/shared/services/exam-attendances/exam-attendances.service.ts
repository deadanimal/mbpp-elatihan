import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ExamAttendance } from './exam-attendances.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Form } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '../../handler/jwt/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class ExamAttendancesService {

  // URL
  private urlAttendance: string = environment.baseUrl + 'v1/exam-attendances/'
  
  // Data
  public attendances: ExamAttendance[] = []
  public attendancesFiltered:  ExamAttendance[] = []

  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) { }

  create(body: Form): Observable<any> {
    return this.http.post<any>(this.urlAttendance, body).pipe(
      tap((res) => {
        console.log('Create exam attendance response: ', res)
      })
    )
  }

  get(): Observable<ExamAttendance[]> {
    return this.http.get<ExamAttendance[]>(this.urlAttendance).pipe(
      tap((res) => {
        this.attendances = res
        console.log('Exam attendances: ', this.attendances)
      })
    )
  }

  update(body: Form, id): Observable<any> {
    let updateUrl = this.urlAttendance + id  + '/'
    return this.http.put<ExamAttendance>(updateUrl, body).pipe(
      tap((res) => {
        console.log('Updated exam attendance: ', res)
      })
    )
  }

  getOne(id: string): Observable<ExamAttendance[]> {
    let getOneUrl = this.urlAttendance + id + '/'
    return this.http.get<ExamAttendance[]>(this.urlAttendance).pipe(
      tap((res) => {
        console.log('Exam attendances: ', res)
      })
    )
  }

  filter(filterField): Observable<any> {
    let filterUrl = this.urlAttendance + '?' + filterField + '/'
    return this.http.get<ExamAttendance[]>(filterUrl).pipe(
      tap((res) => {
        this.attendancesFiltered = res
        console.log('Filtered exam attendances: ', this.attendancesFiltered)
      })
    )
  }

}
