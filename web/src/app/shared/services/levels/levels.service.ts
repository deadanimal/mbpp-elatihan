import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Form } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Level } from './levels.model';

@Injectable({
  providedIn: 'root'
})
export class LevelsService {

  // URL
  public urlLevels: string = environment.baseUrl + 'v1/basic-levels/'

  // Data
  level: Level
  levels: Level[] = []
  levelsFiltered: Level[] = []

  constructor(
    private http: HttpClient
  ) { }

  post(body: any): Observable<Level> {
    return this.http.post<any>(this.urlLevels, body).pipe(
      tap((res) => {
        this.level = res
        // console.log('Level: ', this.level)
      })
    )
  }

  getAll(): Observable<Level[]> {
    return this.http.get<Level[]>(this.urlLevels).pipe(
      tap((res) => {
        this.levels = res
        // console.log('Levels: ', this.levels)
      })
    )
  }

  getOne(id: String): Observable<Level> {
    let urlTemp = this.urlLevels + id + '/'
    return this.http.get<Level>(urlTemp).pipe(
      tap((res) => {
        this.level = res
        // console.log('Level: ', this.level)
      })
    )
  }

  patch(id: String, body: Form): Observable<Level> {
    let urlTemp = this.urlLevels + id + '/'
    return this.http.patch<Level>(urlTemp, body).pipe(
      tap((res) => {
        this.level = res
        // console.log('Level: ', this.level)
      })
    )
  }

  filter(field: String): Observable<Level[]> {
    let urlTemp = this.urlLevels + '?' + field
    return this.http.get<Level[]>(urlTemp).pipe(
      tap((res) => {
        this.levelsFiltered = res
        // console.log('Levels: ', this.levelsFiltered)
      })
    )
  }

  activate(id: string) {
    let urlTemp = this.urlLevels + id + '/activate/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.level = res
        // console.log('Level: ', this.level)
      })
    )
  }

  deactivate(id: string) {
    let urlTemp = this.urlLevels + id + '/deactivate/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.level = res
        // console.log('Level: ', this.level)
      })
    )
  }

  checkReportConfig() {
    let urlTemp = this.urlLevels + 'check_report_config'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        // console.log(res)
      })
    )
  }

}
