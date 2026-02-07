import { FormUtils } from '@/utils/form-utils';
import { Component, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

// Componente que muestra mensajes de error de validación para campos de formularios
// Se reutiliza en todos los formularios de la aplicación para mantener consistencia
// Solo muestra el mensaje de error cuando el campo ha sido tocado (interactuado)
@Component({
  selector: 'form-error-label',
  imports: [],
  templateUrl: './form-error-label.component.html',
})
export class FormErrorLabel {
  // Input requerido: el control del formulario a validar
  // Se recibe del componente padre que contiene el formulario
  control = input.required<AbstractControl>();

  /**
   * Getter que calcula el mensaje de error a mostrar
   * Se ejecuta automáticamente cada vez que los datos cambian
   * 
   * @returns String con el mensaje de error, o null si no hay errores para mostrar
   */
  get errorMessage() {
    // Obtiene los errores del control, o un objeto vacío si no hay
    const errors: ValidationErrors = this.control().errors || {};

    // Solo muestra el mensaje de error si:
    // 1. El control ha sido tocado (touched = true): El usuario ha interactuado con el campo
    // 2. Hay errores de validación: Object.keys(errors).length > 0
    // Esto evita mostrar errores antes de que el usuario termine de escribir
    return this.control().touched && Object.keys(errors).length > 0
      ? FormUtils.getTextError(errors)  // Obtiene el mensaje descriptivo del error
      : null;  // No muestra nada si aún no hay error o no ha sido tocado
  }
}
