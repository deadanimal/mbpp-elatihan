import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BsDropdownModule, ProgressbarModule, TooltipModule, ModalModule, BsDatepickerModule, TabsModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { AdminRoutes } from './admin.routing';

import { FusionChartsModule } from 'angular-fusioncharts';
import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as Widgets from 'fusioncharts/fusioncharts.widgets';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import { ManagementComponent } from './management/management.component';
import { PlanComponent } from './plan/plan.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PengurusanTambahComponent } from './pengurusan-tambah/pengurusan-tambah.component';
import { PengurusanSenaraiComponent } from './pengurusan-senarai/pengurusan-senarai.component';
import { PengurusanPenggunaComponent } from './pengurusan-pengguna/pengurusan-pengguna.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { ProfilComponent } from './profil/profil.component';
import { PengurusanLogComponent } from './pengurusan-log/pengurusan-log.component';
FusionChartsModule.fcRoot(
  FusionCharts, 
  Charts,
  Widgets,
  FusionTheme
);

@NgModule({
  declarations: [
    DashboardComponent,
    ManagementComponent,
    PlanComponent,
    PengurusanTambahComponent,
    PengurusanSenaraiComponent,
    PengurusanPenggunaComponent,
    ProfilComponent,
    PengurusanLogComponent
  ],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    RouterModule.forChild(AdminRoutes),
    FusionChartsModule,
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    TabsModule.forRoot(),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    LoadingBarModule
  ]
})
export class AdminModule { }
