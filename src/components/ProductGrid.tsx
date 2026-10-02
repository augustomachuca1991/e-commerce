import { Loader2 } from 'lucide-react';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { ProductCard } from './ProductCard';
import type { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  onAdd: (product: Product) => void;
  /** Productos por tanda. `Infinity` muestra todo sin centinela. */
  pageSize?: number;
  className?: string;
  emptyMessage?: string;
}

/**
 * Grilla de productos con carga incremental: 12 por tanda a medida que se
 * scrollea, mediante un centinela observado con IntersectionObserver.
 */
export function ProductGrid({
  products,
  onAdd,
  pageSize = 12,
  className = 'grid grid-cols-2 gap-[10px] md:grid-cols-4',
  emptyMessage = 'No hay productos para mostrar.',
}: ProductGridProps) {
  const incremental = pageSize !== Infinity;
  const { visible, hasMore, sentinelRef } = useInfiniteScroll(products, pageSize);

  return (
    <>
      <ul className={className}>
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={onAdd} />
        ))}
      </ul>

      {visible.length === 0 ? (
        <p className="py-10 text-center font-sans text-[13px] text-muted">{emptyMessage}</p>
      ) : null}

      {incremental ? (
        <div
          ref={hasMore ? sentinelRef : undefined}
          className="flex items-center justify-center py-7"
          aria-live="polite"
        >
          {hasMore ? (
            <>
              <Loader2 size={16} strokeWidth={1.5} className="animate-spin text-muted" />
              <span className="sr-only">Cargando más productos</span>
            </>
          ) : (
            <p className="font-sans text-[11.5px] text-muted">
              Mostrás los {products.length} productos
            </p>
          )}
        </div>
      ) : null}
    </>
  );
}