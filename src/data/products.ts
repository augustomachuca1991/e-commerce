import type {
  Category,
  CategoryId,
  Gender,
  NavLink,
  Product,
  ProductColor,
  ProductSize,
} from '../types';

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

/** Máximo de imágenes por producto. */
const MAX_IMAGES = 10;

const PALETTES: Record<CategoryId, ProductColor[]> = {
  running: [
    { label: 'Negro', hex: '#141414' },
    { label: 'Naranja', hex: '#FF5C23' },
    { label: 'Gris', hex: '#8A8A8A' },
    { label: 'Azul', hex: '#2B4C8C' },
  ],
  futbol: [
    { label: 'Blanco', hex: '#F5F5F5' },
    { label: 'Negro', hex: '#141414' },
    { label: 'Rojo', hex: '#C62828' },
    { label: 'Azul', hex: '#1B4FA0' },
  ],
  entrenamiento: [
    { label: 'Negro', hex: '#141414' },
    { label: 'Gris melange', hex: '#9A9A9A' },
    { label: 'Verde', hex: '#2E7D32' },
    { label: 'Naranja', hex: '#FF5C23' },
  ],
  paddle: [
    { label: 'Verde lima', hex: '#C6D92B' },
    { label: 'Azul', hex: '#1B4FA0' },
    { label: 'Rojo', hex: '#C62828' },
    { label: 'Negro', hex: '#141414' },
  ],
};

/** Numeración de calzado. */
const SHOE_SIZES = ['38', '39', '40', '41', '42', '43', '44', '45'];
/** Talles de indumentaria. */
const CLOTH_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
/** Talles de accesorios de talle único. */
const ONE_SIZE = ['Único'];

/** Categorías cuyo producto principal es calzado: usan numeración. */
const FOOTWEAR: CategoryId[] = ['running'];
/** Categorías cuyos productos son accesorios de talle único. */
const ONE_SIZE_CATEGORIES: CategoryId[] = ['paddle'];

function sizesFor(category: CategoryId, seed: number): ProductSize[] {
  const base = ONE_SIZE_CATEGORIES.includes(category)
    ? ONE_SIZE
    : FOOTWEAR.includes(category)
      ? SHOE_SIZES
      : CLOTH_SIZES;

  return base.map((label, i) => {
    // Stock determinista por producto+talle: estable entre recargas y con
    // algunos talles agotados para poder probar la UI de sin stock.
    const soldOut = (seed * 7 + i * 13) % 11 === 0;
    return { label, stock: soldOut ? 0 : ((seed + i * 3) % 9) + 1 };
  });
}

function imagesFor(id: string, count = MAX_IMAGES): string[] {
  return Array.from(
    { length: count },
    (_, i) => `https://picsum.photos/seed/vertex-${id}-${i}/800/800`,
  );
}

const DESCRIPTIONS: Record<CategoryId, string> = {
  running:
    'Pensada para corredores que buscan velocidad y comodidad en cada kilómetro. Tela técnica de secado rápido, costuras planas que no rozan y detalles reflectantes para visibilidad nocturna.',
  futbol:
    'Camiseta de match con costuras reforzadas en hombros y costados, diseño de club y control de humedad avanzado. Te deja libertad total de movimiento en cada carrera y cada entrenamiento.',
  entrenamiento:
    'Pensada para levantar, tirar y repetir. Composición con elastano para movilidad total, costuras flatlock que no molestan bajo carga y un corte que mantiene la forma sesión tras sesión.',
  paddle:
    'Accesorios para pádel con materiales testados en pista: superficie antideslizante, amortiguación y agarre firme. Resistentes al sol y a la abrasión del terreno.',
};

type Seed = [
  name: string,
  price: number,
  discount: number | undefined,
  category: CategoryId,
  gender: Gender,
];

const SEEDS: Seed[] = [
  // Running
  ['Remera Aero Run', 24990, 20, 'running', 'unisex'],
  ['Short Sprint 5"', 21990, undefined, 'running', 'hombre'],
  ['Campera Cortaviento', 69990, undefined, 'running', 'unisex'],
  ['Zapatillas Pro Run', 109999, 20, 'running', 'unisex'],
  ['Zapatillas Trail', 95990, undefined, 'running', 'hombre'],
  ['Campera Polar', 74990, 5, 'running', 'unisex'],
  ['Mallas Running Compression', 45990, undefined, 'running', 'mujer'],
  ['Pantalón Jogger Running', 43999, undefined, 'running', 'hombre'],
  ['Top Deportivo Ligero', 32990, 15, 'running', 'mujer'],
  ['Capucha Impermeable', 38990, undefined, 'running', 'unisex'],
  ['Calcetines Térmicos Running', 12990, undefined, 'running', 'unisex'],
  ['Cintura Running Hydration', 22990, 10, 'running', 'unisex'],

  // Fútbol
  ['Camiseta Pro Match', 39990, 15, 'futbol', 'unisex'],
  ['Pantalón Club Pro', 32990, undefined, 'futbol', 'hombre'],
  ['Botines de Fútbol', 79999, undefined, 'futbol', 'unisex'],
  ['Camiseta Entrenamiento', 28990, undefined, 'futbol', 'hombre'],
  ['Pelota Pro Match', 18990, undefined, 'futbol', 'unisex'],
  ['Medias de Fútbol Altas', 14990, undefined, 'futbol', 'unisex'],
  ['Canilleras Pro', 19990, 10, 'futbol', 'unisex'],
  ['Guantes de Arquero', 34990, undefined, 'futbol', 'unisex'],
  ['Shorts de Fútbol', 28990, undefined, 'futbol', 'hombre'],
  ['Camiseta Suplente', 24990, 25, 'futbol', 'unisex'],
  ['Bolso Sporting', 26990, undefined, 'futbol', 'unisex'],
  ['Pantalón Corto Training', 30990, undefined, 'futbol', 'mujer'],

  // Entrenamiento
  ['Calza Térmica Core', 34990, 30, 'entrenamiento', 'mujer'],
  ['Buzo Training Fit', 54990, undefined, 'entrenamiento', 'hombre'],
  ['Remera Dry Fit', 34999, undefined, 'entrenamiento', 'unisex'],
  ['Short Entrenamiento', 32999, 15, 'entrenamiento', 'hombre'],
  ['Buzo Canguro', 48999, undefined, 'entrenamiento', 'unisex'],
  ['Calzas Largas Mujer', 37990, 25, 'entrenamiento', 'mujer'],
  ['Short Impact Mujer', 27990, undefined, 'entrenamiento', 'mujer'],
  ['Mochila Deportiva', 29999, undefined, 'entrenamiento', 'unisex'],
  ['Pantalones Entrenamiento', 35990, undefined, 'entrenamiento', 'hombre'],
  ['Top Sustén Deportivo', 38990, 20, 'entrenamiento', 'mujer'],
  ['Remera Tirador', 29990, undefined, 'entrenamiento', 'hombre'],
  ['Jogger Fleece', 39990, undefined, 'entrenamiento', 'unisex'],
  ['Kit Mancuernas y Resistencia', 69990, 10, 'entrenamiento', 'unisex'],
  ['Guantes Gimnasio', 24990, undefined, 'entrenamiento', 'unisex'],
  ['Cintura Entrenamiento', 18990, undefined, 'entrenamiento', 'unisex'],

  // Paddle
  ['Paleta de Paddle', 84990, 10, 'paddle', 'unisex'],
  ['Pelotas de Paddle (3)', 9990, undefined, 'paddle', 'unisex'],
  ['Red de Paddle', 15990, 15, 'paddle', 'unisex'],
  ['Toalla Microfibra', 12990, undefined, 'paddle', 'unisex'],
  ['Bolso Paletero', 32990, undefined, 'paddle', 'unisex'],
  ['Protector de Rodillas', 22990, undefined, 'paddle', 'unisex'],
  ['Gripantebras', 21990, undefined, 'paddle', 'unisex'],
  ['Pack Aros', 18990, undefined, 'paddle', 'unisex'],
  ['Zapatillas Padel Indoor', 87990, undefined, 'paddle', 'unisex'],
  ['Set Conos Entrenamiento', 16990, undefined, 'paddle', 'unisex'],
  ['Botella Térmica 750ml', 21990, 20, 'paddle', 'unisex'],

  // Cross category
  ['Remera Manga Larga Térmica', 37990, undefined, 'entrenamiento', 'unisex'],
  ['Buzo Impermeable Urban', 74990, 15, 'entrenamiento', 'unisex'],
  ['Short Runner 7"', 25990, undefined, 'running', 'mujer'],
  ['Camiseta Sin Mangas Running', 27990, undefined, 'running', 'hombre'],
  ['Chaqueta Puffer Ligera', 89990, 20, 'running', 'unisex'],
  ['Pantalon Reflectante Night', 41990, undefined, 'running', 'unisex'],
  ['Buzo Oversize Unisex', 44990, undefined, 'entrenamiento', 'unisex'],
  ['Top Crop Deportivo', 28990, 15, 'entrenamiento', 'mujer'],
  ['Set Pilates Bandas', 27990, undefined, 'entrenamiento', 'mujer'],
];

export const PRODUCTS: Product[] = SEEDS.map(([name, price, discount, category, gender], i) => {
  const id = `p${i + 1}`;
  const seed = i + 1;

  return {
    id,
    name,
    price,
    discount,
    category,
    gender,
    description: DESCRIPTIONS[category],
    images: imagesFor(id),
    sizes: sizesFor(category, seed),
    colors: PALETTES[category].slice(0, ((seed - 1) % 3) + 2),
  };
});

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getCategoryLabel(id: CategoryId): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

/** Precio final de un producto, ya aplicado el descuento. */
export function finalPrice(product: Product): number {
  return product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;
}

/** Stock total del producto en el talle indicado, o 0 si no existe. */
export function stockForSize(product: Product, size: string): number {
  return product.sizes.find((s) => s.label === size)?.stock ?? 0;
}