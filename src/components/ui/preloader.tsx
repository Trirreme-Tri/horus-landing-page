import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'

const ease = [0.76, 0, 0.24, 1] as const

/** Abertura: contador 0→100 e cortina vermelha que sobe revelando o site. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => String(Math.round(v)).padStart(3, '0'))

  useEffect(() => {
    const controls = animate(count, 100, { duration: 1.8, ease: [0.65, 0, 0.35, 1] })
    const t = setTimeout(onDone, 2000)
    return () => {
      controls.stop()
      clearTimeout(t)
    }
  }, [count, onDone])

  return (
    <motion.div
      className="bg-velvet fixed inset-0 z-[100] flex flex-col justify-between p-6 md:p-10"
      initial={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 1.1, ease } }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-mega text-bone/80 md:text-xs">Portfólio Hórus</p>
      <div className="overflow-hidden">
        <motion.h1
          className="font-display text-[22vw] font-light leading-[0.8] tracking-[0.04em] text-bone md:text-[16vw]"
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-30%', opacity: 0, transition: { duration: 0.8, ease } }}
          transition={{ duration: 1.1, ease }}
        >
          HÓRUS
        </motion.h1>
      </div>
      <div className="flex items-end justify-between text-bone/80">
        <p className="max-w-[16ch] text-xs uppercase tracking-[0.3em]">Design editorial desde 2020</p>
        <motion.span className="font-display text-6xl font-light tabular-nums md:text-8xl">{rounded}</motion.span>
      </div>
    </motion.div>
  )
}
