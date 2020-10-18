import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { 
  BsDatepickerModule,
  BsDropdownModule, 
  ModalModule,
  ProgressbarModule, 
  TooltipModule,
  TabsModule
} from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper'; 
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';

import { PenyelarasRoutes } from './penyelaras.routing';
import { DashboardComponent } from './dashboard/dashboard.component';
import { KeperluanKursusComponent } from './keperluan-kursus/keperluan-kursus.component';
import { KursusComponent } from './kursus/kursus.component';
import { LaporanComponent } from './laporan/laporan.component';
import { PelanOperasiComponent } from './pelan-operasi/pelan-operasi.component';
//import { PeperiksaanComponent } from './peperiksaan/peperiksaan.component';
import { InfoComponent } from './kursus/info/info.component';
import { MaklumatPemohonComponent } from './kursus/maklumat-pemohon/maklumat-pemohon.component';
import { LaporanSelesaiComponent } from './kursus/laporan-selesai/laporan-selesai.component';
import { TambahComponent } from './kursus/tambah/tambah.component';
//import { TambahPeperiksaanComponent } from './peperiksaan/tambah/tambah.component';
// import { MaklumatPeperiksaanComponent } from './peperiksaan/maklumat-peperiksaan/maklumat-peperiksaan.component';
import { KursusSemasaComponent } from './kursus-semasa/kursus-semasa.component';
import { KursusTambahComponent } from './kursus-tambah/kursus-tambah.component';
import { KeperluanKursusTambahComponent } from './keperluan-kursus-tambah/keperluan-kursus-tambah.component';
import { KursusMaklumatComponent } from './kursus-maklumat/kursus-maklumat.component';
import { KursusLepasComponent } from './kursus-lepas/kursus-lepas.component';
import { KursusButiranComponent } from './kursus-butiran/kursus-butiran.component';
import { PeperiksaanOverviewComponent } from './peperiksaan-overview/peperiksaan-overview.component';
import { PeperiksaanTambahComponent } from './peperiksaan-tambah/peperiksaan-tambah.component';
import { KursusSejarahComponent } from './kursus-sejarah/kursus-sejarah.component';
import { ProfilComponent } from './profil/profil.component';
import { TakwimComponent } from './takwim/takwim.component';
import { PeperiksaanMaklumatComponent } from './peperiksaan-maklumat/peperiksaan-maklumat.component';

@NgModule({
  declarations: [
    DashboardComponent,
    KursusComponent,
    LaporanComponent,
    PelanOperasiComponent,
    // PeperiksaanComponent,
    TakwimComponent,
    KeperluanKursusComponent,
    InfoComponent,
    MaklumatPemohonComponent,
    LaporanSelesaiComponent,
    TambahComponent,
    // TambahPeperiksaanComponent,
    // MaklumatPeperiksaanComponent,
    KursusSemasaComponent,
    KursusTambahComponent,
    KeperluanKursusTambahComponent,
    KursusMaklumatComponent,
    KursusLepasComponent,
    KursusButiranComponent,
    PeperiksaanOverviewComponent,
    PeperiksaanTambahComponent,
    KursusSejarahComponent,
    ProfilComponent,
    PeperiksaanMaklumatComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    RouterModule.forChild(PenyelarasRoutes),
    MatButtonModule,
    MatStepperModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    NgxDatatableModule,
    Ng2SmartTableModule,
    LoadingBarModule
  ]
})
export class PenyelarasModule { }
