import { Routes } from '@angular/router';
import { UserSignupComponent } from './features/auth-pages/user-signup/user-signup.component';
import { AdminSignupComponent } from './features/auth-pages/admin-signup/admin-signup.component';
import { AdminLoginComponent } from './features/auth-pages/admin-login/admin-login.component';
import { UserLoginComponent } from './features/auth-pages/user-login/user-login.component';

export const routes: Routes = [
  // {
  //   path: '/',
  //   redirectTo: 'user/login',
  //   component: UserLoginComponent,
  // },
  {
    path: 'user/register',
    title: 'User Signup Page',
    component: UserSignupComponent,
  },
  {
    path: 'user/login',
    title: 'User Login Page',
    component: UserLoginComponent,
  },
  {
    path: 'admin/register',
    title: 'Admin Signup Page',
    component: AdminSignupComponent,
  },
  {
    path: 'admin/login',
    title: 'Admin Login Page',
    component: AdminLoginComponent,
  },
];
