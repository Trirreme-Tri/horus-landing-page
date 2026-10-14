import { AnimatePresence, motion, type PanInfo } from 'motion/react'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { lockScroll } from '@/lib/lenis'

export type LightboxItem = { src: string; title: string; subtitle?: string }

type Rect = { top: number; left: number; width: number; height: number }
type OpenState = { items: LightboxItem[]; index: number; origin: HTMLElement | null; originRect: Rect }

const LightboxContext = createContext<(items: LightboxItem[], index: number, origin: HTMLElement) => void>(() => {})

/** Abre o lightbox a partir de qualquer imagem: `open(lista, índice, elementoClicado)`. */
export const useLightbox = () => useContext(LightboxContext)

const ease = [0.16, 1, 0.3, 1] as const

const toRect = (el: HTMLElement): Rect => {
  const r = el.getBoundingClientRect()
  return { top: r.top, left: r.left, width: r.width, height: r.height }
}

/** Calcula o maior retângulo centralizado para a imagem, deixando espaço para a legenda. */
function fitRect(aspect: number): Rect {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const maxW = vw - (vw < 768 ? 32 : 200)
  const maxH = vh - (vw < 768 ? 190 : 200)
  let width = maxW
  let height = width / aspect
  if (height > maxH) {
    height = maxH
    width = height * aspect
  }
  return { width, height, left: (vw - width) / 2, top: (vh - height) / 2 - 24 }
}

/**
 * Lightbox com zoom "FLIP": a imagem sai exatamente de onde foi clicada, cresce até
 * o centro da tela e, ao fechar, volta para o lugar. Clique na imagem aberta para
 * dar zoom (a lupa acompanha o mouse); setas/teclado/arrastar navegam entre capas.
 */
export function LightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OpenState | null>(null)

  const open = useCallback((items: LightboxItem[], index: number, origin: HTMLElement) => {
    setState({ items, index, origin, originRect: toRect(origin) })
  }, [])

  return (
    <LightboxContext.Provider value={open}>
      {children}
      <AnimatePresence>{state && <Lightbox key="lightbox" state={state} setState={setState} />}</AnimatePresence>
    </LightboxContext.Provider>
  )
}

function Lightbox({
  state,
  setState,
}: {
  state: OpenState
  setState: (fn: (s: OpenState | null) => OpenState | null) => void
}) {
  const { items, index, originRect } = state
  const item = items[index]
  const aspect = originRect.width / originRect.height
  const [target, setTarget] = useState(() => fitRect(aspect))
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)
  // a primeira imagem faz o voo a partir da origem; depois da navegação só faz crossfade
  const [navigated, setNavigated] = useState(false)
  const closeBtn = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => setState(() => null), [setState])
  const go = useCallback(
    (dir: 1 | -1) => {
      setNavigated(true)
      setZoom(null)
      setState((s) => s && { ...s, index: (s.index + dir + s.items.length) % s.items.length, origin: null })
    },
    [setState],
  )

  useEffect(() => {
    lockScroll(true)
    closeBtn.current?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    const onResize = () => setTarget(fitRect(aspect))
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      lockScroll(false)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [aspect, close, go])

  // ao fechar, volta para a posição atual do elemento de origem (se ainda for a mesma capa)
  const exitRect = state.origin && state.origin.isConnected ? toRect(state.origin) : null

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -80) go(1)
    else if (info.offset.x > 80) go(-1)
    else if (info.offset.y > 120) close()
  }

  const counter = useMemo(
    () => `${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`,
    [index, items.length],
  )

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[80]"
      initial="closed"
      animate="open"
      exit="closed"
    >
      <motion.div
        className="absolute inset-0 bg-ink/80 backdrop-blur-md"
        variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
        transition={{ duration: 0.5 }}
        onClick={close}
      />

      <AnimatePresence initial={false} mode="popLayout" propagate>
        <motion.div
          key={item.src}
          className="fixed overflow-hidden rounded-lg shadow-[0_40px_120px_-20px_rgb(0_0_0/0.6)]"
          style={{ cursor: zoom ? 'zoom-out' : 'zoom-in' }}
          initial={navigated ? { ...target, opacity: 0, x: 40 } : { ...originRect, opacity: 1, x: 0 }}
          animate={{ ...target, opacity: 1, x: 0 }}
          exit={
            exitRect && !navigated
              ? { ...exitRect, opacity: 1, x: 0, transition: { duration: 0.55, ease } }
              : { opacity: 0, x: -40, transition: { duration: 0.3 } }
          }
          transition={{ duration: 0.7, ease }}
          drag={!zoom}
          dragSnapToOrigin
          dragElastic={0.2}
          onDragEnd={onDragEnd}
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            setZoom((z) => (z ? null : { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }))
          }}
          onPointerMove={(e) => {
            if (!zoom || e.pointerType !== 'mouse') return
            const r = e.currentTarget.getBoundingClientRect()
            setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
          }}
        >
          <motion.img
            src={item.src}
            alt={item.subtitle ? `${item.title}, ${item.subtitle}` : item.title}
            draggable={false}
            className="size-full object-cover"
            animate={{ scale: zoom ? 2.2 : 1 }}
            style={{ transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : '50% 50%' }}
            transition={{ duration: 0.5, ease }}
          />
        </motion.div>
      </AnimatePresence>

      {/* legenda */}
      <motion.div
        className="pointer-events-none fixed inset-x-0 bottom-6 flex flex-col items-center gap-1 px-4 text-center text-bone md:bottom-8"
        variants={{ closed: { opacity: 0, y: 20 }, open: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={item.src}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <p className="font-display text-2xl italic md:text-3xl">{item.title}</p>
            {item.subtitle && <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-bone/70">{item.subtitle}</p>}
          </motion.div>
        </AnimatePresence>
        <p className="mt-2 text-[10px] tabular-nums tracking-[0.3em] text-bone/50">{counter}</p>
      </motion.div>

      {/* controles */}
      <motion.div
        variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <button
          ref={closeBtn}
          onClick={close}
          aria-label="Fechar"
          className="fixed right-4 top-4 flex size-12 items-center justify-center rounded-full bg-bone/10 text-2xl text-bone ring-1 ring-bone/25 backdrop-blur transition hover:bg-bone hover:text-ink md:right-8 md:top-8"
        >
          ×
        </button>
        {items.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Capa anterior"
              className="fixed left-3 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-bone/10 text-bone ring-1 ring-bone/25 backdrop-blur transition hover:bg-bone hover:text-ink md:flex md:left-8"
            >
              ←
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Próxima capa"
              className="fixed right-3 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-bone/10 text-bone ring-1 ring-bone/25 backdrop-blur transition hover:bg-bone hover:text-ink md:flex md:right-8"
            >
              →
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
