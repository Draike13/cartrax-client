import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Auth } from '../services/auth'; // adjust path if needed
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  // Optional: redirect to login
  router.navigateByUrl('/login');
  return false;
};
