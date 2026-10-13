import { cn } from '@/lib/utils'

/** Monograma "H" com o Olho de Hórus no centro, redesenhado a partir do selo dos posts. */
export function HorusMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn('size-10', className)} aria-hidden>
      <circle cx="32" cy="32" r="31" fill="currentColor" />
      <g stroke="var(--color-ink)" fill="none" strokeLinecap="round">
        <path d="M19 15h9M36 15h9M19 49h9M36 49h9" strokeWidth="2.4" />
        <path d="M23.5 15v34M40.5 15v34" strokeWidth="3.4" />
        <path d="M23.5 26h17" strokeWidth="1.6" />
        <path d="M26 33c3-3.4 9-3.4 12 0-3 3.4-9 3.4-12 0z" strokeWidth="1.5" />
        <circle cx="32" cy="33" r="1.7" fill="var(--color-ink)" stroke="none" />
        <path d="M32 36.5v4.5c0 2-2 2.6-3 1.4M33.5 36.2l3 5" strokeWidth="1.4" />
      </g>
    </svg>
  )
}
