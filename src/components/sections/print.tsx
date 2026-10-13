import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { SplitReveal } from '@/components/ui/split-reveal'
import { img, printWorks, postSrc } from '@/data'

/** Do e-book ao livro físico: capas completas empilhando no scroll. */
export function Print() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  return (
    <section className="relative bg-velvet">
      <div className="mx-auto max-w-7xl px-4 pt-24 md:px-8 md:pt-36">
        <p className="text-[10px] font-semibold uppercase tracking-mega text-bone/80 md:text-xs">Do e-book à gráfica</p>
        <h2 className="mt-6 font-display text-6xl font-light leading-[0.9] md:text-[8rem]">
          <SplitReveal text="Para segurar" />
          <span className="block font-script text-5xl text-bone md:text-8xl">nas mãos</span>
        </h2>
        <p className="mt-8 max-w-lg text-base leading-relaxed text-bone/80 md:text-lg">
          Frente, lombada, quarta capa e orelhas pensadas juntas, com o texto de contracapa diagramado e tudo pronto
          para a gráfica. Também adapto capas de e-book para o formato físico.
        </p>
      </div>

      <div ref={ref} className="relative mt-16 md:mt-24" style={{ height: `${printWorks.length * 85}vh` }}>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {printWorks.map((w, i) => (
            <StackCard key={w.src} work={w} index={i} total={printWorks.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>

      <Extras />
    </section>
  )
}

function StackCard({
  work,
  index,
  total,
  progress,
}: {
  work: (typeof printWorks)[number]
  index: number
  total: number
  progress: MotionValue<number>
}) {
  const step = 1 / total
  const start = index * step
  // cada card sobe da base; quando o próximo chega, ele encolhe e escurece ao fundo
  const y = useTransform(progress, [start - step, start], index === 0 ? ['0%', '0%'] : ['110%', '0%'])
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - index) * 0.04])
  const dim = useTransform(progress, [start, start + step], [0, index === total - 1 ? 0 : 0.5])

  return (
    <div className="absolute inset-x-4 top-1/2 mx-auto max-w-5xl -translate-y-1/2 md:inset-x-8" style={{ marginTop: index * 14 }}>
      <motion.figure style={{ y, scale }} className="origin-top">
        <div className="relative overflow-hidden rounded-xl shadow-[0_-20px_80px_-20px_rgb(0_0_0/0.7)] ring-1 ring-white/10">
          <img src={work.src} alt={`Capa completa de ${work.title}, de ${work.author}`} loading="lazy" className="w-full" />
          <motion.div style={{ opacity: dim }} className="absolute inset-0 bg-ink" />
        </div>
        <figcaption className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-bone/80">
          <span>
            <span className="font-display text-base normal-case italic tracking-normal text-bone md:text-lg">
              {work.title}
            </span>{' '}
            · {work.author}
          </span>
          <span className="hidden text-bone/60 sm:inline">{work.tag}</span>
        </figcaption>
      </motion.figure>
    </div>
  )
}

const extras = [
  { src: postSrc('DbBF5LXkbM6_2'), label: 'Marcadores', span: 'md:row-span-2' },
  { src: postSrc('Db5rHiCkbxp_2'), label: 'Chaveiros', span: '' },
  { src: img('print/banner-mattia.webp'), label: 'Banners Amazon', span: 'md:col-span-2' },
  { src: postSrc('Db5rHiCkbxp_1'), label: 'Brindes', span: '' },
  { src: postSrc('DbBF5LXkbM6_1'), label: 'Marcadores', span: 'md:row-span-2' },
  { src: img('print/banner-pre-venda.webp'), label: 'Pré-venda', span: 'md:col-span-2' },
]

/** Bento com o que vai além da capa — cada bloco entra com um leve atraso. */
function Extras() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 md:px-8 md:pb-36">
      <h3 className="mb-10 max-w-2xl font-display text-4xl font-light leading-tight md:text-6xl">
        E tudo que vem <em className="text-bone/70">além da capa.</em>
      </h3>
      <div className="grid auto-rows-[44vw] grid-cols-2 gap-3 md:auto-rows-[15vw] md:grid-cols-4 md:gap-4">
        {extras.map((e, i) => (
          <motion.figure
            key={e.src}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.08 }}
            className={`group relative overflow-hidden rounded-xl ${e.span}`}
          >
            <img
              src={e.src}
              alt={e.label}
              loading="lazy"
              className="size-full object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-110"
            />
            <figcaption className="absolute left-3 top-3 rounded-full bg-ink/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] backdrop-blur-md">
              {e.label}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  )
}
