import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FrontNavbar } from '@/store-front/components/front-navbar/front-navbar';

@Component({
  selector: 'app-store-front-layout',
  imports: [RouterOutlet, FrontNavbar],
  templateUrl: './store-front-layout.component.html',
})
export class StoreFrontLayout {}
