import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Form } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Plan } from './plans.model';

@Injectable({
  providedIn: 'root'
})
export class PlansService {

  // URL
  public urlPlans: string = environment.baseUrl + 'v1/monitoring-plans/'

  // Data
  plan: Plan
  plans: Plan[] = []
  plansFiltered: Plan[] = []

  constructor(
    private http: HttpClient
  ) { }

  post(body: any): Observable<Plan> {
    return this.http.post<any>(this.urlPlans, body).pipe(
      tap((res) => {
        this.plan = res
        // console.log('Plan: ', this.plan)
      })
    )
  }

  getAll(): Observable<Plan[]> {
    return this.http.get<Plan[]>(this.urlPlans).pipe(
      tap((res) => {
        this.plans = res
        // console.log('Plans: ', this.plans)
      })
    )
  }

  getOne(id: String): Observable<Plan> {
    let urlTemp = this.urlPlans + id + '/'
    return this.http.get<Plan>(urlTemp).pipe(
      tap((res) => {
        this.plan = res
        // console.log('Plan: ', this.plan)
      })
    )
  }

  patch(id: String, body: Form): Observable<Plan> {
    let urlTemp = this.urlPlans + id + '/'
    return this.http.patch<Plan>(urlTemp, body).pipe(
      tap((res) => {
        this.plan = res
        // console.log('Plan: ', this.plan)
      })
    )
  }

  filter(field: String): Observable<Plan[]> {
    let urlTemp = this.urlPlans + '?' + field + '/'
    return this.http.get<Plan[]>(urlTemp).pipe(
      tap((res) => {
        this.plansFiltered = res
        // console.log('Plans: ', this.plansFiltered)
      })
    )
  }

  activate(id: string) {
    let urlTemp = this.urlPlans + id + '/activate/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.plan = res
        // console.log('Plan: ', this.plan)
      })
    )
  }

  deactivate(id: string) {
    let urlTemp = this.urlPlans + id + '/deactivate/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.plan = res
        // console.log('Plan: ', this.plan)
      })
    )
  }
}
