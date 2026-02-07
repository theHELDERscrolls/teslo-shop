import { Routes } from '@angular/router';
import { StoreFrontLayout } from './layouts/store-front-layout/store-front-layout.component';
import { HomePage } from './pages/home-page/home-page.component';
import { GenderPage } from './pages/gender-page/gender-page.component';
import { ProductPage } from './pages/product-page/product-page.component';
import { NotFoundPage } from './pages/not-found-page/not-found-page.component';

// Rutas del módulo de tienda pública (store-front)
// Estas rutas se cargan bajo la ruta raíz (/) en la aplicación principal
// Son las rutas públicas que cualquier usuario (autenticado o no) puede acceder
// Estructura de rutas:
//   - /                          (página de inicio)
//   - /gender/:gender            (productos filtrados por género)
//   - /product/:idSlug           (detalle de producto)
//   - /*                         (página no encontrada)
export const storeFrontRoutes: Routes = [
  {
    // Ruta base del módulo store-front
    path: '',
    // Componente layout que proporciona la estructura visual de la tienda
    // Incluye la barra de navegación superior
    component: StoreFrontLayout,
    // Rutas hijas que se mostrarán dentro del RouterOutlet del layout
    children: [
      {
        // Ruta de inicio (home page)
        // URL: /
        // Muestra todos los productos con paginación
        path: '',
        component: HomePage,
      },
      {
        // Ruta para productos filtrados por género
        // URL: /gender/men, /gender/women, /gender/kid, /gender/unisex
        // :gender es un parámetro dinámico que especifica qué género mostrar
        path: 'gender/:gender',
        component: GenderPage,
      },
      {
        // Ruta para el detalle de un producto específico
        // URL: /product/zapatos-deportivos o /product/645a1f2b3c4d5e6f
        // :idSlug es un parámetro dinámico que contiene el slug o ID del producto
        path: 'product/:idSlug',
        component: ProductPage,
      },
      {
        // Ruta comodín para el módulo store-front
        // El ** significa "cualquier ruta que no coincida con las anteriores"
        // Renderiza la página 404 (no encontrada)
        path: '**',
        component: NotFoundPage,
      },
    ],
  },
  {
    // Ruta comodín global como fallback final
    // Si no coincide nada en store-front, redirige a la raíz
    // Esto se ejecuta si alguien intenta una ruta completamente diferente
    path: '**',
    redirectTo: '',
  },
];

// Exporta las rutas como default para ser importadas en app.routes.ts
export default storeFrontRoutes;
