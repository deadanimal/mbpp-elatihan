import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PermohonanComponent } from './kursus/permohonan/permohonan.component';
import { PenilaianLuaranComponent } from './kursus/penilaian-luaran/penilaian-luaran.component';
import { SenaraiComponent } from './kursus/senarai/senarai.component';
import { LaporanComponent } from './laporan/laporan.component';
import { ProfilComponent } from './profil/profil.component';

export const PenyelarasJabatanRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'kursus',
                children: [
                    {
                        path: 'permohonan',
                        component: PermohonanComponent
                    },
                    {
                        path: 'penilaian-luaran',
                        component: PenilaianLuaranComponent
                    },
                    {
                        path: 'senarai',
                        component: SenaraiComponent
                    }
                ]
            },
            {
                path: 'laporan',
                component: LaporanComponent
            },
            {
                path: 'profil',
                component: ProfilComponent
            }
        ]
    }
]