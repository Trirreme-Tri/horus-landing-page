import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { coverSrc, DM_URL } from '@/data'
import { Magnetic } from '@/components/ui/magnetic'
import { cn } from '@/lib/utils'

const ease = [0.16, 1, 0.3, 1] as const

type Floating = {
  slug: string
  className: string
  rotate: number
  depth: number
}

// Capas flutuando em volta do título; depth controla parallax de mouse e scroll.
const floating: Floating[] = [
  { slug: 'furia-escarlate', className: 'left-[4%] top-[9%] w-[22vw] md:top-[16%] md:w-[13vw]', rotate: -9, depth: 0.9 },
  { slug: 'apaixonada-pelo-mafioso-errado', className: 'left-[17%] top-[58%] hidden md:block md:w-[11vw]', rotate: 6, depth: 1.4 },
  { slug: 'nos-labios-do-inimigo', className: 'right-[4%] top-[8%] w-[20vw] md:top-[12%] md:w-[12vw]', rotate: 8, depth: 1.1 },
  { slug: 'senador-e-a-bailarina', className: 'right-[5%] bottom-[4%] w-[22vw] md:bottom-auto md:right-[15%] md:top-[56%] md:w-[13vw]', rotate: -6, depth: 1.6 },
  { slug: 'reinado-submerso', className: 'left-[34%] top-[6%] hidden md:block md:w-[7.5vw] blur-[1.5px] opacity-70', rotate: 4, depth: 0.4 },
  { slug: 'o-caminho-para-as-estrelas', className: 'right-[36%] bottom-[4%] hidden md:block md:w-[8vw] blur-[1px] opacity-80', rotate: -4, depth: 0.5 },
  { slug: 'coroa-escarlate', className: 'left-[6%] bottom-[5%] w-[20vw] md:hidden', rotate: 5, depth: 1.2 },
]

export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 })
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.82])
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex h-[100svh] min-h-[640px] items-center justify-center overflow-hidden"
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        mx.set(e.clientX / window.innerWidth - 0.5)
        my.set(e.clientY / window.innerHeight - 0.5)
      }}
    >
      {/* brilho vermelho de fundo */}
      <div aria-hidden className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 size-[120vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(179_0_27/0.55),rgb(74_7_16/0.35)_35%,transparent_65%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
      </div>

      {floating.map((f, i) => (
        <FloatingCover key={f.slug} item={f} index={i} ready={ready} mx={mx} my={my} scroll={scrollYProgress} />
      ))}

      <motion.div style={{ scale: titleScale, y: titleY, opacity: fade }} className="relative z-10 px-4 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease, delay: 0.5 }}
          className="mb-4 text-[10px] font-semibold uppercase tracking-mega text-bone/80 md:mb-6 md:text-xs"
        >
          Design editorial · desde 2020
        </motion.p>

        <h1 className="font-display text-[21vw] font-light leading-[0.78] tracking-[0.02em] md:text-[17vw]">
          {'HÓRUS'.split('').map((ch, i) => (
            <span key={i} className="-mt-[0.22em] inline-block overflow-hidden pt-[0.22em] align-bottom">
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

      <motion.div
        style={{ opacity: fade }}
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
    </section>
  )
}

function FloatingCover({
  item,
  index,
  ready,
  mx,
  my,
  scroll,
}: {
  item: Floating
  index: number
  ready: boolean
  mx: MotionValue<number>
  my: MotionValue<number>
  scroll: MotionValue<number>
}) {
  const x = useTransform(mx, (v) => v * 60 * item.depth)
  const yMouse = useTransform(my, (v) => v * 40 * item.depth)
  const yScroll = useTransform(scroll, [0, 1], [0, -280 * item.depth])
  const y = useTransform(() => yMouse.get() + yScroll.get())

  return (
    <motion.div style={{ x, y }} className={cn('absolute z-0', item.className)}>
      <motion.img
        src={coverSrc(item.slug)}
        alt=""
        loading="eager"
        initial={{ opacity: 0, scale: 0.6, rotate: 0, y: 80 }}
        animate={ready ? { opacity: 1, scale: 1, rotate: item.rotate, y: 0 } : {}}
        transition={{ duration: 1.4, ease, delay: 0.25 + index * 0.08 }}
        className="aspect-[2/3] w-full rounded-md object-cover shadow-[0_30px_80px_-20px_rgb(0_0_0/0.9)] ring-1 ring-white/10"
      />
    </motion.div>
  )
}
