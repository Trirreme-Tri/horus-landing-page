import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { HorusMark } from '@/components/ui/logo'
import { anatomyBook, anatomyStages, coverSrc } from '@/data'
import { cn } from '@/lib/utils'

const STAGES = anatomyStages.length
/** Progresso em que o livro "fica pronto" quando o visitante pede menos movimento. */
const STATIC_PROGRESS = 0.7

/**
 * Anatomia de uma capa: capítulo preso na tela por 3 telas de scroll.
 * Uma capa real passa por rascunho → cor → acabamento e, no fim, o livro gira
 * mostrando a lombada. As guias douradas são as marcas de gráfica (corte, sangria, margem).
 */
export function Anatomy() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion() ?? false
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useTransform(scrollYProgress, (v) => (reduce ? STATIC_PROGRESS : v))

  return (
    <section ref={ref} id="anatomia" aria-labelledby="anatomia-title" className={cn('relative', !reduce && 'h-[400svh]')}>
      <div
        className={cn(
          'mx-auto grid max-w-7xl items-center gap-8 px-4 md:grid-cols-[1fr_1.1fr] md:gap-16 md:px-8',
          reduce ? 'py-24 md:py-36' : 'sticky top-0 h-[100svh] content-center',
        )}
      >
        <div className="relative z-10">
          <h2 id="anatomia-title" className="font-display text-5xl font-light leading-[0.9] md:text-[6.5rem]">
            Anatomia
            <span className="block pl-[0.5em] font-script text-4xl text-scarlet md:text-7xl">de uma capa</span>
          </h2>

          <div className="mt-8 flex gap-6 md:mt-14">
            <Rail progress={p} />
            <ol className={cn('relative flex-1', reduce ? 'space-y-6' : 'min-h-[9.5rem] md:min-h-[11rem]')}>
              {anatomyStages.map((s, i) => (
                <Stage key={s.name} index={i} progress={p} stacked={reduce} name={s.name} text={s.text} />
              ))}
            </ol>
          </div>
        </div>

        <Book progress={p} />
      </div>
    </section>
  )
}

/** Trilho vertical com uma marca por etapa: mostra quanto do capítulo já passou. */
function Rail({ progress }: { progress: MotionValue<number> }) {
  const fill = useTransform(progress, [0, 1], [0, 1])
  return (
    <div aria-hidden className="relative w-px shrink-0 bg-bone/15">
      <motion.div style={{ scaleY: fill }} className="absolute inset-0 origin-top bg-gold" />
      {anatomyStages.map((_, i) => (
        <span
          key={i}
          className="absolute -left-[3px] size-[7px] rounded-full bg-ink ring-1 ring-gold"
          style={{ top: `${(i / (STAGES - 1)) * 100}%` }}
        />
      ))}
    </div>
  )
}

function Stage({
  index,
  progress,
  stacked,
  name,
  text,
}: {
  index: number
  progress: MotionValue<number>
  stacked: boolean
  name: string
  text: string
}) {
  const step = 1 / STAGES
  const a = index * step
  const b = a + step
  // Cada etapa acende na sua faixa do scroll; a primeira já começa acesa e a última não apaga.
  const input = [a - 0.04, a + 0.02, b - 0.02, b + 0.04]
  const output = [index === 0 ? 1 : 0, 1, 1, index === STAGES - 1 ? 1 : 0]
  const opacity = useTransform(progress, input, output)
  const y = useTransform(progress, input, [index === 0 ? 0 : 24, 0, 0, index === STAGES - 1 ? 0 : -24])

  return (
    <motion.li style={stacked ? undefined : { opacity, y }} className={stacked ? '' : 'absolute inset-x-0 top-0'}>
      <p className="font-display text-2xl italic text-gold md:text-3xl">
        <span className="mr-3 not-italic tabular-nums text-bone/40">{toRoman(index + 1)}.</span>
        {name}
      </p>
      <p className="mt-3 max-w-md text-base leading-relaxed text-bone/75 md:text-lg">{text}</p>
    </motion.li>
  )
}

function toRoman(n: number) {
  return ['I', 'II', 'III', 'IV', 'V', 'VI'][n - 1] ?? String(n)
}

/** O livro 3D. Medidas em CSS vars: --w (largura da capa) e --t (espessura). */
function Book({ progress }: { progress: MotionValue<number> }) {
  // I rascunho → II cor → III acabamento → IV volume
  const grayscale = useTransform(progress, [0.2, 0.42], [1, 0])
  const blur = useTransform(progress, [0, 0.25, 0.5, 0.62], [7, 5, 2, 0])
  const contrast = useTransform(progress, [0.2, 0.42], [0.75, 1])
  const imgFilter = useTransform(
    () => `grayscale(${grayscale.get()}) contrast(${contrast.get()}) blur(${blur.get().toFixed(2)}px)`,
  )
  const guides = useTransform(progress, [0.5, 0.66], [1, 0])
  const glareX = useTransform(progress, [0.52, 0.74], ['-120%', '120%'])

  const rotateY = useTransform(progress, [0, 0.72, 0.95], [-16, -16, 52])
  const rotateX = useTransform(progress, [0, 0.72, 0.95], [6, 6, 2])
  const lift = useTransform(progress, [0.72, 0.95], [1, 1.06])
  const shadow = useTransform(progress, [0.72, 0.95], [0.55, 0.8])

  return (
    <div
      aria-label={`${anatomyBook.title}, de ${anatomyBook.author}: a capa passando por rascunho, cor, acabamento e virando livro`}
      role="img"
      className="relative mx-auto flex items-center justify-center [--t:calc(var(--w)*0.12)] [--w:min(48vw,30svh)] [perspective:1800px] md:[--w:min(26vw,42svh)]"
    >
      {/* sombra no chão */}
      <motion.div
        aria-hidden
        style={{ opacity: shadow }}
        className="absolute top-[96%] h-10 w-[calc(var(--w)*1.3)] rounded-[50%] bg-black blur-2xl"
      />

      <motion.div
        style={{ rotateY, rotateX, scale: lift, transformStyle: 'preserve-3d' }}
        className="relative aspect-[2/3] w-[var(--w)]"
      >
        {/* frente */}
        <div className="absolute inset-0 [transform:translateZ(calc(var(--t)/2))]">
          <div className="absolute inset-0 overflow-hidden rounded-r-[3px] rounded-l-[1px] bg-wine">
            <motion.img
              src={coverSrc(anatomyBook.slug)}
              alt=""
              width={600}
              height={900}
              loading="lazy"
              style={{ filter: imgFilter }}
              className="size-full object-cover"
            />
            {/* dobra da capa junto à lombada */}
            <div className="absolute inset-y-0 left-0 w-[6%] bg-gradient-to-r from-black/45 via-white/10 to-transparent" />
            {/* reflexo que atravessa a capa no acabamento */}
            <motion.div
              style={{ x: glareX }}
              className="absolute inset-0 bg-[linear-gradient(105deg,transparent_35%,rgb(255_255_255/0.32)_50%,transparent_65%)] mix-blend-soft-light"
            />
          </div>
          <motion.div style={{ opacity: guides }} className="pointer-events-none">
            <PrintMarks />
          </motion.div>
        </div>

        {/* quarta capa */}
        <div className="absolute inset-0 overflow-hidden rounded-l-[3px] bg-wine [transform:rotateY(180deg)_translateZ(calc(var(--t)/2))]">
          <img src={coverSrc(anatomyBook.slug)} alt="" loading="lazy" className="size-full scale-125 object-cover opacity-50 blur-md" />
          <HorusMark className="absolute bottom-[8%] left-1/2 size-[14%] -translate-x-1/2 text-bone/80" />
        </div>

        {/* lombada */}
        <div className="absolute left-1/2 top-0 flex h-full w-[var(--t)] -translate-x-1/2 items-center justify-center bg-[linear-gradient(90deg,#2a0409,#5a0a14_45%,#2a0409)] [transform:rotateY(-90deg)_translateZ(calc(var(--w)/2))]">
          <span className="whitespace-nowrap font-display text-[calc(var(--t)*0.42)] tracking-[0.18em] text-gold [writing-mode:vertical-rl]">
            {anatomyBook.title.toUpperCase()} · {anatomyBook.author}
          </span>
        </div>

        {/* páginas (lado oposto à lombada) */}
        <div className="absolute left-1/2 top-[1.2%] h-[97.6%] w-[calc(var(--t)*0.94)] -translate-x-1/2 bg-[repeating-linear-gradient(90deg,#efe4d4_0,#efe4d4_1px,#d9ccb8_1px,#d9ccb8_2px)] [transform:rotateY(90deg)_translateZ(calc(var(--w)/2-1px))]" />

        {/* cabeça e pé do miolo */}
        <div className="absolute left-0 top-0 h-[var(--t)] w-[98%] -translate-y-1/2 bg-[repeating-linear-gradient(0deg,#efe4d4_0,#efe4d4_1px,#d9ccb8_1px,#d9ccb8_2px)] [transform:rotateX(90deg)]" />
        <div className="absolute bottom-0 left-0 h-[var(--t)] w-[98%] translate-y-1/2 bg-[#d9ccb8] [transform:rotateX(-90deg)]" />
      </motion.div>
    </div>
  )
}

/**
 * Marcas de gráfica desenhadas em volta da capa: marcas de corte nos cantos,
 * linha de sangria tracejada, margem de segurança e terços da composição.
 * O SVG ocupa a capa + 10% de folga de cada lado (por isso os insets assimétricos).
 */
function PrintMarks() {
  const stroke = { stroke: 'var(--color-gold)', vectorEffect: 'non-scaling-stroke' as const, fill: 'none' }
  return (
    <svg
      viewBox="0 0 120 170"
      preserveAspectRatio="none"
      className="absolute -left-[10%] -right-[10%] -top-[6.667%] -bottom-[6.667%] size-auto overflow-visible"
      style={{ width: '120%', height: '113.333%' }}
    >
      {/* corte */}
      {[
        [10, 10, -1, -1],
        [110, 10, 1, -1],
        [10, 160, -1, 1],
        [110, 160, 1, 1],
      ].map(([x, y, dx, dy], i) => (
        <g key={i} {...stroke} strokeWidth={1}>
          <line x1={x + dx * 2} y1={y} x2={x + dx * 9} y2={y} />
          <line x1={x} y1={y + dy * 2} x2={x} y2={y + dy * 9} />
        </g>
      ))}
      {/* sangria */}
      <rect x={7} y={7} width={106} height={156} {...stroke} strokeWidth={0.8} strokeDasharray="3 3" opacity={0.7} />
      {/* margem de segurança */}
      <rect x={16} y={16} width={88} height={138} {...stroke} strokeWidth={0.6} opacity={0.55} />
      {/* terços */}
      <g {...stroke} strokeWidth={0.5} opacity={0.4}>
        <line x1={10 + 100 / 3} y1={10} x2={10 + 100 / 3} y2={160} />
        <line x1={10 + 200 / 3} y1={10} x2={10 + 200 / 3} y2={160} />
        <line x1={10} y1={60} x2={110} y2={60} />
        <line x1={10} y1={110} x2={110} y2={110} />
      </g>
      {/* registro */}
      <g {...stroke} strokeWidth={0.8}>
        <circle cx={60} cy={3.5} r={2.2} />
        <line x1={56} y1={3.5} x2={64} y2={3.5} />
        <line x1={60} y1={-0.5} x2={60} y2={7.5} />
      </g>
    </svg>
  )
}
