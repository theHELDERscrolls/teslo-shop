import { AuthService } from '@/auth/services/auth.service';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

// Componente de la barra de navegación principal de la aplicación
// Se muestra en todas las páginas y proporciona navegación y controles de autenticación
@Component({
  selector: 'front-navbar',
  // Importa RouterLink para navegación y RouterLinkActive para marcar links activos
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './front-navbar.html',
})
export class FrontNavbar {
  // Inyecta el servicio de autenticación para acceder a los datos del usuario
  // Se utiliza en el template para mostrar el nombre del usuario y controles de logout
  authService = inject(AuthService);
}
