import { Routes } from '@angular/router';
import { notAuthenticatedGuard } from './auth/guards/not-authenticated.guard';

// Rutas principales de la aplicación
// Define la estructura de navegación entre los tres módulos principales:
// - /auth (autenticación - protegido por notAuthenticatedGuard)
// - /admin (administración - protegido por isAdminGuard)
// - / (tienda pública - sin protección, acceso libre)
export const routes: Routes = [
  {
    // Módulo de autenticación
    // URL: /auth/login, /auth/register, /auth/**
    path: 'auth',
    // loadChildren carga el módulo de forma lazy (solo cuando se necesita)
    // Mejora el rendimiento al no cargar el código de auth al inicio
    loadChildren: () => import('./auth/auth.routes'),
    // Guard que protege este módulo
    // Impide que usuarios autenticados accedan a las páginas de login/register
    // Si lo intentan, son redirigidos a /
    canMatch: [notAuthenticatedGuard],
  },
  {
    // Módulo de administración (panel de admin)
    // URL: /admin/products, /admin/products/:id, /admin/**
    path: 'admin',
    // loadChildren carga el módulo de forma lazy
    loadChildren: () => import('./admin-dashboard/admin-dashboard.routes'),
    // Guard isAdminGuard está definido en el archivo de rutas del admin
  },
  {
    // Módulo de tienda pública (store-front)
    // URL: /, /gender/:gender, /product/:idSlug, /**
    path: '',
    // loadChildren carga el módulo de forma lazy
    loadChildren: () => import('./store-front/store-front.routes'),
    // Sin protección - acceso público libre
  },
];
