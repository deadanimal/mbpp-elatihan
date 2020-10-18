import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TrainingApplication } from './training-applications.modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Form } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingApplicationsService {

  // URL
  private urlApplication: string = environment.baseUrl + 'v1/training-applications/'
  
  // Data
  public applications: TrainingApplication[] = []
  public applicationsFiltered: TrainingApplication[] = []

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  create(body: Form): Observable<any> {
    return this.http.post<any>(this.urlApplication, body).pipe(
      tap((res) => {
        console.log('Create training application response: ', res)
      })
    )
  }

  get(): Observable<TrainingApplication[]> {
    return this.http.get<TrainingApplication[]>(this.urlApplication).pipe(
      tap((res) => {
        this.applications = res
        console.log('Training applications: ', this.applications)
      })
    )
  }

  update(body: Form, id): Observable<any> {
    let updateUrl = this.urlApplication + id  + '/'
    return this.http.put<TrainingApplication>(updateUrl, body,).pipe(
      tap((res) => {
        console.log('Updated training application: ', res)
      })
    )
  }

  getOne(id: string): Observable<TrainingApplication[]> {
    let getOneUrl = this.urlApplication + id + '/'
    return this.http.get<TrainingApplication[]>(getOneUrl).pipe(
      tap((res) => {
        console.log('Training application: ', res)
      })
    )
  }

  filter(filterField): Observable<any> {
    let filterUrl = this.urlApplication + '?' + filterField + '/'
    return this.http.get<TrainingApplication[]>(filterUrl).pipe(
      tap((res) => {
        this.applicationsFiltered = res
        console.log('Filtered training applications: ', this.applicationsFiltered)
      })
    )
  }

}
