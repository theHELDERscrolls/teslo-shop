import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const BASE_URL = environment.baseUrl;

@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {
  /**
   * Transforma la ruta de una imagen de producto al URL completo
   * Maneja tanto strings simples como arrays de imágenes
   * Si no hay imagen disponible, devuelve una imagen placeholder
   * 
   * @param value - Puede ser una string (imagen única) o array de strings (múltiples imágenes)
   * @returns La URL completa de la imagen o la ruta del placeholder
   */
  transform(value: string | string[]): string {
    // Si recibimos una string, significa que es una imagen única
    // Construimos la URL completa concatenando el BASE_URL con la ruta relativa
    if (typeof value === 'string') return `${BASE_URL}/files/product/${value}`;

    // Si es un array, extraemos la primera imagen del array
    const image = value[0];

    // Si no existe imagen (array vacío), devolvemos una imagen por defecto (placeholder)
    // para que los productos sin imágenes tengan algo que mostrar
    if (!image) return './assets/images/placeholder-images/no-image.jpg';

    // Si existe imagen, devolvemos la URL completa de la primera imagen del array
    return `${BASE_URL}/files/product/${image}`;
  }
}
