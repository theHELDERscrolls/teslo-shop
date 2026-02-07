import { Routes } from '@angular/router';
import { AdminDashboardLayout } from './layout/admin-dashboard-layout/admin-dashboard-layout.component';
import { ProductAdminPage } from './pages/product-admin-page/product-admin-page.component';
import { ProductsAdminPage } from './pages/products-admin-page/products-admin-page.component';
import { isAdminGuard } from '@/auth/guards/is-admin.guard';

// Rutas del módulo de panel de administración
// Estas rutas se cargan bajo el prefijo /admin en la aplicación principal
// IMPORTANTE: Todas estas rutas están protegidas por el isAdminGuard
// El guard verifica que:
// 1. El usuario esté autenticado
// 2. El usuario tenga el rol de "admin"
// Si no cumple estos requisitos, el usuario no puede acceder a estas rutas
export const adminDashboardRoutes: Routes = [
  {
    // Ruta base del módulo admin
    path: '',
    // Componente layout que envuelve todas las páginas de administración
    // Proporciona la navegación y estructura visual del panel de admin
    component: AdminDashboardLayout,
    // Guard que protege este módulo
    // Solo usuarios autenticados con rol admin pueden acceder
    canMatch: [isAdminGuard],
    // Rutas hijas que se mostrarán dentro del RouterOutlet del layout
    children: [
      {
        // Ruta para listar todos los productos
        // URL completa: /admin/products
        path: 'products',
        component: ProductsAdminPage,
      },
      {
        // Ruta para editar un producto específico
        // URL completa: /admin/products/:id
        // :id es un parámetro dinámico que contiene el ID del producto a editar
        path: 'products/:id',
        component: ProductAdminPage,
      },
      {
        // Ruta comodín que redirige a la lista de productos
        // El ** significa "cualquier ruta que no coincida con las anteriores"
        // Esto evita páginas 404 en el módulo admin
        path: '**',
        redirectTo: 'products',
      },
    ],
  },
];

// Exporta las rutas como default para ser importadas en app.routes.ts
export default adminDashboardRoutes;
