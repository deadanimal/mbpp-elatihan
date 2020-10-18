import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Form } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Note } from './notes.model';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  // URL
  public urlNotes: string = environment.baseUrl + 'v1/training-notes/'

  // Data
  note: Note
  notes: Note[] = []
  notesFiltered: Note[] = []

  constructor(
    private http: HttpClient
  ) { }

  post(body: Form): Observable<Note> {
    return this.http.post<any>(this.urlNotes, body).pipe(
      tap((res) => {
        this.note = res
        console.log('Note: ', this.note)
      })
    )
  }

  getAll(): Observable<Note[]> {
    return this.http.get<Note[]>(this.urlNotes).pipe(
      tap((res) => {
        this.notes = res
        console.log('Notes: ', this.notes)
      })
    )
  }

  getOne(id: String): Observable<Note> {
    let urlTemp = this.urlNotes + id + '/'
    return this.http.get<Note>(urlTemp).pipe(
      tap((res) => {
        this.note = res
        console.log('Note: ', this.note)
      })
    )
  }

  update(id: String, body: Form): Observable<Note> {
    let urlTemp = this.urlNotes + id + '/'
    return this.http.put<Note>(urlTemp, body).pipe(
      tap((res) => {
        this.note = res
        console.log('Note', this.note)
      })
    )
  }

  filter(field: String): Observable<Note[]> {
    let urlTemp = this.urlNotes + '?' + field
    return this.http.get<Note[]>(urlTemp).pipe(
      tap((res) => {
        this.notesFiltered = res
        console.log('Notes', this.notesFiltered)
      })
    )
  }

  activate(id: string) {
    let urlTemp = this.urlNotes + id + '/activate/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.note = res
        console.log('Note: ', this.note)
      })
    )
  }

  deactivate(id: string) {
    let urlTemp = this.urlNotes + id + '/deactivate/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.note = res
        console.log('Note: ', this.note)
      })
    )
  }

}
