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
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxGaugeModule } from 'ngx-gauge';
import { NgSelectModule } from '@ng-select/ng-select';

import { RouterModule } from '@angular/router';
import { DepartmentCoordinatorRoutes } from './deparment-coordinator.routing';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExamsComponent } from './exams/exams.component';
import { ExamAddComponent } from './exam-add/exam-add.component';
import { ReportComponent } from './report/report.component';
import { StaffsComponent } from './staffs/staffs.component';
import { TrainingsComponent } from './trainings/trainings.component';
import { TrainingInformationComponent } from './training-information/training-information.component';
import { StaffInformationComponent } from './staff-information/staff-information.component';
import { TrainingApplicationsComponent } from './training-applications/training-applications.component';
import { TrainingHistoriesComponent } from './training-histories/training-histories.component';
import { CalendarComponent } from './calendar/calendar.component';
import { TrainingApplicationsHeadComponent } from './training-applications-head/training-applications-head.component';

@NgModule({
  declarations: [
    DashboardComponent,
    TrainingsComponent,
    TrainingInformationComponent,
    ExamsComponent,
    ExamAddComponent,
    ReportComponent,
    StaffsComponent,
    StaffInformationComponent,
    TrainingApplicationsComponent,
    TrainingHistoriesComponent,
    CalendarComponent,
    TrainingApplicationsHeadComponent
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
    NgSelectModule,
    RouterModule.forChild(DepartmentCoordinatorRoutes)
  ]
})
export class DepartmentCoordinatorModule { }
