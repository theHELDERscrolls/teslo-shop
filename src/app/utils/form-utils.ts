import { AbstractControl, FormArray, FormGroup, ValidationErrors } from '@angular/forms';

// Función auxiliar que simula una espera de 2.5 segundos
// Útil para validaciones asincrónicas donde queremos simular un delay del servidor
async function sleep() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2500);
  });
}

// Clase utilitaria que contiene funciones y expresiones regulares de validación
// Se utiliza en los formularios reactivos para validar datos del usuario
export class FormUtils {
  // Expresión regular para validar nombres completos (2 palabras de letras)
  // Patrón: "Nombre Apellido" (ej: "Juan García")
  static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  
  // Expresión regular para validar direcciones de email
  // Patrón: email@dominio.com
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  
  // Expresión regular para validar que no contenga solo espacios en blanco
  // Permite números y letras
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';
  
  // Expresión regular para validar slugs (URLs amigables)
  // Patrón: palabras-en-minusculas-separadas-por-guiones (ej: "zapatos-deportivos")
  static slugPattern = '^[a-z0-9_]+(?:-[a-z0-9_]+)*$';

  /**
   * Convierte un objeto de errores de validación en un mensaje de error descriptivo
   * Este método se ejecuta cuando una validación falla
   * 
   * @param errors - Objeto ValidationErrors de Angular con los errores de validación
   * @returns String con el mensaje de error en español, o null si no hay errores
   */
  static getTextError(errors: ValidationErrors) {
    // Itera sobre todas las claves del objeto de errores
    for (const key of Object.keys(errors)) {
      // Switch que evalúa el tipo de error y retorna un mensaje descriptivo
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;

        case 'min':
          return `Valor mínimo de ${errors['min'].min}`;

        case 'email':
          return `El valor ingresado no es un correo electrónico`;

        case 'emailTaken':
          return `El correo electrónico ya está siendo usado por otro usuario`;

        case 'noStrider':
          return `No se puede usar el username de strider en la app`;

        case 'pattern':
          // Verifica si el error es específicamente del patrón de email
          if (errors['pattern'].requiredPattern === FormUtils.emailPattern) {
            return 'El valor ingresado no luce como un correo electrónico';
          }
          // Si es otro patrón, retorna un error genérico
          return 'Error de patrón contra expresión regular';

        default:
          // Error no controlado o no previsto
          return `Error de validación no controlado ${key}`;
      }
    }

    // Si no hay errores, retorna null
    return null;
  }

  /**
   * Verifica si un campo del formulario tiene errores y ha sido tocado (interactuado)
   * Se utiliza en el template para mostrar mensajes de error solo después de que el usuario interactúe
   * 
   * @param form - FormGroup del formulario
   * @param fieldName - Nombre del campo a validar
   * @returns true si el campo tiene errores y ha sido tocado, false o null en caso contrario
   */
  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    // !! convierte el valor a boolean true/false
    // form.controls[fieldName].errors verifica si hay errores
    // form.controls[fieldName].touched verifica si el usuario ha interactuado con el campo
    return !!form.controls[fieldName].errors && form.controls[fieldName].touched;
  }

  /**
   * Obtiene el mensaje de error para un campo específico del formulario
   * 
   * @param form - FormGroup del formulario
   * @param fieldName - Nombre del campo
   * @returns String con el mensaje de error, o null si no hay errores
   */
  static getFieldError(form: FormGroup, fieldName: string): string | null {
    // Verifica si el campo existe en el formulario
    if (!form.controls[fieldName]) return null;

    // Obtiene los errores del campo, o un objeto vacío si no hay errores
    const errors = form.controls[fieldName].errors ?? {};

    // Convierte los errores en un mensaje de texto
    return FormUtils.getTextError(errors);
  }

  /**
   * Verifica si un campo dentro de un FormArray tiene errores y ha sido tocado
   * Se utiliza para validar arrays dinámicos de campos
   * 
   * @param formArray - FormArray que contiene los campos
   * @param index - Índice del campo en el array
   * @returns true si el campo tiene errores y ha sido tocado
   */
  static isValidFieldInArray(formArray: FormArray, index: number) {
    return formArray.controls[index].errors && formArray.controls[index].touched;
  }

  /**
   * Obtiene el mensaje de error para un campo dentro de un FormArray
   * 
   * @param formArray - FormArray que contiene los campos
   * @param index - Índice del campo en el array
   * @returns String con el mensaje de error, o null si no hay errores
   */
  static getFieldErrorInArray(formArray: FormArray, index: number): string | null {
    // Si el FormArray está vacío, retorna null
    if (formArray.controls.length === 0) return null;

    // Obtiene los errores del campo en el índice especificado
    const errors = formArray.controls[index].errors ?? {};

    // Convierte los errores en un mensaje de texto
    return FormUtils.getTextError(errors);
  }

  /**
   * Validador que compara dos campos del formulario
   * Útil para validar que dos campos coincidan (ej: contraseña y confirmar contraseña)
   * 
   * @param field1 - Nombre del primer campo a comparar
   * @param field2 - Nombre del segundo campo a comparar
   * @returns Función validadora que retorna null si los valores coinciden, o un error si no
   */
  static isFieldOneEqualFieldTwo(field1: string, field2: string) {
    // Retorna una función que será ejecutada por Angular como validador
    return (formGroup: AbstractControl) => {
      // Obtiene el valor del primer campo
      const field1Value = formGroup.get(field1)?.value;
      // Obtiene el valor del segundo campo
      const field2Value = formGroup.get(field2)?.value;

      // Si los valores coinciden, retorna null (sin errores)
      // Si no coinciden, retorna un objeto con error 'passwordsNotEqual'
      return field1Value === field2Value ? null : { passwordsNotEqual: true };
    };
  }

  /**
   * Validador asincrónico que verifica si el email ya está registrado en el servidor
   * Se ejecuta después de un delay para simular la validación en el servidor
   * 
   * @param control - Control del formulario a validar
   * @returns Promise que resuelve a null (válido) o a un objeto de error
   */
  static async checkingServerResponse(control: AbstractControl): Promise<ValidationErrors | null> {
    console.log('Validando contra servidor');

    // Espera 2.5 segundos antes de hacer la validación
    // Esto simula el tiempo que tarda el servidor en responder
    await sleep();

    // Obtiene el valor del campo
    const formValue = control.value;

    // Ejemplo de validación: si el email es "hola@mundo.com", está registrado
    if (formValue === 'hola@mundo.com') {
      // Retorna un error indicando que el email ya está registrado
      return {
        emailTaken: true,
      };
    }

    // Si no hay error, retorna null
    return null;
  }

  static notStrider(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    return value === 'strider' ? { noStrider: true } : null;
  }
}
