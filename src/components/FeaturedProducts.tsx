import { PRODUCTS } from '../data/products';
import { useQuickAdd } from '../hooks/useQuickAdd';
import { ProductGrid } from './ProductGrid';

export function FeaturedProducts() {
  const { quickAdd } = useQuickAdd();

  return (
    <section id="destacados" aria-labelledby="destacados-title" className="px-6 py-5">
      <div className="mx-auto max-w-shell">
        <h2
          id="destacados-title"
          className="mb-3 font-display text-[13px] font-bold uppercase text-content"
        >
          Destacados
        </h2>
        <ProductGrid products={PRODUCTS} onAdd={quickAdd} />
      </div>
    </section>
  );
}