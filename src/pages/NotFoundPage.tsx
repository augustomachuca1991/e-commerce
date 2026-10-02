import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-shell px-6 py-10 text-center">
      <h1 className="font-display text-[40px] font-bold uppercase tracking-[0.3px] text-primary">
        404
      </h1>
      <p className="mt-2 font-sans text-[14px] text-content">
        Página no encontrada
      </p>
      <Link
        to="/"
        className="mt-4 inline-block rounded bg-primary px-4 py-2 font-display text-[12px] font-bold uppercase tracking-[0.3px] text-on-primary transition-opacity hover:opacity-90"
      >
        Volver al inicio
      </Link>
    </div>
  );
}