import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Form } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AbsenceMemo } from './absence-memos.model';

@Injectable({
  providedIn: 'root'
})
export class AbsenceMemosService {

  // URL
  public urlAbsenceMemos: string = environment.baseUrl + 'v1/training-absence-memos/'

  // Data
  absenceMemo: AbsenceMemo
  absenceMemos: AbsenceMemo[] = []
  absenceMemosFiltered: AbsenceMemo[] = []

  constructor(
    private http: HttpClient
  ) { }

  post(body: Form): Observable<AbsenceMemo> {
    return this.http.post<any>(this.urlAbsenceMemos, body).pipe(
      tap((res) => {
        this.absenceMemo = res
        console.log('Absence memo: ', this.absenceMemo)
      })
    )
  }

  getAll(): Observable<AbsenceMemo[]> {
    return this.http.get<AbsenceMemo[]>(this.urlAbsenceMemos).pipe(
      tap((res) => {
        this.absenceMemos = res
        console.log('Absence memos: ', this.absenceMemos)
      })
    )
  }

  getOne(id: String): Observable<AbsenceMemo> {
    let urlTemp = this.urlAbsenceMemos + id + '/'
    return this.http.get<AbsenceMemo>(urlTemp).pipe(
      tap((res) => {
        this.absenceMemo = res
        console.log('Absence memo: ', this.absenceMemo)
      })
    )
  }

  update(id: String, body: Form): Observable<AbsenceMemo> {
    let urlTemp = this.urlAbsenceMemos + id + '/'
    return this.http.put<AbsenceMemo>(urlTemp, body).pipe(
      tap((res) => {
        this.absenceMemo = res
        console.log('Absence memo', this.absenceMemo)
      })
    )
  }

  filter(field: String): Observable<AbsenceMemo[]> {
    let urlTemp = this.urlAbsenceMemos + '?' + field
    return this.http.get<AbsenceMemo[]>(urlTemp).pipe(
      tap((res) => {
        this.absenceMemosFiltered = res
        console.log('Absence memos', this.absenceMemosFiltered)
      })
    )
  }

  activate(id: string) {
    let urlTemp = this.urlAbsenceMemos + id + '/activate/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.absenceMemo = res
        console.log('Absence memo: ', this.absenceMemo)
      })
    )
  }

  deactivate(id: string) {
    let urlTemp = this.urlAbsenceMemos + id + '/deactivate/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.absenceMemo = res
        console.log('Absence memo: ', this.absenceMemo)
      })
    )
  }

}
