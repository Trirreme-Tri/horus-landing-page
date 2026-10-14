import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import { useState } from 'react'
import { services } from '@/data'

/** Lista de serviços: no hover, a imagem do trabalho flutua junto ao cursor. */
export function Services() {
  const [active, setActive] = useState<number | null>(null)
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 28 })
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 28 })

  return (
    <section
      id="servicos"
      className="relative mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-36"
      onPointerMove={(e) => {
        x.set(e.clientX)
        y.set(e.clientY)
      }}
    >
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-20">
        <h2 className="font-display text-6xl font-light leading-[0.9] md:text-[8rem]">
          Serviços
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-ink/60 md:text-base">
          Para autores independentes, agências literárias e editoras. Cada peça conversa com as outras, para o seu
          lançamento ter uma identidade só.
        </p>
      </div>

      <ul className="border-t border-ink/15" onPointerLeave={() => setActive(null)}>
        {services.map((s, i) => (
          <li
            key={s.name}
            onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
            className="group relative border-b border-ink/15"
          >
            <div className="relative z-10 flex items-center gap-4 py-6 md:gap-10 md:py-9">
              <span className="w-8 text-xs tabular-nums text-ink/40 md:w-12">{String(i + 1).padStart(2, '0')}</span>
              <img src={s.image} alt="" loading="lazy" className="size-16 shrink-0 rounded-md object-cover md:hidden" />
              <div className="flex flex-1 flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-10">
                <h3 className="font-display text-3xl font-light transition-transform duration-500 ease-out-expo group-hover:translate-x-4 group-hover:text-blood md:text-6xl">
                  {s.name}
                </h3>
                <p className="text-sm text-ink/55 transition-colors group-hover:text-ink/90 md:max-w-xs md:text-right">
                  {s.note}
                </p>
              </div>
            </div>
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-blood/[0.07] transition-transform duration-500 ease-out-expo group-hover:scale-y-100" />
          </li>
        ))}
      </ul>

      <motion.div
        aria-hidden
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block"
      >
        <AnimatePresence mode="popLayout">
          {active !== null && (
            <motion.img
              key={active}
              src={services[active].image}
              alt=""
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: -4 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 4 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="-translate-x-1/2 -translate-y-1/2 h-80 w-64 rounded-lg object-cover shadow-2xl"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
