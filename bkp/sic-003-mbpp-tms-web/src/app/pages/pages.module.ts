import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { 
  BsDropdownModule, 
  CollapseModule, 
  ModalModule, 
  ProgressbarModule,
  TooltipModule
} from 'ngx-bootstrap';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { RouterModule } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { HomeComponent } from './home/home.component';
import { PagesRoutes } from './pages.routing';

@NgModule({
  declarations: [
    HomeComponent, 
    CalendarComponent
  ],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    LoadingBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    RouterModule.forChild(PagesRoutes)
  ]
})
export class PagesModule { }
