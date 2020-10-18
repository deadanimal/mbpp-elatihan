import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Form } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Training } from './trainings.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingsService {

  // URL
  public urlTraining: string = environment.baseUrl + 'v1/trainings/'

  // Data
  training: Training
  trainings: Training[] = []
  trainingsFiltered: Training[] = []

  constructor(
    private http: HttpClient
  ) { }

  post(body: Form): Observable<Training> {
    console.log('hello')
    return this.http.post<any>(this.urlTraining, body).pipe(
      tap((res) => {
        this.training = res
        console.log('Training: ', this.training)
      })
    )
  }

  getAll(): Observable<Training[]> {
    return this.http.get<Training[]>(this.urlTraining).pipe(
      tap((res) => {
        this.trainings = res
        console.log('Trainings: ', this.trainings)
      })
    )
  }

  getOne(id: String): Observable<Training> {
    let urlTemp = this.urlTraining + id + '/'
    return this.http.get<Training>(urlTemp).pipe(
      tap((res) => {
        this.training = res
        console.log('Training: ', this.training)
      })
    )
  }

  update(id: String, body: Form): Observable<Training> {
    let urlTemp = this.urlTraining + id + '/'
    return this.http.put<Training>(urlTemp, body).pipe(
      tap((res) => {
        this.training = res
        console.log('Training', this.training)
      })
    )
  }

  filter(field: String): Observable<Training[]> {
    let urlTemp = this.urlTraining + '?' + field
    return this.http.get<Training[]>(urlTemp).pipe(
      tap((res) => {
        this.trainingsFiltered = res
        console.log('Trainings', this.trainingsFiltered)
      })
    )
  }

  activate(id: string) {
    let urlTemp = this.urlTraining + id + '/activate/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.training = res
        console.log('Training: ', this.training)
      })
    )
  }

  deactivate(id: string) {
    let urlTemp = this.urlTraining + id + '/deactivate/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.training = res
        console.log('Training: ', this.training)
      })
    )
  }

}
