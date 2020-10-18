import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManagementComponent } from './management/management.component';
import { PlanComponent } from './plan/plan.component';
import { PengurusanSenaraiComponent } from './pengurusan-senarai/pengurusan-senarai.component';
import { PengurusanTambahComponent } from './pengurusan-tambah/pengurusan-tambah.component';
import { PengurusanPenggunaComponent } from './pengurusan-pengguna/pengurusan-pengguna.component';
import { ProfilComponent } from './profil/profil.component';
import { PengurusanLogComponent } from './pengurusan-log/pengurusan-log.component';

export const AdminRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'management',
                component: ManagementComponent
            },
            {
                path: 'plan',
                component: PlanComponent
            },
            {
                path: 'pengurusan',
                children: [
                    {
                        path: 'senarai',
                        component: PengurusanSenaraiComponent
                    },
                    {
                        path: 'tambah',
                        component: PengurusanTambahComponent
                    },
                    {
                        path: 'pengguna',
                        component: PengurusanPenggunaComponent
                    },
                    {
                        path: 'log',
                        component: PengurusanLogComponent
                    }
                ]
            },
            {
                path: 'profil',
                component: ProfilComponent
            }
        ]
    }
]