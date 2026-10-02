/** Tipos de la capa de pasarela de pago. */

export type PaymentStatus = 'approved' | 'rejected' | 'pending';

export type PaymentMethodId = 'mercadopago' | 'tarjeta' | 'efectivo';

export interface Payer {
  nombre: string;
  email: string;
  telefono: string;
  documento: string;
  cp: string;
}

/** Referencia mínima a un producto para construir el pago. */
export interface PaymentLine {
  id: string;
  title: string;
  quantity: number;
  unitPrice: number;
}

export interface CheckoutPayload {
  lines: PaymentLine[];
  subtotal: number;
  shipping: number;
  total: number;
  payer: Payer;
  method: PaymentMethodId;
  shippingMethod: string;
  /** Datos de tarjeta ya saneados: nunca el número completo. */
  card?: { last4: string; marca: string; vencimiento: string };
}

export interface PaymentResult {
  status: PaymentStatus;
  /** Identificador de la orden, con prefijo legible. */
  orderId: string;
  /** Mensaje mostrado al usuario. */
  statusDetail: string;
  /** Últimos 4 dígitos, si el pago fue con tarjeta. */
  last4?: string;
  methodLabel: string;
  paymentId: string;
}

/**
 * Contrato de una pasarela. La implementación simulada vive en simulated.ts;
 * para Mercado Pago real se agrega mercadopago.ts implementando esta misma
 * interfaz y se selecciona en index.ts.
 */
export interface PaymentGateway {
  readonly name: string;
  pay: (payload: CheckoutPayload) => Promise<PaymentResult>;
}

export const METHOD_LABELS: Record<PaymentMethodId, string> = {
  mercadopago: 'Mercado Pago',
  tarjeta: 'Tarjeta de crédito',
  efectivo: 'Efectivo en el local',
};