import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Shirt, ZoomIn } from 'lucide-react';
import type { Product } from '../types';

interface ProductGalleryProps {
  product: Product;
}

/** Galería de la vista de detalle: imagen principal + miniaturas (hasta 10). */
export function ProductGallery({ product }: ProductGalleryProps) {
  const images = product.images;
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const touchStart = useRef<number | null>(null);

  // Al cambiar de producto la selección vuelve a la portada.
  useEffect(() => {
    setIndex(0);
    setZoomed(false);
  }, [product.id]);

  const clamp = useCallback((i: number) => (i + images.length) % images.length, [images.length]);

  const go = useCallback(
    (delta: number) => {
      setZoomed(false);
      setIndex((i) => clamp(i + delta));
    },
    [clamp],
  );

  // Navegación con teclado desde la imagen principal.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    const end = e.changedTouches[0]?.clientX;
    touchStart.current = null;
    if (start == null || end == null) return;
    const delta = end - start;
    if (Math.abs(delta) < 40) return;
    go(delta < 0 ? 1 : -1);
  };

  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row">
      {images.length > 1 ? (
        <ul
          aria-label="Miniaturas del producto"
          className="flex gap-2 overflow-x-auto md:w-[76px] md:flex-col md:overflow-y-auto"
        >
          {images.map((src, i) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                onClick={() => {
                  setZoomed(false);
                  setIndex(i);
                }}
                aria-label={`Ver imagen ${i + 1} de ${product.name}`}
                aria-current={i === index}
                className={`block h-[62px] w-[62px] overflow-hidden rounded border-hairline transition-colors ${
                  i === index ? 'border-primary' : 'border-line hover:border-primary'
                }`}
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full bg-media object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="relative flex-1">
        <div
          role="group"
          aria-roledescription="carrusel"
          aria-label={`Galería de ${product.name}`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded border-hairline border-line bg-media text-hero-sub focus-visible:outline focus-visible:outline-2"
        >
          {images[index] ? (
            <img
              src={images[index]}
              alt={`${product.name}, imagen ${index + 1}`}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              decoding="async"
              className={`h-full w-full object-cover transition-transform duration-200 ${
                zoomed ? 'scale-[1.8]' : 'scale-100'
              }`}
            />
          ) : (
            <Shirt size={40} strokeWidth={1.25} aria-hidden />
          )}

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Imagen anterior"
                className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-base/80 text-content transition-opacity hover:opacity-100 md:opacity-0 md:group-hover:opacity-100"
              >
                <ChevronLeft size={16} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Imagen siguiente"
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-base/80 text-content transition-opacity hover:opacity-100 md:opacity-0 md:group-hover:opacity-100"
              >
                <ChevronRight size={16} strokeWidth={1.5} />
              </button>
            </>
          ) : null}

          {images.length > 1 ? (
            <span className="absolute bottom-2 right-2 rounded-badge bg-base/80 px-1.5 py-0.5 font-sans text-[10px] text-content">
              {index + 1} / {images.length}
            </span>
          ) : null}
        </div>

        {images.length > 1 ? (
          <button
            type="button"
            onClick={() => setZoomed((z) => !z)}
            aria-pressed={zoomed}
            className="mt-2 inline-flex items-center gap-1.5 font-sans text-[11.5px] text-muted transition-colors hover:text-content"
          >
            <ZoomIn size={13} strokeWidth={1.5} aria-hidden />
            {zoomed ? 'Reducir imagen' : 'Ampliar imagen'}
          </button>
        ) : null}
      </div>
    </div>
  );
}