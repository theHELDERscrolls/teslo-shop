import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FrontNavbar } from '@/store-front/components/front-navbar/front-navbar';

@Component({
  selector: 'app-store-front-layout',
  imports: [RouterOutlet, FrontNavbar],
  templateUrl: './store-front-layout.component.html',
})
export class StoreFrontLayout {
  // Este componente es un layout contenedor para todas las páginas de la tienda
  // Incluye la navbar y un outlet para que las rutas hijas se rendericen en su lugar
}
