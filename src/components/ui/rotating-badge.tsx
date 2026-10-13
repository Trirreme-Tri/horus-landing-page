import { cn } from '@/lib/utils'

/** Texto circular girando — selo editorial em volta do retrato. */
export function RotatingBadge({ text, className }: { text: string; className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={cn('animate-spin-slow', className)} aria-hidden>
      <defs>
        <path id="badge-circle" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
      </defs>
      <text className="fill-current font-sans text-[13px] font-semibold uppercase" letterSpacing="5.2">
        <textPath href="#badge-circle">{text}</textPath>
      </text>
    </svg>
  )
}
