import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found-page',
  imports: [],
  templateUrl: './not-found-page.component.html',
})
export class NotFoundPage {
  // Este componente se renderiza cuando el usuario intenta acceder a una ruta que no existe
  // Muestra un mensaje de "página no encontrada" (error 404)
}
