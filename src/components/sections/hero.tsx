import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { useLightbox } from '@/components/ui/lightbox'
import { HorusMark } from '@/components/ui/logo'
import { Magnetic } from '@/components/ui/magnetic'
import { RotatingBadge } from '@/components/ui/rotating-badge'
import { coverBySlug, coverItems, DM_URL, img } from '@/data'
import { cn } from '@/lib/utils'

const ease = [0.16, 1, 0.3, 1] as const

type Floating = { slug: string; className: string; rotate: number; depth: number }

// Capas flutuando do lado direito; depth controla o parallax de mouse e scroll.
const floating: Floating[] = [
  { slug: 'furia-escarlate', className: 'right-[5%] top-[60%] w-[22vw] md:right-[3%] md:top-[12%] md:w-[10vw]', rotate: 8, depth: 1.1 },
  { slug: 'nos-labios-do-inimigo', className: 'right-[30%] top-[7%] hidden md:block md:right-[20%] md:top-[5%] md:w-[7vw] blur-[1px] opacity-80', rotate: -5, depth: 0.5 },
  { slug: 'senador-e-a-bailarina', className: 'right-[22%] bottom-[3%] w-[24vw] md:right-[4%] md:bottom-[7%] md:w-[11vw]', rotate: -6, depth: 1.5 },
  { slug: 'apaixonada-pelo-mafioso-errado', className: 'right-[26%] bottom-[3%] hidden md:block md:right-[17%] md:bottom-[4%] md:w-[8vw]', rotate: 5, depth: 0.8 },
]
const heroCovers = floating.map((f) => coverBySlug(f.slug))

export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 })
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const mascotX = useTransform(mx, (v) => v * -18)
  const mascotY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  return (
    <section
      id="top"
      ref={ref}
      className="bg-blush-glow relative h-[100svh] min-h-[680px] overflow-hidden"
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        mx.set(e.clientX / window.innerWidth - 0.5)
        my.set(e.clientY / window.innerHeight - 0.5)
      }}
    >
      {/* letreiro gigante de fundo, bem suave */}
      <motion.p
        aria-hidden
        style={{ opacity: fade }}
        className="pointer-events-none absolute -bottom-[0.18em] left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[34vw] font-light leading-none text-blood/[0.05]"
      >
        Hórus
      </motion.p>

      {floating.map((f, i) => (
        <FloatingCover key={f.slug} item={f} index={i} ready={ready} mx={mx} my={my} scroll={scrollYProgress} />
      ))}

      {/* mascote ancorada no canto inferior esquerdo: o corte da arte coincide com a borda da tela */}
      <motion.div
        style={{ x: mascotX, y: mascotY }}
        className="pointer-events-none absolute bottom-0 left-0 z-10 w-[66vw] md:h-[88%] md:w-auto"
      >
        <motion.img
          src={img('mascote.webp')}
          alt="Mascote da Hórus: uma gata egípcia de jaqueta vermelha e colar de ankh"
          initial={{ opacity: 0, y: 80 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.4, ease, delay: 0.15 }}
          className="w-full drop-shadow-[0_30px_40px_rgb(110_10_22/0.18)] md:h-full md:w-auto"
        />
      </motion.div>

      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative z-20 flex h-full flex-col items-center px-4 pt-24 text-center md:items-start md:justify-center md:pl-[41%] md:pr-[16%] md:pt-0 md:text-left"
      >
        {/* selo da marca em destaque */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -40 }}
          animate={ready ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ duration: 1.2, ease, delay: 0.3 }}
          className="relative mb-4 size-20 md:mb-6 md:size-28"
        >
          <RotatingBadge text="Hórus ✦ design editorial ✦ " className="absolute inset-0 size-full text-blood" />
          <HorusMark className="absolute inset-[22%] size-[56%] text-blood" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease, delay: 0.5 }}
          className="text-[10px] font-semibold uppercase tracking-mega text-ink/60 md:text-xs"
        >
          Design editorial · desde 2020
        </motion.p>

        <h1 className="mt-5 font-display text-[22vw] font-light leading-[0.85] tracking-[0.01em] text-blood md:mt-8 md:text-[10.5vw]">
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
          className="mt-4 max-w-md text-balance font-display text-xl italic leading-snug text-ink/80 md:mt-6 md:text-3xl"
        >
          Capas que fazem o leitor parar de rolar, e a sua história ganhar o rosto que merece.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3 md:mt-10 md:justify-start md:gap-4"
        >
          <Magnetic>
            <a
              href={DM_URL}
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-blood px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em] text-bone md:px-7 md:py-4 md:text-xs"
            >
              <span className="absolute inset-0 translate-y-full rounded-full bg-wine transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
              <span className="relative">Quero minha capa</span>
              <span className="relative transition-transform duration-500 group-hover:translate-x-1">→</span>
            </a>
          </Magnetic>
          <a
            href="#portfolio"
            className="rounded-full px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/80 ring-1 ring-ink/20 transition hover:bg-ink/5 hover:text-ink md:px-6 md:py-4 md:text-xs"
          >
            Ver portfólio
          </a>
        </motion.div>
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
  const open = useLightbox()
  const x = useTransform(mx, (v) => v * 60 * item.depth)
  const yMouse = useTransform(my, (v) => v * 40 * item.depth)
  const yScroll = useTransform(scroll, [0, 1], [0, -280 * item.depth])
  const y = useTransform(() => yMouse.get() + yScroll.get())
  const cover = heroCovers[index]

  return (
    <motion.div style={{ x, y }} className={cn('absolute z-0', item.className)}>
      <motion.img
        src={coverItems([cover])[0].src}
        alt={`Capa de ${cover.title}`}
        loading="eager"
        data-cursor="Ver"
        onClick={(e) => open(coverItems(heroCovers), index, e.currentTarget)}
        initial={{ opacity: 0, scale: 0.6, rotate: 0, y: 80 }}
        animate={ready ? { opacity: 1, scale: 1, rotate: item.rotate, y: 0 } : {}}
        whileHover={{ scale: 1.05, transition: { duration: 0.4 } }}
        transition={{ duration: 1.4, ease, delay: 0.25 + index * 0.08 }}
        className="aspect-[2/3] w-full cursor-pointer rounded-md object-cover shadow-[0_30px_60px_-20px_rgb(110_10_22/0.45)] ring-1 ring-black/5"
      />
    </motion.div>
  )
}
