import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface CategoryPageProps {
  title: string;
  description: string;
  products: Product[];
  onAdd: (p: Product) => void;
}

export function CategoryPage({ title, description, products, onAdd }: CategoryPageProps) {
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
          <span className="text-[12px] text-muted">{products.length} productos</span>
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

      <ul className="mx-auto grid max-w-shell grid-cols-2 gap-[14px] px-6 pb-2 pt-6 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={onAdd} />
        ))}
      </ul>

      <div className="flex justify-center py-7">
        <button
          type="button"
          className="rounded border-hairline border-primary px-[26px] py-[11px] font-display text-[12.5px] font-bold uppercase tracking-[0.4px] text-primary transition hover:bg-tint"
        >
          Cargar más productos
        </button>
      </div>
    </div>
  );
}
