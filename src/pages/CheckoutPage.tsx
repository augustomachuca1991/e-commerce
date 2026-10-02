import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { AlertCircle, Loader2, Lock, ShoppingBag } from 'lucide-react';
import { useCart, useCartUI } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { finalPrice } from '../data/products';
import { formatARS } from '../lib/format';
import { formatCuit, formatDni, formatPhone, onlyDigits } from '../lib/validators/arg';
import { gateway, METHOD_LABELS, type PaymentResult } from '../lib/payment';
import {
  checkoutResolver,
  normalizeCheckout,
  shippingCostFor,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_COSTS,
  type CheckoutFormValues,
} from '../lib/checkout/schema';
import { PaymentCardForm } from '../components/PaymentCardForm';

const inputBase =
  'w-full rounded border-hairline bg-base px-3 py-2.5 text-[13px] text-content placeholder:text-muted focus:outline-none';

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[12px] font-medium text-content">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 font-sans text-[11.5px] text-primary">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 font-sans text-[11px] text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { close } = useCartUI();
  const { completeOrder } = useOrder();
  const navigate = useNavigate();

  const [gatewayError, setGatewayError] = useState<string | null>(null);
  // Marca que el pago ya está confirmado. Al aprobarse se vacía el carrito, y
  // sin este flag el efecto de "no hay carrito" nos sacaría de la pantalla de
  // resultado antes de mostrarla.
  const paid = useRef(false);

  const form = useForm<CheckoutFormValues>({
    resolver: checkoutResolver,
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      nombre: '',
      email: '',
      telefono: '',
      documento: '',
      cp: '',
      envio: 'estandar',
      metodoPago: 'mercadopago',
      numeroTarjeta: '',
      vencimiento: '',
      cvv: '',
      nombreTarjeta: '',
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const envio = watch('envio');
  const metodoPago = watch('metodoPago');

  const shipping = shippingCostFor(envio, subtotal);
  const total = subtotal + shipping;
  const faltaEnvioGratis = FREE_SHIPPING_THRESHOLD - subtotal;

  // Si no hay carrito, no hay checkout: se vuelve al inicio.
  useEffect(() => {
    if (items.length === 0 && !paid.current) {
      navigate('/', { replace: true });
    }
  }, [items.length, navigate]);

  useEffect(() => {
    close();
  }, [close]);

  const onSubmit = handleSubmit(async (values) => {
    setGatewayError(null);
    const data = normalizeCheckout(values);

    try {
      const result: PaymentResult = await gateway.pay({
        lines: items.map((i) => ({
          id: i.product.id,
          title: `${i.product.name} · ${i.size} · ${i.color}`,
          quantity: i.qty,
          unitPrice: finalPrice(i.product),
        })),
        subtotal,
        shipping,
        total,
        payer: {
          nombre: data.nombre,
          email: data.email,
          telefono: data.telefono,
          documento: data.documento,
          cp: data.cp,
        },
        method: data.metodoPago,
        shippingMethod: envio === 'express' ? 'Express' : 'Estándar',
        card: data.tarjeta,
      });

      // Si el pago se aprobó, el carrito se vacía. Marcamos antes de hacerlo
      // para que el efecto de redirección no nos saque de la pantalla.
      if (result.status === 'approved') paid.current = true;

      completeOrder(
        {
          result,
          lines: items.map((i) => ({
            id: i.product.id,
            title: `${i.product.name} · ${i.size} · ${i.color}`,
            quantity: i.qty,
            unitPrice: finalPrice(i.product),
          })),
          total,
          payerName: data.nombre,
          payerEmail: data.email,
        },
        clear,
      );

      navigate('/checkout/resultado');
    } catch {
      setGatewayError(
        'No pudimos procesar el pago. Revisá los datos e intentá de nuevo.',
      );
    }
  });

  // Al cambiar de método de pago se limpian los errores de tarjeta, porque el
  // schema deja de validarlos.
  useEffect(() => {
    if (metodoPago !== 'tarjeta') {
      setValue('numeroTarjeta', undefined as never);
      setValue('vencimiento', undefined as never);
      setValue('cvv', undefined as never);
      setValue('nombreTarjeta', undefined as never);
    }
  }, [metodoPago, setValue]);

  const errorCount = Object.keys(errors).length;
  const missingForFree =
    envio === 'estandar' && faltaEnvioGratis > 0 && subtotal > 0
      ? `Te faltan ${formatARS(faltaEnvioGratis)} para envío gratis`
      : null;

  const summary = useMemo(
    () =>
      items.map((i) => ({
        key: i.key,
        name: i.product.name,
        size: i.size,
        color: i.color,
        qty: i.qty,
        price: finalPrice(i.product) * i.qty,
        image: i.product.images[0],
      })),
    [items],
  );

  return (
    <div className="bg-base">
      <section className="bg-hero">
        <div className="mx-auto max-w-shell px-6 py-8">
          <h1 className="font-display text-[26px] font-bold uppercase tracking-[0.4px] text-hero-text">
            Finalizar compra
          </h1>
          <p className="mt-1 text-[13px] text-hero-sub">
            {items.length} {items.length === 1 ? 'producto' : 'productos'} en el carrito
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-shell gap-8 px-6 py-8 md:grid-cols-[1fr_320px]">
        <FormProvider {...form}>
          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
            {errorCount > 1 ? (
              <div
                role="alert"
                className="flex items-start gap-2 rounded border-hairline border-primary bg-tint p-3"
              >
                <AlertCircle size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-primary" />
                <p className="font-sans text-[12.5px] text-content">
                  Hay {errorCount} campos con errores. Revisá los marcados en rojo.
                </p>
              </div>
            ) : null}

            {gatewayError ? (
              <div role="alert" className="rounded border-hairline border-primary bg-tint p-3">
                <p className="font-sans text-[12.5px] text-content">{gatewayError}</p>
              </div>
            ) : null}

            <fieldset>
              <legend className="mb-4 font-display text-[13px] font-bold uppercase tracking-[0.3px] text-content">
                Datos de contacto
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field id="nombre" label="Nombre y apellido" error={errors.nombre?.message}>
                    <input
                      id="nombre"
                      type="text"
autoComplete="name"
                    placeholder="María Pérez"
                    aria-invalid={!!errors.nombre}
                    aria-describedby={errors.nombre ? 'nombre-error' : undefined}
                    {...register('nombre')}
                      className={`${inputBase} ${errors.nombre ? 'border-primary' : 'border-line'}`}
                    />
                  </Field>
                </div>

                <Field id="email" label="Email" error={errors.email?.message}>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="maria@email.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    {...register('email')}
                    className={`${inputBase} ${errors.email ? 'border-primary' : 'border-line'}`}
                  />
                </Field>

                <Field
                  id="telefono"
                  label="Teléfono"
                  error={errors.telefono?.message}
                  hint="Con o sin el 15"
                >
                  <input
                    id="telefono"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="11 2234-5678"
                    aria-invalid={!!errors.telefono}
                    aria-describedby={errors.telefono ? 'telefono-error' : undefined}
                    {...register('telefono')}
                    onBlur={(e) =>
                      setValue('telefono', formatPhone(e.target.value), {
                        shouldValidate: true,
                      })
                    }
                    className={`${inputBase} ${errors.telefono ? 'border-primary' : 'border-line'}`}
                  />
                </Field>

                <Field
                  id="documento"
                  label="DNI o CUIT"
                  error={errors.documento?.message}
                  hint="Para facturas"
                >
                  <input
                    id="documento"
                    type="text"
                    inputMode="numeric"
                    placeholder="20123456786"
                    aria-invalid={!!errors.documento}
                    aria-describedby={errors.documento ? 'documento-error' : undefined}
                    {...register('documento')}
                    onBlur={(e) => {
                      const digits = onlyDigits(e.target.value);
                      // shouldValidate mantiene la validación tras reformatear:
                      // sin esto, setValue borra el estado "touched" y el error
                      // no llega a mostrarse al salir del campo.
                      setValue(
                        'documento',
                        digits.length === 11 ? formatCuit(digits) : formatDni(digits),
                        { shouldValidate: true },
                      );
                    }}
                    className={`${inputBase} ${errors.documento ? 'border-primary' : 'border-line'}`}
                  />
                </Field>

                <Field
                  id="cp"
                  label="Código postal"
                  error={errors.cp?.message}
                >
                  <input
                    id="cp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="1424"
                    maxLength={4}
                    aria-invalid={!!errors.cp}
                    aria-describedby={errors.cp ? 'cp-error' : undefined}
                    {...register('cp', {
                      onChange: (e) => setValue('cp', onlyDigits(e.target.value).slice(0, 4)),
                    })}
                    className={`${inputBase} ${errors.cp ? 'border-primary' : 'border-line'}`}
                  />
                </Field>
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-4 font-display text-[13px] font-bold uppercase tracking-[0.3px] text-content">
                Envío
              </legend>
              <div className="flex flex-col gap-2">
                <label className="flex cursor-pointer items-center justify-between rounded border-hairline border-line p-3 transition-colors hover:border-primary">
                  <span className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      value="estandar"
                      aria-invalid={!!errors.envio}
                      {...register('envio')}
                      className="accent-[color:var(--primary)]"
                    />
                    <span>
                      <span className="block font-sans text-[13px] text-content">Estándar</span>
                      <span className="block font-sans text-[11.5px] text-muted">
                        5 a 8 días hábiles
                      </span>
                    </span>
                  </span>
                  <span className="font-sans text-[13px] font-medium text-content">
                    {subtotal >= FREE_SHIPPING_THRESHOLD ? 'Gratis' : formatARS(0)}
                  </span>
                </label>

                <label className="flex cursor-pointer items-center justify-between rounded border-hairline border-line p-3 transition-colors hover:border-primary">
                  <span className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      value="express"
                      aria-invalid={!!errors.envio}
                      {...register('envio')}
                      className="accent-[color:var(--primary)]"
                    />
                    <span>
                      <span className="block font-sans text-[13px] text-content">Express</span>
                      <span className="block font-sans text-[11.5px] text-muted">
                        24 a 48 horas
                      </span>
                    </span>
                  </span>
                  <span className="font-sans text-[13px] font-medium text-content">
                    {formatARS(SHIPPING_COSTS.express)}
                  </span>
                </label>
              </div>

              {missingForFree ? (
                <p className="mt-2 font-sans text-[11.5px] text-muted">{missingForFree}</p>
              ) : null}
            </fieldset>

            <fieldset>
              <legend className="mb-4 font-display text-[13px] font-bold uppercase tracking-[0.3px] text-content">
                Medio de pago
              </legend>
              <div className="flex flex-col gap-2">
                {(['mercadopago', 'tarjeta', 'efectivo'] as const).map((m) => (
                  <label
                    key={m}
                    className="flex cursor-pointer items-center justify-between rounded border-hairline border-line p-3 transition-colors hover:border-primary"
                  >
                    <span className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        value={m}
                        aria-invalid={!!errors.metodoPago}
                        {...register('metodoPago')}
                        className="accent-[color:var(--primary)]"
                      />
                      <span className="font-sans text-[13px] text-content">
                        {METHOD_LABELS[m]}
                      </span>
                    </span>
                    {m === 'mercadopago' ? (
                      <span className="font-sans text-[11px] text-muted">Demo</span>
                    ) : null}
                  </label>
                ))}
              </div>

              {metodoPago === 'tarjeta' ? (
                <div className="mt-5">
                  <PaymentCardForm />
                </div>
              ) : null}

              {metodoPago === 'efectivo' ? (
                <p className="mt-3 rounded border-hairline border-line bg-surface p-3 font-sans text-[12px] text-muted">
                  Vas a pagar al retirar en el local. Te contactamos para coordinar.
                </p>
              ) : null}

              {metodoPago === 'mercadopago' ? (
                <p className="mt-3 rounded border-hairline border-line bg-surface p-3 font-sans text-[12px] text-muted">
                  Pago de demostración: no se solicitan datos de tarjeta. Al confirmar vas a ver la
                  pantalla de resultado.
                </p>
              ) : null}
            </fieldset>

            <button
              type="submit"
              disabled={isSubmitting}
              onClick={() => {
                if (errorCount > 0) {
                  const first = document.querySelector<HTMLElement>('[aria-invalid="true"]');
                  first?.focus();
                }
              }}
              className="flex items-center justify-center gap-2 rounded bg-primary py-3.5 font-display text-[12.5px] font-bold uppercase tracking-[0.4px] text-on-primary transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
                  Procesando pago
                </>
              ) : (
                <>
                  <Lock size={14} strokeWidth={1.5} aria-hidden />
                  Pagar {formatARS(total)}
                </>
              )}
            </button>

            <p className="-mt-4 text-center font-sans text-[11px] text-muted">
              Demo: no se procesa ningún pago real ni se guardan datos de tarjeta.
            </p>
          </form>
        </FormProvider>

        <aside className="md:sticky md:top-20 md:h-fit">
          <div className="rounded border-hairline border-line p-4">
            <h2 className="mb-3 font-display text-[13px] font-bold uppercase tracking-[0.3px] text-content">
              Tu pedido
            </h2>

            <ul className="flex flex-col gap-3">
              {summary.map((s) => (
                <li key={s.key} className="flex gap-3">
                  <img
                    src={s.image}
                    alt=""
                    loading="lazy"
                    className="h-14 w-14 shrink-0 rounded border-hairline border-line bg-media object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-[12px] text-content">{s.name}</p>
                    <p className="font-sans text-[11px] text-muted">
                      {s.size} · {s.color} · x{s.qty}
                    </p>
                  </div>
                  <span className="font-sans text-[12px] font-medium text-content">
                    {formatARS(s.price)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-4 flex flex-col gap-1.5 border-t-hairline border-line pt-3 font-sans text-[12.5px]">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="text-content">{formatARS(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Envío</dt>
                <dd className="text-content">
                  {shipping === 0 ? 'Gratis' : formatARS(shipping)}
                </dd>
              </div>
              <div className="mt-1 flex items-baseline justify-between border-t-hairline border-line pt-2">
                <dt className="font-medium text-content">Total</dt>
                <dd className="font-display text-[18px] font-bold text-primary">
                  {formatARS(total)}
                </dd>
              </div>
            </dl>

            <p className="mt-3 flex items-center gap-1.5 font-sans text-[11px] text-muted">
              <ShoppingBag size={12} strokeWidth={1.5} aria-hidden />
              {envio === 'express' ? 'Express · 24 a 48 horas' : 'Estándar · 5 a 8 días'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}