import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

/** A página lida como um livro: cada seção é um capítulo. */
const chapters = [
  { id: 'top', name: 'Abertura' },
  { id: 'sobre', name: 'A Hórus' },
  { id: 'portfolio', name: 'Portfólio' },
  { id: 'anatomia', name: 'Anatomia de uma capa' },
  { id: 'grafica', name: 'Do e-book à gráfica' },
  { id: 'servicos', name: 'Serviços' },
  { id: 'redes', name: 'Redes sociais' },
  { id: 'pacote', name: 'Pacote completo' },
  { id: 'contato', name: 'Contato' },
]

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX']

/**
 * Marcador fixo de capítulo, como o cabeçalho corrido de um livro.
 * Decorativo (aria-hidden): a navegação real continua no menu.
 * Só aparece a partir de 1360px: abaixo disso a coluna de conteúdo encosta na margem.
 */
export function ChapterMarker() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    // A seção que cruza a linha do meio da tela é o capítulo atual.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const i = chapters.findIndex((c) => c.id === e.target.id)
          if (i >= 0) setActive(i)
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    for (const c of chapters) {
      const el = document.getElementById(c.id)
      if (el) io.observe(el)
    }
    return () => io.disconnect()
  }, [])

  const chapter = chapters[active]

  return (
    // Vertical na margem esquerda, lendo de baixo para cima como a lombada de um livro:
    // fica fora da coluna de conteúdo.
    <div
      aria-hidden
      className="pointer-events-none fixed left-5 top-1/2 z-40 hidden h-72 w-6 -translate-y-1/2 rotate-180 text-bone/60 min-[1360px]:block"
    >
      <AnimatePresence initial={false}>
        <motion.p
          key={chapter.id}
          initial={{ opacity: 0, filter: 'blur(6px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex items-center gap-3 whitespace-nowrap [writing-mode:vertical-rl]"
        >
          <span className="font-display text-base tabular-nums text-gold/80">{ROMAN[active]}</span>
          <span className="h-6 w-px bg-bone/30" />
          <span className="font-display text-base italic">{chapter.name}</span>
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
