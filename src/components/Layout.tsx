import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { BackToTop } from './BackToTop';
import { CartDrawer } from './CartDrawer';
import { CartProvider } from '../context/CartContext';
import { OrderProvider } from '../context/OrderContext';
import { useTheme } from '../hooks/useTheme';

export function Layout() {
  const { theme, toggle } = useTheme();

  return (
    <CartProvider>
      <OrderProvider>
        <div className="flex min-h-screen flex-col bg-base">
          <Header theme={theme} onToggleTheme={toggle} />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
          <BackToTop />
          <CartDrawer />
        </div>
      </OrderProvider>
    </CartProvider>
  );
}