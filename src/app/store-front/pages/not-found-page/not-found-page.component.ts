import { Component } from '@angular/core';

// Página que se renderiza cuando el usuario intenta acceder a una ruta que no existe
// Muestra un mensaje de error 404 (Página No Encontrada) para informar al usuario
@Component({
  selector: 'app-not-found-page',
  imports: [],
  templateUrl: './not-found-page.component.html',
})
export class NotFoundPage {
  // Este componente se renderiza como fallback cuando no hay ruta coincidente
  // La configuración se define en store-front.routes.ts con path: '**'
}
