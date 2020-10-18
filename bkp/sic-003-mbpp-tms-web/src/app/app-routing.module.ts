import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/guard/auth/auth.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'pages/home',
        pathMatch: 'full'
    },
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            // Admin Module
            {
                path: 'admin',
                loadChildren: './core/admin/admin.module#AdminModule',
                canActivate: [AuthGuard],
                data: {
                    role: 'AD'
                }
            },
            // Penyelaras Latihan Module
            {
                path: 'penyelaras',
                loadChildren: './core/user/penyelaras/penyelaras.module#PenyelarasModule',
                // canActivate: [AuthGuard],
                // data: {
                //     role: 'TC'
                // }
            },
            // Penyelaras Jabatan Module
            {
                path: 'penyelaras-jabatan',
                loadChildren: './core/user/penyelaras-jabatan/penyelaras-jabatan.module#PenyelarasJabatanModule',
                canActivate: [AuthGuard],
                data: {
                    role: 'DC'
                }
            },
            // Kakitangan Module
            {
                path: 'kakitangan',
                loadChildren: './core/user/kakitangan/kakitangan.module#KakitanganModule'
            },
            // Authorization Module
            {
                path: 'authorization',
                loadChildren: './core/authorization/authorization.module#AuthorizationModule'
            }
        ]
    },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'auth',
                loadChildren: './auth/auth.module#AuthModule'
            },
            {
                path: 'pages',
                loadChildren: './pages/pages.module#PagesModule'
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'pages/home'
    }
];

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes, {
            useHash: true
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
