import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  AccordionModule, 
  BsDatepickerModule, 
  BsDropdownModule,
  ModalModule,
  ProgressbarModule,
  TabsModule,
  TooltipModule
} from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper'; 
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule, IConfig } from 'ngx-mask'

import { TrainingCoordinatorRoutes } from './training-coordinator.routing';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TrainingsComponent } from './trainings/trainings.component';
import { ExamsComponent } from './exams/exams.component';
import { ExamAddComponent } from './exam-add/exam-add.component';
import { TrainingAddComponent } from './training-add/training-add.component';
import { TrainingDetailsComponent } from './training-details/training-details.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ReportComponent } from './report/report.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { QuillModule } from 'ngx-quill';
import { NeedAnalysisComponent } from './need-analysis/need-analysis.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  declarations: [
    DashboardComponent, 
    ExamsComponent,
    ExamAddComponent,
    TrainingsComponent,
    TrainingAddComponent,
    TrainingDetailsComponent,
    CalendarComponent,
    ReportComponent,
    ConfigurationComponent,
    NeedAnalysisComponent
  ],
  imports: [
    CommonModule,
    AccordionModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    MatButtonModule,
    MatStepperModule,
    MatIconModule,
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    FormsModule,
    QuillModule,
    ReactiveFormsModule,
    LoadingBarModule,
    NgxDatatableModule,
    NgxMaskModule.forRoot(),
    NgSelectModule,
    RouterModule.forChild(TrainingCoordinatorRoutes)
  ]
})
export class TrainingCoordinatorModule { }
