import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import { SplitReveal } from '@/components/ui/split-reveal'
import { TiltCard } from '@/components/ui/tilt-card'
import { coverSrc, covers, type Cover } from '@/data'

const featured = covers.slice(0, 12)
const more = covers.slice(12)

export function Portfolio() {
  return (
    <section id="portfolio" className="relative">
      <HorizontalGallery />
      <ParallaxColumns />
    </section>
  )
}

/** Galeria horizontal presa na tela: o scroll vertical empurra as capas para o lado. */
function HorizontalGallery() {
  const target = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)

  useLayoutEffect(() => {
    const el = track.current
    if (!el) return
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div ref={target} style={{ height: `calc(100vh + ${distance}px)` }} className="relative">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-8 flex w-full max-w-7xl items-end justify-between gap-6 px-4 md:mb-12 md:px-8">
          <h2 className="font-display text-6xl font-light leading-[0.85] md:text-[7rem]">
            <SplitReveal text="Capas" />
            <span className="block pl-[0.6em] font-script text-5xl text-scarlet md:text-7xl">que vendem</span>
          </h2>
          <p className="hidden max-w-xs pb-4 text-sm leading-relaxed text-bone/60 md:block">
            Romance, máfia, fantasia, hot, esporte. Cada capa é pensada para o leitor do gênero, que decide em um
            segundo se vai clicar.
          </p>
        </div>

        <motion.div ref={track} style={{ x }} className="flex w-max gap-5 px-4 md:gap-8 md:px-8">
          {featured.map((c, i) => (
            <CoverCard key={c.slug} cover={c} index={i} progress={scrollYProgress} />
          ))}
          <a
            href="#mais-capas"
            className="flex aspect-[2/3] w-[min(62vw,36svh)] shrink-0 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-bone/25 text-center md:w-[min(22vw,36svh)]"
          >
            <span className="font-display text-5xl font-light md:text-6xl">+3.000</span>
            <span className="text-xs uppercase tracking-[0.25em] text-bone/60">trabalhos entregues</span>
          </a>
        </motion.div>

        <div className="mx-auto mt-8 h-px w-full max-w-7xl px-4 md:mt-12 md:px-8">
          <div className="h-px w-full bg-bone/15">
            <motion.div style={{ width: bar }} className="h-px bg-scarlet" />
          </div>
        </div>
      </div>
    </div>
  )
}

function CoverCard({ cover, index, progress }: { cover: Cover; index: number; progress: MotionValue<number> }) {
  // leve ondulação vertical: as capas não andam todas na mesma linha
  const y = useTransform(progress, [0, 1], [index % 2 ? 30 : -30, index % 2 ? -30 : 30])
  return (
    <motion.figure style={{ y }} className="w-[min(62vw,36svh)] shrink-0 md:w-[min(22vw,36svh)]" data-cursor="Ver">
      <TiltCard className="overflow-hidden rounded-lg shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)]">
        <img
          src={coverSrc(cover.slug)}
          alt={`Capa de ${cover.title}, de ${cover.author}`}
          loading="lazy"
          className="aspect-[2/3] w-full object-cover"
        />
      </TiltCard>
      <figcaption className="mt-4 flex items-baseline justify-between gap-3">
        <span className="font-display text-lg italic md:text-xl">{cover.title}</span>
        <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-bone/50">{cover.author}</span>
      </figcaption>
    </motion.figure>
  )
}

/** Colunas que correm em velocidades diferentes (4 no desktop, 2 no celular). */
function ParallaxColumns() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const speeds = [
    useTransform(scrollYProgress, [0, 1], ['0%', '-18%']),
    useTransform(scrollYProgress, [0, 1], ['-12%', '8%']),
    useTransform(scrollYProgress, [0, 1], ['4%', '-26%']),
    useTransform(scrollYProgress, [0, 1], ['-6%', '6%']),
  ]
  const split = (n: number) => Array.from({ length: n }, (_, k) => more.filter((_, i) => i % n === k))

  return (
    <div id="mais-capas" ref={ref} className="relative mx-auto max-w-7xl overflow-hidden px-4 py-24 md:px-8 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-ink to-transparent" />
      <Columns columns={split(2)} speeds={speeds} className="grid-cols-2 md:hidden" />
      <Columns columns={split(4)} speeds={speeds} className="hidden md:grid md:grid-cols-4" />
    </div>
  )
}

function Columns({
  columns,
  speeds,
  className,
}: {
  columns: Cover[][]
  speeds: MotionValue<string>[]
  className: string
}) {
  return (
    <div className={`grid gap-4 md:gap-8 ${className}`}>
      {columns.map((col, k) => (
        <motion.div key={k} style={{ y: speeds[k] }} className="flex flex-col gap-4 md:gap-8">
          {col.map((c) => (
            <figure key={c.slug} className="group relative overflow-hidden rounded-lg" data-cursor="Ver">
              <img
                src={coverSrc(c.slug)}
                alt={`Capa de ${c.title}, de ${c.author}`}
                loading="lazy"
                className="aspect-[2/3] w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-ink/95 to-transparent p-4 pt-12 transition-transform duration-500 ease-out-expo group-hover:translate-y-0">
                <span className="block font-display text-lg italic">{c.title}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-bone/60">{c.author}</span>
              </figcaption>
            </figure>
          ))}
        </motion.div>
      ))}
    </div>
  )
}
