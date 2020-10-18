import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TrainingNote } from './training-notes.model';
import { Form } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingNotesService {

  // URL
  private urlNote: string = environment.baseUrl + 'v1/training-notes/'
  
  // Data
  public notes: TrainingNote[] = []
  public notesFiltered: TrainingNote[] = []

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  create(body: Form): Observable<any> {
    return this.http.post<any>(this.urlNote, body).pipe(
      tap((res) => {
        console.log('Create training note response: ', res)
      })
    )
  }

  get(): Observable<TrainingNote[]> {
    return this.http.get<TrainingNote[]>(this.urlNote).pipe(
      tap((res) => {
        this.notes = res
        console.log('Training notes: ', this.notes)
      })
    )
  }

  update(body: Form, id): Observable<any> {
    let updateUrl = this.urlNote + id  + '/'
    return this.http.put<TrainingNote>(updateUrl, body).pipe(
      tap((res) => {
        console.log('Updated training note: ', res)
      })
    )
  }

  getOne(id: string): Observable<TrainingNote[]> {
    let getOneUrl = this.urlNote + id + '/'
    return this.http.get<TrainingNote[]>(getOneUrl).pipe(
      tap((res) => {
        console.log('Training note: ', res)
      })
    )
  }

  filter(filterField): Observable<any> {
    let filterUrl = this.urlNote + '?' + filterField + '/'
    return this.http.get<TrainingNote[]>(filterUrl).pipe(
      tap((res) => {
        this.notesFiltered = res
        console.log('Filtered training notes: ', this.notesFiltered)
      })
    )
  }

}
