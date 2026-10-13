import { animate, useInView, useMotionValue, useTransform, motion } from 'motion/react'
import { useEffect, useRef } from 'react'

/** Número que conta até o valor quando entra na tela. */
export function Counter({
  to,
  prefix = '',
  duration = 2.2,
  grouping = true,
}: {
  to: number
  prefix?: string
  duration?: number
  grouping?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })
  const value = useMotionValue(0)
  const format = (v: number) => prefix + Math.round(v).toLocaleString('pt-BR', { useGrouping: grouping })
  const text = useTransform(value, format)

  useEffect(() => {
    if (!inView) return
    const controls = animate(value, to, { duration, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [inView, to, duration, value])

  return (
    <motion.span ref={ref} aria-label={format(to)}>
      {text}
    </motion.span>
  )
}
