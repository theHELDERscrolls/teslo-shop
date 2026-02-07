import { User } from "./user.interface";

// Interfaz que define la respuesta del servidor al autenticarse (login/register)
// El servidor devuelve esta estructura cuando el usuario se autentica correctamente
export interface AuthResponse {
    // Objeto usuario con todos los datos del usuario autenticado
    user:  User;
    // Token JWT que se utiliza para autenticar las siguientes solicitudes HTTP
    // Este token se almacena en localStorage para mantener la sesión activa
    token: string;
}



