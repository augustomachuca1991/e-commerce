import { useEffect, useState } from 'react';
import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import { Menu, Moon, Search, ShoppingBag, Sun, User, X } from 'lucide-react';
import { NAV_LINKS } from '../data/products';
import type { Theme } from '../types';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  cartCount: number;
}

const iconBtn =
  'relative flex h-8 w-8 items-center justify-center rounded text-content transition-colors hover:bg-surface';

export function Header({ theme, onToggleTheme, cartCount }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const isDark = theme === 'dark';

  useEffect(() => {
    const onScroll = () => {
      if (open) {
        setOpacity(1);
        return;
      }
      const y = window.scrollY;
      const fade = Math.min(Math.max((y - 60) / 200, 0), 1);
      setOpacity(1 - fade);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [open]);

  return (
    <header
      className="sticky top-0 z-30 border-b-hairline border-line bg-base"
      style={{ opacity, pointerEvents: opacity < 0.05 ? 'none' : 'auto' }}
    >
      <div className="mx-auto flex max-w-shell items-center justify-between px-6 py-[14px]">
        <Link to="/" aria-label="Stock Master" className="flex items-center">
          <img
            src="/logos/logo_stock_master.svg"
            alt="Stock Master"
            className="h-11 w-auto dark:hidden"
          />
          <img
            src="/logos/logo_stock_master_dark.svg"
            alt="Stock Master"
            className="hidden h-11 w-auto dark:block"
          />
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <RouterNavLink
                  to={l.href}
                  className={({ isActive }) =>
                    `font-display text-[12px] font-medium uppercase tracking-[0.3px] transition-colors hover:text-primary ${
                      isActive ? 'text-primary' : 'text-content'
                    }`
                  }
                >
                  {l.label}
                </RouterNavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            role="switch"
            aria-checked={isDark}
            aria-label="Modo oscuro"
            onClick={onToggleTheme}
            className={iconBtn}
          >
            {isDark ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
          </button>
          <button type="button" aria-label="Buscar" className={iconBtn}>
            <Search size={16} strokeWidth={1.5} />
          </button>
          <Link to="/login" aria-label="Mi cuenta" className={iconBtn}>
            <User size={16} strokeWidth={1.5} />
          </Link>
          <button
            type="button"
            aria-label={`Carrito, ${cartCount} productos`}
            className={iconBtn}
          >
            <ShoppingBag size={16} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-primary font-sans text-[9px] font-bold leading-none text-on-primary">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
          <button
            type="button"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className={`${iconBtn} md:hidden`}
          >
            {open ? <X size={16} strokeWidth={1.5} /> : <Menu size={16} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Menú móvil" className="border-t-hairline border-line md:hidden">
          <ul>
            {NAV_LINKS.map((l) => (
              <li key={l.href} className="border-b-hairline border-line last:border-b-0">
                <RouterNavLink
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block px-6 py-3 font-display text-[12px] font-medium uppercase tracking-[0.3px] transition-colors hover:text-primary ${
                      isActive ? 'text-primary' : 'text-content'
                    }`
                  }
                >
                  {l.label}
                </RouterNavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
