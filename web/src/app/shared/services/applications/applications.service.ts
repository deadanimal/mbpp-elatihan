import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Form } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Application, ApplicationDepartmentExtended, ApplicationSelfExtended } from './applications.model';


@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {

  // URL
  public urlApplications: string = environment.baseUrl + 'v1/training-applications/'

  // Data
  application: Application
  applications: Application[] = []
  applicationsFiltered: Application[] = []

  applicationsSelf: ApplicationSelfExtended[] = []
  applicationsDepartment: ApplicationDepartmentExtended[] = []

  statisticSelf: any

  constructor(
    private http: HttpClient
  ) { }

  post(body: Form): Observable<Application> {
    return this.http.post<any>(this.urlApplications, body).pipe(
      tap((res) => {
        this.application = res
        // console.log('Application: ', this.application)
      })
    )
  }

  postBatch(body: any): Observable<Application[]> {
    let urlTemp = this.urlApplications + 'apply_batch/'
    return this.http.post<any>(urlTemp, body).pipe(
      tap((res) => {
        this.application = res
        // console.log('Application: ', this.application)
      })
    )
  }

  getAll(): Observable<Application[]> {
    return this.http.get<Application[]>(this.urlApplications).pipe(
      tap((res) => {
        this.applications = res
        // console.log('Applications: ', this.applications)
      })
    )
  }

  getDepartmentCoordinatorList(): Observable<ApplicationDepartmentExtended[]> {
    let urlTemp = this.urlApplications + 'get_department_coordinator_list'
    return this.http.get<ApplicationDepartmentExtended[]>(urlTemp).pipe(
      tap((res) => {
        this.applicationsDepartment = res
        // console.log('Applications: ', this.applicationsDepartment)
      })
    )
  }

  getDepartmentHeadList(): Observable<ApplicationDepartmentExtended[]> {
    let urlTemp = this.urlApplications + 'get_department_head_list'
    return this.http.get<ApplicationDepartmentExtended[]>(urlTemp).pipe(
      tap((res) => {
        this.applicationsDepartment = res
        // console.log('Applications: ', this.applicationsDepartment)
      })
    )
  }

  getDepartmentCoordinatorHistories(): Observable<ApplicationDepartmentExtended[]> {
    let urlTemp = this.urlApplications + 'get_department_coordinator_histories'
    return this.http.get<ApplicationDepartmentExtended[]>(urlTemp).pipe(
      tap((res) => {
        this.applicationsDepartment = res
        // console.log('Applications: ', this.applicationsDepartment)
      })
    )
  }

  getDepartmentHeadHistories(): Observable<ApplicationDepartmentExtended[]> {
    let urlTemp = this.urlApplications + 'get_department_head_histories'
    return this.http.get<ApplicationDepartmentExtended[]>(urlTemp).pipe(
      tap((res) => {
        this.applicationsDepartment = res
        // console.log('Applications: ', this.applicationsDepartment)
      })
    )
  }

  getSelf(): Observable<ApplicationSelfExtended[]> {
    let urlTemp = this.urlApplications + 'get_self_latest'
    return this.http.get<ApplicationSelfExtended[]>(urlTemp).pipe(
      tap((res) => {
        this.applicationsSelf = res
        // console.log('Applications: ', this.applicationsSelf)
      })
    )
  }

  getOne(id: String): Observable<Application> {
    let urlTemp = this.urlApplications + id + '/'
    return this.http.get<Application>(urlTemp).pipe(
      tap((res) => {
        this.application = res
        // console.log('Application: ', this.application)
      })
    )
  }

  update(id: String, body: Form): Observable<Application> {
    let urlTemp = this.urlApplications + id + '/'
    return this.http.put<Application>(urlTemp, body).pipe(
      tap((res) => {
        this.application = res
        // console.log('Application', this.application)
      })
    )
  }

  filter(field: String): Observable<Application[]> {
    let urlTemp = this.urlApplications + '?' + field
    return this.http.get<Application[]>(urlTemp).pipe(
      tap((res) => {
        this.applicationsFiltered = res
        // console.log('Applications', this.applicationsFiltered)
      })
    )
  }

  approveLevel1(id: string) {
    let urlTemp = this.urlApplications + id + '/approve_level_1/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.application = res
        // console.log('Application: ', this.application)
      })
    )
  }

  approveLevel2(id: string) {
    let urlTemp = this.urlApplications + id + '/approve_level_2/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.application = res
        // console.log('Application: ', this.application)
      })
    )
  }

  approveLevel3(id: string) {
    let urlTemp = this.urlApplications + id + '/approve_level_3/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.application = res
        // console.log('Application: ', this.application)
      })
    )
  }

  reject(id: string) {
    let urlTemp = this.urlApplications + id + '/reject/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.application = res
        // console.log('Application: ', this.application)
      })
    )
  }

  reserve(id: string) {
    let urlTemp = this.urlApplications + id + '/reserve/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.application = res
        // console.log('Application: ', this.application)
      })
    )
  }

  getStatisticsSelf() {
    let urlTemp = this.urlApplications + 'get_statistics_self'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.statisticSelf = res
        // console.log('Statistics: ', this.statisticSelf)
      })
    )
  }

}
