import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'

/**
 * Cursor customizado: um ponto que segue o mouse e vira um selo com texto
 * sobre elementos marcados com data-cursor="Texto". Só aparece com mouse.
 */
export function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })
  const [label, setLabel] = useState<string | null>(null)
  const [enabled] = useState(() => window.matchMedia('(pointer: fine)').matches)

  useEffect(() => {
    if (!enabled) return
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor]')
      setLabel(target?.dataset.cursor ?? null)
    }
    // ao clicar (ex.: abrir o lightbox) o elemento sob o cursor muda sem pointermove
    const clear = () => setLabel(null)
    window.addEventListener('pointermove', move)
    window.addEventListener('click', clear)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('click', clear)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[95] -translate-x-1/2 -translate-y-1/2"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full bg-blood text-bone"
        animate={{ width: label ? 96 : 10, height: label ? 96 : 10 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="text-[11px] font-bold uppercase tracking-[0.2em]"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
