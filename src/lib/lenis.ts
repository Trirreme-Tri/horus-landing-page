import type Lenis from 'lenis'

/** Instância global do Lenis, para componentes (ex.: o lightbox) poderem pausar o scroll. */
export const lenisRef: { current: Lenis | null } = { current: null }

export function lockScroll(locked: boolean) {
  if (locked) lenisRef.current?.stop()
  else lenisRef.current?.start()
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}
