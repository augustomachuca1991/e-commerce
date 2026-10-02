import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Check, ChevronRight, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart, useCartUI } from '../context/CartContext';
import {
  CATEGORIES,
  finalPrice,
  getCategoryLabel,
  getProductById,
  PRODUCTS,
} from '../data/products';
import { formatARS } from '../lib/format';
import { ProductGallery } from '../components/ProductGallery';
import { ProductGrid } from '../components/ProductGrid';
import { useQuickAdd } from '../hooks/useQuickAdd';

export default function ProductPage() {
  const { id = '' } = useParams();
  const product = getProductById(id);
  const { add } = useCart();
  const { open: openCart } = useCartUI();
  const { quickAdd } = useQuickAdd();

  const firstAvailable = product?.sizes.find((s) => s.stock > 0)?.label ?? '';

  const [size, setSize] = useState(firstAvailable);
  const [color, setColor] = useState(product?.colors[0]?.label ?? '');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // Al navegar entre productos relacionados, la selección se recalcula.
  useEffect(() => {
    setSize(firstAvailable);
    setColor(product?.colors[0]?.label ?? '');
    setQty(1);
    setAdded(false);
  }, [id, firstAvailable, product]);

  const stock = useMemo(
    () => product?.sizes.find((s) => s.label === size)?.stock ?? 0,
    [product, size],
  );

  // Si el talle elegido se agota, el cantidad no puede superarlo.
  useEffect(() => {
    setQty((q) => (stock > 0 ? Math.min(q, stock) : 1));
  }, [stock]);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(t);
  }, [added]);

  if (!product) return <Navigate to="/404" replace />;

  const price = finalPrice(product);
  // Memorizado para que useInfiniteScroll no se reinicie en cada render.
  const related = useMemo(
    () =>
      PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 8),
    [product.category, product.id],
  );
  const category = CATEGORIES.find((c) => c.id === product.category);

  const onAdd = () => {
    if (!size || !color || stock <= 0) return;
    add(product, { size, color, qty });
    setAdded(true);
    openCart();
  };

  return (
    <div className="bg-base">
      <nav aria-label="Miga de pan" className="mx-auto max-w-shell px-6 pt-4">
        <ol className="flex flex-wrap items-center gap-1 font-sans text-[11px] text-muted">
          <li>
            <Link to="/" className="underline">
              Inicio
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight size={11} strokeWidth={1.5} />
          </li>
          {category ? (
            <>
              <li>
                <Link to={`/otros?categoria=${category.id}`} className="underline">
                  {getCategoryLabel(category.id)}
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight size={11} strokeWidth={1.5} />
              </li>
            </>
          ) : null}
          <li aria-current="page" className="text-content">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="mx-auto grid max-w-shell gap-8 px-6 py-6 md:grid-cols-2">
        <ProductGallery product={product} />

        <div>
          <h1 className="font-display text-[26px] font-bold uppercase tracking-[0.4px] text-content">
            {product.name}
          </h1>

          <p className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-[24px] font-bold text-primary">
              {formatARS(price)}
            </span>
            {product.discount ? (
              <>
                <span className="font-sans text-[13px] text-muted line-through">
                  {formatARS(product.price)}
                </span>
                <span className="rounded-badge bg-primary px-1.5 py-0.5 font-sans text-[10px] font-medium text-on-primary">
                  -{product.discount}%
                </span>
              </>
            ) : null}
          </p>

          <p className="mt-4 font-sans text-[13px] leading-relaxed text-muted">
            {product.description}
          </p>

          <fieldset className="mt-6">
            <legend className="mb-2 font-display text-[12px] font-bold uppercase tracking-[0.3px] text-content">
              Talle
            </legend>
            <ul className="flex flex-wrap gap-2">
              {product.sizes.map((s) => {
                const soldOut = s.stock === 0;
                const selected = s.label === size;
                return (
                  <li key={s.label}>
                    <button
                      type="button"
                      onClick={() => !soldOut && setSize(s.label)}
                      disabled={soldOut}
                      aria-pressed={selected}
                      aria-label={`Talle ${s.label}${soldOut ? ', sin stock' : ''}`}
                      className={`relative min-w-[44px] rounded border-hairline px-3 py-2 font-sans text-[12px] transition-colors ${
                        selected
                          ? 'border-primary text-primary'
                          : soldOut
                            ? 'cursor-not-allowed border-line text-muted line-through'
                            : 'border-line text-content hover:border-primary'
                      }`}
                    >
                      {s.label}
                    </button>
                  </li>
                );
              })}
            </ul>
            <p aria-live="polite" className="mt-2 font-sans text-[11.5px] text-muted">
              {size
                ? stock > 0
                  ? `${stock} disponibles en talle ${size}`
                  : `Sin stock en talle ${size}`
                : 'Elegí un talle'}
            </p>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="mb-2 font-display text-[12px] font-bold uppercase tracking-[0.3px] text-content">
              Color
            </legend>
            <ul className="flex flex-wrap gap-2">
              {product.colors.map((c) => {
                const selected = c.label === color;
                return (
                  <li key={c.label}>
                    <button
                      type="button"
                      onClick={() => setColor(c.label)}
                      aria-pressed={selected}
                      aria-label={`Color ${c.label}`}
                      className={`flex items-center gap-2 rounded border-hairline px-2.5 py-1.5 font-sans text-[12px] transition-colors ${
                        selected ? 'border-primary text-primary' : 'border-line text-content hover:border-primary'
                      }`}
                    >
                      <span
                        aria-hidden
                        className="h-3.5 w-3.5 rounded-full border-hairline border-line"
                        style={{ backgroundColor: c.hex }}
                      />
                      {c.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </fieldset>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded border-hairline border-line">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Quitar una unidad"
                className="flex h-10 w-10 items-center justify-center text-content transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:text-muted"
              >
                <Minus size={14} strokeWidth={1.5} />
              </button>
              <span aria-live="polite" className="min-w-[40px] text-center font-sans text-[13px] text-content">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(stock || 1, q + 1))}
                disabled={!stock || qty >= stock}
                aria-label="Agregar una unidad"
                className="flex h-10 w-10 items-center justify-center text-content transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:text-muted"
              >
                <Plus size={14} strokeWidth={1.5} />
              </button>
            </div>

            <button
              type="button"
              onClick={onAdd}
              disabled={!size || !color || stock <= 0}
              className="flex flex-1 items-center justify-center gap-2 rounded bg-primary py-3 font-display text-[12.5px] font-bold uppercase tracking-[0.4px] text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted disabled:opacity-100"
            >
              {added ? (
                <>
                  <Check size={15} strokeWidth={2} aria-hidden />
                  Agregado
                </>
              ) : (
                <>
                  <ShoppingBag size={15} strokeWidth={1.5} aria-hidden />
                  {stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
                </>
              )}
            </button>
          </div>

          <p className="mt-3 font-sans text-[11.5px] text-muted">
            Envío gratis en compras superiores a {formatARS(80000)}. Hasta 12 cuotas sin
            interés.
          </p>
        </div>
      </div>

      {related.length > 0 ? (
        <section aria-labelledby="relacionados-title" className="border-t-hairline border-line px-6 py-8">
          <div className="mx-auto max-w-shell">
            <h2
              id="relacionados-title"
              className="mb-4 font-display text-[13px] font-bold uppercase text-content"
            >
              También te puede interesar
            </h2>
            <ProductGrid
              products={related}
              onAdd={quickAdd}
              pageSize={Infinity}
              className="grid grid-cols-2 gap-[10px] md:grid-cols-4"
            />
          </div>
        </section>
      ) : null}
    </div>
  );
}