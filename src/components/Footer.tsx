export function Footer() {
  return (
    <footer className="bg-footer px-6 py-4">
      <div className="mx-auto flex max-w-shell items-center justify-between gap-4">
        <img
          src="/logos/logo_stock_master_dark.svg"
          alt="Stock Master"
          className="h-6 w-auto"
        />
        <p className="font-sans text-[10.5px] font-normal text-footer-text">
          © {new Date().getFullYear()} Stock Master. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
