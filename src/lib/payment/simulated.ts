import {
  METHOD_LABELS,
  type CheckoutPayload,
  type PaymentGateway,
  type PaymentResult,
} from './types';

/** Latencia simulada para que se vea el estado "procesando". */
const DELAY_MS = 1400;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Genera un identificador de orden con prefijo legible, para que el resultado
 * simulado tenga la misma forma que devolvería una pasarela real.
 */
function makeId(prefix: string): string {
  const time = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.floor(Math.random() * 46656)
    .toString(36)
    .toUpperCase()
    .padStart(3, '0');
  return `${prefix}-${time}${rand}`;
}

/**
 * Pasarela simulada para el demo.
 *
 * El resultado depende de los últimos 4 dígitos de la tarjeta, siguiendo la
 * convención de las tarjetas de prueba de las pasarelas reales:
 *   ...0001 / ...0004 → pendiente de revisión
 *   ...0002 → fondos insuficientes
 *   ...0003 → tarjeta reportada
 *   cualquier otra    → aprobado
 *
 * Sin tarjeta (Mercado Pago o efectivo) el pago se aprueba.
 */
export class SimulatedGateway implements PaymentGateway {
  readonly name = 'simulated';

  async pay(payload: CheckoutPayload): Promise<PaymentResult> {
    await delay(DELAY_MS);

    const methodLabel = METHOD_LABELS[payload.method];
    const base = { orderId: makeId('SM'), methodLabel };

    // Mercado Pago y efectivo no llevan número de tarjeta.
    if (!payload.card) {
      return {
        ...base,
        status: 'approved',
        statusDetail: 'Pago aprobado.',
        paymentId: makeId('PAY'),
      };
    }

    const { last4 } = payload.card;
    const paymentId = makeId('PAY');

    switch (last4) {
      case '0028':
        return {
          ...base,
          paymentId,
          last4,
          status: 'rejected',
          statusDetail: 'Rechazado: la tarjeta no tiene fondos suficientes.',
        };

      case '0036':
        return {
          ...base,
          paymentId,
          last4,
          status: 'rejected',
          statusDetail: 'Rechazado: la tarjeta fue reportada por el emisor.',
        };

      case '0010':
      case '0044':
        return {
          ...base,
          paymentId,
          last4,
          status: 'pending',
          statusDetail: 'El pago está en revisión. Te avisamos por email.',
        };

      default:
        return {
          ...base,
          paymentId,
          last4,
          status: 'approved',
          statusDetail: 'Pago aprobado.',
        };
    }
  }
}

/**
 * Tarjetas de prueba para probar los distintos resultados del demo.
 *
 * Todos los números pasan el chequeo de Luhn; los tres últimos dígitos son los
 * que consulta `pay` para decidir el resultado, y el cuarto es el verificador
 * calculado. Si cambiás alguno, actualizá el `switch` de `pay`.
 */
const TEST_CARDS: { number: string; label: string }[] = [
  { number: '4509 9535 1123 0326', label: 'Pago aprobado' },
  { number: '4000 0000 0000 0028', label: 'Fondos insuficientes' },
  { number: '4000 0000 0000 0036', label: 'Tarjeta reportada' },
  { number: '4000 0000 0000 0010', label: 'Pago en revisión' },
];

export { TEST_CARDS };