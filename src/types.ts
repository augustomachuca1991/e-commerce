export type CategoryId = 'running' | 'futbol' | 'entrenamiento' | 'paddle';

export type Gender = 'hombre' | 'mujer' | 'unisex';

export interface Category {
  id: CategoryId;
  label: string;
}

export interface ProductSize {
  label: string;
  /** Unidades disponibles; 0 deshabilita el talle. */
  stock: number;
}

export interface ProductColor {
  label: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  /** Precio de lista en ARS. */
  price: number;
  /** Porcentaje de descuento (0-100). */
  discount?: number;
  category: CategoryId;
  gender: Gender;
  description: string;
  /** Hasta 10 imágenes: la primera es la portada. */
  images: string[];
  sizes: ProductSize[];
  colors: ProductColor[];
}

export interface CartItem {
  /** Identificador único de la variante (producto + talle + color). */
  key: string;
  product: Product;
  size: string;
  color: string;
  qty: number;
}

export interface NavLink {
  label: string;
  href: string;
}

export type Theme = 'light' | 'dark';

/** Evento no estándar de Chromium para instalar la PWA. */
export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}