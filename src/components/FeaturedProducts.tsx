import { PRODUCTS } from '../data/products';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';

interface FeaturedProductsProps {
  onAdd: (product: Product) => void;
}

export function FeaturedProducts({ onAdd }: FeaturedProductsProps) {
  return (
    <section id="destacados" aria-labelledby="destacados-title" className="px-6 py-5">
      <div className="mx-auto max-w-shell">
        <h2
          id="destacados-title"
          className="mb-3 font-display text-[13px] font-bold uppercase text-content"
        >
          Destacados
        </h2>
        <ul className="grid grid-cols-2 gap-[10px] md:grid-cols-4">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={onAdd} />
          ))}
        </ul>
      </div>
    </section>
  );
}
