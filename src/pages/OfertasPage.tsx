import { useMemo } from 'react';
import { PRODUCTS } from '../data/products';
import { CategoryPage } from './CategoryPage';

export default function OfertasPage() {
  const ofertas = useMemo(() => PRODUCTS.filter((p) => p.discount), []);

  return (
    <CategoryPage
      title="Ofertas"
      description="Las mejores promos en ropa y calzado deportivo."
      products={ofertas}
      filterByCategory
    />
  );
}