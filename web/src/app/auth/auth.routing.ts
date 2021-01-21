import { Routes } from '@angular/router';
import { ForgotComponent } from './forgot/forgot.component';
import { LoginComponent } from './login/login.component';

export const AuthRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'forgot',
                component: ForgotComponent
            },
            {
                path: 'login',
                component: LoginComponent
            }
        ]
    }
]