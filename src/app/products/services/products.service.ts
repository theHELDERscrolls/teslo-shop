import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Gender, Product, ProductsResponse } from '../interfaces/product.interface';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '@/auth/interfaces/user.interface';

const BASE_URL = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User,
};

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

  /**
   * Obtiene un producto específico por su ID
   * Verifica la caché antes de hacer una petición HTTP
   * Caso especial: si el ID es 'new', devuelve un producto vacío para crear uno nuevo
   *
   * @param id - Identificador único del producto (o 'new' para crear uno nuevo)
   * @returns Observable con los datos del producto
   */
  getProductById(id: string): Observable<Product> {
    // Caso especial: si se quiere crear un producto nuevo, devolvemos un template vacío
    // Esto permite al formulario tener todos los campos inicializados correctamente
    if (id === 'new') {
      return of(emptyProduct);
    }

    // Verificamos si el producto ya está en la caché de productos individuales
    if (this.productsCache.has(id)) {
      // Si existe, lo devolvemos directamente sin hacer petición
      return of(this.oneProductCache.get(id)!);
    }

    // Si no está cacheado, hacemos la petición HTTP a la API
    return this.http
      .get<Product>(`${BASE_URL}/products/${id}`)
      .pipe(tap((product) => this.oneProductCache.set(id, product)));
  }

  /**
   * Actualiza un producto enviando los cambios al servidor
   * Después de actualizar, refuerza la caché con los nuevos datos
   *
   * @param id - Identificador único del producto a actualizar
   * @param productLike - Objeto con los campos a actualizar (parcial)
   * @returns Observable con el producto actualizado desde el servidor
   */
  updateProduct(id: string, productLike: Partial<Product>): Observable<Product> {
    // Hacemos una petición PATCH a la API para actualizar el producto
    // PATCH solo envía los campos que han cambiado, no todo el objeto
    return (
      this.http
        .patch<Product>(`${BASE_URL}/products/${id}`, productLike)
        // Después de recibir la respuesta, actualizamos la caché
        .pipe(tap((product) => this.updateProductCache(product)))
    );
  }

  /**
   * Actualiza la caché con los datos nuevos de un producto
   * Sincroniza tanto la caché de productos individuales como la de listas
   * Esto asegura que todos los lugares donde aparezca el producto muestren datos actualizados
   *
   * @param product - Producto actualizado con los nuevos datos
   */
  updateProductCache(product: Product) {
    // Obtenemos el ID del producto actualizado
    const productId = product.id;

    // Actualizamos el producto en la caché de productos individuales
    // Esto es para consultas del tipo: getProductById(id)
    this.oneProductCache.set(productId, product);

    // Recorremos todas las listas de productos cacheadas (diferentes páginas y filtros)
    this.productsCache.forEach((productResp) => {
      // Para cada lista de productos, buscamos el producto con el mismo ID
      // y lo reemplazamos con la versión actualizada
      // Esto asegura que si el producto aparece en múltiples listas, se actualicen todas
      productResp.products = productResp.products.map((currentProduct) => {
        // Si es el producto que actualizamos, lo reemplazamos con la versión nueva
        // Si no es, lo dejamos igual
        return currentProduct.id === productId ? product : currentProduct;
      });
    });
  }

  /**
   * Crea un nuevo producto en el servidor
   * Después de crear, actualiza la caché con el nuevo producto
   * 
   * @param porductLike - Objeto con los datos del nuevo producto a crear
   * @returns Observable con el producto creado (incluye su ID asignado por el servidor)
   */
  createProduct(porductLike: Partial<Product>): Observable<Product> {
    // Hacemos una petición POST a la API para crear el producto
    // POST se usa para crear nuevos recursos en el servidor
    return this.http
      .post<Product>(`${BASE_URL}/products`, porductLike)
      // Después de recibir la respuesta con el producto creado, actualizamos la caché
      .pipe(tap((product) => this.updateProductCache(product)));
  }
}
