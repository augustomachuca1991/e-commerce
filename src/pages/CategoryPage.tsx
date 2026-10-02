import { useMemo } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { CATEGORIES } from '../data/products';
import { useQuickAdd } from '../hooks/useQuickAdd';
import { ProductGrid } from '../components/ProductGrid';
import type { CategoryId, Product } from '../types';

interface CategoryPageProps {
  title: string;
  description: string;
  products: Product[];
  /** Filtra por `?categoria=`, usado por las tarjetas de la home. */
  filterByCategory?: boolean;
}

export function CategoryPage({
  title,
  description,
  products,
  filterByCategory = false,
}: CategoryPageProps) {
  const [params] = useSearchParams();
  const location = useLocation();
  const { quickAdd } = useQuickAdd();

  const category = filterByCategory ? params.get('categoria') : null;
  // Memorizado para que useInfiniteScroll no reinicie la paginación en cada render.
  const visibleProducts = useMemo(
    () => (category ? products.filter((p) => p.category === (category as CategoryId)) : products),
    [products, category],
  );

  return (
    <div className="bg-base">
      <section className="bg-hero">
        <div className="mx-auto max-w-shell px-6 py-9">
          <p className="mb-2.5 text-[11px] text-hero-sub">
            <Link to="/" className="underline">
              Inicio
            </Link>{' '}
            / {title}
          </p>
          <h1 className="mb-2 font-display text-[26px] font-bold uppercase tracking-[0.4px] text-hero-text">
            {title}
          </h1>
          <p className="max-w-[420px] text-[13px] text-hero-sub">{description}</p>
        </div>
      </section>

      <div className="border-b-hairline border-line">
        <div className="mx-auto flex max-w-shell items-center justify-between px-6 py-4">
          <span aria-live="polite" className="text-[12px] text-muted">
            {visibleProducts.length} productos
          </span>
          <div className="flex items-center gap-2.5">
            <select
              aria-label="Ordenar por"
              className="rounded border-hairline border-line bg-base px-3 py-2 text-[12px] text-content"
            >
              <option>Relevancia</option>
              <option>Precio: menor a mayor</option>
              <option>Precio: mayor a menor</option>
              <option>Más nuevos</option>
            </select>
            <button
              type="button"
              className="rounded border-hairline border-line bg-base px-3 py-2 text-[12px] text-content"
            >
              Filtrar
            </button>
          </div>
        </div>
      </div>

      {category ? (
        <nav aria-label="Filtrar por categoría" className="border-b-hairline border-line">
          <ul className="mx-auto flex max-w-shell flex-wrap gap-2 px-6 py-3">
            <li>
              <Link
                to={location.pathname}
                className={`inline-block rounded-full border-hairline border-line px-3 py-1 font-sans text-[11.5px] transition-colors ${
                  !category ? 'border-primary text-primary' : 'text-muted hover:text-content'
                }`}
              >
                Todas
              </Link>
            </li>
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link
                  to={`?categoria=${c.id}`}
                  className={`inline-block rounded-full border-hairline border-line px-3 py-1 font-sans text-[11.5px] transition-colors ${
                    category === c.id ? 'border-primary text-primary' : 'text-muted hover:text-content'
                  }`}
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      <div className="mx-auto max-w-shell px-6">
        <ProductGrid
          products={visibleProducts}
          onAdd={quickAdd}
          pageSize={12}
          className="grid grid-cols-2 gap-[14px] pt-6 md:grid-cols-4"
          emptyMessage="No hay productos en esta categoría."
        />
      </div>
    </div>
  );
}