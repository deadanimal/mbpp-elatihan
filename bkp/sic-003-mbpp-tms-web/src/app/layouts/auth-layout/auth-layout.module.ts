import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthLayoutRoutes } from "./auth-layout.routing";

import { LoginComponent } from "../../extras/examples/login/login.component";
import { PricingComponent } from "../../extras/examples/pricing/pricing.component";
import { LockComponent } from "../../extras/examples/lock/lock.component";
import { RegisterComponent } from "../../extras/examples/register/register.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule
  ],
  declarations: [
    LoginComponent,
    PricingComponent,
    LockComponent,
    RegisterComponent
  ]
})
export class AuthLayoutModule {}
