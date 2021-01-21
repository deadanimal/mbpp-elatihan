import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Form } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Domain } from './domains.model';

@Injectable({
  providedIn: 'root'
})
export class DomainsService {

  // URL
  public urlDomains: string = environment.baseUrl + 'v1/training-domains/'

  // Data
  domain: Domain
  domains: Domain[] = []
  domainFiltered: Domain[] = []

  constructor(
    private http: HttpClient
  ) { }

  create(body: Form): Observable<Domain> {
    return this.http.post<any>(this.urlDomains, body).pipe(
      tap((res) => {
        this.domain = res
        console.log('Domain: ', this.domain)
      })
    )
  }

  getDomains(): Observable<Domain[]> {
    return this.http.get<Domain[]>(this.urlDomains).pipe(
      tap((res) => {
        this.domains = res
        console.log('Domains: ', this.domains)
      })
    )
  }

  getDomain(id: string): Observable<Domain> {
    let urlTemp = this.urlDomains + id
    return this.http.get<Domain>(urlTemp).pipe(
      tap((res) => {
        this.domain = res
        console.log('Domain: ', this.domain)
      })
    )
  }

  update(id: String, body: Form): Observable<Domain> {
    let urlTemp = this.urlDomains + id + '/'
    return this.http.put<Domain>(urlTemp, body).pipe(
      tap((res) => {
        this.domain = res
        console.log('Domain: ', this.domain)
      })
    )
  }

  filter(field: String): Observable<Domain[]> {
    let urlTemp = this.urlDomains + '?' + field
    return this.http.get<Domain[]>(urlTemp).pipe(
      tap((res) => {
        this.domainFiltered = res
        console.log('Domain', this.domainFiltered)
      })
    )
  }

}
