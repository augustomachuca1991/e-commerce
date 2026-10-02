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
- `/producto/:id` — vista de producto (galería, talle, color, agregar al carrito)
- `/checkout`, `/checkout/resultado` — checkout y resultado del pago
- `/login`, `/register`, `/forgot` — formularios sin header/footer
- `*` — 404

## Estructura

```
index.html
vite.config.ts          # react + VitePWA (manifest, workbox, runtimeCaching)
.env.example            # VITE_PAYMENT_GATEWAY, VITE_MP_PUBLIC_KEY
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
  data/products.ts      # 60 productos, categorías, nav
  context/
    CartContext.tsx     # carrito por variante + localStorage + panel lateral
    OrderContext.tsx    # última orden (sessionStorage)
  hooks/
    useTheme.ts
    useInfiniteScroll.ts  # carga de a tandas con IntersectionObserver
    useQuickAdd.ts
  lib/
    format.ts
    validators/arg.ts    # DNI, CUIT, teléfono y CP argentinos
    validators/card.ts   # Luhn, marcas, vencimiento
    checkout/schema.ts   # esquema zod del checkout
    payment/             # pasarela: types, simulated, index
  components/           # Header, Footer, Hero, Categories, FeaturedProducts,
                         # ProductCard, ProductGrid, ProductGallery,
                         # CartDrawer, PaymentCardForm, Layout, AuthLayout,
                         # BackToTop, TennisRacket
  pages/                # HomePage, HombrePage, MujerPage, OfertasPage,
                         # OtrosPage, CategoryPage, ProductPage,
                         # CheckoutPage, CheckoutResultPage,
                         # LoginPage, RegisterPage, ForgotPage, NotFoundPage
```

## Features

- Tema claro/oscuro (clase `dark` en `<html>`, persistido en `localStorage`).
- Header con fade ligado al scroll (se oculta al bajar, reaparece al subir) y botón “volver arriba”.
- Hero: carrusel automático de 3 imágenes con overlay adaptado al tema y texto por slide.
- Categorías (running, fútbol, entrenamiento, paddle) con icono propio.
- Catálogo de 60 productos con carga infinita (12 por tanda al scrollear).
- Vista de producto con galería de hasta 10 imágenes, talle, color y stock.
- Carrito por variante (producto + talle + color) con persistencia y panel lateral.
- Checkout con validación completa y pasarela de pago **simulada**.
- Login / Register / Forgot con card centrada, divider y botones sociales (UI).
- PWA: manifest, service worker, instalable; SW inactivo en desarrollo (se desregistran los viejos).

## Checkout y pagos (demo)

La pasarela activa se define con `VITE_PAYMENT_GATEWAY` (ver `.env.example`).

**Modo actual: `simulated`.** El pago se resuelve en el navegador con ~1,4 s de
espera. El resultado depende de los últimos 4 dígitos de la tarjeta:

| Tarjeta | Resultado |
| --- | --- |
| `4509 9535 1123 0326` | Aprobado |
| `4000 0000 0000 0028` | Rechazado — fondos insuficientes |
| `4000 0000 0000 0036` | Rechazado — tarjeta reportada |
| `4000 0000 0000 0010` | Pendiente de revisión |

El carrito solo se vacía si el pago resulta **aprobado**; si queda pendiente o
rechazado, el usuario conserva sus productos.

> El resultado del pago lo decide el navegador: sirve para revisar la UI, no
> como checkout real. Los precios, el stock y el total hay que recalcularlos
> siempre en el servidor.

### Migrar a Mercado Pago (Checkout Pro)

Checkout Pro redirigido necesita backend: `POST /checkout/preferences` exige el
**Access Token secreto**, que nunca puede ir en el navegador. Con Vercel:

1. Crear `api/create-preference.ts` (función serverless) que reciba los ítems,
   llame a la API de Mercado Pago y devuelva el `init_point`.
2. Definir `MP_ACCESS_TOKEN` y `MP_PUBLIC_KEY` como variables de entorno del
   deploy (no en `.env` del front; `VITE_MP_PUBLIC_KEY` sí puede ir en el front).
3. Implementar `PaymentGateway` en `src/lib/payment/mercadopago.ts` para pedir la
   preferencia y redirigir, y registrarlo en `src/lib/payment/index.ts`.
4. Agregar el webhook para confirmar pedidos y bajar stock.

`src/lib/payment/types.ts` define el contrato; la UI del checkout no cambia.

### Validaciones

- **CUIT**: 11 dígitos con dígito verificador módulo 11 (verificado contra `stdnum`).
- **DNI**: 7 u 8 dígitos. Ojo: el DNI argentino **no** tiene dígito verificador;
  solo se valida el formato.
- **Teléfono**: normaliza `11 2234-5678`, `011 15 …`, `+54 9 …`.
- **CP**: 4 dígitos en rango 1000–8999.
- **Tarjeta**: Luhn, 7 marcas (Visa, MC, Amex, Nativa, Naranja, Argencard,
  Mercado Pago), vencimiento real (rechaza meses pasados) y CVV de 3 o 4 según
  marca. El número completo nunca se persiste: solo queda el `last4`.

## Notas

- En desarrollo `vite-plugin-pwa` no registra SW para evitar caché viejos.
- En producción, requiere HTTPS (Netlify/Vercel/Cloudflare) para instalar como app.
- `npm audit` reporta vulnerabilidades en `vite@5`/`esbuild` que solo afectan al
  dev server; corregirlas exige `vite@8` (cambio incompatible).
