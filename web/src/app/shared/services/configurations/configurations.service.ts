import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Form } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Configuration } from './configurations.model';
import { Certification } from './certifications.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationsService {

  // URL
  public urlConfiguration: string = environment.baseUrl + 'v1/configurations/'
  public urlCertificate: string = environment.baseUrl + 'v1/sijil/'

  // Data
  configuration: Configuration
  configurations: Configuration[] = []

  certification: Certification
  certifications: Certification[] = []


  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<Configuration[]> {
    return this.http.get<Configuration[]>(this.urlConfiguration).pipe(
      tap((res) => {
        this.configurations = res
        // console.log('Configurations: ', this.configurations)
      })
    )
  }

  getAllCert(): Observable<Configuration[]> {
    return this.http.get<Configuration[]>(this.urlCertificate).pipe(
      tap((res) => {
        this.certifications = res
        // console.log('Configurations: ', this.configurations)
      })
    )
  }

  getOne(id: String): Observable<Configuration> {
    let urlTemp = this.urlConfiguration + id + '/'
    return this.http.get<Configuration>(urlTemp).pipe(
      tap((res) => {
        this.configuration = res
        // console.log('Configuration: ', this.configuration)
      })
    )
  }

  update(id: String, body: Form): Observable<Configuration> {
    let urlTemp = this.urlConfiguration + id + '/'
    return this.http.patch<Configuration>(urlTemp, body).pipe(
      tap((res) => {
        this.configuration = res
        // console.log('Configuration', this.configuration)
      })
    )
  }

  updateCert(id: String, body: Form): Observable<Configuration> {
    let urlTemp = this.urlCertificate + id + '/'
    return this.http.patch<Configuration>(urlTemp, body).pipe(
      tap((res) => {
        this.configuration = res
        // console.log('Configuration', this.configuration)
      })
    )
  }
}
