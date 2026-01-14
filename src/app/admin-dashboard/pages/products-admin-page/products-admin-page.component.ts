import { Component, inject, input, signal } from '@angular/core';
import { ProductTable } from '@/admin-dashboard/components/product-table/product-table.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductsService } from '@/products/services/products.service';
import { PaginationService } from '@/shared/components/pagination/pagination.service';
import { Pagination } from '@/shared/components/pagination/pagination.component';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTable, Pagination],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPage {
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  productsPerpage = signal(10);

  productsResource = rxResource({
    params: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.productsPerpage(),
    }),
    stream: ({ params }) => {
      return this.productsService.getProducts({
        offset: params.page * 9,
        limit: params.limit,
      });
    },
  });
}
