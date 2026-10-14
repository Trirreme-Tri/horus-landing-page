import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { lockScroll } from '@/lib/scroll'
import { LightboxContext, type LightboxItem, type OpenLightbox } from './lightbox-context'

const ease = [0.16, 1, 0.3, 1] as const

/**
 * Visualizador de imagens ampliadas.
 * Fecha com Esc, clique fora ou botão; navega com ← → ou botões.
 * O foco vai para o diálogo ao abrir e volta para quem abriu ao fechar.
 */
export function LightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ items: LightboxItem[]; index: number } | null>(null)
  const opener = useRef<HTMLElement | null>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const dialog = useRef<HTMLDivElement>(null)

  const open = useCallback<OpenLightbox>((items, index) => {
    opener.current = document.activeElement as HTMLElement | null
    setState({ items, index })
  }, [])
  const close = useCallback(() => setState(null), [])
  const step = useCallback(
    (dir: 1 | -1) => setState((s) => (s ? { ...s, index: (s.index + dir + s.items.length) % s.items.length } : s)),
    [],
  )

  const isOpen = state !== null
  useEffect(() => {
    if (!isOpen) return
    lockScroll(true)
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
      else if (e.key === 'Tab') {
        // mantém o foco dentro do visualizador
        const els = dialog.current?.querySelectorAll<HTMLElement>('button')
        if (!els?.length) return
        const first = els[0]
        const last = els[els.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lockScroll(false)
      opener.current?.focus()
    }
  }, [isOpen, close, step])

  const item = state?.items[state.index]
  const many = (state?.items.length ?? 0) > 1

  return (
    <LightboxContext.Provider value={open}>
      {children}
      <AnimatePresence>
        {state && item && (
          <motion.div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-label={item.title ? `${item.title}, ampliada` : 'Imagem ampliada'}
            className="fixed inset-0 z-[97] flex items-center justify-center bg-ink/92 px-4 py-16 backdrop-blur-md md:px-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={close}
          >
            <figure className="flex max-h-full flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={item.src}
                  src={item.src}
                  alt={item.alt}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.45, ease }}
                  className="max-h-[calc(100svh-10rem)] w-auto max-w-full rounded-md object-contain shadow-[0_40px_120px_-30px_rgb(0_0_0/0.9)]"
                />
              </AnimatePresence>
              {(item.title || many) && (
                <figcaption className="mt-5 flex w-full items-baseline justify-between gap-6 text-bone/70">
                  <span>
                    {item.title && <span className="font-display text-lg italic text-bone md:text-xl">{item.title}</span>}
                    {item.author && <span className="ml-3 text-xs tracking-[0.15em] text-bone/50">{item.author}</span>}
                  </span>
                  {many && (
                    <span className="shrink-0 text-xs tabular-nums text-bone/50">
                      {state.index + 1} / {state.items.length}
                    </span>
                  )}
                </figcaption>
              )}
            </figure>

            <button
              ref={closeBtn}
              type="button"
              onClick={close}
              aria-label="Fechar"
              className="absolute right-4 top-4 flex size-12 items-center justify-center rounded-full text-2xl text-bone/80 ring-1 ring-bone/20 transition hover:bg-bone/10 hover:text-bone focus-visible:outline-2 focus-visible:outline-gold md:right-8 md:top-8"
            >
              ×
            </button>
            {many && (
              <>
                <NavButton dir={-1} onStep={step} />
                <NavButton dir={1} onStep={step} />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxContext.Provider>
  )
}

function NavButton({ dir, onStep }: { dir: 1 | -1; onStep: (d: 1 | -1) => void }) {
  return (
    <button
      type="button"
      aria-label={dir === 1 ? 'Próxima imagem' : 'Imagem anterior'}
      onClick={(e) => {
        e.stopPropagation()
        onStep(dir)
      }}
      className={`absolute bottom-4 flex size-12 items-center justify-center rounded-full text-xl text-bone/80 ring-1 ring-bone/20 transition hover:bg-bone/10 hover:text-bone focus-visible:outline-2 focus-visible:outline-gold md:top-1/2 md:bottom-auto md:-translate-y-1/2 ${
        dir === 1 ? 'right-4 md:right-8' : 'left-4 md:left-8'
      }`}
    >
      {dir === 1 ? '→' : '←'}
    </button>
  )
}
