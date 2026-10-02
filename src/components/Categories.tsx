import { Dumbbell, Footprints, Trophy, type LucideIcon } from 'lucide-react';
import { TennisRacket } from './TennisRacket';
import { CATEGORIES } from '../data/products';
import type { CategoryId } from '../types';

type CategoryIcon = LucideIcon | typeof TennisRacket;

const ICONS: Record<CategoryId, CategoryIcon> = {
  running: Footprints,
  futbol: Trophy,
  entrenamiento: Dumbbell,
  paddle: TennisRacket,
};

/** Fondo y color de texto por categoría: base / tint / surface. */
const STYLES: Record<CategoryId, string> = {
  running: 'bg-base text-content',
  futbol: 'bg-tint text-category-text',
  entrenamiento: 'bg-surface text-content',
  paddle: 'bg-base text-content',
};

export function Categories() {
  return (
    <section aria-label="Categorías" className="border-b-hairline border-line bg-line">
      <div className="mx-auto grid w-full max-w-shell grid-cols-2 md:grid-cols-4 gap-px min-[1205px]:max-w-full">
        {CATEGORIES.map((c) => {
          const Icon = ICONS[c.id];
          return (
            <a
              key={c.id}
              href={`#${c.id}`}
              className={`flex flex-col items-center justify-center gap-2 px-2 py-5 transition-opacity hover:opacity-80 ${STYLES[c.id]}`}
            >
              <Icon size={16} strokeWidth={1.5} />
              <span className="font-display text-[12px] font-bold uppercase tracking-[0.3px]">
                {c.label}
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
