import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TrainingCodeClass } from './training-code-class.model';
import { Form } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingCodeClassService {

  // URL
  private urlClass: string = environment.baseUrl + 'v1/training-code-class/'
  
  // Data
  public classes: TrainingCodeClass[] = []
  public classesFiltered: TrainingCodeClass[] = []

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  create(body: Form): Observable<any> {
    let postUrl = this.urlClass + '/'
    return this.http.post<any>(postUrl, body).pipe(
      tap((res) => {
        console.log('Create training code class response: ', res)
      })
    )
  }

  get(): Observable<TrainingCodeClass[]> {
    return this.http.get<TrainingCodeClass[]>(this.urlClass).pipe(
      tap((res) => {
        this.classes = res
        console.log('Training code class: ', this.classes)
      })
    )
  }

  update(body: Form, id): Observable<any> {
    let updateUrl = this.urlClass + id  + '/'
    return this.http.put<TrainingCodeClass>(updateUrl, body).pipe(
      tap((res) => {
        console.log('Updated training code class: ', res)
      })
    )
  }

  getOne(id: string): Observable<TrainingCodeClass[]> {
    let getOneUrl = this.urlClass + id + '/'
    return this.http.get<TrainingCodeClass[]>(getOneUrl).pipe(
      tap((res) => {
        console.log('Training code class: ', res)
      })
    )
  }

  filter(filterField): Observable<any> {
    let filterUrl = this.urlClass + '?' + filterField + '/'
    return this.http.get<TrainingCodeClass[]>(filterUrl).pipe(
      tap((res) => {
        this.classesFiltered = res
        console.log('Filtered training code class: ', this.classesFiltered)
      })
    )
  }

}
