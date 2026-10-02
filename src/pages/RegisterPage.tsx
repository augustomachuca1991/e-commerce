import { Link } from 'react-router-dom';

export default function RegisterPage() {
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
          Crear cuenta
        </h1>
        <p className="mb-7 mt-1.5 text-center text-[13px] text-muted">
          Registrate para hacer tu primera compra.
        </p>

        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="name" className="mb-1.5 block text-[12px] font-medium text-content">
              Nombre completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Juan Pérez"
              required
              className="w-full rounded border-hairline border-line bg-base px-3 py-2.5 text-[13px] text-content placeholder:text-muted focus:border-primary focus:outline-none"
            />
          </div>

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

          <div>
            <label htmlFor="password" className="mb-1.5 block text-[12px] font-medium text-content">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              required
              className="w-full rounded border-hairline border-line bg-base px-3 py-2.5 text-[13px] text-content placeholder:text-muted focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="mt-1 w-full rounded bg-primary py-3 font-display text-[13px] font-bold uppercase tracking-[0.4px] text-on-primary transition hover:brightness-95"
          >
            Crear cuenta
          </button>
        </form>

        <div className="my-[22px] flex items-center gap-2.5">
          <span className="h-px flex-1 bg-line" />
          <span className="whitespace-nowrap text-[11px] text-muted">o continuá con</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <div className="flex gap-2.5">
          <button
            type="button"
            className="flex-1 rounded border-hairline border-line py-2.5 text-[12px] text-content transition hover:bg-surface"
          >
            Google
          </button>
          <button
            type="button"
            className="flex-1 rounded border-hairline border-line py-2.5 text-[12px] text-content transition hover:bg-surface"
          >
            Apple
          </button>
        </div>

        <p className="mt-6 text-center text-[12.5px] text-muted">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
