import { useOutletContext } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { CategoryPage } from './CategoryPage';
import type { Product } from '../types';

type OutletCtx = { addToCart: (p: Product) => void };

export default function OtrosPage() {
  const { addToCart } = useOutletContext<OutletCtx>();
  return (
    <CategoryPage
      title="Otros"
      description="Accesorios y equipamiento complementario para tu entrenamiento."
      products={PRODUCTS}
      onAdd={addToCart}
    />
  );
}
