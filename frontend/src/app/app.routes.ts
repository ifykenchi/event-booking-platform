import { Routes } from '@angular/router';
import { UserSignupComponent } from './features/post/pages/user-signup/user-signup.component';
import { AdminSignupComponent } from './features/post/pages/admin-signup/admin-signup.component';
import { AdminLoginComponent } from './features/post/pages/admin-login/admin-login.component';
import { UserLoginComponent } from './features/post/pages/user-login/user-login.component';

export const routes: Routes = [
  {
    path: 'api/register',
    component: UserSignupComponent,
  },
  {
    path: 'api/login',
    component: UserLoginComponent,
  },
  {
    path: 'api/admin/register',
    component: AdminSignupComponent,
  },
  {
    path: 'api/admin/login',
    component: AdminLoginComponent,
  },
];
