import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Form } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Core } from './cores.model';

@Injectable({
  providedIn: 'root'
})
export class CoresService {
  
  // URL
  public urlCore: string = environment.baseUrl + 'v1/training-cores'
  
  // Data
  core: Core
  cores: Core[] = []

  constructor(
    private http: HttpClient
  ) { }

  post(body: Form): Observable<Core> {
    return this.http.post<any>(this.urlCore, body).pipe(
      tap((res) => {
        this.core = res
        console.log('Core: ', this.core)
      })
    )
  }

  getAll(): Observable<Core[]> {
    return this.http.get<Core[]>(this.urlCore).pipe(
      tap((res) => {
        this.cores = res
        console.log('Cores: ', this.cores)
      })
    )
  }

  getOne(id: String): Observable<Core> {
    let urlTemp = this.urlCore + id + '/'
    return this.http.get<Core>(urlTemp).pipe(
      tap((res) => {
        this.core = res
        console.log('Core: ', this.core)
      })
    )
  }

  update(id: String, body: Form): Observable<Core> {
    let urlTemp = this.urlCore + id + '/'
    return this.http.put<Core>(urlTemp, body).pipe(
      tap((res) => {
        this.core = res
        console.log('Core', this.core)
      })
    )
  }


}
