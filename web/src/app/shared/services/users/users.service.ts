import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Form } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from './users.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  // URL
  public urlUser: string = environment.baseUrl + 'v1/users/'

  // Data
  public user: User
  public users: User[] = []
  public usersFiltered: User[] = []

  constructor(
    private http: HttpClient
  ) { }

  create(body: Form): Observable<User> {
    return this.http.post<any>(this.urlUser, body).pipe(
      tap((res) => {
        this.user = res
        console.log('User: ', this.user)
      })
    )
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.urlUser).pipe(
      tap((res) => {
        this.users = res
        console.log('Users: ', this.users)
      })
    )
  }

  getOne(id: String): Observable<User> {
    let urlTemp = this.urlUser + id + '/'
    return this.http.get<User>(urlTemp).pipe(
      tap((res) => {
        this.user = res
        console.log('User: ', this.user)
      })
    )
  }

  update(id: String, body: Form): Observable<User> {
    let urlTemp = this.urlUser + id + '/'
    return this.http.put<User>(urlTemp, body).pipe(
      tap((res) => {
        this.user = res
        console.log('User', this.user)
      })
    )
  }

  filter(field: String): Observable<User[]> {
    let urlTemp = this.urlUser + '?' + field
    return this.http.get<User[]>(urlTemp).pipe(
      tap((res) => {
        this.usersFiltered = res
        console.log('Users', this.usersFiltered)
      })
    )
  }

}
