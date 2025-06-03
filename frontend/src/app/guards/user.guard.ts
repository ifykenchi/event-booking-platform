import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import TokenUtil from '../../utils/token.util';

export const userGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (TokenUtil.user_token()) {
    return true;
  }

  router.navigate(['/user/register']);
  return false;
};
