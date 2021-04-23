import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { 
  BsDropdownModule, 
  ModalModule, 
  ProgressbarModule,
  TooltipModule
} from 'ngx-bootstrap';

import { LoadingBarModule } from '@ngx-loading-bar/core';

import { RouterModule } from '@angular/router';
import { AuthRoutes } from './auth.routing';
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';



@NgModule({
  declarations: [
    LoginComponent,
    ForgotComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    LoadingBarModule,
    RouterModule.forChild(AuthRoutes),
    ModalModule.forRoot(),
  ]
})
export class AuthModule { }
