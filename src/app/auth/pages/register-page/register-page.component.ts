import { AuthService } from '@/auth/services/auth.service';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

// Componente que implementa la página de registro
// Permite a nuevos usuarios crear una cuenta con email, contraseña y nombre completo
@Component({
  selector: 'app-register-page',
  // Importa RouterLink para navegar y ReactiveFormsModule para formularios reactivos
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPage {
  // Inyecta FormBuilder para crear el formulario reactivo
  fb = inject(FormBuilder);
  
  // Signal que controla si se debe mostrar un mensaje de error
  // Se pone a true cuando falla el registro, y se autodesactiva después de 2 segundos
  hasError = signal(false);
  
  // Signal para indicar si se está enviando la solicitud al servidor
  // Podría utilizarse para deshabilitar el botón submit mientras se procesa
  isPosting = signal(false);

  // Inyecta el router para navegar después del registro exitoso
  router = inject(Router);

  // Inyecta el servicio de autenticación para realizar el registro
  authService = inject(AuthService);

  // Define el formulario reactivo con sus campos y validaciones
  // Nota: las validaciones del frontal deben ser lo más similares a las del back
  // para evitar interacciones innecesarias con el servidor
  registerForm = this.fb.group({
    // Campo email con validación requerida y formato de email
    email: ['', [Validators.required, Validators.email]],
    // Campo password con longitud mínima de 6 caracteres
    password: ['', [Validators.minLength(6)]],
    // Campo nombre completo con longitud mínima de 6 caracteres
    fullName: ['', [Validators.minLength(6)]],
  });

  // Metodo que se ejecuta cuando el usuario envía el formulario
  onSubmit() {
    // Valida que el formulario sea válido
    if (this.registerForm.invalid) {
      // Muestra el mensaje de error
      this.hasError.set(true);
      // Oculta el mensaje automáticamente después de 2 segundos
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return;
    }

    // Obtiene los valores del formulario con valores por defecto
    const { fullName = '', email = '', password = '' } = this.registerForm.value;

    // Realiza el registro llamando al servicio de autenticación
    // El ! es un operador de aserción que indica que los valores no serán null
    this.authService.register(fullName!, email!, password!).subscribe((isAuthenticated) => {
      // Si el registro fue exitoso y el usuario está autenticado
      if (isAuthenticated) {
        // Redirige al usuario a la página de inicio
        this.router.navigateByUrl('/');
        return;
      }

      // Si el registro falló, muestra el mensaje de error
      this.hasError.set(true);
      // Oculta el mensaje automáticamente después de 2 segundos
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
    });
  }
}
