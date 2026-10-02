import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { PaymentResult } from '../lib/payment/types';

const STORAGE_KEY = 'vertex-order';

export interface StoredOrder {
  result: PaymentResult;
  /** Copia de los ítems al momento de la compra, sin datos de tarjeta. */
  lines: { id: string; title: string; quantity: number; unitPrice: number }[];
  total: number;
  payerName: string;
  payerEmail: string;
}

interface OrderContextValue {
  order: StoredOrder | null;
  /** Registra el resultado y vacía el carrito si el pago fue aprobado. */
  completeOrder: (order: StoredOrder, onApproved: () => void) => void;
  clearOrder: () => void;
}

const OrderContext = createContext<OrderContextValue | null>(null);

function readOrder(): StoredOrder | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StoredOrder;
    if (!parsed?.result?.status) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<StoredOrder | null>(readOrder);

  const completeOrder = useCallback(
    (next: StoredOrder, onApproved: () => void) => {
      setOrder(next);
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* sessionStorage no disponible */
      }
      // El carrito solo se vacía si el pago se aprobó; si queda pendiente o
      // fue rechazado, el usuario conserva sus productos.
      if (next.result.status === 'approved') onApproved();
    },
    [],
  );

  const clearOrder = useCallback(() => {
    setOrder(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* sessionStorage no disponible */
    }
  }, []);

  const value = useMemo(
    () => ({ order, completeOrder, clearOrder }),
    [order, completeOrder, clearOrder],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder(): OrderContextValue {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder debe usarse dentro de <OrderProvider>');
  return ctx;
}