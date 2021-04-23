import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SecurityAnswer, SecurityQuestion } from './security.model';
import { Form } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  // URL
  public urlQuestion: string = environment.baseUrl + 'v1/security-questions/'
  public urlAnswer: string = environment.baseUrl + 'v1/security-answers/'

  // Data
  public question: SecurityQuestion
  public answer: SecurityAnswer
  public questions: SecurityQuestion[] = []
  public answers: SecurityAnswer[] = []
  
  constructor(
    private http: HttpClient
  ) { }

  createQuestion(body: Form): Observable<any> {
    return this.http.post<any>(this.urlQuestion, body).pipe(
      tap((res) => {
        this.question = res
        // console.log('Question: ', this.question)
      })
    )
  }

  getQuestions(): Observable<SecurityQuestion[]> {
    return this.http.get<SecurityQuestion[]>(this.urlQuestion).pipe(
      tap((res: SecurityQuestion[]) => {
        this.questions = res
        // console.log('Questions: ', this.questions)
      })
    )
  }

  getQuestion(id: string): Observable<SecurityQuestion> {
    let urlTemp = this.urlQuestion + id + '/'
    return this.http.get<SecurityQuestion>(urlTemp).pipe(
      tap((res) => {
        this.question = res
        // console.log('Question: ', this.question)
      })
    )
  }

  patchQuestion(id: string, body: Form): Observable<SecurityQuestion> {
    let urlTemp = this.urlQuestion + id + '/'
    return this.http.patch<SecurityQuestion>(urlTemp, body).pipe(
      tap((res) => {
        this.question = res
        // console.log('Question: ', this.question)
      })
    )
  }

  createAnswer(body: Form): Observable<SecurityAnswer> {
    return this.http.post<SecurityAnswer>(this.urlAnswer, body).pipe(
      tap((res) => {
        this.answer = res
        // console.log('Answer: ', this.answer)
      })
    )
  }

  getAnswers(): Observable<SecurityAnswer[]> {
    return this.http.get<SecurityAnswer[]>(this.urlAnswer).pipe(
      tap((res: SecurityAnswer[]) => {
        this.answers = res
        // console.log('Answers: ', this.answers)
      })
    )
  }

  getAnswer(id: string): Observable<SecurityAnswer> {
    let urlTemp = this.urlAnswer + id + '/'
    return this.http.get<SecurityAnswer>(urlTemp).pipe(
      tap((res: SecurityAnswer) => {
        this.answer = res
        // console.log('Answer: ', this.answer)
      })
    )
  }

  patchAnswer(id: string, body: Form): Observable<SecurityAnswer> {
    let urlTemp = this.urlAnswer + id + '/'
    return this.http.patch<SecurityAnswer>(urlTemp, body).pipe(
      tap((res) => {
        this.answer = res
        // console.log('Answer: ', this.answer)
      })
    )
  }

  getUserAnswer(body: any): Observable<any> {
    let urlTemp = this.urlAnswer + 'get_user_answer/'
    // console.log('url', urlTemp)
    // console.log('body', body)
    return this.http.post<any>(urlTemp, body).pipe(
      tap((res) => {
        this.answer = res
        // console.log('dd', res)
      })
    )
  }

  checker(): Observable<any> {
    let urlTemp = this.urlAnswer + 'checker'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        console.log(res)
      })
    )
  }

  filterAnswer(field: String): Observable<any[]> {
    let urlTemp = this.urlAnswer + '?' + field
    return this.http.get<any[]>(urlTemp).pipe(
      tap((res) => {
        this.questions = res
        // console.log('Notes: ', this.notesFiltered)
      })
    )
  }

  filterQuestion(field: String): Observable<any[]> {
    let urlTemp = this.urlQuestion + '?' + field
    return this.http.get<any[]>(urlTemp).pipe(
      tap((res) => {
        this.questions = res
        // console.log('Notes: ', this.notesFiltered)
      })
    )
  }
}
