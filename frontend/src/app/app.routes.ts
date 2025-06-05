import { Routes } from '@angular/router';
import { UserSignupComponent } from './features/auth-pages/user-signup/user-signup.component';
import { AdminSignupComponent } from './features/auth-pages/admin-signup/admin-signup.component';
import { AdminLoginComponent } from './features/auth-pages/admin-login/admin-login.component';
import { UserLoginComponent } from './features/auth-pages/user-login/user-login.component';
import { AdminDashboardComponent } from './features/dashboard/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './features/dashboard/user-dashboard/user-dashboard.component';
import { adminGuard } from './guards/admin.guard';
import { userGuard } from './guards/user.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'user/register',
    pathMatch: 'full',
  },
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
    path: 'user/dashboard',
    title: 'User Dashboard',
    component: UserDashboardComponent,
    canActivate: [userGuard],
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
  {
    path: 'admin/dashboard',
    title: 'Admin Dashboard',
    component: AdminDashboardComponent,
    canActivate: [adminGuard],
  },
  { path: '**', redirectTo: 'user/register' },
];
