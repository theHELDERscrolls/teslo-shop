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
  route = inject(ActivatedRoute);

  gender = toSignal(this.route.params.pipe(map(({ gender }) => gender)));

  productsService = inject(ProductsService);

  paginationService = inject(PaginationService);

  productsResource = rxResource({
    params: () => ({ gender: this.gender(), page: this.paginationService.currentPage() - 1 }),
    stream: ({ params }) => {
      return this.productsService.getProducts({ gender: params.gender, offset: params.page * 9 });
    },
  });
}
