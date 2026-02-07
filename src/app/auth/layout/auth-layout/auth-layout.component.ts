import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Componente layout que envuelve todas las páginas de autenticación (login y register)
// Proporciona una estructura visual consistente para ambas páginas
// El RouterOutlet muestra la página correspondiente según la ruta activa
@Component({
  selector: 'app-auth-layout',
  // Importa RouterOutlet para renderizar las rutas hijas
  imports: [RouterOutlet],
  templateUrl: './auth-layout.component.html'
})
export class AuthLayout {
  // Este componente actúa como contenedor, sin lógica adicional
}
