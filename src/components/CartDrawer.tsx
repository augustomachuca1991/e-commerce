import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart, useCartUI } from '../context/CartContext';
import { finalPrice } from '../data/products';
import { formatARS } from '../lib/format';

export function CartDrawer() {
  const { items, itemCount, subtotal, setQty, remove, clear } = useCart();
  const { isOpen, close } = useCartUI();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Escape cierra, y al abrir recuperamos el foco del panel.
  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;

      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={close}
        aria-hidden
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className="absolute right-0 top-0 flex h-full w-full max-w-[380px] flex-col bg-base shadow-xl"
      >
        <header className="flex items-center justify-between border-b-hairline border-line px-4 py-3">
          <h2 className="font-display text-[13px] font-bold uppercase tracking-[0.3px] text-content">
            Carrito {itemCount > 0 ? `(${itemCount})` : ''}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Cerrar carrito"
            className="flex h-8 w-8 items-center justify-center rounded text-content transition-colors hover:bg-surface"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag size={28} strokeWidth={1.25} className="text-muted" aria-hidden />
            <p className="font-sans text-[13px] text-content">Tu carrito está vacío</p>
            <Link
              to="/"
              onClick={close}
              className="rounded border-hairline border-primary px-4 py-2 font-display text-[11.5px] font-bold uppercase tracking-[0.3px] text-primary transition-colors hover:bg-tint"
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-[color:var(--border)] overflow-y-auto px-4">
              {items.map((item) => {
                const price = finalPrice(item.product);
                const cover = item.product.images[0];
                return (
                  <li key={item.key} className="flex gap-3 py-3">
                    <Link
                      to={`/producto/${item.product.id}`}
                      onClick={close}
                      className="shrink-0"
                      aria-label={`Ver ${item.product.name}`}
                    >
                      <img
                        src={cover}
                        alt=""
                        loading="lazy"
                        className="h-20 w-20 rounded border-hairline border-line bg-media object-cover"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <Link
                        to={`/producto/${item.product.id}`}
                        onClick={close}
                        className="truncate font-sans text-[12.5px] text-content hover:text-primary"
                      >
                        {item.product.name}
                      </Link>
                      <p className="font-sans text-[11px] text-muted">
                        {item.size} · {item.color}
                      </p>

                      <div className="mt-auto flex items-center justify-between gap-2 pt-1.5">
                        <div className="flex items-center rounded border-hairline border-line">
                          <button
                            type="button"
                            onClick={() => setQty(item.key, item.qty - 1)}
                            aria-label={`Quitar una unidad de ${item.product.name}`}
                            className="flex h-7 w-7 items-center justify-center text-content transition-colors hover:bg-surface"
                          >
                            <Minus size={12} strokeWidth={1.5} />
                          </button>
                          <span
                            aria-live="polite"
                            className="min-w-[22px] text-center font-sans text-[12px] text-content"
                          >
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty(item.key, item.qty + 1)}
                            aria-label={`Agregar una unidad de ${item.product.name}`}
                            className="flex h-7 w-7 items-center justify-center text-content transition-colors hover:bg-surface"
                          >
                            <Plus size={12} strokeWidth={1.5} />
                          </button>
                        </div>

                        <span className="font-sans text-[12.5px] font-medium text-primary">
                          {formatARS(price * item.qty)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(item.key)}
                      aria-label={`Eliminar ${item.product.name} del carrito`}
                      className="h-7 shrink-0 self-start rounded p-1 text-muted transition-colors hover:text-primary"
                    >
                      <Trash2 size={14} strokeWidth={1.5} />
                    </button>
                  </li>
                );
              })}
            </ul>

            <footer className="border-t-hairline border-line px-4 py-3">
              <div className="mb-1 flex items-baseline justify-between">
                <span className="font-sans text-[12px] text-muted">Subtotal</span>
                <span aria-live="polite" className="font-display text-[17px] font-bold text-content">
                  {formatARS(subtotal)}
                </span>
              </div>
              <p className="mb-3 font-sans text-[11px] text-muted">
                Envío e impuestos se calculan al finalizar la compra.
              </p>

              {items.length === 0 ? (
                <Link
                  to="/checkout"
                  aria-disabled={true}
                  tabIndex={-1}
                  className="pointer-events-none w-full rounded bg-line py-2.5 text-center font-display text-[12px] font-bold uppercase tracking-[0.4px] text-muted"
                >
                  Finalizar compra
                </Link>
              ) : (
                <Link
                  to="/checkout"
                  onClick={close}
                  className="w-full rounded bg-primary py-2.5 text-center font-display text-[12px] font-bold uppercase tracking-[0.4px] text-on-primary transition-opacity hover:opacity-90"
                >
                  Finalizar compra
                </Link>
              )}
              <button
                type="button"
                onClick={clear}
                className="mt-2 w-full py-1 font-sans text-[11.5px] text-muted underline transition-colors hover:text-content"
              >
                Vaciar carrito
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}