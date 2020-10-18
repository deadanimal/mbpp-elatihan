import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TrainingCodeCategory } from './training-code-categories.model';
import { Form } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingCodeCategoriesService {

  // URL
  private urlCategory: string = environment.baseUrl + 'v1/training-code-categories/'
  
  // Data
  public categories: TrainingCodeCategory[] = []
  public categoriesFiltered: TrainingCodeCategory[] = []

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  create(body: Form): Observable<any> {
    return this.http.post<any>(this.urlCategory, body).pipe(
      tap((res) => {
        console.log('Create training code categories response: ', res)
      })
    )
  }

  get(): Observable<TrainingCodeCategory[]> {
    let getUrl = this.urlCategory + + '/'
    return this.http.get<TrainingCodeCategory[]>(getUrl ).pipe(
      tap((res) => {
        this.categories = res
        console.log('Training code categories: ', this.categories)
      })
    )
  }

  update(body: Form, id): Observable<any> {
    let updateUrl = this.urlCategory + '/' + id  + '/'
    return this.http.put<TrainingCodeCategory>(updateUrl, body).pipe(
      tap((res) => {
        console.log('Updated training code category: ', res)
      })
    )
  }

  getOne(id: string): Observable<TrainingCodeCategory[]> {
    let getOneUrl = this.urlCategory + id + '/'
    return this.http.get<TrainingCodeCategory[]>(getOneUrl).pipe(
      tap((res) => {
        console.log('Training code category: ', res)
      })
    )
  }

  filter(filterField): Observable<any> {
    let filterUrl = this.urlCategory + '?' + filterField + '/'
    return this.http.get<TrainingCodeCategory[]>(filterUrl).pipe(
      tap((res) => {
        this.categoriesFiltered = res
        console.log('Filtered training code categories: ', this.categoriesFiltered)
      })
    )
  }

}
