import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { KursusComponent } from './kursus/kursus.component';
import { LaporanComponent } from './laporan/laporan.component';
import { PelanOperasiComponent } from './pelan-operasi/pelan-operasi.component';
// import { PeperiksaanComponent } from './peperiksaan/peperiksaan.component';
import { TakwimComponent } from './takwim/takwim.component';

import { KeperluanKursusComponent } from './keperluan-kursus/keperluan-kursus.component';
import { KeperluanKursusTambahComponent } from './keperluan-kursus-tambah/keperluan-kursus-tambah.component';

import { MaklumatPemohonComponent } from './kursus/maklumat-pemohon/maklumat-pemohon.component';
import { LaporanSelesaiComponent } from './kursus/laporan-selesai/laporan-selesai.component';
// import { TambahComponent } from './kursus/tambah/tambah.component';
// import { TambahPeperiksaanComponent } from './peperiksaan/tambah/tambah.component';
// import { MaklumatPeperiksaanComponent } from './peperiksaan/maklumat-peperiksaan/maklumat-peperiksaan.component';
import { KursusSemasaComponent } from './kursus-semasa/kursus-semasa.component';
import { KursusTambahComponent } from './kursus-tambah/kursus-tambah.component';
import { KursusButiranComponent } from './kursus-butiran/kursus-butiran.component';
import { KursusSejarahComponent } from './kursus-sejarah/kursus-sejarah.component';

import { PeperiksaanOverviewComponent } from './peperiksaan-overview/peperiksaan-overview.component';
import { PeperiksaanMaklumatComponent } from './peperiksaan-maklumat/peperiksaan-maklumat.component';
import { PeperiksaanTambahComponent } from './peperiksaan-tambah/peperiksaan-tambah.component';

import { ProfilComponent } from './profil/profil.component';


export const PenyelarasRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'keperluan-kursus',
                children: [
                    {
                        path: 'overview',
                        component: KeperluanKursusComponent
                    },
                    {
                        path: 'tambah',
                        component: KeperluanKursusTambahComponent
                    }
                ]
            },
            {
                path: 'kursus',
                children: [
                    {
                        path: 'maklumat-pemohon',
                        component: MaklumatPemohonComponent
                    },
                    {
                        path: 'laporan', //
                        component: LaporanSelesaiComponent
                    },
                    {
                        path: 'tambah', //
                        component: KursusTambahComponent
                    },
                    {
                        path: 'semasa', //
                        component: KursusSemasaComponent
                    },
                    {
                        path: 'butiran', //
                        component: KursusButiranComponent
                    },
                    {
                        path: 'sejarah', //
                        component: KursusSejarahComponent
                    }
                ]
            },
            {
                path: 'laporan',
                component: LaporanComponent
            },
            {
                path: 'pelan-operasi',
                component: PelanOperasiComponent
            },
            {
                path: 'peperiksaan',
                children: [
                    {
                        path: 'overview',
                        component: PeperiksaanOverviewComponent
                    },
                    {
                        path: 'tambah',
                        component: PeperiksaanTambahComponent
                    },
                    {
                        path: 'maklumat',
                        component: PeperiksaanMaklumatComponent
                    }
                ]
            },
            {
                path: 'takwim',
                component: TakwimComponent
            },
            {
                path: 'profil',
                component: ProfilComponent
            }
        ]
    }
]