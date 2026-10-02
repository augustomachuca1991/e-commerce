import { useCallback, useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

/**
 * Compra rápida desde la grilla: usa el primer talle con stock y el primer
 * color del producto. La selección explícita vive en la vista de detalle.
 */
export function useQuickAdd(onAdded?: () => void) {
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const quickAdd = useCallback(
    (product: Product) => {
      const size = product.sizes.find((s) => s.stock > 0)?.label;
      const color = product.colors[0]?.label;
      if (!size || !color) return;

      add(product, { size, color, qty: 1 });
      setJustAdded(product.id);
      onAdded?.();
    },
    [add, onAdded],
  );

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(null), 1400);
    return () => clearTimeout(t);
  }, [justAdded]);

  return { quickAdd, justAdded };
}