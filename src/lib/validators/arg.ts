/**
 * Validadores de datos argentinos usados en el checkout.
 * Funciones puras: no dependen de React ni de zod.
 */

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * DNI argentino: 7 u 8 dígitos, sin dígito verificador.
 *
 * El DNI no tiene check digit: RENAPER asigna el número correlativo y no publica
 * un algoritmo de verificación. El "método" 9,8,7,6,5,4,3,2 que circula en
 * internet aplicado al DNI no es oficial; el dígito verificador real es el del
 * CUIT (ver isValidCuit). Acá solo se valida formato.
 */
export function isValidDni(value: string): boolean {
  const dni = onlyDigits(value);
  return dni.length === 7 || dni.length === 8;
}

/**
 * CUIT / CUIL: 11 dígitos. Los primeros 10 (prefijo de tipo + DNI o sociedad)
 * se multiplican por 5,4,3,2,7,6,5,4,3,2 y el verificador es 11 menos el
 * resto módulo 11, con 11 → 0 y 10 → 9.
 */
export function isValidCuit(value: string): boolean {
  const cuit = onlyDigits(value);
  if (cuit.length !== 11) return false;
  if (!/^(20|23|24|27|30|33|34)/.test(cuit)) return false;

  const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number(cuit[i]) * weights[i];
  }

  const rest = 11 - (sum % 11);
  const expected = rest === 11 ? 0 : rest === 10 ? 9 : rest;

  return expected === Number(cuit[10]);
}

/** Acepta DNI (7-8 dígitos) o CUIT (11 dígitos con verificador). */
export function isValidDocument(value: string): boolean {
  const doc = onlyDigits(value);
  if (doc.length === 7 || doc.length === 8) return true;
  return isValidCuit(doc);
}

/**
 * Teléfono celular argentino.
 *
 * Se normaliza a 10 dígitos (área de 2 + número de 8) probando las formas de
 * uso reales, de más larga a más corta:
 *   +54 9 11 2234-5678     (internacional con 9 de móvil)
 *   +54 11 15 2234-5678    (internacional con 15 interno)
 *   011 15 2234-5678       (prefijo de acceso fijo)
 *   11 15 2234-5678        (15 interno tras el área)
 *   11 2234-5678           (sin 15)
 */
export function isValidArgentinianPhone(value: string): boolean {
  const digits = onlyDigits(value);
  // 10 dígitos directos, o hasta 13 con prefijos (+54 / 011) y bloque 15.
  if (digits.length < 10 || digits.length > 13) return false;

  // Nos fijamos en los últimos 10 dígitos (área + número). Cualquier prefijo
  // internacional (+54, 9) o de acceso (011) queda fuera de esa ventana, sin
  // importar en qué orden aparezcan.
  const local = digits.slice(-10);

  // Área: 2 dígitos que no arrancan con 0 (el 0 inicial es del prefijo).
  if (local[0] === '0') return false;

  // El número de 8 dígitos no puede arrancar con 0 ni con 9 (que es el
  // marcador de móvil internacional). El 15 es opcional, y tanto los fijos
  // (prefijo 1) como los celulares (2, 3, 6, 7) son válidos.
  const prefix = local[2];
  if (prefix === '0' || prefix === '9') return false;

  return true;
}

/** Código postal argentino: 4 dígitos, rango válido 1000–8999. */
export function isValidPostalCode(value: string): boolean {
  const cp = onlyDigits(value);
  if (cp.length !== 4) return false;

  const n = Number(cp);
  return n >= 1000 && n <= 8999;
}

/** Inserta guiones en el DNI: 30.123.456 */
export function formatDni(value: string): string {
  const dni = onlyDigits(value).slice(0, 8);
  if (dni.length <= 2) return dni;
  if (dni.length <= 5) return `${dni.slice(0, 2)}.${dni.slice(2)}`;
  if (dni.length <= 7) return `${dni.slice(0, 2)}.${dni.slice(2, 5)}.${dni.slice(5)}`;
  return `${dni.slice(0, 2)}.${dni.slice(2, 5)}.${dni.slice(5)}`;
}

/** Formatea el CUIT como 20-12345678-9. */
export function formatCuit(value: string): string {
  const cuit = onlyDigits(value).slice(0, 11);
  if (cuit.length <= 2) return cuit;
  if (cuit.length < 11) return `${cuit.slice(0, 2)}-${cuit.slice(2)}`;
  return `${cuit.slice(0, 2)}-${cuit.slice(2, 10)}-${cuit.slice(10)}`;
}

/**
 * Descompone un teléfono para formatearlo.
 *
 * Nota: la forma de discado desde línea fija (011 15 2234-5678) no repite el
 * área, así que el bloque 15 puede aparecer donde menos se espera. Por eso
 * acá solo se separa el prefijo internacional/de acceso y se agrupan los
 * dígitos restantes en bloques de 4.
 */
export function formatPhone(value: string): string {
  const digits = onlyDigits(value);
  if (!digits) return '';
  if (digits.length < 10) return digits;

  let prefix = '';
  let rest = digits;

  if (rest.startsWith('54')) {
    prefix = '+54 ';
    rest = rest.slice(2);
    // El 9 marca móvil en formato internacional (9 + 10 dígitos).
    if (rest.length === 11 && rest[0] === '9') {
      prefix += '9 ';
      rest = rest.slice(1);
    }
  }

  if (rest.startsWith('011')) {
    prefix += '011 ';
    rest = rest.slice(3);
  } else if (rest.length > 10 && rest[0] === '0') {
    prefix += '0';
    rest = rest.slice(1);
  }

  if (rest.length > 10 && rest.length <= 12) {
    // Sobra el bloque 15 interno: "11 15 2234-5678".
    const area = rest.slice(0, 2);
    const tail = rest.slice(2);
    if (tail.startsWith('15')) {
      const body = tail.slice(2);
      return `${prefix}${area} 15 ${body.slice(0, 4)}-${body.slice(4)}`;
    }
  }

  const local = rest.slice(-10);
  return `${prefix}${local.slice(0, 2)} ${local.slice(2, 6)}-${local.slice(6)}`;
}