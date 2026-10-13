import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Título que sobe letra a letra de dentro de uma máscara.
 * O inView é medido no wrapper: as letras escondidas pela máscara nunca "intersectam".
 */
export function SplitReveal({
  text,
  className,
  delay = 0,
  stagger = 0.035,
}: {
  text: string
  className?: string
  delay?: number
  stagger?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const words = text.split(' ')

  return (
    <span ref={ref} className={cn('inline-flex flex-wrap', className)} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="-mt-[0.2em] inline-flex overflow-hidden pb-[0.08em] pt-[0.2em]" aria-hidden>
          {word.split('').map((ch, ci) => {
            const index = words.slice(0, wi).join(' ').length + ci
            return (
              <motion.span
                key={ci}
                className="inline-block"
                initial={{ y: '115%' }}
                animate={inView ? { y: '0%' } : {}}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: delay + index * stagger }}
              >
                {ch}
              </motion.span>
            )
          })}
          {wi < words.length - 1 && <span className="inline-block w-[0.28em]" />}
        </span>
      ))}
    </span>
  )
}
