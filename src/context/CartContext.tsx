import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react';
import { finalPrice, getProductById } from '../data/products';
import type { CartItem, Product } from '../types';

const STORAGE_KEY = 'vertex-cart';

export interface AddToCartOptions {
  size: string;
  color: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'add'; product: Product; size: string; color: string; qty: number }
  | { type: 'remove'; key: string }
  | { type: 'setQty'; key: string; qty: number }
  | { type: 'clear' };

interface CartContextValue extends CartState {
  add: (product: Product, options: AddToCartOptions) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  /** Suma de cantidades (no de líneas). */
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

/* Estado puramente visual del panel lateral, separado de los datos del carrito. */
interface CartUIContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const CartUIContext = createContext<CartUIContextValue | null>(null);

/** Identifica la variante: mismo producto + talle + color es la misma línea. */
function lineKey(productId: string, size: string, color: string): string {
  return `${productId}__${size}__${color}`;
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const key = lineKey(action.product.id, action.size, action.color);
      const existing = state.items.find((i) => i.key === key);
      const max = action.product.sizes.find((s) => s.label === action.size)?.stock ?? 0;

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.key === key ? { ...i, qty: Math.min(i.qty + action.qty, max) } : i,
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            key,
            product: action.product,
            size: action.size,
            color: action.color,
            qty: Math.max(1, Math.min(action.qty, max || action.qty)),
          },
        ],
      };
    }

    case 'remove':
      return { items: state.items.filter((i) => i.key !== action.key) };

    case 'setQty':
      return {
        items: state.items
          .map((i) => {
            if (i.key !== action.key) return i;
            const max = i.product.sizes.find((s) => s.label === i.size)?.stock ?? 0;
            const next = Math.min(Math.max(action.qty, 0), max || action.qty);
            return next === 0 ? null : { ...i, qty: next };
          })
          .filter((i): i is CartItem => i !== null),
      };

    case 'clear':
      return { items: [] };
  }
}

/** Recupera el carrito persistido, descartando líneas cuyo producto ya no exista. */
function initState(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };

    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return { items: [] };

    const items = parsed.filter(
      (i): i is CartItem =>
        !!i && typeof i.key === 'string' && !!getProductById(i.product?.id ?? ''),
    );
    return { items };
  } catch {
    return { items: [] };
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      /* almacenamiento no disponible o cuota excedida */
    }
  }, [state.items]);

  const add = useCallback(
    (product: Product, { size, color, qty }: AddToCartOptions) =>
      dispatch({ type: 'add', product, size, color, qty }),
    [],
  );

  const remove = useCallback((key: string) => dispatch({ type: 'remove', key }), []);
  const setQty = useCallback((key: string, qty: number) => dispatch({ type: 'setQty', key, qty }), []);
  const clear = useCallback(() => dispatch({ type: 'clear' }), []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = state.items.reduce((acc, i) => acc + i.qty, 0);
    const subtotal = state.items.reduce((acc, i) => acc + finalPrice(i.product) * i.qty, 0);
    return { ...state, add, remove, setQty, clear, itemCount, subtotal };
  }, [state, add, remove, setQty, clear]);

  return (
    <CartContext.Provider value={value}>
      <CartUIProvider>{children}</CartUIProvider>
    </CartContext.Provider>
  );
}

function CartUIProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const ui = useMemo<CartUIContextValue>(() => ({ isOpen, open, close }), [isOpen, open, close]);

  return <CartUIContext.Provider value={ui}>{children}</CartUIContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}

/** Apertura del panel lateral, para que el ícono del header lo dispare. */
export function useCartUI(): CartUIContextValue {
  const ctx = useContext(CartUIContext);
  if (!ctx) throw new Error('useCartUI debe usarse dentro de <CartProvider>');
  return ctx;
}