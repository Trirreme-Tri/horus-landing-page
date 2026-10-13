import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'motion/react'
import { useRef, type ReactNode } from 'react'

/**
 * Marquee que reage à velocidade do scroll (padrão "Scroll Velocity" do 21st.dev):
 * acelera, inverte o sentido e inclina quando a página corre.
 */
export function VelocityMarquee({ children, baseVelocity = 3 }: { children: ReactNode; baseVelocity?: number }) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false })
  const skew = useTransform(smoothVelocity, [-2000, 2000], [8, -8])
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`)
  const direction = useRef(1)

  useAnimationFrame((_, delta) => {
    let moveBy = direction.current * baseVelocity * (delta / 1000)
    if (velocityFactor.get() < 0) direction.current = -1
    else if (velocityFactor.get() > 0) direction.current = 1
    moveBy += direction.current * moveBy * velocityFactor.get()
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div className="flex shrink-0 flex-nowrap" style={{ x, skewX: skew }}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="flex shrink-0 items-center" aria-hidden={i > 0}>
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
