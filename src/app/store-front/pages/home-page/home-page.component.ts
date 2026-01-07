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
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  productsResource = rxResource({
    params: () => ({ page: this.paginationService.currentPage() - 1 }),
    stream: ({ params }) => {
      return this.productsService.getProducts({
        offset: params.page * 9,
      });
    },
  });
}
