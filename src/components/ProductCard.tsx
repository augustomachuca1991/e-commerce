import { Link } from 'react-router-dom';
import { Shirt, ShoppingBag } from 'lucide-react';
import { finalPrice } from '../data/products';
import { formatARS } from '../lib/format';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const { name, price, discount, images } = product;
  const cover = images[0];
  const final = finalPrice(product);
  const available = product.sizes.some((s) => s.stock > 0);

  return (
    <li className="group relative overflow-hidden rounded border-hairline border-line bg-base transition-colors hover:border-primary">
      <Link
        to={`/producto/${product.id}`}
        aria-label={`Ver ${name}, ${formatARS(final)}`}
        className="block"
      >
        <div className="relative flex h-[140px] items-center justify-center bg-media text-hero-sub">
          {discount ? (
            <span className="absolute left-1.5 top-1.5 z-10 rounded-badge bg-primary px-1.5 py-0.5 font-sans text-[9px] font-medium leading-none text-on-primary">
              -{discount}%
            </span>
          ) : null}
          {!available ? (
            <span className="absolute right-1.5 top-1.5 z-10 rounded-badge bg-content px-1.5 py-0.5 font-sans text-[9px] font-medium leading-none text-base">
              Sin stock
            </span>
          ) : null}
          {cover ? (
            <img
              src={cover}
              alt={name}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Shirt size={28} strokeWidth={1.25} aria-hidden />
          )}
        </div>
        <div className="px-2.5 py-2">
          <p className="font-sans text-[10.5px] font-normal text-content">{name}</p>
          <p className="mt-1 flex items-baseline gap-1.5">
            <span className="font-sans text-[12px] font-medium text-primary">
              {formatARS(final)}
            </span>
            {discount ? (
              <span className="font-sans text-[10.5px] text-muted line-through">
                {formatARS(price)}
              </span>
            ) : null}
          </p>
        </div>
      </Link>

      {/* Botón de compra rápida: independiente del link para no navegar. */}
      <button
        type="button"
        onClick={() => onAdd(product)}
        disabled={!available}
        aria-label={`Agregar ${name} al carrito`}
        className="flex w-full items-center justify-center gap-1.5 border-t-hairline border-line py-1.5 font-sans text-[10.5px] text-content transition-colors hover:bg-primary hover:text-on-primary disabled:cursor-not-allowed disabled:text-muted disabled:hover:bg-transparent disabled:hover:text-muted"
      >
        <ShoppingBag size={12} strokeWidth={1.5} aria-hidden />
        {available ? 'Agregar' : 'Sin stock'}
      </button>
    </li>
  );
}