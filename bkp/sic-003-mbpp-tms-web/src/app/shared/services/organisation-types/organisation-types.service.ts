import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { OrganisationType } from './organisation-types.model';
import { Form } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganisationTypesService {

  // URL
  private organisationTypesUrl: string = environment.baseUrl + 'v1/organisation-types/'
  
  // Data
  public organisationTypes: OrganisationType[] = []
  public organisationTypesFiltered:  OrganisationType[] = []

  constructor(
    private http: HttpClient
  ) { }

  get(): Observable<OrganisationType[]> {
    return this.http.get<OrganisationType[]>(this.organisationTypesUrl).pipe(
      tap((res) => {
        this.organisationTypes = res
        console.log('Organisation types: ', this.organisationTypes)
      })
    )
  }

  update(body: Form, id): Observable<any> {
    let updateUrl = this.organisationTypesUrl + id  + '/'
    return this.http.put<OrganisationType>(updateUrl, body).pipe(
      tap((res) => {
        console.log('Updated organisation type: ', res)
      })
    )
  }

  getOne(id: string): Observable<OrganisationType[]> {
    let getOneUrl = this.organisationTypesUrl + id + '/'
    return this.http.get<OrganisationType[]>(getOneUrl).pipe(
      tap((res) => {
        console.log('Organisation type: ', res)
      })
    )
  }

  filter(filterField): Observable<any> {
    let filterUrl = this.organisationTypesUrl + '?' + filterField + '/'
    return this.http.get<OrganisationType[]>(filterUrl).pipe(
      tap((res) => {
        this.organisationTypesFiltered = res
        console.log('Filtered organisation types: ', this.organisationTypesFiltered)
      })
    )
  }

}
