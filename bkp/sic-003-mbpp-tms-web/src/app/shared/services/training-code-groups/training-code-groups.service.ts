import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TrainingCodeGroup } from './training-code-groups.model';
import { Form } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingCodeGroupsService {

  // URL
  private urlGroup: string = environment.baseUrl + 'v1/training-code-groups/'
  
  // Data
  public groups: TrainingCodeGroup[] = []
  public groupsFiltered: TrainingCodeGroup[] = []

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  create(body: Form): Observable<any> {
    return this.http.post<any>(this.urlGroup, body).pipe(
      tap((res) => {
        console.log('Create training code group response: ', res)
      })
    )
  }

  get(): Observable<TrainingCodeGroup[]> {
    return this.http.get<TrainingCodeGroup[]>(this.urlGroup).pipe(
      tap((res) => {
        this.groups = res
        console.log('Training code groups: ', this.groups)
      })
    )
  }

  update(body: Form, id): Observable<any> {
    let updateUrl = this.urlGroup + id  + '/'
    return this.http.put<TrainingCodeGroup>(updateUrl, body).pipe(
      tap((res) => {
        console.log('Updated training code group: ', res)
      })
    )
  }

  getOne(id: string): Observable<TrainingCodeGroup[]> {
    let getOneUrl = this.urlGroup + id + '/'
    return this.http.get<TrainingCodeGroup[]>(getOneUrl).pipe(
      tap((res) => {
        console.log('Training code group: ', res)
      })
    )
  }

  filter(filterField): Observable<any> {
    let filterUrl = this.urlGroup + '?' + filterField + '/'
    return this.http.get<TrainingCodeGroup[]>(filterUrl).pipe(
      tap((res) => {
        this.groupsFiltered = res
        console.log('Filtered training code groups: ', this.groupsFiltered)
      })
    )
  }
}
