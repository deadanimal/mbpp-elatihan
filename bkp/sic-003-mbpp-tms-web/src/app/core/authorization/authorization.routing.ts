import { Routes } from '@angular/router';
import { ErrorComponent } from './error/error.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';

export const AuthorizationRoutes: Routes = [
    {
        path: 'error',
        component: ErrorComponent
    },
    {
        path: 'not-authorized',
        component: NotAuthorizedComponent
    }
]