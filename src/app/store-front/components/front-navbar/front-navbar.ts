import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'front-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './front-navbar.html',
})
export class FrontNavbar {
  // Este componente es una barra de navegación simple que muestra links a las diferentes categorías
  // No tiene lógica en TypeScript, toda la navegación se maneja en el template con routerLink
}
