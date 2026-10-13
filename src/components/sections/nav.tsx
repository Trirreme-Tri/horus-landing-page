import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useState } from 'react'
import { HorusMark } from '@/components/ui/logo'
import { DM_URL } from '@/data'

const links = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#portfolio', label: 'Portfólio' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#contato', label: 'Contato' },
]

export function Nav({ ready }: { ready: boolean }) {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 400)
    setSolid(y > 60)
  })

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: ready && !hidden ? 0 : -100 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8"
    >
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-3 py-2 transition-colors duration-500 md:px-4 ${
          solid ? 'bg-ink/70 ring-1 ring-bone/10 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <a href="#top" className="flex items-center gap-3" aria-label="Hórus Design Editorial — início">
          <HorusMark className="size-9 text-bone" />
          <span className="hidden text-[11px] font-semibold uppercase tracking-[0.35em] sm:block">Hórus</span>
        </a>
        <ul className="hidden items-center gap-8 text-xs font-medium uppercase tracking-[0.2em] text-bone/70 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="group relative py-1 transition-colors hover:text-bone">
                {l.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-scarlet transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>
        <a
          href={DM_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-blood px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-bone transition-colors hover:bg-scarlet"
        >
          Orçamento
        </a>
      </nav>
    </motion.header>
  )
}
