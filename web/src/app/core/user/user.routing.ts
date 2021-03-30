import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExamsComponent } from './exams/exams.component';
import { ExamAddComponent } from './exam-add/exam-add.component';
import { TakwimComponent } from './takwim/takwim.component';
import { TrainingsComponent } from './trainings/trainings.component';
import { TrainingAddComponent } from './training-add/training-add.component';
import { TrainingDetailComponent } from './training-detail/training-detail.component';
import { TrainingHistoryComponent } from './training-history/training-history.component';
import { TrainingListComponent } from './training-list/training-list.component';
import { TrainingInformationComponent } from './training-information/training-information.component';
import { NeedAnalysisComponent } from './need-analysis/need-analysis.component';
import { TrainingEvaluateComponent } from './training-evaluate/training-evaluate.component';

export const UserRoutes: Routes = [
    {
        path: '',
        children: [
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
                path: 'takwim',
                component: TakwimComponent
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
                        path: 'detail',
                        component: TrainingDetailComponent
                    },
                    {
                        path: 'history',
                        component: TrainingHistoryComponent
                    },
                    {
                        path: 'list',
                        component: TrainingListComponent
                    },
                    {
                        path: 'information',
                        component: TrainingInformationComponent
                    },
                    {
                        path: 'evaluate',
                        component: TrainingEvaluateComponent
                    }
                ]
            },
            {
                path: 'need-analysis',
                children: [
                    {
                        path: '',
                        component: NeedAnalysisComponent
                    }
                ]
            }
        ]
    }
]