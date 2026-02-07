import { Product } from '@/products/interfaces/product.interface';
import { ProductImagePipe } from '@/products/pipes/product-image.pipe';
import { SlicePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

// Componente que renderiza una tarjeta de producto en la tienda
// Se utiliza en páginas de listado (home page, gender page) para mostrar cada producto
// Permite al usuario ver información básica del producto y acceder a su página de detalle
@Component({
  selector: 'product-card',
  // Importa pipes y directivas necesarias:
  // - RouterLink: permite navegar al detalle del producto
  // - SlicePipe: para limitar caracteres del título
  // - ProductImagePipe: para construir la URL completa de la imagen
  imports: [RouterLink, SlicePipe, ProductImagePipe],
  templateUrl: './product-card.component.html',
})
export class ProductCard {
  // Input requerido: objeto de producto con toda su información
  // Este componente recibe un producto del componente padre (home-page, gender-page)
  // para mostrar su título, imagen, precio y enlace al detalle
  product = input.required<Product>();
}
