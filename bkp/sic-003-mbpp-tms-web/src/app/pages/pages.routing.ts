import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CalendarComponent } from './calendar/calendar.component';

export const PagesRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: 'calendar',
                component: CalendarComponent
            }
        ]
    }
]