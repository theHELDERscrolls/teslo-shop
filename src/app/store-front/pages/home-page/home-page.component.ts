import { Component, inject } from '@angular/core';
import { ProductCard } from '@/store-front/components/product-card/product-card';
import { ProductsService } from '@/products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home-page',
  imports: [ProductCard],
  templateUrl: './home-page.component.html',
})
export class HomePage {
  productsService = inject(ProductsService);

  productsResource = rxResource({
    params: () => ({}),
    stream: ({ params }) => {
      return this.productsService.getProducts({
        limit: 5,
        gender: 'women',
      });
    },
  });
}
