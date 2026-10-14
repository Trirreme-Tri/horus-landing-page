import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { useCurtain } from '@/components/ui/curtain'
import { HorusMark } from '@/components/ui/logo'
import { Magnetic } from '@/components/ui/magnetic'
import { SplitReveal } from '@/components/ui/split-reveal'
import { DM_URL, INSTAGRAM_URL } from '@/data'

const YEAR = new Date().getFullYear()

export function Contact() {
  const sigRef = useRef<HTMLDivElement>(null)
  const section = useRef<HTMLElement>(null)
  const clipPath = useCurtain(section)
  const inView = useInView(sigRef, { once: true, margin: '-15%' })

  return (
    <motion.section ref={section} style={{ clipPath }} id="contato" className="relative overflow-hidden bg-velvet">
      <div className="mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 py-24 text-center md:px-8">
        <p className="text-[10px] font-semibold uppercase tracking-mega text-bone/80 md:text-xs">
          Vamos dar um rosto à sua história
        </p>
        <h2 className="mt-8 font-display font-light leading-[0.85]">
          <span className="block font-script text-6xl text-bone/90 md:text-9xl">Posso ser sua</span>
          <SplitReveal text="DESIGNER?" className="justify-center text-[13.5vw] tracking-[0.02em] md:text-[13vw]" />
        </h2>

        <div className="mt-12 flex flex-col items-center gap-6">
          <Magnetic strength={0.45}>
            <a
              href={DM_URL}
              target="_blank"
              rel="noreferrer"
              data-cursor="Vamos!"
              className="group relative flex size-40 items-center justify-center rounded-full bg-bone text-ink md:size-52"
            >
              <span className="absolute inset-0 scale-0 rounded-full bg-ink transition-transform duration-500 ease-out-expo group-hover:scale-100" />
              <span className="relative text-xs font-bold uppercase leading-relaxed tracking-[0.22em] transition-colors duration-500 group-hover:text-bone md:text-sm">
                Chamar no
                <br />
                Instagram
              </span>
            </a>
          </Magnetic>
          <p className="max-w-md text-sm leading-relaxed text-bone/75 md:text-base">
            Me conta sobre o seu livro (gênero, clima, personagens) e eu te mando um orçamento.
          </p>
        </div>
      </div>

      <footer className="relative border-t border-bone/15">
        <div ref={sigRef} className="mx-auto max-w-7xl px-4 pt-10 md:px-8">
          {/* viewBox alto o bastante para a cauda do "g" e as hastes da letra cursiva não serem cortadas */}
          <svg viewBox="0 0 1000 290" className="w-full overflow-visible" role="img" aria-label="Obrigada!">
            <motion.text
              x="50%"
              y="185"
              textAnchor="middle"
              className="font-script"
              fontSize="190"
              fill="transparent"
              stroke="var(--color-bone)"
              strokeWidth="1.2"
              initial={{ strokeDasharray: 1600, strokeDashoffset: 1600, fillOpacity: 0 }}
              animate={inView ? { strokeDashoffset: 0 } : {}}
              transition={{ duration: 3, ease: 'easeInOut' }}
            >
              Obrigada!
            </motion.text>
            <motion.text
              x="50%"
              y="185"
              textAnchor="middle"
              className="font-script"
              fontSize="190"
              fill="var(--color-bone)"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 1.2, delay: 2.2 }}
            >
              Obrigada!
            </motion.text>
          </svg>
        </div>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-[11px] uppercase tracking-[0.2em] text-bone/60 md:flex-row md:px-8">
          <span className="flex items-center gap-3">
            <HorusMark className="size-7 text-bone" />
            Hórus Design Editorial
          </span>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-bone">
            @horuseditorialdesign
          </a>
          <span>© {YEAR} · Juliana Brum</span>
        </div>
      </footer>
    </motion.section>
  )
}
