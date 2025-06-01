import { Routes } from '@angular/router';
import { UserSignupComponent } from './features/auth-pages/user-signup/user-signup.component';
import { AdminSignupComponent } from './features/auth-pages/admin-signup/admin-signup.component';
import { AdminLoginComponent } from './features/auth-pages/admin-login/admin-login.component';
import { UserLoginComponent } from './features/auth-pages/user-login/user-login.component';

export const routes: Routes = [
  {
    path: 'user/register',
    component: UserSignupComponent,
  },
  {
    path: 'user/login',
    component: UserLoginComponent,
  },
  {
    path: 'admin/register',
    component: AdminSignupComponent,
  },
  {
    path: 'admin/login',
    component: AdminLoginComponent,
  },
];
