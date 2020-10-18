import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error/error.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { ProgressbarModule, TooltipModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { AuthorizationRoutes } from './authorization.routing';

@NgModule({
  declarations: [
    ErrorComponent, 
    NotAuthorizedComponent
  ],
  imports: [
    CommonModule,
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    RouterModule.forChild(AuthorizationRoutes)
  ]
})
export class AuthorizationModule { }
