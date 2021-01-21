import { Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExamsComponent } from './exams/exams.component';
import { ExamAddComponent } from './exam-add/exam-add.component';
import { ReportComponent } from './report/report.component';
import { TrainingsComponent } from './trainings/trainings.component';
import { TrainingAddComponent } from './training-add/training-add.component';
import { TrainingDetailsComponent } from './training-details/training-details.component';

export const TrainingCoordinatorRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'calendar',
                component: CalendarComponent
            },
            {
                path: 'configuration',
                component: ConfigurationComponent
            },
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'exams',
                children: [
                    {
                        path: 'summary',
                        component: ExamsComponent
                    },
                    {
                        path: 'add',
                        component: ExamAddComponent
                    }
                ]
            },
            {
                path: 'trainings',
                children: [
                    {
                        path: 'summary',
                        component: TrainingsComponent
                    },
                    {
                        path: 'add',
                        component: TrainingAddComponent
                    },
                    {
                        path: 'details',
                        component: TrainingDetailsComponent
                    }
                ]
            },
            {
                path: 'report',
                component: ReportComponent
            }
        ]
    }
]