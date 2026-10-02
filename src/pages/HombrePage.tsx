import { useMemo } from 'react';
import { PRODUCTS } from '../data/products';
import { CategoryPage } from './CategoryPage';
export default function HombrePage() {
  // Solo productos de hombre o unisex.
  const products = useMemo(() => PRODUCTS.filter((p) => p.gender !== 'mujer'), []);

  return (
    <CategoryPage
      title="Hombre"
      description="Indumentaria y calzado técnico para entrenar, correr y jugar al máximo nivel."
      products={products}
    />
  );
}