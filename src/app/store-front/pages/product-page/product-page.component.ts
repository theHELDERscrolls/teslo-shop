import { ProductsService } from '@/products/services/products.service';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCarousel } from "@/products/components/product-carousel/product-carousel.component";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarousel],
  templateUrl: './product-page.component.html',
})
export class ProductPage {
  // Inyectamos ActivatedRoute para acceder a los parámetros de la ruta
  activatedRoute = inject(ActivatedRoute);
  
  // Inyectamos el servicio de productos para obtener el detalle del producto
  productsService = inject(ProductsService);

  /**
   * Obtenemos el identificador único del producto (slug o ID) de los parámetros de la ruta
   * snapshot permite obtener el valor actual sin necesidad de suscribirse
   * Ejemplo: si la ruta es /product/zapatos-deportivos, idSlug = "zapatos-deportivos"
   */
  productIdSlug: string = this.activatedRoute.snapshot.params['idSlug'];

  /**
   * rxResource que obtiene el detalle completo del producto individual
   * Incluye todas las imágenes, descripción detallada, precio, etc.
   */
  productResource = rxResource({
    // Parámetros de la petición (en este caso solo el slug del producto)
    params: () => ({ idSlug: this.productIdSlug }),
    // Función que hace la petición HTTP al servicio
    stream: ({ params }) => {
      // Llamamos al servicio para obtener los datos detallados del producto específico
      return this.productsService.getProductByIdSlug(params.idSlug);
    },
  });
}
