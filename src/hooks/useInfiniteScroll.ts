import { useCallback, useEffect, useMemo, useState } from 'react';

/** Productos por tanda. */
export const PAGE_SIZE = 12;

interface UseInfiniteScrollResult<T> {
  /** Subconjunto ya visible de la lista completa. */
  visible: T[];
  hasMore: boolean;
  /** Ref para el elemento centinela que dispara la carga. */
  sentinelRef: (node: HTMLElement | null) => void;
  /** Carga manual de una tanda (fallback accesible sin IntersectionObserver). */
  loadMore: () => void;
}

/**
 * Carga incremental de una lista: expone los primeros `pageSize * page` elementos
 * y suma otra tanda cuando el centinela entra en el viewport. Si el navegador no
 * soporta IntersectionObserver, degrada a una tanda inicial (el resto se puede
 * pedir con `loadMore`, por ejemplo desde un botón).
 */
export function useInfiniteScroll<T>(items: T[], pageSize: number = PAGE_SIZE): UseInfiniteScrollResult<T> {
  const [page, setPage] = useState(1);
  const [sentinel, setSentinel] = useState<HTMLElement | null>(null);

  const total = items.length;
  const hasMore = page * pageSize < total;

  // Cambiar la lista (otra categoría, un filtro) vuelve a la primera tanda.
  useEffect(() => {
    setPage(1);
  }, [items]);

  const loadMore = useCallback(() => {
    setPage((p) => (p * pageSize < total ? p + 1 : p));
  }, [pageSize, total]);

  useEffect(() => {
    if (!sentinel || !hasMore) return;

    if (typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPage((p) => (p * pageSize < total ? p + 1 : p));
        }
      },
      // Precarga antes de que el usuario llegue al final de la grilla.
      { rootMargin: '400px 0px' },
    );

    io.observe(sentinel);
    return () => io.disconnect();
  }, [sentinel, hasMore, pageSize, total]);

  const visible = useMemo(() => items.slice(0, page * pageSize), [items, page, pageSize]);

  return { visible, hasMore, sentinelRef: setSentinel, loadMore };
}