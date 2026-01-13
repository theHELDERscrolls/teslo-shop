// Interfaz que define la estructura de datos de un usuario autenticado
// Esta interfaz se utiliza en toda la aplicación para tipificar los datos del usuario
export interface User {
    // Identificador único del usuario en la base de datos
    id:       string;
    // Email del usuario utilizado para el login
    email:    string;
    // Nombre completo del usuario
    fullName: string;
    // Indica si la cuenta del usuario está activa o desactivada
    isActive: boolean;
    // Array de roles asignados al usuario (ej: 'admin', 'user', etc.)
    // Se utiliza para control de acceso y permisos en la aplicación
    roles:    string[];
}