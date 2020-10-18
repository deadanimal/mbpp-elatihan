import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TrainingAssessmentAnswer } from './training-assessment-answers.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Form } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingAssessmentAnswersService {

  // URL
  private urlAnswer: string = environment.baseUrl + 'v1/training-assessment-answers/'
  
  // Data
  public answers: TrainingAssessmentAnswer[] = []
  public answersFiltered: TrainingAssessmentAnswer[] = []

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  create(body: Form): Observable<any> {
    return this.http.post<any>(this.urlAnswer, body).pipe(
      tap((res) => {
        console.log('Create training assessment answer response: ', res)
      })
    )
  }

  get(): Observable<TrainingAssessmentAnswer[]> {
    return this.http.get<TrainingAssessmentAnswer[]>(this.urlAnswer).pipe(
      tap((res) => {
        this.answers = res
        console.log('Training assessment answers: ', this.answers)
      })
    )
  }

  update(body: Form, id): Observable<any> {
    let updateUrl = this.urlAnswer + id  + '/'
    return this.http.put<TrainingAssessmentAnswer>(updateUrl, body).pipe(
      tap((res) => {
        console.log('Updated training assesment answer: ', res)
      })
    )
  }

  getOne(id: string): Observable<TrainingAssessmentAnswer[]> {
    let getOneUrl = this.urlAnswer + id + '/'
    return this.http.get<TrainingAssessmentAnswer[]>(getOneUrl).pipe(
      tap((res) => {
        console.log('Training assessment answer: ', res)
      })
    )
  }

  filter(filterField): Observable<any> {
    let filterUrl = this.urlAnswer + '?' + filterField + '/'
    return this.http.get<TrainingAssessmentAnswer[]>(filterUrl).pipe(
      tap((res) => {
        this.answersFiltered = res
        console.log('Filtered training assessmenet answers: ', this.answersFiltered)
      })
    )
  }

}
