import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import './index.css';

if (import.meta.env.PROD) {
  registerSW({ immediate: true });
} else if ('serviceWorker' in navigator) {
  // En desarrollo desregistramos cualquier SW de build/preview para evitar cache viejo
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((r) => r.unregister());
  });
}

const root = document.getElementById('root');
if (!root) throw new Error('Elemento #root no encontrado');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
