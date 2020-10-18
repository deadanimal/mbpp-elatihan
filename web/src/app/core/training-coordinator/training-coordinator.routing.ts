import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExamsComponent } from './exams/exams.component';
import { ExamAddComponent } from './exam-add/exam-add.component';
import { TrainingsComponent } from './trainings/trainings.component';
import { TrainingAddComponent } from './training-add/training-add.component';

export const TrainingCoordinatorRoutes: Routes = [
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
                path: 'trainings',
                children: [
                    {
                        path: 'summary',
                        component: TrainingsComponent
                    },
                    {
                        path: 'add',
                        component: TrainingAddComponent
                    }
                ]
            }
        ]
    }
]