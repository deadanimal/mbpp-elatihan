import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { KursusComponent } from './kursus/kursus.component';
import { KursusInfoComponent } from './profil/kursus-info/kursus-info.component';
import { ProfilComponent } from './profil/profil.component';
import { SurveyComponent } from './survey/survey.component';
import { TakwimLatihanComponent } from './takwim-latihan/takwim-latihan.component';
import { TestingComponent } from './testing/testing.component';
import { KursusButiranComponent } from './kursus-butiran/kursus-butiran.component';
import { KursusPenilaianComponent } from './kursus-penilaian/kursus-penilaian.component';
import { KursusNotaComponent } from './kursus-nota/kursus-nota.component';
import { KursusKehadiranComponent } from './kursus-kehadiran/kursus-kehadiran.component';
import { KursusSejarahComponent } from './kursus-sejarah/kursus-sejarah.component';
import { KursusLaporanPenilaianComponent } from './kursus-laporan-penilaian/kursus-laporan-penilaian.component';

export const KakitanganRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'profil',
                children: [
                    {
                        path: '',
                        component: ProfilComponent
                    },
                    {
                        path: 'kursus-info',
                        component: KursusInfoComponent
                    }
                ]
            },
            {
                path: 'takwim-latihan',
                component: TakwimLatihanComponent
            },
            {
                path: 'kursus',
                children: [
                    {
                        path: 'butiran',
                        component: KursusButiranComponent
                    },
                    {
                        path: 'penilaian',
                        component: KursusPenilaianComponent
                    },
                    {
                        path: 'senarai',
                        component: KursusComponent
                    },
                    {
                        path: 'nota',
                        component: KursusNotaComponent
                    },
                    {
                        path: 'kehadiran',
                        component: KursusKehadiranComponent
                    },
                    {
                        path: 'sejarah',
                        component: KursusSejarahComponent
                    },
                    {
                        path: 'laporan-penilaian',
                        component: KursusLaporanPenilaianComponent
                    }
                ]
            },
            {
                path: 'survey',
                component: SurveyComponent
            },
            {
                path: 'testing',
                component: TestingComponent
            }
        ]
    }
]