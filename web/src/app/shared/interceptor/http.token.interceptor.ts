import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { JwtService } from '../handler/jwt/jwt.service';
import { NotifyService } from '../handler/notify/notify.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

    constructor(
        private notifyService: NotifyService,
        private jwtService: JwtService,
        private router: Router
    ){ }

    private handleError(error: HttpErrorResponse) {
        let data = {}
        data = {
            reason: error && error.error.reason ? error.error.reason : '',
            status: error.status
        }
        console.log(data)
        if (error instanceof HttpErrorResponse) {
            // Server or connection error happened
            if (!navigator.onLine) {
                // Handle offline error
                // this.notifyService.openToastrConnection()
            } else {
                // Handle Http Error (error.status === 403, 404...)
                // this.notifyService.openToastrError(error.status, error.statusText)
                // console.log('Maka disinilah error akan ditunjuk: ', error)
                if (error.error.code == 'token_not_valid') {
                    let title = 'Ralat'
                    let message = 'Sesi anda telah tamat. Anda diminta untuk log masuk sekali lagi'
                    this.notifyService.openToastrInfo(title, message)
                    this.router.navigate(['/auth/login'])
                }
            }
        } else {
            // Handle Client Error (Angular Error, ReferenceError...)     
        }
        console.error('It happens: ', error);
        console.log('Error: ', error)
        return throwError(error)
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const headersConfig = {
            'Accept': '*/*'
        };
        // 'Content-Type': 'application/json',

        if (req.url.includes('auth/obtain')) {
            // console.log('Is obtain? ', req.url.includes('auth/obtain'))
            this.jwtService.destroyToken()
        }

        if (
            this.router.url != '/home' &&
            this.router.url != '/auth/login'
        ) {
            const token = this.jwtService.getToken('accessToken');
            headersConfig['Authorization'] = `Bearer ${token}`;
            // console.log(headersConfig)
        }

        const request = req.clone({ setHeaders: headersConfig });
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // console.log('Event: ', event);
                }
                return event;
            }),
            catchError(this.handleError.bind(this))
        );
    }

}
