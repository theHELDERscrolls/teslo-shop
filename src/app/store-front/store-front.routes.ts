import { Routes } from '@angular/router';
import { StoreFrontLayout } from './layouts/store-front-layout/store-front-layout.component';
import { HomePage } from './pages/home-page/home-page.component';
import { GenderPage } from './pages/gender-page/gender-page.component';
import { ProductPage } from './pages/product-page/product-page.component';
import { NotFoundPage } from './pages/not-found-page/not-found-page.component';

export const storeFrontRoutes: Routes = [
  {
    path: '',
    component: StoreFrontLayout,
    children: [
      {
        path: '',
        component: HomePage,
      },
      {
        path: 'gender/:gender',
        component: GenderPage,
      },
      {
        path: 'product/:idSlug',
        component: ProductPage,
      },
      {
        path: '**',
        component: NotFoundPage,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default storeFrontRoutes;
