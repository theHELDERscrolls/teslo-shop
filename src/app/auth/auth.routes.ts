import { Routes } from '@angular/router';
import { AuthLayout } from './layout/auth-layout/auth-layout.component';
import { LoginPage } from './pages/login-page/login-page.component';
import { RegisterPage } from './pages/register-page/register-page.component';

// Rutas del módulo de autenticación
// Estas rutas se cargan bajo el prefijo /auth en la aplicación principal
// La estructura es: /auth/login, /auth/register, /auth/** (fallback), etc.
// Todas estas rutas están protegidas por el notAuthenticatedGuard que impide que usuarios
// autenticados accedan a estas páginas (serían redirigidos a /)
export const authRoutes: Routes = [
  {
    // Ruta base del módulo auth
    path: '',
    // Componente layout que envuelve todas las páginas de autenticación
    // Proporciona la estructura visual consistente para login y register
    component: AuthLayout,
    // Rutas hijas que se mostrarán dentro del RouterOutlet del layout
    children: [
      {
        // Ruta para la página de login
        // URL completa: /auth/login
        path: 'login',
        component: LoginPage,
      },
      {
        // Ruta para la página de registro
        // URL completa: /auth/register
        path: 'register',
        component: RegisterPage,
      },
      {
        // Ruta comodín que actúa como fallback
        // El ** significa "cualquier ruta que no coincida con las anteriores"
        // Redirige a 'login' para evitar páginas 404 en el módulo auth
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];

// Exporta las rutas como default para ser importadas en app.routes.ts
export default authRoutes;
