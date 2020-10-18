import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TrainingEvent } from './training-events.model';
import { Form } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingEventsService {

  // URL
  private urlEvents: string = environment.baseUrl +'v1/training-events/'
  
  // Data
  public events: TrainingEvent[] = []
  public eventsFiltered: TrainingEvent[] = []

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  get(): Observable<TrainingEvent[]> {
    return this.http.get<TrainingEvent[]>(this.urlEvents).pipe(
      tap((res) => {
        this.events = res
        console.log('Training events: ', this.events)
      })
    )
  }

  filter(filterField): Observable<any> {
    let filterUrl = this.urlEvents + '?' + filterField + '/'
    return this.http.get<TrainingEvent[]>(filterUrl).pipe(
      tap((res) => {
        this.eventsFiltered = res
        console.log('Filtered training events: ', this.eventsFiltered)
      })
    )
  }
  
}
