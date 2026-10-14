import { createContext, useContext } from 'react'

export type LightboxItem = { src: string; alt: string; title?: string; author?: string }

export type OpenLightbox = (items: LightboxItem[], index: number) => void

export const LightboxContext = createContext<OpenLightbox>(() => {})

/** Abre o visualizador: `const open = useLightbox(); open(itens, indice)`. */
export function useLightbox() {
  return useContext(LightboxContext)
}
