import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ExamEvent } from './exam-events.model';
import { Form } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExamEventsService {

  // URL
  private examEventsUrl: string = environment.baseUrl +'v1/exam-events/'
  
  // Data
  public events: ExamEvent[] = []
  public eventsFiltered: ExamEvent[] = []

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  get(): Observable<ExamEvent[]> {
    return this.http.get<ExamEvent[]>(this.examEventsUrl).pipe(
      tap((res) => {
        this.events = res
        console.log('Exam events: ', this.events)
      })
    )
  }

  filter(filterField): Observable<any> {
    let filterUrl = this.examEventsUrl + '?' + filterField + '/'
    return this.http.get<ExamEvent[]>(filterUrl).pipe(
      tap((res) => {
        this.eventsFiltered = res
        console.log('Filtered exam events: ', this.eventsFiltered)
      })
    )
  }

}
