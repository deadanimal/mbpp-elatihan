import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { TokenResponse } from './auth.model';
import { Form } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { JwtService } from '../../handler/jwt/jwt.service';
import { NotifyService } from '../../handler/notify/notify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // URL
  public urlRegister: string = environment.baseUrl + 'auth/registration/'
  public urlPasswordChange: string = environment.baseUrl + 'auth/password/change/'
  public urlPasswordReset: string = environment.baseUrl + 'auth/password/reset'
  public urlTokenObtain: string = environment.baseUrl + 'auth/obtain/'
  public urlTokenRefresh: string = environment.baseUrl + 'auth/refresh/'
  public urlTokenVerify: string = environment.baseUrl + 'auth/verify/' 
  public urlUser: string = environment.baseUrl + 'v1/users/'

  // Data
  public token: TokenResponse
  public tokenAccess: string
  public tokenRefresh: string
  public email: string
  public userID: string
  public username: string
  public userType: string
  public userRole: number = 1
  public isLogged = false

  // Temp
  userDetail: any
  retrievedUsers: any = []
  
  constructor(
    private jwtService: JwtService,
    private http: HttpClient,
    private notifyService: NotifyService
  ) { }

  register(body: Form): Observable<any> {
    return this.http.post<any>(this.urlRegister, body).pipe(
      tap((res) => {
        // console.log('Registration: ', res)
      })
    )
  }

  changePassword(body: Form): Observable<any> {
    return this.http.post<any>(this.urlPasswordChange, body).pipe(
      tap((res) => {
        // console.log('Change password: ', res)
      },
      (err) => {
        console.log(err['error'])
        if (err['error']['new_password2']) {
          for (let err_ of err['error']['new_password2']) {
            if (err_ == 'This password is too common.') {
              let title1 = 'Ralat'
              let message1 = 'Kata laluan ini terlalu biasa. Sila cuba sekali lagi menggunakan kata laluan lain'
              this.notifyService.openToastrError(title1, message1)
            }
            else if (err_ == 'This password is entirely numeric.') {
              let title2 = 'Ralat'
              let message2 = 'Kata laluan ini sepenuhnya angka. Sila cuba sekali lagi menggunakan kata laluan lain'
              this.notifyService.openToastrError(title2, message2)
            }
            else if (err_ == 'This password is too short. It must contain at least 8 characters.') {
              let title3 = 'Ralat'
              let message3 = 'Kata laluan ini terlalu pendek. Ia mesti mengandungi sekurang-kurangnya 8 aksara. Sila cuba sekali lagi'
              this.notifyService.openToastrError(title3, message3)
            }
          }
        }
      })
    )
  }

  resetPassword(body: Form): Observable<any> {
    return this.http.post<any>(this.urlPasswordReset, body).pipe(
      tap((res) => {
        // console.log('Reset password: ', res)
      })
    )
  }

  obtainToken(body: Form): Observable<any> {
    let jwtHelper: JwtHelperService = new JwtHelperService()
    return this.http.post<any>(this.urlTokenObtain, body).pipe(
      tap((res) => {
        this.token = res
        this.tokenRefresh = res.refresh
        this.tokenAccess = res.access

        let decodedToken = jwtHelper.decodeToken(this.tokenAccess)
        this.email = decodedToken.email
        this.username = decodedToken.username
        this.userID = decodedToken.user_id
        this.userType = decodedToken.user_type
        // console.log('Decoded token: ', decodedToken)
        // console.log('Post response: ', res)
        // console.log('Refresh token', this.tokenRefresh)
        // console.log('Access token', this.tokenAccess)
        // console.log('Token: ', this.token)
        // console.log('Email: ', this.email)
        // console.log('Username: ', this.username)
        // console.log('User ID: ', this.userID)
        // console.log('User type: ', this.userType)
        if (this.userType == 'ST') {
          this.userRole = 1
        }
        else if (this.userType == 'TC') {
          this.userRole = 2
        }
        else if (this.userType == 'DC') {
          this.userRole = 3
        }
        else if (this.userType == 'DH') {
          this.userRole = 4
        }
        else if (this.userType == 'AD') {
          this.userRole = 5
        }
        this.jwtService.saveToken('accessToken', this.tokenAccess)
        this.jwtService.saveToken('refreshToken', this.tokenRefresh)
      })
    )
  }

  refreshToken(): Observable<any> {
    let refreshToken = this.jwtService.getToken('refreshToken')
    let body = {
      refresh: refreshToken
    }
    return this.http.post<any>(this.urlTokenRefresh, body).pipe(
      tap((res) => {
        // console.log('Token refresh: ', res)
      })
    )
  }

  verifyToken(body: Form): Observable<any> {
    return this.http.post<any>(this.urlTokenVerify, body).pipe(
      tap((res) => {
        // console.log('Token verify: ', res)
      })
    )
  }

  getUserDetail(): Observable<any> {
    // console.log('getuserdetail')
    let urlTemp = this.urlUser + this.userID + '/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.userDetail = res
        // console.log('User detail', this.userDetail)
      })
    )
  }

  getDetailByToken():Observable<any> {
    // console.log('getuserbytoken')
    let urlTemp = this.urlUser + 'current_user_detail'
    let jwtHelper: JwtHelperService = new JwtHelperService()
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        this.userDetail = res
        this.isLogged = true
        // console.log('User detail', this.userDetail)

        this.tokenRefresh = this.jwtService.getToken('accessToken') as string
        this.tokenAccess = this.jwtService.getToken('refreshToken') as string

        let decodedToken = jwtHelper.decodeToken(this.tokenAccess)
        this.email = decodedToken.email
        this.username = decodedToken.username
        this.userID = decodedToken.user_id
        this.userType = decodedToken.user_type

        if (this.userType == 'ST') {
          this.userRole = 1
        }
        else if (this.userType == 'TC') {
          this.userRole = 2
        }
        else if (this.userType == 'DC') {
          this.userRole = 3
        }
        else if (this.userType == 'DH') {
          this.userRole = 4
        }
        else if (this.userType == 'AD') {
          this.userRole = 5
        }
        // console.log(this.userType, this.userRole)
      })
    )
  }

  completeFirstLogin(): Observable<any> {
    let urlTemp = this.urlUser + this.userID + '/complete_first_login/'
    return this.http.get<any>(urlTemp).pipe(
      tap((res) => {
        // console.log('Complete first login', res)
      })
    )
  }

}
