import { Shirt } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

const formatARS = (n: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n);

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const { name, price, discount } = product;
  const finalPrice = discount ? Math.round(price * (1 - discount / 100)) : price;

  return (
    <li>
      <button
        type="button"
        onClick={() => onAdd(product)}
        aria-label={`Agregar ${name} al carrito, ${formatARS(finalPrice)}`}
        className="block w-full overflow-hidden rounded border-hairline border-line bg-base text-left transition-colors hover:border-primary"
      >
        <div className="relative flex h-[140px] items-center justify-center bg-media text-hero-sub">
          {discount ? (
            <span className="absolute left-1.5 top-1.5 z-10 rounded-badge bg-primary px-1.5 py-0.5 font-sans text-[9px] font-medium leading-none text-on-primary">
              -{discount}%
            </span>
          ) : null}
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
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
              {formatARS(finalPrice)}
            </span>
            {discount ? (
              <span className="font-sans text-[10.5px] text-muted line-through">
                {formatARS(price)}
              </span>
            ) : null}
          </p>
        </div>
      </button>
    </li>
  );
}
