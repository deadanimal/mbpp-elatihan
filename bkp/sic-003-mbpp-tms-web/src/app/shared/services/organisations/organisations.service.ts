import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Organisation } from './organisations.model';
import { Form } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrganisationsService {

  // URL
  private urlOrganisation: string = environment.baseUrl + 'v1/organisations/'
  
  // Data
  public organisations: Organisation[] = []
  public organisationsFiltered:  Organisation[] = []

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  create(body: Form): Observable<any> {
    return this.http.post<any>(this.urlOrganisation, body).pipe(
      tap((res) => {
        console.log('Create organisation response: ', res)
      })
    )
  }

  get(): Observable<Organisation[]> {
    return this.http.get<Organisation[]>(this.urlOrganisation).pipe(
      tap((res) => {
        this.organisations = res
        console.log('Organisations: ', this.organisations)
      })
    )
  }

  update(body: Form, id): Observable<any> {
    let updateUrl = this.urlOrganisation + id  + '/'
    return this.http.put<Organisation>(updateUrl, body).pipe(
      tap((res) => {
        console.log('Updated organisation: ', res)
      })
    )
  }

  getOne(id: string): Observable<Organisation[]> {
    let getOneUrl = this.organisations + id + '/'
    return this.http.get<Organisation[]>(getOneUrl).pipe(
      tap((res) => {
        console.log('Organisation: ', res)
      })
    )
  }

  filter(filterField): Observable<any> {
    let filterUrl = this.urlOrganisation + '?' + filterField + '/'
    return this.http.get<Organisation[]>(filterUrl).pipe(
      tap((res) => {
        this.organisationsFiltered = res
        console.log('Filtered organisations: ', this.organisationsFiltered)
      })
    )
  }

}
