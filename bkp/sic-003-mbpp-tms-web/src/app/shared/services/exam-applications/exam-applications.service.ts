import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ExamApplication } from './exam-applications.model';
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
export class ExamApplicationsService {

  // URL
  private urlApplication: string = environment.baseUrl + 'v1/exam-applications/'
  
  // Data
  public applications: ExamApplication[] = []
  public applicationsFiltered:  ExamApplication[] = []

  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) { }

  create(body: Form): Observable<any> {
    return this.http.post<any>(this.urlApplication, body).pipe(
      tap((res) => {
        console.log('Create exam application response: ', res)
      })
    )
  }

  get(): Observable<ExamApplication[]> {
    return this.http.get<ExamApplication[]>(this.urlApplication).pipe(
      tap((res) => {
        this.applications = res
        console.log('Exam applications: ', this.applications)
      })
    )
  }

  update(body: Form, id): Observable<any> {
    let updateUrl = this.urlApplication + id  + '/'
    return this.http.put<ExamApplication>(updateUrl, body).pipe(
      tap((res) => {
        console.log('Updated exam application: ', res)
      })
    )
  }

  getOne(id: string): Observable<ExamApplication> {
    let getOneUrl = this.urlApplication + id + '/' 
    return this.http.get<ExamApplication>(getOneUrl).pipe(
      tap((res) => {
        console.log('Exam application: ', res)
      })
    )
  }

  filter(filterField): Observable<any> {
    let filterUrl = this.urlApplication + '?' + filterField + '/'
    return this.http.get<ExamApplication[]>(filterUrl).pipe(
      tap((res) => {
        this.applicationsFiltered = res
        console.log('Filtered exam applications: ', this.applicationsFiltered)
      })
    )
  }

}
