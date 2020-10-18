import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TrainingAssessmentQuestion } from './training-assessment-questions.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Form } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingAssessmentQuestionsService {

  // URL
  private urlQuestion: string = environment.baseUrl + 'v1/training-assessment-questions/'
  
  // Data
  public questions: TrainingAssessmentQuestion[] = []
  public questionsFiltered: TrainingAssessmentQuestion[] = []

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  create(body: Form): Observable<any> {
    return this.http.post<any>(this.urlQuestion, body).pipe(
      tap((res) => {
        console.log('Create training assessment question response: ', res)
      })
    )
  }

  get(): Observable<TrainingAssessmentQuestion[]> {
    return this.http.get<TrainingAssessmentQuestion[]>(this.urlQuestion).pipe(
      tap((res) => {
        this.questions = res
        console.log('Training assessment questions: ', this.questions)
      })
    )
  }

  update(body: Form, id): Observable<any> {
    let updateUrl = this.urlQuestion + id  + '/'
    return this.http.put<TrainingAssessmentQuestion>(updateUrl, body).pipe(
      tap((res) => {
        console.log('Updated training assessment question: ', res)
      })
    )
  }

  getOne(id: string): Observable<TrainingAssessmentQuestion[]> {
    let getOneUrl = this.urlQuestion + id + '/'
    return this.http.get<TrainingAssessmentQuestion[]>(getOneUrl).pipe(
      tap((res) => {
        console.log('Training assessmet question: ', res)
      })
    )
  }

  filter(filterField): Observable<any> {
    let filterUrl = this.urlQuestion + '?' + filterField + '/'
    return this.http.get<TrainingAssessmentQuestion[]>(filterUrl).pipe(
      tap((res) => {
        this.questionsFiltered = res
        console.log('Filtered training assessment questions: ', this.questionsFiltered)
      })
    )
  }

}
