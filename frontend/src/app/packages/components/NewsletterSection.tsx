export function NewsletterSection() {
  return (
    <section className="bg-primary-700 py-16 text-white">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h3 className="text-4xl font-bold">Unete a nuestra comunidad luxviajes VIP</h3>
        <p className="mx-auto mt-3 max-w-2xl text-white!">
          Suscribete a nuestro boletin para recibir ofertas exclusivas, consejos de viaje y las ultimas novedades directamente en tu bandeja de entrada.
        </p>

        <form className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder="Tu correo electronico"
            className="h-12 flex-1 rounded-full border border-white/20 bg-white px-5 text-sm text-neutral-800 placeholder:text-neutral-600 outline-none focus:border-white/50"
          />
          <button
            type="submit"
            className="h-12 rounded-full bg-primary-50 px-7 text-sm font-semibold text-primary-800 transition hover:bg-primary-100"
          >
            Suscribirme
          </button>
        </form>
      </div>
    </section>
  );
}
