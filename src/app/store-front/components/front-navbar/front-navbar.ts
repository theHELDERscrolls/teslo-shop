import { AuthService } from '@/auth/services/auth.service';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

// Componente de la barra de navegación principal de la aplicación
// Se muestra en todas las páginas de la tienda (store-front)
// Proporciona:
// - Navegación entre secciones (Home, Hombres, Mujeres, Niños, Unisex)
// - Información del usuario autenticado
// - Botón de logout para cerrar sesión
// - Enlaces a páginas de autenticación si no está logueado
@Component({
  selector: 'front-navbar',
  // Importa:
  // - RouterLink: para navegación entre rutas
  // - RouterLinkActive: para marcar el link de la ruta activa como "active"
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './front-navbar.html',
})
export class FrontNavbar {
  // Inyecta el servicio de autenticación para acceder a los datos del usuario
  // Se utiliza en el template para:
  // - Mostrar el nombre del usuario si está autenticado
  // - Mostrar/ocultar botones de login/logout según el estado
  // - Verificar si el usuario es administrador para mostrar enlace a panel admin
  authService = inject(AuthService);
}
