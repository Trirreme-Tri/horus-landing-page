import type Lenis from 'lenis'

/**
 * Referência ao scroll suave (Lenis) criado no App, para que overlays
 * (como o visualizador de imagens) possam pausar a rolagem da página.
 */
let current: Lenis | null = null

export function setLenis(lenis: Lenis | null) {
  current = lenis
}

/** Trava ou libera a rolagem da página (com ou sem Lenis ativo). */
export function lockScroll(locked: boolean) {
  if (locked) current?.stop()
  else current?.start()
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}
