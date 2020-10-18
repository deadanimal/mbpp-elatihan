import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TrainingNeedAnswer } from './training-need-answers.model';
import { Form } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';import { AuthService } from '../auth/auth.service';
;

@Injectable({
  providedIn: 'root'
})
export class TrainingNeedAnswersService {

  // URL
  private urlAnswer: string = environment.baseUrl + 'v1/training-need-answers/'
  
  // Data
  public answers: TrainingNeedAnswer[] = []
  public answersFiltered: TrainingNeedAnswer[] = []

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  create(credentials: Form): Observable<any> {
    return this.http.post<any>(this.urlAnswer, credentials).pipe(
      tap((res) => {
        console.log('Create training need answer response: ', res)
      })
    )
  }

  get(): Observable<TrainingNeedAnswer[]> {
    return this.http.get<TrainingNeedAnswer[]>(this.urlAnswer).pipe(
      tap((res) => {
        this.answers = res
        console.log('Training need answers: ', this.answers)
      })
    )
  }

  update(credentials: Form, id): Observable<any> {
    let updateUrl = this.urlAnswer + id  + '/'
    return this.http.put<TrainingNeedAnswer>(updateUrl, credentials).pipe(
      tap((res) => {
        console.log('Updated training need answer: ', res)
      })
    )
  }

  getOne(id: string): Observable<TrainingNeedAnswer[]> {
    let getOneUrl = this.urlAnswer + id + '/'
    return this.http.get<TrainingNeedAnswer[]>(getOneUrl).pipe(
      tap((res) => {
        console.log('Training need answer: ', res)
      })
    )
  }

  filter(filterField): Observable<any> {
    let filterUrl = this.urlAnswer + '?' + filterField + '/'
    return this.http.get<TrainingNeedAnswer[]>(filterUrl).pipe(
      tap((res) => {
        this.answersFiltered = res
        console.log('Filtered training need answers: ', this.answersFiltered)
      })
    )
  }

}
