import { Outlet } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { BackToTop } from './BackToTop';
import { useTheme } from '../hooks/useTheme';
import type { Product } from '../types';

export function Layout() {
  const { theme, toggle } = useTheme();
  const [cart, setCart] = useState<Product[]>([]);
  const addToCart = useCallback((p: Product) => setCart((c) => [...c, p]), []);

  return (
    <div className="flex min-h-screen flex-col bg-base">
      <Header theme={theme} onToggleTheme={toggle} cartCount={cart.length} />
      <main className="flex-1">
        <Outlet context={{ addToCart }} />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
