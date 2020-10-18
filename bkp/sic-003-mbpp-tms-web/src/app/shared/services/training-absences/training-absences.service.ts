import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TrainingAbsence } from './training-absences.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Form } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingAbsencesService {

  // URL
  private urlAbsence: string = environment.baseUrl + 'v1/training-absences/'
  
  // Data
  public absences: TrainingAbsence[] = []
  public absencesFiltered: TrainingAbsence[] = []

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  create(body: Form): Observable<any> {
    return this.http.post<any>(this.urlAbsence, body).pipe(
      tap((res) => {
        console.log('Create training absence response: ', res)
      })
    )
  }

  get(): Observable<TrainingAbsence[]> {
    return this.http.get<TrainingAbsence[]>(this.urlAbsence).pipe(
      tap((res) => {
        this.absences = res
        console.log('Training absences: ', this.absences)
      })
    )
  }

  update(body: Form, id): Observable<any> {
    let updateUrl = this.urlAbsence + id  + '/'
    return this.http.put<TrainingAbsence>(updateUrl, body).pipe(
      tap((res) => {
        console.log('Updated training absence: ', res)
      })
    )
  }

  getOne(id: string): Observable<TrainingAbsence[]> {
    let getOneUrl = this.urlAbsence + id + '/'
    return this.http.get<TrainingAbsence[]>(getOneUrl).pipe(
      tap((res) => {
        console.log('Training absence: ', res)
      })
    )
  }

  filter(filterField): Observable<any> {
    let filterUrl = this.urlAbsence + '?' + filterField + '/'
    return this.http.get<TrainingAbsence[]>(filterUrl).pipe(
      tap((res) => {
        this.absencesFiltered = res
        console.log('Filtered training absences: ', this.absencesFiltered)
      })
    )
  }

}
