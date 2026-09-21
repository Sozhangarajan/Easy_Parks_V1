import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.loggedIn()) {
    return true;
  }
  router.navigate(['/auth/login']);
  return false;
};

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data?.['role'] as string;
  if (!authService.loggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }
  if (requiredRole && authService.userRole() !== requiredRole) {
    router.navigate(['/auth/role-select']);
    return false;
  }
  return true;
};

export const noAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.loggedIn()) {
    return true;
  }
  const role = authService.userRole();
  if (role === 'owner') {
    router.navigate(['/owner/dashboard']);
  } else if (role === 'user') {
    router.navigate(['/user/home']);
  } else {
    router.navigate(['/auth/role-select']);
  }
  return false;
};
