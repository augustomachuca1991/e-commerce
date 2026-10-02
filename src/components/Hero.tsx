import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const SLIDES = [
  {
    src: '/images/banner/image1.jpg',
    title: 'Corré con ventaja.',
    description:
      'Zapatillas deportivas con amortiguación reactiva para que cada kilómetro rinda más.',
  },
  {
    src: '/images/banner/image2.jpg',
    title: 'Mujer, en movimiento.',
    description:
      'Ropa deportiva femenina pensada para entrenar sin rozar ni frenar.',
  },
  {
    src: '/images/banner/image3.jpg',
    title: 'Hombre, sin límites.',
    description:
      'Indumentaria deportiva de hombre con tejido técnico, elástico y duradero.',
  },
];

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="inicio" className="relative isolate overflow-hidden bg-hero px-7 py-9">
      {/* Carrusel de fondo */}
      <div className="absolute inset-0 -z-10">
        {SLIDES.map((s, i) => (
          <div
            key={s.src}
            aria-hidden={i !== index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-out ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url('${s.src}')` }}
          />
        ))}
        {/* Overlay para mejorar contraste del texto */}
        <div aria-hidden className="absolute inset-0 bg-white/30 dark:bg-black/55" />
      </div>

      <div className="relative mx-auto max-w-shell">
        <div className="max-w-[560px]" key={SLIDES[index].src}>
          <h1 className="font-display text-[24px] font-bold uppercase leading-[1.15] text-hero-text drop-shadow-sm dark:text-white">
            {SLIDES[index].title}
          </h1>
          <p className="mt-2.5 font-sans text-[13px] font-normal text-hero-text drop-shadow-sm dark:text-white">
            {SLIDES[index].description}
          </p>
          <a
            href="#destacados"
            className="mt-5 inline-flex items-center gap-2 rounded bg-primary px-5 py-3 font-display text-[13px] font-bold uppercase tracking-[0.4px] text-[#C8F3FF] transition-opacity hover:opacity-90 dark:text-[#141414]"
          >
            Ver colección
            <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
