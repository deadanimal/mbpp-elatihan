import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ExamAddComponent } from './exam-add/exam-add.component';
import { ExamsComponent } from './exams/exams.component';
import { ReportComponent } from './report/report.component';
import { StaffsComponent } from './staffs/staffs.component';
import { TrainingsComponent } from './trainings/trainings.component';
import { TrainingInformationComponent } from './training-information/training-information.component';
import { StaffInformationComponent } from './staff-information/staff-information.component';
import { TrainingApplicationsComponent } from './training-applications/training-applications.component';
import { TrainingHistoriesComponent } from './training-histories/training-histories.component';
import { TrainingApplicationsHeadComponent } from './training-applications-head/training-applications-head.component';
import { CalendarComponent } from './calendar/calendar.component';

export const DepartmentCoordinatorRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'takwim',
                component: CalendarComponent
            },
            {
                path : 'dashboard',
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
                path: 'report',
                component: ReportComponent
            },
            {
                path: 'staffs',
                children: [
                    {
                        path: 'list',
                        component: StaffsComponent
                    },
                    {
                        path: 'information',
                        component: StaffInformationComponent
                    }
                ]
            },
            {
                path: 'trainings',
                children: [
                    {
                        path: 'list',
                        component: TrainingsComponent
                    },
                    {
                        path: 'information',
                        component: TrainingInformationComponent
                    },
                    {
                        path: 'applications',
                        component: TrainingApplicationsComponent
                    },
                    {
                        path: 'application-histories',
                        component: TrainingHistoriesComponent
                    },
                    {
                        path: 'applications-head',
                        component: TrainingApplicationsHeadComponent
                    }
                ]
            }
        ]
    }
]