import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Form } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Organisation } from './organisations.model';

@Injectable({
  providedIn: 'root'
})
export class OrganisationsService {

  // URL
  public urlOrganisations: string = environment.baseUrl + 'v1/organisations/'

  // Data
  organisation: Organisation
  organisations: Organisation[] = []
  organisationsFiltered: Organisation[] = []

  constructor(
    private http: HttpClient
  ) { }

  post(body: Form): Observable<Organisation> {
    return this.http.post<any>(this.urlOrganisations, body).pipe(
      tap((res) => {
        this.organisation = res
        // console.log('Organisation: ', this.organisation)
      })
    )
  }

  getAll(): Observable<Organisation[]> {
    return this.http.get<Organisation[]>(this.urlOrganisations).pipe(
      tap((res) => {
        this.organisations = res
        // console.log('Organisations: ', this.organisations)
      })
    )
  }

  getOne(id: String): Observable<Organisation> {
    let urlTemp = this.urlOrganisations + id + '/'
    return this.http.get<Organisation>(urlTemp).pipe(
      tap((res) => {
        this.organisation = res
        // console.log('Organisation: ', this.organisation)
      })
    )
  }

  update(id: String, body: Form): Observable<Organisation> {
    let urlTemp = this.urlOrganisations + id + '/'
    return this.http.put<Organisation>(urlTemp, body).pipe(
      tap((res) => {
        this.organisation = res
        // console.log('Organisation', this.organisation)
      })
    )
  }

  filter(field: String): Observable<Organisation[]> {
    let urlTemp = this.urlOrganisations + '?' + field
    return this.http.get<Organisation[]>(urlTemp).pipe(
      tap((res) => {
        this.organisationsFiltered = res
        // console.log('Organisations', this.organisationsFiltered)
      })
    )
  }

  activate(id: string) {
    let urlTemp = this.urlOrganisations + id + '/activate/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.organisation = res
        // console.log('Organisation: ', this.organisation)
      })
    )
  }

  deactivate(id: string) {
    let urlTemp = this.urlOrganisations + id + '/deactivate/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.organisation = res
        // console.log('Organisation: ', this.organisation)
      })
    )
  }

}
