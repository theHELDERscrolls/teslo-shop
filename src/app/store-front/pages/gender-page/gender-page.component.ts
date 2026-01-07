import { ProductsService } from '@/products/services/products.service';
import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ProductCard } from '@/store-front/components/product-card/product-card.component';
import { Pagination } from '@/shared/components/pagination/pagination.component';
import { PaginationService } from '@/shared/components/pagination/pagination.service';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCard, Pagination],
  templateUrl: './gender-page.component.html',
})
export class GenderPage {
  // Inyectamos ActivatedRoute para acceder a los parámetros de la ruta (gender)
  route = inject(ActivatedRoute);

  /**
   * Signal que contiene el género actual desde los parámetros de la ruta
   * Ejemplo: si la URL es /gender/men, gender() = "men"
   * Se actualiza automáticamente cuando cambia la ruta
   */
  gender = toSignal(this.route.params.pipe(map(({ gender }) => gender)));

  // Inyectamos el servicio de productos para obtener productos filtrados por género
  productsService = inject(ProductsService);

  // Inyectamos el servicio de paginación para obtener la página actual
  paginationService = inject(PaginationService);

  /**
   * rxResource que maneja la petición de productos filtrados por género
   * Se reejecutará automáticamente cuando cambien el género o la página
   */
  productsResource = rxResource({
    // Parámetros que se usan para la petición
    // Incluyen el género y la página actual
    params: () => ({ gender: this.gender(), page: this.paginationService.currentPage() - 1 }),
    // Función que hace la petición HTTP
    stream: ({ params }) => {
      // Llamamos al servicio con los parámetros de género y offset
      // Esto devuelve solo los productos que coinciden con el género especificado
      return this.productsService.getProducts({ gender: params.gender, offset: params.page * 9 });
    },
  });
}
