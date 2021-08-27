import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Form } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { 
  Content,
  ContentExtended,
  External,
  ExternalExtended,
  Internal,
  InternalExtended
 } from './evaluations.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluationsService {

  // URL
  public urlContent: string = environment.baseUrl + 'v1/content-evaluations/'
  public urlExternal: string = environment.baseUrl + 'v1/external-evaluations/'
  public urlInternal: string = environment.baseUrl + 'v1/internal-evaluations/'

  // Data
  content: Content
  contents: Content[] = []
  external: External
  externalExtended: ExternalExtended
  externals: ExternalExtended[] = []
  internal: Internal
  internalExtended: InternalExtended
  internals: InternalExtended[] = []
  internalFiltered: InternalExtended[] = []

  constructor(
    private http: HttpClient
  ) { }

  // Content evaluations
  createContent(body: any): Observable<Content> {
    return this.http.post<any>(this.urlContent, body).pipe(
      tap((res) => {
        this.content = res
        // console.log('Content: ', this.content)
      })
    )
  }

  getContents(): Observable<Content[]> {
    return this.http.get<Content[]>(this.urlContent).pipe(
      tap((res) => {
        this.contents = res
        // console.log('Contents: ', this.contents)
      })
    )
  }

  getContent(id: string): Observable<Content> {
    let urlTemp = this.urlContent + id
    return this.http.get<Content>(urlTemp).pipe(
      tap((res) => {
        this.content = res
        // console.log('Contents: ', this.contents)
      })
    )
  }

  getContentSelf(body: any): Observable<Content[]> {
    let urlTemp = this.urlContent + 'get_self/'
    return this.http.post<Content[]>(urlTemp, body).pipe(
      tap((res) => {
        this.contents = res
        // console.log('Contents: ', this.contents)
      })
    )
  }

  getContentTraining(body: any): Observable<Content[]> {
    let urlTemp = this.urlContent + 'get_training/'
    return this.http.post<Content[]>(urlTemp, body).pipe(
      tap((res) => {
        this.contents = res
        // console.log('Contents: ', this.contents)
      })
    )
  }

  getContentTrainingSelf(body: any): Observable<Content> {
    let urlTemp = this.urlContent + 'get_training_self/'
    return this.http.post<Content>(urlTemp, body).pipe(
      tap((res) => {
        this.content = res
        // console.log('Contents: ', this.contents)
      })
    )
  }

  // External evaluations
  createExternal(body: any): Observable<External> {
    return this.http.post<any>(this.urlExternal, body).pipe(
      tap((res) => {
        this.external = res
        // console.log('External: ', this.external)
      })
    )
  }

  getExternals(): Observable<ExternalExtended[]> {
    let urlTemp = this.urlExternal + 'extended_all'
    return this.http.get<ExternalExtended[]>(urlTemp).pipe(
      tap((res) => {
        this.externals = res
        // console.log('Externals: ', this.externals)
      })
    )
  }

  getExternal(id: string): Observable<ExternalExtended> {
    let urlTemp = this.urlExternal + id + '/extended'
    return this.http.get<ExternalExtended>(urlTemp).pipe(
      tap((res) => {
        this.externalExtended = res
        // console.log('External: ', this.external)
      })
    )
  }

  getExternalSelf(body: any): Observable<ExternalExtended[]> {
    let urlTemp = this.urlExternal + 'get_self/'
    return this.http.post<ExternalExtended[]>(urlTemp, body).pipe(
      tap((res) => {
        this.externals = res
        // console.log('Externals: ', this.externals)
      })
    )
  }

  getExternalTraining(body: any): Observable<ExternalExtended[]> {
    let urlTemp = this.urlExternal + 'get_training/'
    return this.http.post<ExternalExtended[]>(urlTemp, body).pipe(
      tap((res) => {
        this.externals = res
        // console.log('Externals: ', this.externals)
      })
    )
  }

  getExternalTrainingSelf(body: any): Observable<ExternalExtended> {
    let urlTemp = this.urlExternal + 'get_training_self/'
    return this.http.post<ExternalExtended>(urlTemp, body).pipe(
      tap((res) => {
        this.externalExtended = res
        // console.log('Externals: ', this.externals)
      })
    )
  }

  approveExternal(id: string): Observable<ExternalExtended> {
    let urlTemp = this.urlExternal + id + '/approve'
    return this.http.get<ExternalExtended>(urlTemp).pipe(
      tap((res) => {
        this.externalExtended = res
        // console.log('Externals: ', this.externals)
      })
    )
  }

  verifyExternal(id: string): Observable<ExternalExtended> {
    let urlTemp = this.urlExternal + id + '/verify'
    return this.http.get<ExternalExtended>(urlTemp).pipe(
      tap((res) => {
        this.externalExtended = res
        // console.log('Externals: ', this.externals)
      })
    )
  }

  // Internal evaluations
  createInternal(body: any): Observable<Internal> {
    return this.http.post<any>(this.urlInternal, body).pipe(
      tap((res) => {
        this.internal = res
        // console.log('Internal: ', this.internal)
      })
    )
  }

  getInternals(): Observable<InternalExtended[]> {
    let urlTemp = this.urlInternal + 'extended_all'
    return this.http.get<InternalExtended[]>(urlTemp).pipe(
      tap((res) => {
        this.internals = res
        // console.log('Internals: ', this.internals)
      })
    )
  }

  getInternal(id: string): Observable<InternalExtended> {
    let urlTemp = this.urlInternal + id + '/extended'
    return this.http.get<InternalExtended>(urlTemp).pipe(
      tap((res) => {
        this.internalExtended = res
        // console.log('Internals: ', this.internal)
      })
    )
  }

  getInternalSelf(body: any): Observable<InternalExtended[]> {
    let urlTemp = this.urlInternal + 'get_self/'
    return this.http.post<InternalExtended[]>(urlTemp, body).pipe(
      tap((res) => {
        this.internals = res
        // console.log('Internals: ', this.internals)
      })
    )
  }

  getInternalTraining(body: any): Observable<InternalExtended[]> {
    let urlTemp = this.urlInternal + 'get_training/'
    return this.http.post<InternalExtended[]>(urlTemp, body).pipe(
      tap((res) => {
        this.internals = res
        // console.log('Internals: ', this.internals)
      })
    )
  }

  getInternalTrainingSelf(body: any): Observable<InternalExtended> {
    let urlTemp = this.urlInternal + 'get_training_self/'
    return this.http.post<InternalExtended>(urlTemp, body).pipe(
      tap((res) => {
        this.internalExtended = res
        // console.log('Internals: ', this.internals)
      })
    )
  }

  approveInternal(id: string): Observable<InternalExtended> {
    let urlTemp = this.urlInternal + id + '/approve'
    return this.http.get<InternalExtended>(urlTemp).pipe(
      tap((res) => {
        this.internalExtended = res
        // console.log('Internals: ', this.internals)
      })
    )
  }

  verifyInternal(id: string): Observable<InternalExtended> {
    let urlTemp = this.urlInternal + id + '/verify'
    return this.http.get<InternalExtended>(urlTemp).pipe(
      tap((res) => {
        this.internalExtended = res
        // console.log('Internals: ', this.internals)
      })
    )
  }

  filterInternal(field: String): Observable<InternalExtended[]> {
    let urlTemp = this.urlInternal + '?' + field
    return this.http.get<InternalExtended[]>(urlTemp).pipe(
      tap((res) => {
        this.internalFiltered = res
        // console.log('Filter Internal: ', res)
      })
    )
  }

  filterExternal(field: String): Observable<ExternalExtended[]> {
    let urlTemp = this.urlExternal + '?' + field
    return this.http.get<ExternalExtended[]>(urlTemp).pipe(
      tap((res) => {
        // console.log('Filter External: ', res)
      })
    )
  }

  getChart21(body: any): Observable<any[]> {
    let urlTemp = this.urlInternal + 'get_chart_21/'
    return this.http.post<any[]>(urlTemp, body).pipe(
      tap((res) => {
        // console.log('Filter Internal: ', res)
      })
    )
  }

  getChart22(body: any): Observable<any[]> {
    let urlTemp = this.urlInternal + 'get_chart_22/'
    return this.http.post<any[]>(urlTemp, body).pipe(
      tap((res) => {
        // console.log('Filter Internal: ', res)
      })
    )
  }

  getChart23(body: any): Observable<any[]> {
    let urlTemp = this.urlInternal + 'get_chart_23/'
    return this.http.post<any[]>(urlTemp, body).pipe(
      tap((res) => {
        // console.log('Filter Internal: ', res)
      })
    )
  }

  getChart24(body: any): Observable<any[]> {
    let urlTemp = this.urlContent + 'get_chart_24/'
    return this.http.post<any[]>(urlTemp, body).pipe(
      tap((res) => {
        // console.log('Filter Internal: ', res)
      })
    )
  }

  getChart2(body: any): Observable<any[]> {
    let urlTemp = this.urlExternal + 'get_chart_2/'
    return this.http.post<any[]>(urlTemp, body).pipe(
      tap((res) => {
        // console.log('Filter Internal: ', res)
      })
    )
  }

  generateBulkInternal(body: any): Observable<any[]> {
    let urlTemp = this.urlInternal + 'generate_bulk/'
    return this.http.post<any[]>(urlTemp, body).pipe(
      tap((res) => {
        // console.log('Print Internal: ', res)
      })
    )
  }
  
  generateBulkExternal(body: any): Observable<any[]> {
    let urlTemp = this.urlExternal + 'generate_bulk/'
    return this.http.post<any[]>(urlTemp, body).pipe(
      tap((res) => {
        // console.log('Print External: ', res)
      })
    )
  }

}
