import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import TokenUtil from '../../utils/token.util';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (TokenUtil.admin_token()) {
    return true;
  }

  router.navigate(['/admin/register']);
  return false;
};
