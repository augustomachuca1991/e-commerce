import { useOutletContext } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { CategoryPage } from './CategoryPage';
import type { Product } from '../types';

type OutletCtx = { addToCart: (p: Product) => void };

export default function MujerPage() {
  const { addToCart } = useOutletContext<OutletCtx>();
  return (
    <CategoryPage
      title="Mujer"
      description="Indumentaria deportiva femenina pensada para rendir con comodidad y estilo."
      products={PRODUCTS}
      onAdd={addToCart}
    />
  );
}
