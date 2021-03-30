import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Form } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Certificate, CertificateExtended } from './certificates.model';

@Injectable({
  providedIn: 'root'
})
export class CertificatesService {

  // URL
  public urlCertificates: string = environment.baseUrl + 'v1/certificates/'

  // Data
  certificate: CertificateExtended
  certificates: CertificateExtended[] = []
  certificatesFiltered: CertificateExtended[] = []

  constructor(
    private http: HttpClient
  ) { }

  generateBulk(body: any): Observable<CertificateExtended> {
    let urlTemp = this.urlCertificates + 'generate_bulk/'
    return this.http.post<any>(urlTemp, body).pipe(
      tap((res) => {
        this.certificates = res
        // console.log('Certificates: ', this.certificates)
      })
    )
  }

  getSelf(): Observable<CertificateExtended[]> {
    let urlTemp = this.urlCertificates + 'get_self'
    return this.http.get<CertificateExtended[]>(urlTemp).pipe(
      tap((res) => {
        this.certificates = res
        // console.log('Certificates: ', this.certificates)
      })
    )
  }

  getTrainings(body: any): Observable<CertificateExtended[]> {
    let urlTemp = this.urlCertificates + 'get_training/'
    return this.http.post<CertificateExtended[]>(urlTemp, body).pipe(
      tap((res) => {
        this.certificates = res
        // console.log('Certificates: ', this.certificates)
      })
    )
  }

  getTrainingSelf(body: any): Observable<CertificateExtended[]> {
    let urlTemp = this.urlCertificates + 'get_training_self/'
    return this.http.post<CertificateExtended[]>(urlTemp, body).pipe(
      tap((res) => {
        this.certificates = res
        // console.log('Certificates: ', this.certificates)
      })
    )
  }

}
