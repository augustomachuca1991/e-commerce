import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import {
  isValidArgentinianPhone,
  isValidDocument,
  isValidPostalCode,
  onlyDigits,
} from '../validators/arg';
import {
  cardLast4,
  detectBrand,
  isValidExpiry,
  luhnValid,
  onlyDigitsCard,
} from '../validators/card';

export const PAYMENT_METHODS = ['mercadopago', 'tarjeta', 'efectivo'] as const;
export type PaymentMethodId = (typeof PAYMENT_METHODS)[number];

export const SHIPPING_METHODS = ['estandar', 'express'] as const;
export type ShippingMethodId = (typeof SHIPPING_METHODS)[number];

/** Costo del envío express; el estándar es gratis. */
export const SHIPPING_COSTS: Record<ShippingMethodId, number> = {
  estandar: 0,
  express: 9990,
};

export const FREE_SHIPPING_THRESHOLD = 80000;

/** Campos comunes a todos los métodos de pago. */
const baseSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, 'Ingresá tu nombre')
    .max(80, 'El nombre es demasiado largo'),
  email: z.email('Ingresá un email válido'),
  telefono: z
    .string()
    .trim()
    .min(1, 'Ingresá tu teléfono')
    .refine(isValidArgentinianPhone, 'Ingresá un teléfono válido (ej. 11 2234-5678)'),
  documento: z
    .string()
    .trim()
    .min(1, 'Ingresá tu DNI o CUIT')
    .refine(isValidDocument, 'Ingresá un DNI (7-8 dígitos) o un CUIT válido'),
  cp: z
    .string()
    .trim()
    .min(1, 'Ingresá tu código postal')
    .refine(isValidPostalCode, 'Ingresá un código postal válido (4 dígitos)'),
  envio: z.enum(SHIPPING_METHODS),
  metodoPago: z.enum(PAYMENT_METHODS),
});

const cardSchema = z.object({
  numeroTarjeta: z
    .string()
    .trim()
    .min(1, 'Ingresá el número de tarjeta')
    .refine((v) => onlyDigitsCard(v).length >= 13, 'El número de tarjeta está incompleto')
    .refine((v) => !!detectBrand(v), 'No reconocemos esa tarjeta')
    .refine(luhnValid, 'El número de tarjeta no es válido'),
  vencimiento: z
    .string()
    .trim()
    .min(1, 'Ingresá el vencimiento')
    .refine(isValidExpiry, 'Ingresá un vencimiento válido (MM/AA)'),
  cvv: z
    .string()
    .trim()
    .min(1, 'Ingresá el código de seguridad')
    .refine((v) => onlyDigitsCard(v).length <= 4, 'El código de seguridad es inválido'),
  nombreTarjeta: z
    .string()
    .trim()
    .min(3, 'Ingresá el nombre tal como figura en la tarjeta')
    .max(60, 'El nombre es demasiado largo'),
}).superRefine((data, ctx) => {
  // El CVV depende de la marca, así que hay que mirar el campo hermano: por
  // eso esto no puede ser un .refine() aislado sobre `cvv`.
  const expected = detectBrand(data.numeroTarjeta)?.cvvLength ?? 3;
  const actual = onlyDigitsCard(data.cvv).length;

  if (actual !== expected) {
    ctx.addIssue({
      code: 'custom',
      path: ['cvv'],
      message:
        expected === 4
          ? 'American Express pide un código de 4 dígitos'
          : 'El código de seguridad tiene 3 dígitos',
    });
  }
});

/**
 * Esquema del checkout. La tarjeta se valida con un discriminated union para
 * que solo exija los campos del método elegido.
 */
export const checkoutSchema = z.discriminatedUnion('metodoPago', [
  baseSchema.extend({ metodoPago: z.literal('tarjeta') }).merge(cardSchema),
  baseSchema.extend({ metodoPago: z.literal('mercadopago') }),
  baseSchema.extend({ metodoPago: z.literal('efectivo') }),
]);

export type CheckoutValues = z.infer<typeof checkoutSchema>;

/**
 * Forma plana para react-hook-form. El union discriminado de zod no permite
 * acceder a los campos de tarjeta sin narrowings, y el formulario necesita
 * todos los campos accesibles a la vez.
 */
export interface CheckoutFormValues {
  nombre: string;
  email: string;
  telefono: string;
  documento: string;
  cp: string;
  envio: ShippingMethodId;
  metodoPago: PaymentMethodId;
  numeroTarjeta: string;
  vencimiento: string;
  cvv: string;
  nombreTarjeta: string;
}

/**
 * El schema devuelve un union discriminado por `metodoPago`, mientras que el
 * formulario usa la forma plana `CheckoutFormValues`. El cast concentra esa
 * diferencia en un solo punto en lugar de propagarla por toda la app.
 */
export const checkoutResolver = zodResolver(checkoutSchema) as Resolver<CheckoutFormValues>;

/** Normaliza los campos antes de mandarlos a la pasarela. */
export function normalizeCheckout(values: CheckoutFormValues) {
  return {
    nombre: values.nombre.trim(),
    email: values.email.trim().toLowerCase(),
    telefono: onlyDigits(values.telefono),
    documento: onlyDigits(values.documento),
    cp: onlyDigits(values.cp),
    envio: values.envio,
    metodoPago: values.metodoPago,
    // Solo se conserva el final de la tarjeta: el número completo nunca sale
    // del formulario.
    ...(values.metodoPago === 'tarjeta'
      ? {
          tarjeta: {
            last4: cardLast4(values.numeroTarjeta),
            marca: detectBrand(values.numeroTarjeta)?.label ?? '',
            vencimiento: values.vencimiento,
          },
        }
      : {}),
  };
}

/** Calcula el envío según el método y el subtotal. */
export function shippingCostFor(
  envio: ShippingMethodId,
  subtotal: number,
): number {
  if (envio === 'express') return SHIPPING_COSTS.express;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COSTS.estandar;
}