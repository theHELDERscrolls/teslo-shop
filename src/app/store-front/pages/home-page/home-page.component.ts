import { Component, inject } from '@angular/core';
import { Pagination } from '@/shared/components/pagination/pagination.component';
import { ProductCard } from '@/store-front/components/product-card/product-card.component';
import { ProductsService } from '@/products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationService } from '@/shared/components/pagination/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCard, Pagination],
  templateUrl: './home-page.component.html',
})
export class HomePage {
  // Inyectamos el servicio de productos para obtener la lista de productos
  productsService = inject(ProductsService);
  
  // Inyectamos el servicio de paginación para obtener la página actual de la URL
  paginationService = inject(PaginationService);

  /**
   * rxResource es una herramienta reactiva que maneja peticiones HTTP
   * Se reejecutará automáticamente cuando cambien sus parámetros
   */
  productsResource = rxResource({
    // params es una función que devuelve los parámetros necesarios
    // Se reejecutará automáticamente cuando currentPage() cambie
    params: () => ({ page: this.paginationService.currentPage() - 1 }),
    // stream es la función que hace la petición HTTP
    // Recibe los parámetros y devuelve un Observable con los datos
    stream: ({ params }) => {
      // Llamamos al servicio para obtener productos
      // offset = params.page * 9 significa que cada página muestra 9 productos
      // Página 1 (params.page = 0) = offset 0 (productos 0-8)
      // Página 2 (params.page = 1) = offset 9 (productos 9-17)
      // Página 3 (params.page = 2) = offset 18 (productos 18-26)
      return this.productsService.getProducts({
        offset: params.page * 9,
      });
    },
  });
}
