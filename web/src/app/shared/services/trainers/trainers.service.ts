import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Trainer } from './trainers.model';
import { Form } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainersService {

  // URL
  public urlTrainers: string = environment.baseUrl + 'v1/trainers/'

  // Data
  trainer: Trainer
  trainers: Trainer[] = []
  trainerFiltered: Trainer[] = []

  constructor(
    private http: HttpClient
  ) { }

  create(body: Form): Observable<Trainer> {
    return this.http.post<any>(this.urlTrainers, body).pipe(
      tap((res) => {
        this.trainer = res
        // console.log('Trainer: ', this.trainer)
      })
    )
  }

  getTrainers(): Observable<Trainer[]> {
    return this.http.get<Trainer[]>(this.urlTrainers).pipe(
      tap((res) => {
        this.trainers = res
        // console.log('Trainers: ', this.trainers)
      })
    )
  }

  getTrainer(id: string): Observable<Trainer> {
    let urlTemp = this.urlTrainers + id
    return this.http.get<Trainer>(urlTemp).pipe(
      tap((res) => {
        this.trainer = res
        // console.log('Trainer: ', this.trainer)
      })
    )
  }

  update(id: String, body: Form): Observable<Trainer> {
    let urlTemp = this.urlTrainers + id
    return this.http.put<Trainer>(urlTemp, body).pipe(
      tap((res) => {
        this.trainer = res
        // console.log('Trainer: ', this.trainer)
      })
    )
  }

  filter(field: String): Observable<Trainer[]> {
    let urlTemp = this.urlTrainers + '?' + field
    return this.http.get<Trainer[]>(urlTemp).pipe(
      tap((res) => {
        this.trainerFiltered = res
        // console.log('Trainer', this.trainerFiltered)
      })
    )
  }

}
