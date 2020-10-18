import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TrainingAttendance } from './training-attendances.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Form } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingAttendancesService {

  // URL
  private urlAttendance: string = environment.baseUrl + 'v1/training-attendances/'
  
  // Data
  public attendances: TrainingAttendance[] = []
  public attendancesFiltered: TrainingAttendance[] = []

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  create(credentials: Form): Observable<any> {
    return this.http.post<any>(this.urlAttendance, credentials).pipe(
      tap((res) => {
        console.log('Create training attendance response: ', res)
      })
    )
  }

  get(): Observable<TrainingAttendance[]> {
    return this.http.get<TrainingAttendance[]>(this.urlAttendance).pipe(
      tap((res) => {
        this.attendances = res
        console.log('Training attendances: ', this.attendances)
      })
    )
  }

  update(credentials: Form, id): Observable<any> {
    let updateUrl = this.urlAttendance + id  + '/'
    return this.http.put<TrainingAttendance>(updateUrl, credentials).pipe(
      tap((res) => {
        console.log('Updated training attendance: ', res)
      })
    )
  }

  getOne(id: string): Observable<TrainingAttendance[]> {
    let getOneUrl = this.urlAttendance + id + '/'
    return this.http.get<TrainingAttendance[]>(getOneUrl).pipe(
      tap((res) => {
        console.log('Training attendance: ', res)
      })
    )
  }

  filter(filterField): Observable<any> {
    let filterUrl = this.urlAttendance + '?' + filterField + '/'
    return this.http.get<TrainingAttendance[]>(filterUrl).pipe(
      tap((res) => {
        this.attendancesFiltered = res
        console.log('Filtered training attendances: ', this.attendancesFiltered)
      })
    )
  }

}
