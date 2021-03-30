import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  AccordionModule,
  BsDropdownModule,
  ModalModule,
  ProgressbarModule, 
  TabsModule,
  TooltipModule
} from 'ngx-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { NgxGaugeModule } from 'ngx-gauge';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { RouterModule } from '@angular/router';
import { UserRoutes } from './user.routing';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TrainingsComponent } from './trainings/trainings.component';
import { TrainingAddComponent } from './training-add/training-add.component';
import { ExamsComponent } from './exams/exams.component';
import { ExamAddComponent } from './exam-add/exam-add.component';
import { TakwimComponent } from './takwim/takwim.component';
import { TrainingListComponent } from './training-list/training-list.component';
import { TrainingHistoryComponent } from './training-history/training-history.component';
import { TrainingDetailComponent } from './training-detail/training-detail.component';
import { TrainingInformationComponent } from './training-information/training-information.component';
import { NeedAnalysisComponent } from './need-analysis/need-analysis.component';
import { EvaluationsComponent } from './evaluations/evaluations.component';
import { TrainingEvaluateComponent } from './training-evaluate/training-evaluate.component';

@NgModule({
  declarations: [
    DashboardComponent,
    TrainingsComponent,
    TrainingAddComponent,
    ExamsComponent,
    ExamAddComponent,
    TakwimComponent,
    TrainingListComponent,
    TrainingHistoryComponent,
    TrainingDetailComponent,
    TrainingInformationComponent,
    NeedAnalysisComponent,
    EvaluationsComponent,
    TrainingEvaluateComponent
  ],
  imports: [
    CommonModule,
    AccordionModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    LoadingBarModule,
    NgxDatatableModule,
    NgxGaugeModule,
    ZXingScannerModule,
    RouterModule.forChild(UserRoutes)
  ]
})
export class UserModule { }
