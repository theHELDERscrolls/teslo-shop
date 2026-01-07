import { ProductImagePipe } from '@/products/pipes/product-image.pipe';
import { AfterViewInit, Component, ElementRef, input, viewChild } from '@angular/core';

// import Swiper JS
import Swiper from 'swiper';
// import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

@Component({
  selector: 'product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.component.html',
  styles: `
  .swiper {
    width: 100%;
    height: 500px;
  }
  `,
})
export class ProductCarousel implements AfterViewInit {
  // Input requerido: array de URLs de imágenes del producto
  // Este valor viene del componente padre (product-card o product-page)
  images = input.required<string[]>();

  // Referencia al elemento del DOM donde está el carrusel Swiper
  // Se obtiene usando el template reference variable #swiperDiv
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');

  /**
   * Se ejecuta después de que la vista se haya inicializado
   * Aquí inicializamos el carrusel Swiper con sus configuraciones
   */
  ngAfterViewInit(): void {
    // Obtenemos el elemento del DOM nativo del template reference variable
    const element = this.swiperDiv().nativeElement;

    // Si no existe el elemento, retornamos para evitar errores
    if (!element) return;

    // Inicializamos Swiper con las configuraciones deseadas
    const swiper = new Swiper(element, {
      // El carrusel se desplaza horizontalmente (de izquierda a derecha)
      direction: 'horizontal',
      // loop: true permite que cuando llegues al final, vuelva al principio de forma continua
      loop: true,

      // Registramos los módulos que usaremos en el carrusel
      modules: [Navigation, Pagination],

      // Configuración de la paginación (los puntos que indican en qué slide estamos)
      pagination: {
        el: '.swiper-pagination', // Selector CSS del elemento donde aparecerá la paginación
      },

      // Configuración de los botones de navegación (flechas siguiente/anterior)
      navigation: {
        nextEl: '.swiper-button-next',  // Selector CSS del botón siguiente
        prevEl: '.swiper-button-prev',  // Selector CSS del botón anterior
      },

      // Configuración de la barra de scroll (opcional)
      scrollbar: {
        el: '.swiper-scrollbar', // Selector CSS de la barra de scroll
      },
    });
  }
}
