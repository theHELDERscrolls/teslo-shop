import { ProductsService } from '@/products/services/products.service';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCarousel } from "@/products/components/product-carousel/product-carousel.component";

// Página que muestra el detalle completo de un producto específico
// Incluye:
// - Carrusel de imágenes del producto
// - Información completa del producto (nombre, descripción, precio, stock, tallas, etc.)
// - Opción para agregar el producto al carrito (si se implementa)
@Component({
  selector: 'app-product-page',
  imports: [ProductCarousel],
  templateUrl: './product-page.component.html',
})
export class ProductPage {
  // Inyectamos ActivatedRoute para acceder a los parámetros de la ruta
  // En este caso, el parámetro "idSlug" que identifica el producto
  activatedRoute = inject(ActivatedRoute);
  
  // Inyectamos el servicio de productos para obtener el detalle del producto específico
  productsService = inject(ProductsService);

  /**
   * Obtenemos el identificador único del producto (slug o ID) de los parámetros de la ruta
   * snapshot permite obtener el valor actual sin necesidad de suscribirse
   * Ejemplo: 
   *   - URL: /product/zapatos-deportivos  → idSlug = "zapatos-deportivos"
   *   - URL: /product/645a1f2b3c4d5e6f   → idSlug = "645a1f2b3c4d5e6f"
   */
  productIdSlug: string = this.activatedRoute.snapshot.params['idSlug'];

  /**
   * rxResource que obtiene el detalle completo del producto individual
   * Incluye todas las imágenes, descripción detallada, precio, stock, tallas disponibles, etc.
   */
  productResource = rxResource({
    // Parámetros de la petición (en este caso solo el slug/ID del producto)
    params: () => ({ idSlug: this.productIdSlug }),
    
    // Función que hace la petición HTTP al servicio
    stream: ({ params }) => {
      // Llamamos al servicio para obtener los datos detallados del producto específico
      // Este método incluye caché para evitar peticiones innecesarias al mismo producto
      return this.productsService.getProductByIdSlug(params.idSlug);
    },
  });
}
