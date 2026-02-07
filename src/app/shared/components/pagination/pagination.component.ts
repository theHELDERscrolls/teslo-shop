import { Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

// Componente de paginación reutilizable que aparece en todas las páginas con listados
// Permite al usuario navegar entre diferentes páginas de productos
// Muestra botones numerados para cada página y el estado de la página actual
@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
})
export class Pagination {
  // Input: número total de páginas disponibles
  // Se calcula en el componente padre según el total de productos y el límite por página
  // Valor por defecto es 0 si no se proporciona
  pages = input(0);
  
  // Input: página actual que está siendo visualizada
  // Viene del PaginationService basado en el parámetro de query "page" de la URL
  // Valor por defecto es 1 (primera página)
  currentPage = input<number>(1);

  // Signal vinculada a currentPage que nos permite cambiar la página actual
  // linkedSignal crea un signal que se sincroniza automáticamente con el input
  // Si el input cambia, este signal se actualiza también
  activePage = linkedSignal(this.currentPage);

  /**
   * Computed signal que genera un array con los números de página
   * Se recalcula automáticamente cuando cambia el valor de pages()
   * Ejemplo: si hay 5 páginas, genera [1, 2, 3, 4, 5]
   * Esto se utiliza en el template para renderizar un botón para cada página
   */
  getPagesList = computed(() => {
    // Array.from crea un nuevo array con una longitud específica
    // { length: this.pages() } crea un array con tantos elementos como páginas hay
    // (_, i) => i + 1 mapea cada posición (0, 1, 2...) al número de página (1, 2, 3...)
    return Array.from({ length: this.pages() }, (_, i) => i + 1);
  });
}
