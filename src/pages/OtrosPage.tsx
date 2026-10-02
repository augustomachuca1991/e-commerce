import { CategoryPage } from './CategoryPage';
import { PRODUCTS } from '../data/products';

export default function OtrosPage() {
  return (
    <CategoryPage
      title="Otros"
      description="Accesorios y equipamiento complementario para tu entrenamiento."
      products={PRODUCTS}
      filterByCategory
    />
  );
}