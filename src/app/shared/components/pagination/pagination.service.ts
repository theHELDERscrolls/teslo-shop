import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

// Servicio que gestiona el estado de paginación de la aplicación
// Proporciona la página actual extraída de los parámetros de query de la URL
// Se inyecta en componentes que necesitan saber qué página está siendo visualizada
@Injectable({ providedIn: 'root' })
export class PaginationService {
  // Inyectamos ActivatedRoute para acceder a los parámetros de la URL
  private activatedRoute = inject(ActivatedRoute);

  /**
   * Signal que contiene la página actual basada en el parámetro de query "page" de la URL
   * Se actualiza automáticamente cuando cambia la URL
   * Ejemplo: 
   *   - URL: /products?page=3  →  currentPage = 3
   *   - URL: /products        →  currentPage = 1 (página por defecto)
   *   - URL: /products?page=abc → currentPage = 1 (valor inválido, usa página por defecto)
   */
  currentPage = toSignal(
    // queryParamMap es un Observable que emite los parámetros de query de la URL
    this.activatedRoute.queryParamMap.pipe(
      // Primer map: extrae el valor del parámetro "page" de la URL
      // Si existe "page", lo convierte a número con el operador unario (+)
      // Si no existe, devuelve 1 (página por defecto)
      map((params) => (params.get('page') ? +params.get('page')! : 1)),
      // Segundo map: validación de seguridad
      // Si el valor no es un número válido (NaN), devolvemos 1
      // Esto evita errores en el resto de la aplicación si alguien pone ?page=abc en la URL
      map((page) => (isNaN(page) ? 1 : page))
    ),
    // initialValue: valor inicial mientras se carga el Observable
    // Se utiliza como valor predeterminado antes de que se resuelva el Observable
    { initialValue: 1 }
  );
}
