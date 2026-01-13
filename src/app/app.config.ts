import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { loggingInterceptor } from './shared/interceptors/logging.interceptor';
import { authInterceptor } from './auth/interceptors/auth.interceptor';

// Configuración principal de la aplicación Angular
// Define todos los proveedores globales que se necesitan en toda la app
export const appConfig: ApplicationConfig = {
  providers: [
    // Habilita escuchas globales de errores en el navegador
    provideBrowserGlobalErrorListeners(),
    // Proporciona el sistema de enrutamiento con las rutas definidas en app.routes
    provideRouter(routes),
    // Configura el cliente HTTP con:
    // - withFetch(): Utiliza la API Fetch nativa en lugar de XMLHttpRequest
    // - withInterceptors(): Registra los interceptores HTTP que se ejecutarán en todas las solicitudes
    //   1. loggingInterceptor: Registra todas las solicitudes HTTP para debugging
    //   2. authInterceptor: Añade el token JWT al header Authorization de cada solicitud
    provideHttpClient(withFetch(), withInterceptors([loggingInterceptor, authInterceptor])),
  ],
};
