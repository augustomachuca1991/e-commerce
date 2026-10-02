import { useOutletContext } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { CategoryPage } from './CategoryPage';
import type { Product } from '../types';

type OutletCtx = { addToCart: (p: Product) => void };

export default function OfertasPage() {
  const { addToCart } = useOutletContext<OutletCtx>();
  const ofertas = PRODUCTS.filter((p) => p.discount);
  return (
    <CategoryPage
      title="Ofertas"
      description="Las mejores promos en ropa y calzado deportivo."
      products={ofertas}
      onAdd={addToCart}
    />
  );
}
