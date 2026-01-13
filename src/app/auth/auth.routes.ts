import { Routes } from '@angular/router';
import { AuthLayout } from './layout/auth-layout/auth-layout.component';
import { LoginPage } from './pages/login-page/login-page.component';
import { RegisterPage } from './pages/register-page/register-page.component';

// Rutas del módulo de autenticación
// Estas rutas se cargan bajo el prefijo /auth en la aplicación
// La estructura es: /auth/login, /auth/register, etc.
export const authRoutes: Routes = [
  {
    // Ruta base del módulo auth
    path: '',
    // Componente layout que envuelve todas las páginas de autenticación
    component: AuthLayout,
    // Rutas hijas que se mostrarán dentro del RouterOutlet del layout
    children: [
      {
        // Ruta para la página de login
        path: 'login',
        component: LoginPage,
      },
      {
        // Ruta para la página de registro
        path: 'register',
        component: RegisterPage,
      },
      {
        // Ruta comodín que redirige cualquier ruta no existente a login
        // El ** significa "cualquier ruta que no coincida con las anteriores"
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];

export default authRoutes;
