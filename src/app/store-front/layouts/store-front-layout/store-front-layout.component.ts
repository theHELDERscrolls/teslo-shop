import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FrontNavbar } from '@/store-front/components/front-navbar/front-navbar';

// Layout componente que envuelve todas las páginas de la tienda (store-front)
// Proporciona la estructura visual consistente para todas las páginas públicas
// Incluye la barra de navegación superior y el contenido variable de cada página
@Component({
  selector: 'app-store-front-layout',
  // Importa:
  // - RouterOutlet: para renderizar las rutas hijas (home-page, gender-page, product-page, etc.)
  // - FrontNavbar: componente de la barra de navegación principal
  imports: [RouterOutlet, FrontNavbar],
  templateUrl: './store-front-layout.component.html',
})
export class StoreFrontLayout {
  // Este componente actúa como contenedor, sin lógica adicional
  // La barra de navegación se muestra siempre, y el contenido varía según la ruta activa
}
