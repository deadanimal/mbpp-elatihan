import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ExamResult } from './exam-results.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Form } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExamResultsService {

  // URL
  private examResultsUrl: string = environment.baseUrl + 'v1/exam-results/'
  
  // Data
  public results: ExamResult[] = []
  public resultsFiltered:  ExamResult[] = []

  constructor(
    private http: HttpClient,
    private authService: AuthService
    ) { }

  create(body: Form): Observable<any> {
    return this.http.post<any>(this.examResultsUrl, body).pipe(
      tap((res) => {
        console.log('Create exam result response: ', res)
      })
    )
  }

  get(): Observable<ExamResult[]> {
    return this.http.get<ExamResult[]>(this.examResultsUrl).pipe(
      tap((res) => {
        this.results = res
        console.log('Exam results: ', this.results)
      })
    )
  }

  update(body: Form, id): Observable<any> {
    let updateUrl = this.examResultsUrl + id  + '/'
    return this.http.put<ExamResult>(updateUrl, body).pipe(
      tap((res) => {
        console.log('Updated exam result: ', res)
      })
    )
  }

  getOne(id: string): Observable<ExamResult[]> {
    let getOneUrl = this.examResultsUrl + id + '/'
    return this.http.get<ExamResult[]>(getOneUrl).pipe(
      tap((res) => {
        console.log('Exam result: ', res)
      })
    )
  }

  filter(filterField): Observable<any> {
    let filterUrl = this.examResultsUrl + '?' + filterField + '/'
    return this.http.get<ExamResult[]>(filterUrl).pipe(
      tap((res) => {
        this.resultsFiltered = res
        console.log('Filtered exam results: ', this.resultsFiltered)
      })
    )
  }

}
