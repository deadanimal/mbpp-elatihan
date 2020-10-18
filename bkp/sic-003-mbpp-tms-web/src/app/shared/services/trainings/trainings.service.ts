import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Training } from './trainings.model';
import { Form } from '@angular/forms';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainingsService {
  
  // URL
  private urlTraining: string = environment.baseUrl + 'v1/trainings/'
  
  // Data
  public training: Training
  public trainings: Training[] = []
  public trainingsFiltered:  Training[] = []

  constructor(
    private http: HttpClient
  ) { }

  create(body: Form): Observable<any> {
    return this.http.post<any>(this.urlTraining, body).pipe(
      tap((res) => {
        console.log('Create training response: ', res)
      })
    )
  }

  get(): Observable<Training[]> {
    return this.http.get<Training[]>(this.urlTraining).pipe(
      tap((res) => {
        this.trainings = res
        console.log('Trainings: ', this.trainings)
      })
    )
  }

  update(body: Form, id): Observable<any> {
    let updateUrl = this.urlTraining + id  + '/'
    return this.http.put<Training>(updateUrl, body).pipe(
      tap((res) => {
        console.log('Updated training: ', res)
      })
    )
  }

  getOne(id: string): Observable<Training> {
    let getOneUrl = this.urlTraining + id + '/'
    return this.http.get<Training>(getOneUrl).pipe(
      tap((res) => {
        this.training = res
        console.log('Training: ', res)
      })
    )
  }

  filter(filterField): Observable<any> {
    let filterUrl = this.urlTraining + '?' + filterField + '/'
    return this.http.get<Training[]>(filterUrl).pipe(
      tap((res) => {
        this.trainingsFiltered = res
        console.log('Filtered trainings: ', this.trainingsFiltered)
      })
    )
  }

}
