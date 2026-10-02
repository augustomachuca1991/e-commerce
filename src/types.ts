export type CategoryId = 'running' | 'futbol' | 'entrenamiento' | 'paddle';

export interface Category {
  id: CategoryId;
  label: string;
}

export interface Product {
  id: string;
  name: string;
  /** Precio de lista en ARS. */
  price: number;
  /** Porcentaje de descuento (0-100). */
  discount?: number;
  category: CategoryId;
  /** URL o ruta de imagen del producto. */
  image?: string;
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
