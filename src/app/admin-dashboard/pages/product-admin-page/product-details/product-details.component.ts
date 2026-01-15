import { Product } from '@/products/interfaces/product.interface';
import { Component, inject, input, OnInit } from '@angular/core';
import { ProductCarousel } from '@/products/components/product-carousel/product-carousel.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@/utils/form-utils';
import { FormErrorLabel } from '@/shared/components/form-error-label/form-error-label.component';
import { ProductsService } from '@/products/services/products.service';
import { Router } from '@angular/router';

// Componente que muestra el formulario de edición de detalles de un producto
// Permite al administrador actualizar:
// - Información básica (título, descripción, slug)
// - Pricing (precio, stock)
// - Atributos (tallas disponibles, imágenes, género)
// - Metadatos (tags)
@Component({
  selector: 'product-details',
  imports: [ProductCarousel, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './product-details.component.html',
})
export class ProductDetails implements OnInit {
  // Input requerido: el producto que se va a editar
  // Viene del componente padre (product-admin-page)
  product = input.required<Product>();

  router = inject(Router);
  productService = inject(ProductsService);

  // Inyectamos FormBuilder para construir el formulario reactivo
  fb = inject(FormBuilder);

  // Formulario reactivo con todos los campos del producto
  // Incluye validaciones tanto de formato como de valores permitidos
  productForm = this.fb.group({
    // Título del producto - requerido y no puede estar vacío
    title: ['', Validators.required],

    // Descripción del producto - requerido
    description: ['', Validators.required],

    // Slug (URL amigable) - requerido y debe cumplir el patrón de slug válido
    // Patrón: palabras-en-minusculas-separadas-por-guiones
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],

    // Precio del producto - requerido y debe ser mayor a 0
    price: [0, [Validators.required, Validators.min(0)]],

    // Cantidad en stock - requerido y debe ser mayor o igual a 0
    stock: [0, [Validators.required, Validators.min(0)]],

    // Tallas disponibles - array que se actualiza cuando el usuario selecciona tallas
    sizes: [['']],

    // Array de imágenes del producto
    images: [[]],

    // Tags para categorizar el producto (separados por comas)
    tags: [''],

    // Género del producto - requerido
    // Solo permite: men, women, kid, unisex
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]],
  });

  // Array con todas las tallas disponibles que puede seleccionar el administrador
  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  /**
   * Se ejecuta después de inicializar el componente
   * Carga los datos del producto en el formulario
   */
  ngOnInit(): void {
    // Rellena el formulario con los datos del producto actual
    this.setFormValue(this.product());
  }

  /**
   * Establece los valores del formulario con los datos del producto
   * Convierte datos especiales como tags de array a string separado por comas
   *
   * @param formLike - Datos parciales o completos del producto
   */
  setFormValue(formLike: Partial<Product>) {
    // Reset limpia el formulario y establece nuevos valores
    this.productForm.reset(this.product() as any);

    // Los tags vienen como array, los convertimos a string separado por comas
    // para que se vea bien en el campo input text del formulario
    this.productForm.patchValue({ tags: formLike.tags?.join(',') });
    // this.productForm.patchValue(formLike as any);
  }

  /**
   * Maneja el envío del formulario de edición de producto
   * Valida los datos, procesa los tags, y crea o actualiza el producto según sea necesario
   * Si es un producto nuevo (id === 'new'), lo crea; si no, lo actualiza
   */
  onSubmit() {
    // Verificamos que el formulario sea válido antes de procesar
    const isValid = this.productForm.valid;

    // Si hay errores de validación, cancelamos la operación
    if (!isValid) return;

    // Obtenemos los valores del formulario
    const formValue = this.productForm.value;

    // Creamos el objeto a enviar al servidor
    // Esparcimos todos los valores del formulario y procesamos los tags especialmente
    const productLike: Partial<Product> = {
      ...(formValue as any),
      // Los tags vienen como string separados por comas en el input
      // Los convertimos a array, limpiamos espacios en blanco y convertimos a minúsculas
      tags: formValue.tags
        ?.toLowerCase()
        .split(',')
        .map((tag) => tag.trim() ?? []),
    };

    // Si es un producto nuevo (id === 'new'), creamos uno nuevo en la base de datos
    if (this.product().id === 'new') {
      this.productService.createProduct(productLike);
    } 
    // Si es un producto existente, lo actualizamos
    else {
      this.productService.updateProduct(this.product().id, productLike).subscribe((producto) => {
        console.log('🔃 Producto actualizado');
      });
    }
  }

  /**
   * Alterna la selección de una talla (la agrega si no está, la quita si ya está)
   * Se ejecuta cuando el usuario hace click en un botón de talla
   *
   * @param size - La talla a activar/desactivar (ej: "M", "L")
   */
  onSizeClicked(size: string) {
    // Obtiene el array actual de tallas seleccionadas del formulario
    const currentSizes = this.productForm.value.sizes ?? [];

    // Si la talla ya está en el array, la quita
    if (currentSizes.includes(size)) {
      // indexOf devuelve el índice de la talla, splice la elimina
      currentSizes.splice(currentSizes.indexOf(size), 1);
    }
    // Si no está, la añade
    else {
      currentSizes.push(size);
    }

    // Actualiza el valor del formulario con el nuevo array de tallas
    this.productForm.patchValue({ sizes: currentSizes });
  }
}
