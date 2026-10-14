import { VelocityMarquee } from '@/components/ui/velocity-marquee'

const rowA = ['Capas para e-book', 'Livro físico', 'Diagramação', 'Marcadores', 'Banners']
const rowB = ['Dark romance', 'Máfia', 'Fantasia', 'Romance de época', 'Hot', 'Esportes']

function Star({ className = 'text-scarlet' }: { className?: string }) {
  return <span className={`mx-6 md:mx-10 ${className}`}>✦</span>
}

export function Marquee() {
  return (
    <section aria-label="Serviços em destaque" className="relative z-10 -my-px space-y-3 overflow-hidden py-10 md:py-16">
      <div className="-rotate-2 bg-blood py-4 text-bone md:py-6">
        <VelocityMarquee baseVelocity={-2}>
          {rowA.map((t) => (
            <span key={t} className="flex items-center font-display text-4xl font-light uppercase tracking-wide md:text-7xl">
              {t}
              <Star className="text-bone/60" />
            </span>
          ))}
        </VelocityMarquee>
      </div>
      <div className="rotate-1 py-2">
        <VelocityMarquee baseVelocity={1.5}>
          {rowB.map((t) => (
            <span key={t} className="flex items-center font-display text-3xl italic text-blood/40 md:text-5xl">
              {t}
              <Star />
            </span>
          ))}
        </VelocityMarquee>
      </div>
    </section>
  )
}
