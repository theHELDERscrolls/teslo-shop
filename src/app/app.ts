import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Componente raíz de la aplicación Angular
// Este es el punto de entrada principal de la app
// Proporciona el outlet donde se renderizan todas las rutas
@Component({
  selector: 'app-root',
  // Importa RouterOutlet para renderizar las rutas principales
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  // Signal que almacena el título de la aplicación
  // Se utiliza en el template si es necesario mostrar el nombre de la app
  protected readonly title = signal('teslo-shop');
}
