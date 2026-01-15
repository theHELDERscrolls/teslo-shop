import { inject } from '@angular/core';
import { CanMatchFn, Route, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom, map } from 'rxjs';

// Guard que protege las rutas del panel de administración
// Impide que usuarios no autenticados o no administradores accedan a /admin
// Solo permite acceso a usuarios que tengan el rol "admin"
export const isAdminGuard: CanMatchFn = () => {
  // Inyecta el servicio de autenticación para verificar el estado del usuario
  const authService = inject(AuthService);

  // Verifica dos condiciones:
  // 1. El usuario debe estar autenticado (checkStatus() retorna true)
  // 2. El usuario debe tener el rol de administrador (isAdmin() retorna true)
  // Ambas condiciones deben ser verdaderas para permitir el acceso
  return authService.checkStatus().pipe(map((isAuth) => isAuth && authService.isAdmin()));
};
