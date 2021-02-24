import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { PresentationComponent } from './examples/presentation/presentation.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'presentation',
    component: PresentationComponent
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        // User pages
        path: '',
        loadChildren: './core/user/user.module#UserModule'
      },
      {
        // Administrator pages
        path: 'admin',
        loadChildren: './core/admin/admin.module#AdminModule'
      },
      {
        // Global pages
        path: 'global',
        loadChildren: './core/global/global.module#GlobalModule'
      },
      {
        // Training coordinator pages
        path: 'tc',
        loadChildren: './core/training-coordinator/training-coordinator.module#TrainingCoordinatorModule'
      },
      {
        // Department coordinator pages
        path: 'dc',
        loadChildren: './core/department-coordinator/department-coordinator.module#DepartmentCoordinatorModule'
      },
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
        path: 'examples',
        loadChildren: './layouts/auth-layout/auth-layout.module#AuthLayoutModule'
      },
      {
        path: '',
        loadChildren: './pages/pages.module#PagesModule'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'home'
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
export class AppRoutingModule {}
