import {
  CanActivateFn,
  Router
} from '@angular/router';

import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (

  route,

  state

) => {

  const router = inject(Router);

  const token =
    localStorage.getItem('token');

  if (!token) {

    router.navigate(['/']);

    return false;
  }

  try {

    const payload =
      JSON.parse(atob(token.split('.')[1]));

    const userRole =
      payload.role;

    const allowedRoles =
      route.data?.['roles'] || [];

    if (
      allowedRoles.includes(userRole)
    ) {

      return true;
    }

    router.navigate(['/dashboard']);

    return false;

  }
  catch (error) {

    router.navigate(['/']);

    return false;
  }
};