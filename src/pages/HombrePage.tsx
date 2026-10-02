import { useOutletContext } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { CategoryPage } from './CategoryPage';
import type { Product } from '../types';

type OutletCtx = { addToCart: (p: Product) => void };

export default function HombrePage() {
  const { addToCart } = useOutletContext<OutletCtx>();
  return (
    <CategoryPage
      title="Hombre"
      description="Indumentaria y calzado técnico para entrenar, correr y jugar al máximo nivel."
      products={PRODUCTS}
      onAdd={addToCart}
    />
  );
}
