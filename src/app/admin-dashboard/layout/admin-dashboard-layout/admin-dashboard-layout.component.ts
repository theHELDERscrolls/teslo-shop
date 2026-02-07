import { AuthService } from '@/auth/services/auth.service';
import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

// Layout componente que envuelve todas las páginas del panel de administración
// Proporciona la estructura visual y navegación del área administrativa
// Incluye una barra lateral con navegación y la zona donde se renderizan las páginas de admin
@Component({
  selector: 'app-admin-dashboard-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-dashboard-layout.component.html',
})
export class AdminDashboardLayout {
  // Inyecta el servicio de autenticación para acceder a los datos del usuario
  authService = inject(AuthService);

  // Computed que obtiene los datos del usuario actualmente autenticado
  // Se utiliza en el template para mostrar información del usuario (nombre, email, etc.)
  user = computed(() => this.authService.user());
}
