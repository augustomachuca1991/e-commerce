# Stock Master — PWA e-commerce de ropa deportiva

React 18 + TypeScript + Vite + Tailwind CSS + vite-plugin-pwa + lucide-react + react-router-dom.

## Scripts

```bash
npm install
npm run dev       # desarrollo → http://localhost:5173
npm run build     # build de producción (tsc -b && vite build) → dist/
npm run preview   # sirve /dist (PWA/SW activos; abrir con HTTPS o localhost)
```

## Rutas

- `/` — inicio (Hero con carrusel, categorías, destacados)
- `/hombre`, `/mujer`, `/ofertas`, `/otros` — catálogo por sección
- `/login`, `/register`, `/forgot` — formularios sin header/footer
- `*` — 404

## Estructura

```
index.html
vite.config.ts          # react + VitePWA (manifest, workbox, runtimeCaching)
public/
  favicon.svg           # isólogo (favicon)
  logos/                # logo stock master (light / dark / isotipo)
  icons/                # PNG del manifest + apple-touch-icon
  images/banner/        # imágenes del carrusel del Hero
src/
  main.tsx              # entry; registra SW solo en producción
  App.tsx
  routes.tsx            # createBrowserRouter (Layout + AuthLayout)
  index.css             # tokens de tema (light/dark)
  types.ts
  data/products.ts      # productos, categorías, nav
  hooks/useTheme.ts
  components/           # Header, Footer, Hero, Categories, FeaturedProducts,
                        # ProductCard, Layout, AuthLayout, BackToTop, TennisRacket
  pages/                # HomePage, HombrePage, MujerPage, OfertasPage,
                        # OtrosPage, CategoryPage, LoginPage, RegisterPage,
                        # ForgotPage, NotFoundPage
```

## Features

- Tema claro/oscuro (clase `dark` en `<html>`, persistido en `localStorage`).
- Header con fade ligado al scroll (se oculta al bajar, reaparece al subir) y botón “volver arriba”.
- Hero: carrusel automático de 3 imágenes con overlay adaptado al tema y texto por slide.
- Categorías (running, fútbol, entrenamiento, paddle) con icono propio.
- Catálogo con cards de producto (imagen, precio, descuento), carrito con contador.
- Login / Register / Forgot con card centrada, divider y botones sociales (UI).
- PWA: manifest, service worker, instalable; SW inactivo en desarrollo (se desregistran los viejos).

## Notas

- En desarrollo `vite-plugin-pwa` no registra SW para evitar caché viejos.
- En producción, requiere HTTPS (Netlify/Vercel/Cloudflare) para instalar como app.
