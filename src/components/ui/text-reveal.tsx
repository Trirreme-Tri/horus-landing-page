import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Text reveal por scroll (inspirado no TextReveal da Magic UI / 21st.dev):
 * cada palavra acende conforme a seção atravessa a tela.
 * Palavras entre *asteriscos* ganham destaque em itálico vermelho.
 */
export function TextReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')

  return (
    <p ref={ref} className={cn('flex flex-wrap', className)}>
      {words.map((raw, i) => {
        const accent = raw.startsWith('*')
        const word = raw.replaceAll('*', '')
        const start = i / words.length
        return (
          <Word key={i} progress={scrollYProgress} range={[start, start + 1 / words.length]} accent={accent}>
            {word}
          </Word>
        )
      })}
    </p>
  )
}

function Word({
  children,
  progress,
  range,
  accent,
}: {
  children: ReactNode
  progress: MotionValue<number>
  range: [number, number]
  accent: boolean
}) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <span className="relative mr-[0.25em] mt-[0.1em]">
      <motion.span style={{ opacity }} className={cn(accent && 'font-display italic text-scarlet')}>
        {children}
      </motion.span>
    </span>
  )
}
