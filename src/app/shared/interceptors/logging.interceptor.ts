import { HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

// Interceptor que registra (log) todas las respuestas HTTP de la aplicación
// Se ejecuta automáticamente después de cada solicitud HTTP para fines de debugging
// Permite ver en la consola qué solicitudes se están haciendo y sus respuestas
export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  // Continúa con la solicitud y usa tap para ejecutar código sin modificar los datos
  return next(req).pipe(
    // tap se ejecuta cuando la respuesta es recibida
    tap((event) => {
      // Verifica si el evento es una respuesta HTTP completada
      // HttpEventType.Response indica que ya tenemos la respuesta del servidor
      if (event.type === HttpEventType.Response) {
        // Registra en la consola:
        // - La URL de la solicitud
        // - El status HTTP de la respuesta (200, 404, 500, etc.)
        console.log(req.url, 'returned a response with status', event.status);
      }
    })
  );
}
