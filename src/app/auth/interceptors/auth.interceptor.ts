import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// Interceptor que añade automáticamente el token JWT a todas las solicitudes HTTP
// Cuando el usuario está autenticado, el token se incluye en el header Authorization
// Esto permite que el servidor valide que el usuario autenticado está haciendo la solicitud
export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Obtiene el token del servicio de autenticación
  const token = inject(AuthService).token();

  // Clona la solicitud original y añade el token en el header Authorization
  // El formato es "Bearer <token>" que es el estándar de JWT
  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  });
  
  // Continúa con la solicitud modificada
  return next(newReq);
}
