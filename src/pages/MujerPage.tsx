import { useMemo } from 'react';
import { PRODUCTS } from '../data/products';
import { CategoryPage } from './CategoryPage';

export default function MujerPage() {
  // Solo productos de mujer o unisex.
  const products = useMemo(() => PRODUCTS.filter((p) => p.gender !== 'hombre'), []);

  return (
    <CategoryPage
      title="Mujer"
      description="Indumentaria deportiva femenina pensada para rendir con comodidad y estilo."
      products={products}
    />
  );
}