import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product, ProductsResponse } from '../interfaces/product.interface';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const BASE_URL = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  // Inyectamos HttpClient para hacer peticiones HTTP a la API
  private http = inject(HttpClient);

  // Caché para almacenar productos ya obtenidos (evita peticiones innecesarias)
  // Clave: "limit-offset-gender" para identificar cada combinación de filtros
  private productsCache = new Map<string, ProductsResponse>();

  // Caché para almacenar productos individuales por su ID o slug
  private oneProductCache = new Map<string, Product>();

  /**
   * Obtiene una lista de productos con filtros opcionales
   * Utiliza caché para evitar hacer peticiones HTTP repetidas con los mismos parámetros
   *
   * @param options - Objeto con limit (cantidad de productos), offset (página) y gender (filtro por género)
   * @returns Observable con la respuesta de productos o datos cacheados
   */
  getProducts(options: Options): Observable<ProductsResponse> {
    // Destructuramos las opciones con valores por defecto
    // limit: 9 productos por defecto
    // offset: 0 para la primera página
    // gender: vacío para mostrar todos los productos
    const { limit = 9, offset = 0, gender = '' } = options;

    // Creamos una clave única basada en los parámetros de búsqueda
    // Esto permite identificar si ya tenemos estos datos cacheados
    const key = `${limit}-${offset}-${gender}`;

    // Verificamos si ya tenemos estos datos en caché
    if (this.productsCache.has(key)) {
      // Si existe en caché, devolvemos los datos cacheados sin hacer petición HTTP
      // of() convierte el dato en un Observable
      return of(this.productsCache.get(key)!);
    }

    // Si no está en caché, hacemos la petición HTTP a la API
    return this.http
      .get<ProductsResponse>(`${BASE_URL}/products`, {
        params: {
          limit: limit,
          offset: offset,
          gender: gender,
        },
      })
      .pipe(
        // tap() ejecuta una acción sin modificar los datos
        // Aquí registramos la respuesta en la consola para debug
        tap((resp) => console.log(resp)),
        // Guardamos la respuesta en el caché con la clave correspondiente
        // Así, la próxima vez que soliciten estos datos, se usará el caché
        tap((resp) => this.productsCache.set(key, resp))
      );
  }

  /**
   * Obtiene un producto específico por su ID o slug
   * Utiliza caché para evitar peticiones repetidas del mismo producto
   *
   * @param idSlug - Identificador único del producto (slug o ID)
   * @returns Observable con los datos del producto individual
   */
  getProductByIdSlug(idSlug: string): Observable<Product> {
    // Verificamos si el producto ya está cacheado
    if (this.productsCache.has(idSlug)) {
      // Si existe, lo devolvemos directamente sin hacer petición
      return of(this.oneProductCache.get(idSlug)!);
    }

    // Si no está cacheado, hacemos la petición HTTP a la API
    return (
      this.http
        .get<Product>(`${BASE_URL}/products/${idSlug}`)
        // Guardamos el producto en el caché para futuras consultas
        .pipe(tap((product) => this.oneProductCache.set(idSlug, product)))
    );
  }

  getProductById(id: string): Observable<Product> {
    if (this.productsCache.has(id)) {
      return of(this.oneProductCache.get(id)!);
    }

    return this.http
      .get<Product>(`${BASE_URL}/products/${id}`)
      .pipe(tap((product) => this.oneProductCache.set(id, product)));
  }
}
