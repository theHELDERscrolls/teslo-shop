import { inject } from '@angular/core';
import { CanMatchFn, Route, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom, map } from 'rxjs';

export const isAdminGuard: CanMatchFn = () => {
  const authService = inject(AuthService);

  return authService.checkStatus().pipe(map((isAuth) => isAuth && authService.isAdmin()));
};
