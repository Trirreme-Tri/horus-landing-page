import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useRef } from 'react'
import { coverSrc, DM_URL } from '@/data'
import { Magnetic } from '@/components/ui/magnetic'
import { cn } from '@/lib/utils'

const ease = [0.16, 1, 0.3, 1] as const

type Floating = {
  slug: string
  className: string
  rotate: number
  /** 0.4 = longe (pequena, desfocada) · 1.6 = perto. Controla parallax e o quanto a capa "passa pela câmera". */
  depth: number
  /** Para onde a capa foge quando a câmera avança, em vw/vh. */
  out: [number, number]
  /** Desfoque de lente das capas de fundo, em px. */
  blur?: number
  /** Opacidade base das capas de fundo. */
  dim?: number
}

const floating: Floating[] = [
  { slug: 'furia-escarlate', className: 'left-[4%] top-[9%] w-[22vw] md:top-[16%] md:w-[13vw]', rotate: -9, depth: 0.9, out: [-38, -30] },
  { slug: 'apaixonada-pelo-mafioso-errado', className: 'left-[17%] top-[58%] hidden md:block md:w-[11vw]', rotate: 6, depth: 1.4, out: [-40, 38] },
  { slug: 'nos-labios-do-inimigo', className: 'right-[4%] top-[8%] w-[20vw] md:top-[12%] md:w-[12vw]', rotate: 8, depth: 1.1, out: [40, -34] },
  { slug: 'senador-e-a-bailarina', className: 'right-[5%] bottom-[4%] w-[22vw] md:bottom-auto md:right-[15%] md:top-[56%] md:w-[13vw]', rotate: -6, depth: 1.6, out: [42, 40] },
  { slug: 'reinado-submerso', className: 'left-[26%] top-[4%] hidden md:block md:w-[7.5vw]', rotate: 4, depth: 0.4, out: [-14, -26], blur: 1.5, dim: 0.7 },
  { slug: 'o-caminho-para-as-estrelas', className: 'right-[36%] bottom-[4%] hidden md:block md:w-[8vw]', rotate: -4, depth: 0.5, out: [10, 30], blur: 1, dim: 0.8 },
  { slug: 'coroa-escarlate', className: 'left-[6%] bottom-[5%] w-[20vw] md:hidden', rotate: 5, depth: 1.2, out: [-30, 34] },
]

const manifesto = 'Antes de virar capa, o seu livro vira conversa: gênero, clima, personagens.'

/**
 * Hero em profundidade: preso na tela por uma tela de scroll.
 * A "câmera" avança — as capas de perto passam por você e saem, o título recua
 * e a frase-manifesto acende palavra por palavra.
 */
export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion() ?? false
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 })
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // Sem movimento: congela no início (o manifesto aparece estático abaixo do título).
  const progress = useTransform(scrollYProgress, (v) => (reduce ? 0 : v))

  const titleScale = useTransform(progress, [0, 0.55], [1, 0.7])
  const titleOpacity = useTransform(progress, [0.12, 0.45], [1, 0])
  const titleBlur = useTransform(progress, [0.1, 0.45], ['blur(0px)', 'blur(10px)'])
  const glowScale = useTransform(progress, [0, 1], [1, 1.5])
  const hintOpacity = useTransform(progress, [0, 0.08], [1, 0])

  return (
    <section id="top" ref={ref} className={cn('relative', reduce ? '' : 'h-[200svh]')}>
      <div
        className="sticky top-0 flex h-[100svh] min-h-[640px] items-center justify-center overflow-hidden"
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse') return
          mx.set(e.clientX / window.innerWidth - 0.5)
          my.set(e.clientY / window.innerHeight - 0.5)
        }}
      >
        {/* brilho vermelho de fundo, cresce conforme a câmera entra */}
        <div aria-hidden className="absolute inset-0">
          <motion.div
            style={{ scale: glowScale }}
            className="absolute left-1/2 top-1/2 size-[120vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(179_0_27/0.55),rgb(74_7_16/0.35)_35%,transparent_65%)]"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
        </div>

        {floating.map((f, i) => (
          <FloatingCover key={f.slug} item={f} index={i} ready={ready} mx={mx} my={my} progress={progress} />
        ))}

        <motion.div
          style={{ scale: titleScale, opacity: titleOpacity, filter: titleBlur }}
          className="relative z-10 px-4 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease, delay: 0.5 }}
            className="mb-4 text-[10px] font-semibold uppercase tracking-mega text-bone/80 md:mb-6 md:text-xs"
          >
            Design editorial · desde 2020
          </motion.p>

          <h1
            aria-label="Hórus Design Editorial"
            className="font-display text-[21vw] font-light leading-[0.78] tracking-[0.02em] md:text-[17vw]"
          >
            {/* letras separadas só para a animação; leitores de tela leem o aria-label */}
            {'HÓRUS'.split('').map((ch, i) => (
              <span key={i} aria-hidden className="-mt-[0.22em] inline-block overflow-hidden pt-[0.22em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: '125%' }}
                  animate={ready ? { y: '0%' } : {}}
                  transition={{ duration: 1.2, ease, delay: 0.1 + i * 0.07 }}
                >
                  {ch}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease, delay: 0.75 }}
            className="mx-auto mt-6 max-w-xl text-balance font-display text-2xl italic leading-snug text-bone/90 md:mt-8 md:text-3xl"
          >
            Capas que fazem o leitor parar de rolar, e a história que você escreveu ganhar o rosto que merece.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 md:mt-10"
          >
            <Magnetic>
              <a
                href={DM_URL}
                target="_blank"
                rel="noreferrer"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-bone px-7 py-4 text-xs font-bold uppercase tracking-[0.22em] text-ink"
              >
                <span className="absolute inset-0 translate-y-full rounded-full bg-scarlet transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
                <span className="relative transition-colors duration-500 group-hover:text-bone">Quero minha capa</span>
                <span className="relative transition-transform duration-500 group-hover:translate-x-1 group-hover:text-bone">→</span>
              </a>
            </Magnetic>
            <a
              href="#portfolio"
              className="rounded-full px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-bone/80 ring-1 ring-bone/25 transition hover:bg-bone/10 hover:text-bone"
            >
              Ver portfólio
            </a>
          </motion.div>
        </motion.div>

        {reduce ? (
          <p className="absolute inset-x-0 bottom-10 z-10 mx-auto max-w-2xl px-6 text-center font-display text-xl italic text-bone/70">
            {manifesto}
          </p>
        ) : (
          <Manifesto progress={progress} />
        )}

        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-bone/60 md:flex"
        >
          Role
          <span className="relative h-10 w-px overflow-hidden bg-bone/20">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-bone"
              animate={{ y: ['-100%', '200%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </motion.div>
      </div>
    </section>
  )
}

/** Frase que surge no lugar do título quando as capas já passaram pela câmera. */
function Manifesto({ progress }: { progress: MotionValue<number> }) {
  const words = manifesto.split(' ')
  const y = useTransform(progress, [0.4, 0.8], [40, 0])
  return (
    <motion.p
      style={{ y }}
      className="pointer-events-none absolute inset-x-0 top-1/2 z-10 mx-auto flex max-w-4xl -translate-y-1/2 flex-wrap justify-center px-6 text-center font-display text-4xl font-light leading-[1.05] md:text-7xl"
    >
      {words.map((w, i) => {
        const start = 0.42 + (i / words.length) * 0.4
        return (
          <ManifestoWord key={i} progress={progress} range={[start, start + 0.08]}>
            {w}
          </ManifestoWord>
        )
      })}
    </motion.p>
  )
}

function ManifestoWord({
  children,
  progress,
  range,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0, 1])
  const blur = useTransform(progress, range, ['blur(8px)', 'blur(0px)'])
  // "personagens." fecha a frase em script vermelho: é o que a autora traz de mais seu
  const accent = children.startsWith('personagens')
  return (
    <motion.span
      style={{ opacity, filter: blur }}
      className={cn('mr-[0.25em] inline-block', accent && 'font-script text-scarlet')}
    >
      {children}
    </motion.span>
  )
}

function FloatingCover({
  item,
  index,
  ready,
  mx,
  my,
  progress,
}: {
  item: Floating
  index: number
  ready: boolean
  mx: MotionValue<number>
  my: MotionValue<number>
  progress: MotionValue<number>
}) {
  // Quanto mais perto, mais rápido a capa cresce e foge — é isso que cria a sensação de profundidade.
  const travel = useTransform(progress, [0, 0.7], [0, 1], { clamp: true })
  const x = useTransform(() => mx.get() * 60 * item.depth + travel.get() * item.out[0] * item.depth * (window.innerWidth / 100))
  const y = useTransform(
    () => my.get() * 40 * item.depth + travel.get() * item.out[1] * item.depth * (window.innerHeight / 100),
  )
  const scale = useTransform(travel, [0, 1], [1, 1 + item.depth * 1.3])
  const opacity = useTransform(progress, [0.4, 0.72], [item.dim ?? 1, 0])
  const filter = useTransform(travel, (t) => {
    const px = (item.blur ?? 0) + t * item.depth * 6
    return px > 0.05 ? `blur(${px.toFixed(1)}px)` : 'none'
  })

  return (
    <motion.div style={{ x, y, scale, opacity, filter }} className={cn('absolute z-0', item.className)}>
      <motion.img
        src={coverSrc(item.slug)}
        alt=""
        width={600}
        height={900}
        loading="eager"
        initial={{ opacity: 0, scale: 0.6, rotate: 0, y: 80 }}
        animate={ready ? { opacity: 1, scale: 1, rotate: item.rotate, y: 0 } : {}}
        transition={{ duration: 1.4, ease, delay: 0.25 + index * 0.08 }}
        className="aspect-[2/3] w-full rounded-md object-cover shadow-[0_30px_80px_-20px_rgb(0_0_0/0.9)] ring-1 ring-white/10"
      />
    </motion.div>
  )
}
