import { Link, Navigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { formatARS } from '../lib/format';

const CONFIG = {
  approved: {
    icon: CheckCircle2,
    title: '¡Pago aprobado!',
    tone: 'text-primary',
    body: 'Gracias por tu compra. Te enviamos el detalle por email.',
  },
  pending: {
    icon: Clock,
    title: 'Pago en revisión',
    tone: 'text-content',
    body: 'Estamos verificando la operación. Te avisamos apenas se confirme.',
  },
  rejected: {
    icon: AlertCircle,
    title: 'Pago rechazado',
    tone: 'text-primary',
    body: 'No pudimos procesar el pago. Podés intentar con otro medio de pago.',
  },
} as const;

export default function CheckoutResultPage() {
  const { order } = useOrder();

  // Sin orden en sesión no hay nada que mostrar.
  if (!order) return <Navigate to="/" replace />;

  const { result, lines, total, payerName, payerEmail } = order;
  const { icon: Icon, title, tone, body } = CONFIG[result.status];

  return (
    <div className="bg-base">
      <div className="mx-auto max-w-shell px-6 py-12">
        <div className="mx-auto max-w-[560px]">
          <div className="text-center">
            <Icon size={40} strokeWidth={1.25} className={`mx-auto ${tone}`} aria-hidden />
            <h1 className="mt-4 font-display text-[26px] font-bold uppercase tracking-[0.4px] text-content">
              {title}
            </h1>
            <p className="mt-1.5 font-sans text-[13px] text-muted">{body}</p>
          </div>

          <div className="mt-8 rounded border-hairline border-line p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-hairline border-line pb-3">
              <span className="font-sans text-[11.5px] text-muted">Número de orden</span>
              <span className="font-sans text-[13px] font-medium text-content">
                {result.orderId}
              </span>
            </div>

            <dl className="mt-3 flex flex-col gap-1.5 font-sans text-[12.5px]">
              <div className="flex justify-between">
                <dt className="text-muted">Estado</dt>
                <dd className="text-content">{result.statusDetail}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Medio de pago</dt>
                <dd className="text-content">
                  {result.methodLabel}
                  {result.last4 ? ` •••• ${result.last4}` : ''}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Comprador</dt>
                <dd className="text-content">{payerName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Email</dt>
                <dd className="text-content">{payerEmail}</dd>
              </div>
            </dl>

            <ul className="mt-4 flex flex-col gap-2.5 border-t-hairline border-line pt-3">
              {lines.map((l) => (
                <li key={l.id + l.title} className="flex justify-between gap-3 font-sans text-[12px]">
                  <span className="text-muted">
                    {l.quantity} × {l.title}
                  </span>
                  <span className="shrink-0 text-content">{formatARS(l.unitPrice * l.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex items-baseline justify-between border-t-hairline border-line pt-3">
              <span className="font-sans text-[12.5px] font-medium text-content">Total</span>
              <span className="font-display text-[18px] font-bold text-primary">
                {formatARS(total)}
              </span>
            </div>
          </div>

          {result.status === 'rejected' ? (
            <p className="mt-3 text-center font-sans text-[11.5px] text-muted">
              Tu carrito sigue intacto: podés reintentar cuando quieras.
            </p>
          ) : null}

          <div className="mt-6 flex justify-center gap-3">
            {result.status !== 'approved' ? (
              <Link
                to="/checkout"
                className="rounded bg-primary px-5 py-2.5 font-display text-[12px] font-bold uppercase tracking-[0.3px] text-on-primary transition-opacity hover:opacity-90"
              >
                Intentar de nuevo
              </Link>
            ) : null}
            <Link
              to="/"
              className="rounded border-hairline border-line px-5 py-2.5 font-display text-[12px] font-bold uppercase tracking-[0.3px] text-content transition-colors hover:border-primary"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}