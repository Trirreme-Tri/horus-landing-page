const noise =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.17  0 0 0 0 0.08  0 0 0 0 0.09  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"

/** Grão de papel por cima da página inteira — a textura das artes da Hórus. */
export function Grain() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] overflow-hidden opacity-[0.06] mix-blend-multiply">
      <div className="animate-grain absolute -inset-[50%]" style={{ backgroundImage: noise }} />
    </div>
  )
}
