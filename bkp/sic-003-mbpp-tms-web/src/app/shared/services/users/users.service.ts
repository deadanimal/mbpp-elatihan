import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './users.model';
import { Form } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  // URL
  private usersUrl: string = environment.baseUrl + 'v1/users/'
  
  // Data
  public users: User[] = []
  public usersFiltered: User[] = []
  public user: User

  public staffs: User[] = []
  public departmentCoordinators: User[] = []

  
  public trainingCoordinators: User[] = []
  public administrators: User[] = []
  public trainers: User[] = []

  public updateUserId: string

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  get(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl).pipe(
      tap((res) => {
        this.users = res
        console.log('Users: ', this.users)
      })
    )
  }

  getStaffs(): Observable<User[]> {
    let staffUrl = this.usersUrl + '?user_type=ST'
    return this.http.get<User[]>(staffUrl).pipe(
      tap((res) => {
        this.staffs = res
        console.log('Staffs: ', this.staffs)
      })
    )
  }

  // getDepartmentHeads(): Observable<User[]> {
  //   let departmentHeadUrl = this.usersUrl + '?user_type=DH'
  //   return this.http.get<User[]>(departmentHeadUrl).pipe(
  //     tap((res) => {
  //       this.departmentHeads = res
  //       console.log('Department heads: ', this.departmentHeads)
  //     })
  //   )
  // }

  // getDepartmentDirectors(): Observable<User[]> {
  //   let departmentDirectorUrl = this.usersUrl + '?user_type=DD'
  //   return this.http.get<User[]>(departmentDirectorUrl).pipe(
  //     tap((res) => {
  //       this.departmentDirectors = res
  //       console.log('Department directors: ', this.departmentDirectors)
  //     })
  //   )
  // }

  getTrainingCoordinators(): Observable<User[]> {
    let trainingCoordinatorsUrl = this.usersUrl + '?user_type=TC'
    return this.http.get<User[]>(trainingCoordinatorsUrl).pipe(
      tap((res) => {
        this.trainingCoordinators = res
        console.log('Training coordinators: ', this.trainingCoordinators)
      })
    )
  }

  getTrainers(): Observable<User[]> {
    let trainerUrl = this.usersUrl + '?user_type=TR'
    return this.http.get<User[]>(trainerUrl).pipe(
      tap((res) => {
        this.trainers = res
        console.log('Trainers: ', this.trainers)
      })
    )
  }

  getAdministrators(): Observable<User[]> {
    let staffUrl = this.usersUrl + '?user_type=AD'
    return this.http.get<User[]>(staffUrl).pipe(
      tap((res) => {
        this.administrators = res
        console.log('Administrators: ', this.administrators)
      })
    )
  }
  

  getSingleUser(userID: string): Observable<any> {
    let filterUrl = this.usersUrl + userID + '/'
    return this.http.get<User>(filterUrl).pipe(
      tap((res) => {
        this.user = res
        console.log('Self: ', this.user)
      })
    )
  }

  filter(filterField): Observable<any> {
    let filterUrl = this.usersUrl + '?' + filterField + '/'
    return this.http.get<User[]>(filterUrl).pipe(
      tap((res) => {
        this.usersFiltered = res
        console.log('Filtered users: ', this.usersFiltered)
      })
    )
  }

  update(body: Form, id): Observable<any> {
    let updateUrl = this.usersUrl + id  + '/'
    return this.http.put<any>(updateUrl, body).pipe(
      tap((res) => {
        console.log('Updated user: ', res)
      })
    )
  }

  complete(id: string): Observable<any> {
    let updateUrl = this.usersUrl + id  + '/completed/'
    return this.http.get<any>(updateUrl).pipe(
      tap((res) => {
        console.log('Completed: ', res)
      })
    )
  }

}
