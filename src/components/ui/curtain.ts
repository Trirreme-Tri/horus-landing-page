import { useReducedMotion, useScroll, useTransform } from 'motion/react'
import type { RefObject } from 'react'

/**
 * Cortina de entrada: a seção nasce como um painel com cantos arredondados e margens,
 * e abre até a tela cheia enquanto o topo dela sobe da base até o alto da tela.
 * Devolve o valor para `style={{ clipPath }}`. Com menos movimento, a seção já entra aberta.
 */
export function useCurtain(ref: RefObject<HTMLElement | null>) {
  const reduce = useReducedMotion() ?? false
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] })
  return useTransform(scrollYProgress, (v) => {
    if (reduce) return 'none'
    const t = 1 - Math.min(1, Math.max(0, v))
    const side = (t * 6).toFixed(2)
    const top = (t * 10).toFixed(2)
    const radius = (t * 48).toFixed(1)
    return `inset(${top}% ${side}% 0% ${side}% round ${radius}px)`
  })
}
