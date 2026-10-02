import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  cvvLengthFor,
  detectBrand,
  formatCardNumber,
  formatExpiry,
  onlyDigitsCard,
} from '../lib/validators/card';
import { TEST_CARDS } from '../lib/payment/simulated';
import type { CheckoutFormValues } from '../lib/checkout/schema';

const inputBase =
  'w-full rounded border-hairline bg-base px-3 py-2.5 text-[13px] text-content placeholder:text-muted focus:outline-none';

/** Etiqueta + input + mensaje de error, con los atributos ARIA correctos. */
function Field({
  id,
  label,
  error,
  children,
  suffix,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  suffix?: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[12px] font-medium text-content">
        {label}
      </label>
      <div className="relative">
        {children}
        {suffix ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted">
            {suffix}
          </span>
        ) : null}
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 font-sans text-[11.5px] text-primary">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Datos de la tarjeta. Solo se escribe el formateo en vivo; la validaciÃ³n real
 * la hace el schema de zod. El nÃºmero completo nunca se envÃ­a ni se persiste:
 * al confirmar la orden solo queda el final.
 */
export function PaymentCardForm() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CheckoutFormValues>();

  // Los valores se leen con watch para poder mostrar el texto formateado
  // (los hooks de registro no exponen el valor actual).
  const numeroTarjeta = watch('numeroTarjeta') ?? '';
  const vencimiento = watch('vencimiento') ?? '';
  const cvv = watch('cvv') ?? '';

  const [brand, setBrand] = useState(() => detectBrand(''));

  // Formatea el nÃºmero segÃºn la marca y guarda solo los dÃ­gitos.
  const onNumberChange = (raw: string) => {
    const digits = onlyDigitsCard(raw);
    setValue('numeroTarjeta', digits, { shouldValidate: false, shouldDirty: true });
    setBrand(detectBrand(digits));
  };

  const onExpiryChange = (raw: string) => {
    setValue('vencimiento', onlyDigitsCard(raw).slice(0, 4), {
      shouldValidate: false,
      shouldDirty: true,
    });
  };

  const onCvvChange = (raw: string) => {
    const max = brand?.cvvLength ?? 3;
    setValue('cvv', onlyDigitsCard(raw).slice(0, max), {
      shouldValidate: false,
      shouldDirty: true,
    });
  };

  const fillTestCard = () => {
    const card = TEST_CARDS[0];
    setValue('numeroTarjeta', onlyDigitsCard(card.number), { shouldDirty: true });
    setValue('vencimiento', '1230', { shouldDirty: true });
    setValue('cvv', '123', { shouldDirty: true });
    setValue('nombreTarjeta', 'MARIA PEREZ', { shouldDirty: true });
    setBrand(detectBrand(card.number));
  };

  const cvvLength = cvvLengthFor(numeroTarjeta);

  return (
    <div className="flex flex-col gap-4">
      <Field id="numeroTarjeta" label="NÃºmero de tarjeta" error={errors.numeroTarjeta?.message}>
        <input
          id="numeroTarjeta"
          type="text"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="4509 9535 1123 0326"
aria-invalid={!!errors.numeroTarjeta}
          aria-describedby={errors.numeroTarjeta ? 'numeroTarjeta-error' : undefined}
          {...register('numeroTarjeta')}
          onChange={(e) => onNumberChange(e.target.value)}
          value={formatCardNumber(numeroTarjeta)}
          className={`${inputBase} ${errors.numeroTarjeta ? 'border-primary' : 'border-line'}`}
        />
        {brand ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-sans text-[11px] text-muted">
            {brand.label}
          </span>
        ) : null}
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field
          id="vencimiento"
          label="Vencimiento"
          error={errors.vencimiento?.message}
          suffix="MM/AA"
        >
          <input
            id="vencimiento"
            type="text"
            inputMode="numeric"
            autoComplete="cc-exp"
placeholder="12/30"
            aria-invalid={!!errors.vencimiento}
            aria-describedby={errors.vencimiento ? 'vencimiento-error' : undefined}
            {...register('vencimiento')}
            onChange={(e) => onExpiryChange(e.target.value)}
            value={formatExpiry(vencimiento)}
            className={`${inputBase} ${errors.vencimiento ? 'border-primary' : 'border-line'}`}
          />
        </Field>

        <Field
          id="cvv"
          label="CÃ³digo de seguridad"
          error={errors.cvv?.message}
          suffix={String(cvvLength)}
        >
          <input
            id="cvv"
            type="text"
            inputMode="numeric"
            autoComplete="cc-csc"
placeholder="123"
            aria-invalid={!!errors.cvv}
            aria-describedby={errors.cvv ? 'cvv-error' : undefined}
            {...register('cvv')}
            onChange={(e) => onCvvChange(e.target.value)}
            value={cvv}
            className={`${inputBase} ${errors.cvv ? 'border-primary' : 'border-line'}`}
          />
        </Field>
      </div>

      <Field
        id="nombreTarjeta"
        label="Nombre en la tarjeta"
        error={errors.nombreTarjeta?.message}
      >
        <input
          id="nombreTarjeta"
          type="text"
          autoComplete="cc-name"
placeholder="Como figura impreso"
          aria-invalid={!!errors.nombreTarjeta}
          aria-describedby={errors.nombreTarjeta ? 'nombreTarjeta-error' : undefined}
          {...register('nombreTarjeta')}
          className={`${inputBase} ${errors.nombreTarjeta ? 'border-primary' : 'border-line'}`}
        />
      </Field>

      {/* Ayuda para probar el demo sin tarjeta real. */}
      <div className="rounded border-hairline border-line bg-surface p-3">
        <p className="font-sans text-[11.5px] font-medium text-content">Tarjetas de prueba</p>
        <ul className="mt-1.5 space-y-1">
          {TEST_CARDS.map((c) => (
            <li key={c.number} className="font-sans text-[11px] text-muted">
              <span className="text-content">{c.number}</span> â€” {c.label}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={fillTestCard}
          className="mt-2 font-sans text-[11.5px] text-primary underline"
        >
          Completar con una tarjeta vÃ¡lida
        </button>
      </div>
    </div>
  );
}
