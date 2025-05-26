import { Routes } from '@angular/router';
import { UserSignupComponent } from './features/post/pages/user-signup/user-signup.component';
import { AdminSignupComponent } from './features/post/pages/admin-signup/admin-signup.component';

export const routes: Routes = [
  {
    path: 'api/register',
    component: UserSignupComponent,
  },
  {
    path: 'api/admin/register',
    component: AdminSignupComponent,
  },
];
