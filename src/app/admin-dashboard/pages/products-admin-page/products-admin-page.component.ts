import { Component, inject, input, signal } from '@angular/core';
import { ProductTable } from '@/admin-dashboard/components/product-table/product-table.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductsService } from '@/products/services/products.service';
import { PaginationService } from '@/shared/components/pagination/pagination.service';
import { Pagination } from '@/shared/components/pagination/pagination.component';

// Página del panel de administración que lista todos los productos
// Los administradores pueden ver, editar y eliminar productos desde aquí
// Incluye paginación para manejar listas largas de productos
@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTable, Pagination],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPage {
  // Inyectamos el servicio de productos para obtener la lista de todos los productos
  productsService = inject(ProductsService);
  
  // Inyectamos el servicio de paginación para obtener la página actual
  paginationService = inject(PaginationService);

  // Signal que controla cuántos productos se muestran por página en el panel de admin
  // Por defecto muestra 10 productos por página (diferente al 9 de la tienda)
  productsPerpage = signal(10);

  /**
   * rxResource que obtiene la lista paginada de productos para administración
   * Se reejecutará automáticamente cuando cambien la página o el número de productos por página
   */
  productsResource = rxResource({
    // Parámetros necesarios para la petición
    // Incluyen la página actual y el número de productos a mostrar
    params: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.productsPerpage(),
    }),
    
    // Función que hace la petición HTTP
    stream: ({ params }) => {
      // Llamamos al servicio para obtener los productos con paginación
      // Cada página de admin muestra 10 productos (del parámetro limit)
      return this.productsService.getProducts({
        offset: params.page * 9,
        limit: params.limit,
      });
    },
  });
}
