import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

// Tipos posibles del estado de autenticacion:
// - 'checking': Se esta verificando el estado de autenticación (cargando)
// - 'authenticated': Usuario autenticado correctamente
// - 'not-authenticated': Usuario no autenticado o sesión expirada
type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

// URL base del servidor API obtenida del archivo de configuración de entorno
const BASE_URL = environment.baseUrl;

// Servicio inyectable que gestiona toda la lógica de autenticación de la aplicación
// Se proporciona en el nivel raíz (root) para que esté disponible en toda la app
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Signal privado que almacena el estado actual de autenticación
  // Inicialmente es 'checking' para verificar si hay una sesión activa
  private _authStatus = signal<AuthStatus>('checking');
  
  // Signal privado que almacena los datos del usuario autenticado
  // Es null si no hay usuario autenticado
  private _user = signal<User | null>(null);
  
  // Signal privado que almacena el token JWT obtenido del localStorage
  // Se utiliza para autenticar las solicitudes HTTP posteriores
  private _token = signal<string | null>(localStorage.getItem('token'));

  // Inyecta el servicio HttpClient para hacer solicitudes HTTP al servidor
  private http = inject(HttpClient);

  // rxResource que ejecuta checkStatus() automáticamente cuando se carga el componente
  // Verifica si el usuario tiene una sesión activa válida
  checkStatusResource = rxResource({
    stream: () => this.checkStatus(),
  });

  // Computed signal que calcula el estado de autenticación actual
  // Retorna el estado basado en el estado privado y el usuario autenticado
  // Este es un selector público para que los componentes accedan al estado
  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) return 'authenticated';

    return 'not-authenticated';
  });

  // Computed signals públicos para acceder de forma segura a los datos privados
  // Los componentes pueden leer estos datos pero no pueden modificarlos
  user = computed(() => this._user());
  token = computed(this._token);

  // Metodo para hacer login con email y contraseña
  // Retorna un Observable<boolean> que indica si la autenticación fue exitosa
  login(email: string, password: string): Observable<boolean> {
    return this.http
      // Realiza una solicitud POST al endpoint /auth/login del servidor
      .post<AuthResponse>(`${BASE_URL}/auth/login`, {
        email: email,
        password: password,
      })
      .pipe(
        // Si la respuesta es exitosa, procesa los datos con handleAuthSuccess
        map((resp) => this.handleAuthSuccess(resp)),
        // Si hay error en la solicitud, lo maneja con handleAuthError
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  // Metodo para registrar un nuevo usuario
  // Retorna un Observable<boolean> que indica si el registro fue exitoso
  register(fullName: string, email: string, password: string): Observable<boolean> {
    return this.http
      // Realiza una solicitud POST al endpoint /auth/register del servidor
      .post<AuthResponse>(`${BASE_URL}/auth/register`, {
        fullName: fullName,
        email: email,
        password: password,
      })
      .pipe(
        // Si la respuesta es exitosa, procesa los datos con handleAuthSuccess
        map((resp) => this.handleAuthSuccess(resp)),
        // Si hay error en la solicitud, lo maneja con handleAuthError
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  // Metodo para verificar el estado actual de autenticación del usuario
  // Se ejecuta al cargar la aplicación para restaurar la sesión anterior si existe
  // Retorna un Observable<boolean> que indica si el usuario está autenticado
  checkStatus(): Observable<boolean> {
    // Obtiene el token almacenado en el localStorage
    const token = localStorage.getItem('token');

    // Si no hay token almacenado, el usuario no está autenticado
    if (!token) {
      this.logout();
      return of(false);
    }

    // Realiza una solicitud GET al servidor para verificar si el token es válido
    // El servidor valida el token y retorna los datos del usuario si es válido
    return this.http.get<AuthResponse>(`${BASE_URL}/auth/check-status`).pipe(
      // Si la respuesta es exitosa, procesa los datos con handleAuthSuccess
      map((resp) => this.handleAuthSuccess(resp)),
      // Si el token es inválido o expirado, lo maneja con handleAuthError
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  // Metodo para cerrar sesión del usuario actual
  // Limpia todos los datos de autenticación tanto en memoria como en localStorage
  logout() {
    // Limpia los datos del usuario
    this._user.set(null);
    // Limpia el token
    this._token.set(null);
    // Actualiza el estado a no autenticado
    this._authStatus.set('not-authenticated');

    // Elimina el token del localStorage para que no persista después de cerrar sesión
    localStorage.removeItem('token');

    return of(true);
  }

  // Metodo privado que maneja una autenticación exitosa
  // Se ejecuta cuando login, register o checkStatus retornan una respuesta exitosa
  private handleAuthSuccess({ token, user }: AuthResponse) {
    // Actualiza el signal del usuario con los datos recibidos del servidor
    this._user.set(user);
    // Marca el estado como autenticado
    this._authStatus.set('authenticated');
    // Almacena el token en el signal
    this._token.set(token);

    // Persiste el token en localStorage para mantener la sesión entre recargas
    localStorage.setItem('token', token);

    return true;
  }

  // Metodo privado que maneja errores de autenticación
  // Se ejecuta cuando las solicitudes de autenticación fallan
  private handleAuthError(error: any) {
    // Limpia la sesión del usuario y lo desautentica
    this.logout();
    // Retorna false para indicar que la autenticación falló
    return of(false);
  }
}
