import { Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EvaluationsComponent } from './evaluations/evaluations.component';
import { ExamsComponent } from './exams/exams.component';
import { ExamAddComponent } from './exam-add/exam-add.component';
import { NeedAnalysisComponent } from './need-analysis/need-analysis.component';
import { ReportComponent } from './report/report.component';
import { ReportConfigurationComponent } from './report-configuration/report-configuration.component';
import { TrainingsComponent } from './trainings/trainings.component';
import { TrainingAddComponent } from './training-add/training-add.component';
import { TrainingDetailsComponent } from './training-details/training-details.component';
import { UsersComponent } from './users/users.component';
import { EvaluationDetailsComponent } from './evaluation-details/evaluation-details.component';
import { TrainingHistoriesComponent } from './training-histories/training-histories.component';

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
                path: 'evaluations',
                children: [
                    {
                        path: '',
                        component: EvaluationsComponent
                    },
                    {
                        path: 'details',
                        component: EvaluationDetailsComponent
                    }
                ]
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
                    },
                    {
                        path: 'applicant-histories',
                        component: TrainingHistoriesComponent
                    },
                ]
            },
            {
                path: 'report',
                children: [
                    {
                        path: 'generate',
                        component: ReportComponent
                    },
                    {
                        path: 'configuration',
                        component: ReportConfigurationComponent
                    }
                ]
            },
            {
                path: 'need-analyses',
                component: NeedAnalysisComponent
            },
            {
                path: 'users',
                component: UsersComponent
            }
        ]
    }
]