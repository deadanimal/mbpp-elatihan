import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Form } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Analysis, AnalysisExtended } from './analyses.model';

@Injectable({
  providedIn: 'root'
})
export class AnalysesService {

  // URL
  public urlAnalysis: string = environment.baseUrl + 'v1/training-need-analyses/'
  
  // Data
  analysis: Analysis
  analysisExtended: AnalysisExtended
  analyses: Analysis[] = []
  analysesExtended: AnalysisExtended[] = []

  statistics: any

  constructor(
    private http: HttpClient
  ) { }

  post(body: any): Observable<Analysis> {
    return this.http.post<any>(this.urlAnalysis, body).pipe(
      tap((res) => {
        this.analysis = res
        console.log('Analysis: ', this.analysis)
      })
    )
  }

  getAll(): Observable<AnalysisExtended[]> {
    let urlTemp = this.urlAnalysis + 'extended_all'
    return this.http.get<AnalysisExtended[]>(urlTemp).pipe(
      tap((res) => {
        this.analysesExtended = res
        console.log('Analyses: ', this.analysesExtended)
      })
    )
  }

  getAllRange(body: any): Observable<AnalysisExtended[]> {
    let urlTemp = this.urlAnalysis + 'get_all_range'
    return this.http.post<AnalysisExtended[]>(urlTemp, body).pipe(
      tap((res) => {
        this.analysesExtended = res
        console.log('Analyses: ', this.analysesExtended)
      })
    )
  }

  getOne(id: string): Observable<AnalysisExtended> {
    let urlTemp = this.urlAnalysis + id + '/extended'
    return this.http.get<AnalysisExtended>(urlTemp).pipe(
      tap((res) => {
        this.analysisExtended = res
        console.log('Analysis: ', this.analysisExtended)
      })
    )
  }

  getSelf(): Observable<AnalysisExtended[]> {
    let urlTemp = this.urlAnalysis + 'get_self'
    return this.http.get<AnalysisExtended[]>(urlTemp).pipe(
      tap((res) => {
        this.analysesExtended = res
        console.log('Analyses: ', this.analysesExtended)
      })
    )
  }

  getSelfRange(body: any): Observable<AnalysisExtended[]> {
    let urlTemp = this.urlAnalysis + 'get_self_range'
    return this.http.post<AnalysisExtended[]>(urlTemp, body).pipe(
      tap((res) => {
        this.analysesExtended = res
        console.log('Analyses: ', this.analysesExtended)
      })
    )
  }

  update(id: String, body: Form): Observable<Analysis> {
    let urlTemp = this.urlAnalysis + id + '/'
    return this.http.put<Analysis>(urlTemp, body).pipe(
      tap((res) => {
        this.analysis = res
        console.log('Analysis', this.analysis)
      })
    )
  }

  getStatistics() {
    let urlTemp = this.urlAnalysis + 'get_statistics'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.statistics = res
        console.log('Statistics: ', this.statistics)
      })
    )
  }

}
