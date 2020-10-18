import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Exam } from './exams.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Form } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExamsService {

  // URL
  private examsUrl: string = environment.baseUrl + 'v1/exams/'
  
  // Data
  public exams: Exam[] = []
  public examsFiltered:  Exam[] = []

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  create(body: Form): Observable<any> {
    return this.http.post<any>(this.examsUrl, body).pipe(
      tap((res) => {
        console.log('Create exam response: ', res)
      })
    )
  }

  get(): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.examsUrl).pipe(
      tap((res) => {
        this.exams = res
        console.log('Exams: ', this.exams)
      })
    )
  }

  update(body: Form, id): Observable<any> {
    let updateUrl = this.examsUrl + id  + '/'
    return this.http.put<Exam>(updateUrl, body).pipe(
      tap((res) => {
        console.log('Updated exam: ', res)
      })
    )
  }

  getOne(id: string): Observable<Exam[]> {
    let getOneUrl = this.examsUrl + id + '/'
    return this.http.get<Exam[]>(getOneUrl).pipe(
      tap((res) => {
        console.log('Exams: ', res)
      })
    )
  }

  filter(filterField): Observable<any> {
    let filterUrl = this.examsUrl + '?' + filterField + '/'
    return this.http.get<Exam[]>(filterUrl).pipe(
      tap((res) => {
        this.examsFiltered = res
        console.log('Filtered exams: ', this.examsFiltered)
      })
    )
  }

}
