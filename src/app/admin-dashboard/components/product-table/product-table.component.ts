import { Product } from '@/products/interfaces/product.interface';
import { ProductImagePipe } from '@/products/pipes/product-image.pipe';
import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pagination } from "@/shared/components/pagination/pagination.component";

@Component({
  selector: 'product-table',
  imports: [ProductImagePipe, RouterLink, CurrencyPipe],
  templateUrl: './product-table.component.html',
})
export class ProductTable {
  products = input.required<Product[]>();
}
