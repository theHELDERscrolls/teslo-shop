import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

// Guard que protege las rutas de autenticación (login y register)
// Impide que usuarios autenticados accedan a estas páginas
// Si un usuario autenticado intenta acceder a /auth/login, será redirigido a /
export const notAuthenticatedGuard: CanMatchFn = async (route: Route, segments: UrlSegment[]) => {
  // Inyecta el servicio de autenticación para verificar el estado del usuario
  const authService = inject(AuthService);

  // Inyecta el router para redirigir si es necesario
  const router = inject(Router);

  // Verifica si el usuario está autenticado
  // firstValueFrom convierte el Observable en una Promise para usar async/await
  const isAuthenticated = await firstValueFrom(authService.checkStatus());

  // Si el usuario YA está autenticado, lo redirige a la página de inicio
  // y retorna false para impedir el acceso a la ruta de autenticación
  if (isAuthenticated) {
    router.navigateByUrl('/');
    return false;
  }

  // Si el usuario NO está autenticado, permite el acceso a la ruta
  // Así el usuario puede hacer login o registro
  return true;
};
