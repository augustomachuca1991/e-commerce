import { SimulatedGateway } from './simulated';
import type { PaymentGateway } from './types';

/**
 * Selección de pasarela. Se define con VITE_PAYMENT_GATEWAY para poder
 * cambiar sin recompilar el resto del código.
 *
 * Opciones:
 *   simulated     → pasarela de demo (default)
 *   mercadopago   → Checkout Pro real (requiere backend, ver README)
 */
const GATEWAY_NAME = import.meta.env.VITE_PAYMENT_GATEWAY ?? 'simulated';

function createGateway(name: string): PaymentGateway {
  switch (name) {
    // Mercado Pago real: cuando exista api/create-preference, se implementa
    // MercadoPagoGateway acá y se devuelve en este caso.
    case 'mercadopago':
      // Sin backend configurado caemos en la simulada para no romper la demo.
      return new SimulatedGateway();

    case 'simulated':
    default:
      return new SimulatedGateway();
  }
}

export const gateway: PaymentGateway = createGateway(GATEWAY_NAME);

export { SimulatedGateway, TEST_CARDS } from './simulated';
export * from './types';