import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  BsDropdownModule, 
  ProgressbarModule, 
  TooltipModule 
} from 'ngx-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingBarModule } from '@ngx-loading-bar/core';

import { RouterModule } from '@angular/router';
import { AuthRoutes } from './auth.routing';
import { ErrorComponent } from './error/error.component';
import { ForgotComponent } from './forgot/forgot.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';

@NgModule({
  declarations: [
    ErrorComponent, 
    ForgotComponent, 
    LoginComponent, 
    LogoutComponent
  ],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    RouterModule.forChild(AuthRoutes),
    FormsModule,
    ReactiveFormsModule,
    LoadingBarModule
  ]
})
export class AuthModule { }
