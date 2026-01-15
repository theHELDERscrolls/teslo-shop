import { Product } from '@/products/interfaces/product.interface';
import { ProductImagePipe } from '@/products/pipes/product-image.pipe';
import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pagination } from "@/shared/components/pagination/pagination.component";

// Componente tabla que muestra una lista de productos en el panel de administración
// Presenta los productos en un formato tabular para facilitar la gestión y edición
// Cada fila es un producto que se puede editar o eliminar
@Component({
  selector: 'product-table',
  imports: [ProductImagePipe, RouterLink, CurrencyPipe],
  templateUrl: './product-table.component.html',
})
export class ProductTable {
  // Input requerido: array de productos a mostrar en la tabla
  // Viene del componente padre (products-admin-page) con los productos a administrar
  products = input.required<Product[]>();
}
