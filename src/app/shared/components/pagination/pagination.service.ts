import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaginationService {
  // Inyectamos ActivatedRoute para acceder a los parámetros de la URL
  private activatedRoute = inject(ActivatedRoute);

  /**
   * Signal que contiene la página actual basada en el parámetro de query "page" de la URL
   * Se actualiza automáticamente cuando cambia la URL
   * Ejemplo: /products?page=3 establece currentPage en 3
   */
  currentPage = toSignal(
    // queryParamMap proporciona un Observable con los parámetros de query de la URL
    this.activatedRoute.queryParamMap.pipe(
      // Primer map: extrae el valor del parámetro "page" de la URL
      // Si existe "page", lo convierte a número (+)
      // Si no existe, devuelve 1 (página por defecto)
      map((params) => (params.get('page') ? +params.get('page')! : 1)),
      // Segundo map: validación de seguridad
      // Si el valor no es un número válido (NaN), devolvemos 1
      // Esto evita errores si alguien pone ?page=abc en la URL
      map((page) => (isNaN(page) ? 1 : page))
    ),
    // initialValue: valor inicial mientras se carga el Observable
    { initialValue: 1 }
  );
}
