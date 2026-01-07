import { Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
})
export class Pagination {
  // Input: número total de páginas disponibles
  // Valor por defecto es 0 si no se proporciona
  pages = input(0);
  
  // Input: página actual que está siendo visualizada
  // Valor por defecto es 1 (primera página)
  currentPage = input<number>(1);

  // Signal vinculada a currentPage que nos permite cambiar la página actual
  // linkedSignal crea un signal que se sincroniza automáticamente con el input
  activePage = linkedSignal(this.currentPage);

  /**
   * Computed signal que genera un array con los números de página
   * Se recalcula automáticamente cuando cambiar el valor de pages()
   * Ejemplo: si hay 5 páginas, genera [1, 2, 3, 4, 5]
   */
  getPagesList = computed(() => {
    // Array.from crea un nuevo array con una longitud específica
    // { length: this.pages() } crea un array con tantos elementos como páginas hay
    // (_, i) => i + 1 mapea cada posición (0, 1, 2...) al número de página (1, 2, 3...)
    return Array.from({ length: this.pages() }, (_, i) => i + 1);
  });
}
