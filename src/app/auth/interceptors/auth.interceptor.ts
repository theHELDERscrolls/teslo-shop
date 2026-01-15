import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// Interceptor que automaticamente añade el token JWT a todas las solicitudes HTTP
// Esto es esencial para que el servidor pueda autenticar y autorizar las solicitudes
// del usuario autenticado
export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Obtiene el token JWT almacenado en el servicio de autenticación
  // Si el usuario está autenticado, aquí obtendremos el token JWT válido
  const token = inject(AuthService).token();

  // Clona la solicitud original para modificarla sin afectar la original
  // Luego añade el header Authorization con el token JWT
  // El formato "Bearer <token>" es el estándar HTTP para autenticación JWT
  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  });
  
  // Continúa con la solicitud modificada que ahora incluye el token de autenticación
  // Esto permite que el servidor valide la identidad del usuario
  return next(newReq);
}
