import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ErrorComponent } from './error/error.component';

export const AuthRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'logout',
                component: LogoutComponent
            },
            {
                path: 'forgot',
                component: ForgotComponent
            },
            {
                path: 'error',
                component: ErrorComponent
            }
        ]
    }
]