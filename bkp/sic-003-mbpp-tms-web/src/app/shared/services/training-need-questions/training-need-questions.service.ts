import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TrainingNeedQuestion } from './training-need-questions.model';
import { Form } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingNeedQuestionsService {

  // URL
  private urlQuestion: string = environment.baseUrl + 'v1/training-need-questions/'

  // Data
  public questions: TrainingNeedQuestion[] = []
  public questionsFiltered: TrainingNeedQuestion[] = []

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  create(body: Form): Observable<any> {
    return this.http.post<any>(this.urlQuestion, body).pipe(
      tap((res) => {
        console.log('Create training need question response: ', res)
      })
    )
  }

  get(): Observable<TrainingNeedQuestion[]> {
    return this.http.get<TrainingNeedQuestion[]>(this.urlQuestion).pipe(
      tap((res) => {
        this.questions = res
        console.log('Training need questions: ', this.questions)
      })
    )
  }

  update(body: Form, id): Observable<any> {
    let updateUrl = this.urlQuestion + id  + '/'
    return this.http.put<TrainingNeedQuestion>(updateUrl, body).pipe(
      tap((res) => {
        console.log('Updated training need question: ', res)
      })
    )
  }

  getOne(id: string): Observable<TrainingNeedQuestion[]> {
    let getOneUrl = this.urlQuestion + id + '/'
    return this.http.get<TrainingNeedQuestion[]>(getOneUrl).pipe(
      tap((res) => {
        console.log('Training need question: ', res)
      })
    )
  }

  filter(filterField): Observable<any> {
    let filterUrl = this.urlQuestion + '?' + filterField + '/'
    return this.http.get<TrainingNeedQuestion[]>(filterUrl).pipe(
      tap((res) => {
        this.questionsFiltered = res
        console.log('Filtered training need questions: ', this.questionsFiltered)
      })
    )
  }

}
