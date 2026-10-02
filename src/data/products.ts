import type { Category, NavLink, Product } from '../types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Hombre', href: '/hombre' },
  { label: 'Mujer', href: '/mujer' },
  { label: 'Ofertas', href: '/ofertas' },
  { label: 'Otros', href: '/otros' },
];

export const CATEGORIES: Category[] = [
  { id: 'running', label: 'Running' },
  { id: 'futbol', label: 'Fútbol' },
  { id: 'entrenamiento', label: 'Entrenamiento' },
  { id: 'paddle', label: 'Paddle' },
];

export const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Remera Aero Run', price: 24990, discount: 20, category: 'running', image: 'https://picsum.photos/seed/vertex-p1/400/300' },
  { id: 'p2', name: 'Short Sprint 5"', price: 21990, category: 'running', image: 'https://picsum.photos/seed/vertex-p2/400/300' },
  { id: 'p3', name: 'Camiseta Pro Match', price: 39990, discount: 15, category: 'futbol', image: 'https://picsum.photos/seed/vertex-p3/400/300' },
  { id: 'p4', name: 'Campera Cortaviento', price: 69990, category: 'running', image: 'https://picsum.photos/seed/vertex-p4/400/300' },
  { id: 'p5', name: 'Calza Térmica Core', price: 34990, discount: 30, category: 'entrenamiento', image: 'https://picsum.photos/seed/vertex-p5/400/300' },
  { id: 'p6', name: 'Buzo Training Fit', price: 54990, category: 'entrenamiento', image: 'https://picsum.photos/seed/vertex-p6/400/300' },
  { id: 'p7', name: 'Pantalón Club Pro', price: 32990, category: 'futbol', image: 'https://picsum.photos/seed/vertex-p7/400/300' },
  { id: 'p8', name: 'Top Impact Mujer', price: 27990, discount: 10, category: 'entrenamiento', image: 'https://picsum.photos/seed/vertex-p8/400/300' },
  { id: 'p9', name: 'Zapatillas Pro Run', price: 109999, discount: 20, category: 'running', image: 'https://picsum.photos/seed/vertex-p9/400/300' },
  { id: 'p10', name: 'Remera Dry Fit', price: 34999, category: 'entrenamiento', image: 'https://picsum.photos/seed/vertex-p10/400/300' },
  { id: 'p11', name: 'Short Entrenamiento', price: 32999, discount: 15, category: 'entrenamiento', image: 'https://picsum.photos/seed/vertex-p11/400/300' },
  { id: 'p12', name: 'Botines de Fútbol', price: 79999, category: 'futbol', image: 'https://picsum.photos/seed/vertex-p12/400/300' },
  { id: 'p13', name: 'Pantalón Jogger', price: 43999, discount: 10, category: 'entrenamiento', image: 'https://picsum.photos/seed/vertex-p13/400/300' },
  { id: 'p14', name: 'Buzo Canguro', price: 48999, category: 'entrenamiento', image: 'https://picsum.photos/seed/vertex-p14/400/300' },
  { id: 'p15', name: 'Camiseta Entrenamiento', price: 28990, category: 'futbol', image: 'https://picsum.photos/seed/vertex-p15/400/300' },
  { id: 'p16', name: 'Calzas Largas Mujer', price: 37990, discount: 25, category: 'entrenamiento', image: 'https://picsum.photos/seed/vertex-p16/400/300' },
  { id: 'p17', name: 'Zapatillas Trail', price: 95990, category: 'running', image: 'https://picsum.photos/seed/vertex-p17/400/300' },
  { id: 'p18', name: 'Campera Polar', price: 74990, discount: 5, category: 'running', image: 'https://picsum.photos/seed/vertex-p18/400/300' },
  { id: 'p19', name: 'Pelota Pro Match', price: 18990, category: 'futbol', image: 'https://picsum.photos/seed/vertex-p19/400/300' },
  { id: 'p20', name: 'Mochila Deportiva', price: 29999, category: 'entrenamiento', image: 'https://picsum.photos/seed/vertex-p20/400/300' },
  { id: 'p21', name: 'Paleta de Paddle', price: 84990, discount: 10, category: 'paddle', image: 'https://picsum.photos/seed/vertex-p21/400/300' },
  { id: 'p22', name: 'Pelotas de Paddle (3)', price: 9990, category: 'paddle', image: 'https://picsum.photos/seed/vertex-p22/400/300' },
  { id: 'p23', name: 'Red de Paddle', price: 15990, discount: 15, category: 'paddle', image: 'https://picsum.photos/seed/vertex-p23/400/300' },
  { id: 'p24', name: 'Toalla Microfibra', price: 12990, category: 'paddle', image: 'https://picsum.photos/seed/vertex-p24/400/300' },
];
