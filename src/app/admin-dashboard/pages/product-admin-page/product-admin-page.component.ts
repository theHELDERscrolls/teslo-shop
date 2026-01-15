import { ProductsService } from '@/products/services/products.service';
import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { ProductDetails } from './product-details/product-details.component';

// Página del panel de administración para editar un producto específico
// Permite al administrador actualizar todos los detalles del producto
// Si el producto no existe, redirige automáticamente a la lista de productos
@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetails],
  templateUrl: './product-admin-page.component.html',
})
export class ProductAdminPage {
  // Inyectamos ActivatedRoute para obtener el ID del producto de la URL
  activatedRoute = inject(ActivatedRoute);
  
  // Inyectamos Router para redirigir si hay errores
  router = inject(Router);
  
  // Inyectamos el servicio de productos
  productService = inject(ProductsService);

  /**
   * Signal que contiene el ID del producto extraído de los parámetros de la ruta
   * Se actualiza automáticamente cuando cambia la URL
   * Ejemplo: /admin/products/645a1f2b3c4d5e6f  → productId() = "645a1f2b3c4d5e6f"
   */
  productId = toSignal(this.activatedRoute.params.pipe(map((params) => params['id'])));

  /**
   * rxResource que obtiene el detalle del producto a editar
   * Se reejecutará automáticamente cuando cambdie el productId
   */
  productResource = rxResource({
    // Parámetro: el ID del producto
    params: () => ({ id: this.productId() }),
    
    // Petición HTTP para obtener el producto
    stream: ({ params }) => {
      return this.productService.getProductById(params.id);
    },
  });

  /**
   * effect que monitorea si ocurre un error al cargar el producto
   * Si el producto no existe (error 404), redirige a la lista de productos
   */
  redirectEffect = effect(() => {
    // Si productResource.error() devuelve un valor (hay un error)
    if (this.productResource.error()) {
      // Redirige al usuario a la página de listado de productos
      // Así se evita mostrar una página de edición sin producto
      this.router.navigate(['/admin/products']);
    }
  });
}
