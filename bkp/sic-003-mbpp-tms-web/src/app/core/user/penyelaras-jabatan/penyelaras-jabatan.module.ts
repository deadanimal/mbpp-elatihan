import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { 
  BsDropdownModule, 
  ProgressbarModule, 
  TooltipModule, 
  BsDatepickerModule,
  ModalModule
} from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { PenyelarasJabatanRoutes } from './penyelaras-jabatan.routing';
import { PermohonanComponent } from './kursus/permohonan/permohonan.component';
import { PenilaianLuaranComponent } from './kursus/penilaian-luaran/penilaian-luaran.component';
import { SenaraiComponent } from './kursus/senarai/senarai.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LaporanComponent } from './laporan/laporan.component';
import { TakwimComponent } from './takwim/takwim.component';
import { ProfilComponent } from './profil/profil.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DashboardComponent, 
    PermohonanComponent, 
    PenilaianLuaranComponent, 
    SenaraiComponent, LaporanComponent, TakwimComponent, ProfilComponent
  ],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(PenyelarasJabatanRoutes),
    NgxDatatableModule,
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PenyelarasJabatanModule { }
