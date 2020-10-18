import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilComponent } from './profil/profil.component';
import { 
  BsDropdownModule, 
  ProgressbarModule, 
  TooltipModule, 
  BsDatepickerModule, 
  ModalModule,
  CollapseModule,
  TabsModule
} from 'ngx-bootstrap';
import { NgxGaugeModule } from 'ngx-gauge';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { LoadingBarModule } from '@ngx-loading-bar/core';

import { RouterModule } from '@angular/router';
import { KakitanganRoutes } from './kakitangan.routing';
import { TakwimLatihanComponent } from './takwim-latihan/takwim-latihan.component';
import { KursusComponent } from './kursus/kursus.component';
import { KursusInfoComponent } from './profil/kursus-info/kursus-info.component';
import { SurveyComponent } from './survey/survey.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestingComponent } from './testing/testing.component';
import { KursusButiranComponent } from './kursus-butiran/kursus-butiran.component';
import { KursusPenilaianComponent } from './kursus-penilaian/kursus-penilaian.component';
import { KursusNotaComponent } from './kursus-nota/kursus-nota.component';
import { KursusSejarahComponent } from './kursus-sejarah/kursus-sejarah.component';
import { KursusKehadiranComponent } from './kursus-kehadiran/kursus-kehadiran.component';
import { KursusLaporanComponent } from './kursus-laporan/kursus-laporan.component';
import { KursusLaporanPenilaianComponent } from './kursus-laporan-penilaian/kursus-laporan-penilaian.component';

@NgModule({
  declarations: [
    ProfilComponent,
    TakwimLatihanComponent,
    KursusComponent,
    KursusInfoComponent,
    SurveyComponent,
    DashboardComponent,
    TestingComponent,
    KursusButiranComponent,
    KursusPenilaianComponent,
    KursusNotaComponent,
    KursusSejarahComponent,
    KursusKehadiranComponent,
    KursusLaporanComponent,
    KursusLaporanPenilaianComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(KakitanganRoutes),
    ModalModule.forRoot(),
    NgxGaugeModule,
    TabsModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    LoadingBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ]
})
export class KakitanganModule { }
