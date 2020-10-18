import { Routes } from "@angular/router";

import { LoginComponent } from "../../extras/examples/login/login.component";
import { PricingComponent } from "../../extras/examples/pricing/pricing.component";
import { LockComponent } from "../../extras/examples/lock/lock.component";
import { RegisterComponent } from "../../extras/examples/register/register.component";
import { PresentationComponent } from "../../extras/presentation/presentation.component";

export const AuthLayoutRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "login",
        component: LoginComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "lock",
        component: LockComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "register",
        component: RegisterComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "pricing",
        component: PricingComponent
      }
    ]
  }
];
