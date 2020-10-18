import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Form } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Exam } from './exams.model';

@Injectable({
  providedIn: 'root'
})
export class ExamsService {

  // URL
  public urlExams: string = environment.baseUrl + 'v1/exams/'

  // Data
  exam: Exam
  exams: Exam[] = []
  examsFiltered: Exam[] = []

  constructor(
    private http: HttpClient
  ) { }

  post(body: Form): Observable<Exam> {
    return this.http.post<any>(this.urlExams, body).pipe(
      tap((res) => {
        this.exam
        console.log('Exam: ', this.exam)
      })
    )
  }

  getAll(): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.urlExams).pipe(
      tap((res) => {
        this.exams = res
        console.log('Exams: ', this.exams)
      })
    )
  }

  getOne(id: String): Observable<Exam> {
    let urlTemp = this.urlExams + id + '/'
    return this.http.get<Exam>(urlTemp).pipe(
      tap((res) => {
        this.exam = res
        console.log('Exam: ', this.exam)
      })
    )
  }

  update(id: String, body: Form): Observable<Exam> {
    let urlTemp = this.urlExams + id + '/'
    return this.http.put<Exam>(urlTemp, body).pipe(
      tap((res) => {
        this.exam = res
        console.log('Exam', this.exam)
      })
    )
  }

  filter(field: String): Observable<Exam[]> {
    let urlTemp = this.urlExams + '?' + field
    console.log(urlTemp)
    return this.http.get<Exam[]>(urlTemp).pipe(
      tap((res) => {
        this.examsFiltered = res
        console.log('Exams', this.examsFiltered)
      })
    )
  }

  activate(id: string) {
    let urlTemp = this.urlExams + id + '/activate/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.exam = res
        console.log('Exam: ', this.exam)
      })
    )
  }

  deactivate(id: string) {
    let urlTemp = this.urlExams + id + '/deactivate/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.exam = res
        console.log('Exam: ', this.exam)
      })
    )
  }

}
