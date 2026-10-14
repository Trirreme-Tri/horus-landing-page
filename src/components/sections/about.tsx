import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Counter } from '@/components/ui/counter'
import { RotatingBadge } from '@/components/ui/rotating-badge'
import { TextReveal } from '@/components/ui/text-reveal'
import { img } from '@/data'

const intro =
  'Olá, autor! Assim como você, eu também já fui *escritora* um dia. E é justamente por isso que sei o quão importante é ter uma boa capa para *representar* o seu livro.'

const stats = [
  { value: 3000, prefix: '+', label: 'trabalhos entregues' },
  { value: 2020, prefix: '', label: 'o ano em que a Hórus nasceu', year: true },
  { value: new Date().getFullYear() - 2020, prefix: '+', label: 'anos vestindo histórias' },
]

export function About() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], ['12%', '-12%'])

  return (
    <section id="sobre" ref={ref} className="relative mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-40">
      <p className="mb-10 text-[10px] font-semibold uppercase tracking-mega text-scarlet md:mb-16 md:text-xs">
        Hórus & Juliana
      </p>

      <TextReveal
        text={intro}
        className="font-display text-[2.1rem] font-light leading-[1.08] md:text-7xl md:leading-[1.02]"
      />

      <div className="mt-20 grid items-center gap-14 md:mt-32 md:grid-cols-[1fr_1.1fr] md:gap-20">
        <motion.div style={{ y: photoY }} className="relative mx-auto w-[78%] max-w-sm md:w-full">
          <div className="relative aspect-square overflow-hidden rounded-full ring-8 ring-blush">
            <img
              src={img('juliana.webp')}
              alt="Juliana Brum, a Lucy, designer da Hórus"
              loading="lazy"
              className="size-full scale-[1.06] object-cover"
            />
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_60px_rgb(110_10_22/0.25)]" />
          </div>
          <RotatingBadge
            text="Hórus design editorial ✦ Juliana Brum ✦ "
            className="absolute -inset-[13%] size-[126%] text-blood/80"
          />
        </motion.div>

        <div>
          <h2 className="font-display text-5xl font-light leading-none md:text-7xl">
            Juliana Brum,
            <span className="block font-script text-6xl text-scarlet md:text-8xl">a Lucy</span>
          </h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-ink/75 md:text-lg">
            <p>
              Trabalho com design gráfico desde 2020, quando criei a Hórus: um perfil voltado inteiramente a designs
              para o <em className="font-display text-xl text-ink">nicho literário</em>.
            </p>
            <p>
              Não faço só a capa. Também crio banners, marcadores, posts para redes sociais, diagramação e tudo de
              visual que compõe a história que você quer contar para o mundo.
            </p>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-ink/15 pt-8">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-4xl font-light text-blood md:text-6xl">
                  <Counter to={s.value} prefix={s.prefix} grouping={!('year' in s)} />
                </dd>
                <dd className="mt-2 text-[11px] uppercase leading-snug tracking-[0.15em] text-ink/55 md:text-xs">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
