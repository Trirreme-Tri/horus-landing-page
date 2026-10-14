import Lenis from 'lenis'
import { AnimatePresence, MotionConfig } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { About } from '@/components/sections/about'
import { Anatomy } from '@/components/sections/anatomy'
import { Contact } from '@/components/sections/contact'
import { Hero } from '@/components/sections/hero'
import { Marquee } from '@/components/sections/marquee'
import { Nav } from '@/components/sections/nav'
import { PackageOffer } from '@/components/sections/package-offer'
import { Portfolio } from '@/components/sections/portfolio'
import { Print } from '@/components/sections/print'
import { Services } from '@/components/sections/services'
import { Social } from '@/components/sections/social'
import { ChapterMarker } from '@/components/ui/chapter-marker'
import { Cursor } from '@/components/ui/cursor'
import { Grain } from '@/components/ui/grain'
import { LightboxProvider } from '@/components/ui/lightbox'
import { Preloader } from '@/components/ui/preloader'
import { setLenis } from '@/lib/scroll'

export default function App() {
  // Quem pediu menos movimento ao sistema não espera os 2s da abertura.
  const [ready, setReady] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const done = useCallback(() => setReady(true), [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.09, anchors: true })
    if (!ready) lenis.stop()
    else lenis.start()
    setLenis(lenis)
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    })
    return () => {
      cancelAnimationFrame(raf)
      setLenis(null)
      lenis.destroy()
    }
  }, [ready])

  return (
    <MotionConfig reducedMotion="user">
      <LightboxProvider>
      <AnimatePresence>{!ready && <Preloader onDone={done} />}</AnimatePresence>
      <Grain />
      <Cursor />
      <ChapterMarker />
      <Nav ready={ready} />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <About />
        <Portfolio />
        <Anatomy />
        <Print />
        <Services />
        <Social />
        <PackageOffer />
        <Contact />
      </main>
      </LightboxProvider>
    </MotionConfig>
  )
}
