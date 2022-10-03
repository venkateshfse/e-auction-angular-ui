import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login/login.component";
import { RegisterComponent } from "./register/register.component";
import { DashboardComponent } from "./seller/dashboard/dashboard.component";

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
    data: { icon: 'dashboard', text: 'Dashboard' }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { icon: 'dashboard', text: 'Dashboard' }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { icon: 'dashboard', text: 'Dashboard' }
  },
  {
    path: 'seller',
    component: DashboardComponent,
    data: { icon: 'dashboard', text: 'Dashboard' },
    canActivate: ['CanActivateRouteGuard']
  },
];
