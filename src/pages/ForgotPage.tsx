import { Link } from 'react-router-dom';

export default function ForgotPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6 py-8">
      <div className="w-full max-w-[440px] rounded border-hairline border-line bg-base px-8 py-10">
        <img
          src="/logos/logo_stock_master.svg"
          alt="Stock Master"
          className="mx-auto h-10 w-auto dark:hidden"
        />
        <img
          src="/logos/logo_stock_master_dark.svg"
          alt="Stock Master"
          className="mx-auto hidden h-10 w-auto dark:block"
        />
        <h1 className="mt-5 text-center font-display text-[20px] font-bold uppercase tracking-[0.3px] text-content">
          Recuperar contraseña
        </h1>
        <p className="mb-7 mt-1.5 text-center text-[13px] text-muted">
          Ingresá tu email y te enviamos las instrucciones.
        </p>

        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-[12px] font-medium text-content">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="nombre@email.com"
              required
              className="w-full rounded border-hairline border-line bg-base px-3 py-2.5 text-[13px] text-content placeholder:text-muted focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="mt-1 w-full rounded bg-primary py-3 font-display text-[13px] font-bold uppercase tracking-[0.4px] text-on-primary transition hover:brightness-95"
          >
            Enviar instrucciones
          </button>
        </form>

        <p className="mt-6 text-center text-[12.5px] text-muted">
          ¿Ya la recordaste?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
