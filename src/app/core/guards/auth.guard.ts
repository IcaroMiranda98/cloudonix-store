import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const AuthGuard = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.isTokenized()) {
    return true;
  } else {
    router.navigate(['/auth']);
    return false;
  }
};

export const LoginGuard = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.isTokenized()) {
    router.navigate(['/items']);
    return false;
  } else {
    return true;
  }
};
