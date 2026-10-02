/** Validadores de tarjeta de crédito. Funciones puras. */

export function onlyDigitsCard(value: string): string {
  return value.replace(/\D/g, '');
}

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'nativa' | 'naranja' | 'argencard' | 'mercadopago';

interface BrandSpec {
  id: CardBrand;
  label: string;
  /** Expresión regular que valida el número completo. */
  pattern: RegExp;
  /**
   * Prefijos que identifican la marca. Se evalúan sobre el número parcial,
   * para que la detección funcione mientras el usuario tipea.
   */
  prefixes: RegExp;
  lengths: number[];
  cvvLength: number;
  /** Formatea el número en bloques de 4 (Amex usa 4-6-5). */
  gaps: number[];
}

/** Especificaciones por marca, con los prefijosBIN reales de Argentina. */
const BRANDS: BrandSpec[] = [
  {
    id: 'visa',
    label: 'Visa',
    pattern: /^4\d{12}(\d{3})?$/,
    prefixes: /^4/,
    lengths: [16, 13, 19],
    cvvLength: 3,
    gaps: [4, 8, 12],
  },
  {
    id: 'mastercard',
    label: 'Mastercard',
    pattern: /^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))\d{10}$/,
    // Serie clásica 51–55 y serie 2 de Mastercard.
    prefixes: /^(5[1-5]|2[2-9])/,
    lengths: [16],
    cvvLength: 3,
    gaps: [4, 8, 12],
  },
  {
    id: 'amex',
    label: 'American Express',
    pattern: /^3[47]\d{13}$/,
    prefixes: /^3[47]/,
    lengths: [15],
    cvvLength: 4,
    gaps: [4, 10],
  },
  {
    id: 'nativa',
    label: 'Nativa',
    pattern: /^63\d{10,15}$/,
    prefixes: /^63/,
    lengths: [16],
    cvvLength: 3,
    gaps: [4, 8, 12],
  },
  {
    id: 'naranja',
    label: 'Naranja',
    pattern: /^589562\d{10}$/,
    prefixes: /^58956/,
    lengths: [16],
    cvvLength: 3,
    gaps: [4, 8, 12],
  },
  {
    id: 'argencard',
    label: 'Argencard',
    pattern: /^50\d{14}$/,
    prefixes: /^50/,
    lengths: [16],
    cvvLength: 3,
    gaps: [4, 8, 12],
  },
  {
    id: 'mercadopago',
    label: 'Mercado Pago',
    pattern: /^9\d{15}$/,
    prefixes: /^9/,
    lengths: [16],
    cvvLength: 3,
    gaps: [4, 8, 12],
  },
];

export function cardBrands(): BrandSpec[] {
  return BRANDS;
}

/**
 * Detecta la marca por prefijo. Funciona con números parciales porque evalúa
 * el patrón de prefijos, no el de longitud completa.
 */
export function detectBrand(value: string): BrandSpec | undefined {
  const digits = onlyDigitsCard(value);
  if (!digits) return undefined;
  return BRANDS.find((b) => b.prefixes.test(digits));
}

/** Algoritmo de Luhn para validar el dígito de control. */
export function luhnValid(value: string): boolean {
  const digits = onlyDigitsCard(value);
  if (digits.length < 13) return false;

  let sum = 0;
  let double = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }

  return sum % 10 === 0;
}

/**
 * Valida el vencimiento. Acepta MM/AA y MM/AAAA.
 * Rechaza fechas ya vencidas, meses fuera de rango y años inverosímiles.
 * Las tarjetas vencen al cierre del mes indicado, así que el mes en curso
 * todavía es válido.
 */
export function isValidExpiry(value: string, now = new Date()): boolean {
  const raw = value.trim();

  // MM/AA o MM/AAAA
  const withSlash = /^(\d{2})\/(\d{2}|\d{4})$/.exec(raw);
  // MMAA o MMAAAA sin barra
  const bare = /^(\d{2})(\d{2}|\d{4})$/.exec(raw);

  let month: number;
  let year: number;

  if (withSlash) {
    month = Number(withSlash[1]);
    year = withSlash[2].length === 4 ? Number(withSlash[2]) : 2000 + Number(withSlash[2]);
  } else if (bare) {
    month = Number(bare[1]);
    year = bare[2].length === 4 ? Number(bare[2]) : 2000 + Number(bare[2]);
  } else {
    return false;
  }

  if (month < 1 || month > 12) return false;

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // Una tarjeta no puede tener más de 20 años de vencimiento.
  if (year > currentYear + 20) return false;
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  return true;
}

/** Longitud de CVV esperada para la marca (Amex usa 4, el resto 3). */
export function cvvLengthFor(value: string): number {
  return detectBrand(value)?.cvvLength ?? 3;
}

/** Formatea el número en bloques según la marca. */
export function formatCardNumber(value: string): string {
  const digits = onlyDigitsCard(value);
  const brand = detectBrand(digits);
  const gaps = brand?.gaps ?? [4, 8, 12];

  let out = '';
  let gapIndex = 0;

  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && gapIndex < gaps.length && i === gaps[gapIndex]) {
      out += ' ';
      gapIndex++;
    }
    out += digits[i];
  }

  return out;
}

/** Formatea el vencimiento como MM/AA. */
export function formatExpiry(value: string): string {
  const digits = onlyDigitsCard(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

/** Solo los últimos 4 dígitos, que es lo único que se conserva. */
export function cardLast4(value: string): string {
  return onlyDigitsCard(value).slice(-4);
}