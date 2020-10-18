import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SecurityQuestion } from './security-questions.model';
import { Form } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityQuestionsService {

  // URL
  public urlQuestion: string = environment.baseUrl + 'v1/security-questions/'
  
  // Data
  public questions: SecurityQuestion[] = []
  public questionsFiltered: SecurityQuestion[] = []

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  get(): Observable<SecurityQuestion[]> {
    return this.http.get<SecurityQuestion[]>(this.urlQuestion).pipe(
      tap((res) => {
        this.questions = res
        console.log('Security questions: ', this.questions)
      })
    )
  }

  update(credentials: Form, id): Observable<any> {
    let updateUrl = this.urlQuestion + id  + '/'
    return this.http.put<any>(updateUrl, credentials).pipe(
      tap((res) => {
        console.log('Updated security question: ', res)
      })
    )
  }

}
