import Lenis from 'lenis'
import { AnimatePresence, MotionConfig } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { About } from '@/components/sections/about'
import { Contact } from '@/components/sections/contact'
import { Hero } from '@/components/sections/hero'
import { Marquee } from '@/components/sections/marquee'
import { Nav } from '@/components/sections/nav'
import { PackageOffer } from '@/components/sections/package-offer'
import { Portfolio } from '@/components/sections/portfolio'
import { Print } from '@/components/sections/print'
import { Services } from '@/components/sections/services'
import { Social } from '@/components/sections/social'
import { Cursor } from '@/components/ui/cursor'
import { Grain } from '@/components/ui/grain'
import { Preloader } from '@/components/ui/preloader'

export default function App() {
  const [ready, setReady] = useState(false)
  const done = useCallback(() => setReady(true), [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.09, anchors: true })
    if (!ready) lenis.stop()
    else lenis.start()
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    })
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [ready])

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{!ready && <Preloader onDone={done} />}</AnimatePresence>
      <Grain />
      <Cursor />
      <Nav ready={ready} />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <About />
        <Portfolio />
        <Print />
        <Services />
        <Social />
        <PackageOffer />
        <Contact />
      </main>
    </MotionConfig>
  )
}
