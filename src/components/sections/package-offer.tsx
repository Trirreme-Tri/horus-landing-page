import { motion, useMotionTemplate, useMotionValue } from 'motion/react'
import { DM_URL, postSrc } from '@/data'

const items = ['Capa para e-book', 'Capa para livro físico', '100 marcadores impressos 4/0']

/** Destaque do pacote: card com spotlight que acompanha o cursor. */
export function PackageOffer() {
  const mx = useMotionValue(50)
  const my = useMotionValue(50)
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${mx}% ${my}%, rgb(225 19 43 / 0.35), transparent 60%)`

  return (
    <section id="pacote" className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
      <div
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          mx.set(((e.clientX - r.left) / r.width) * 100)
          my.set(((e.clientY - r.top) / r.height) * 100)
        }}
        className="relative grid overflow-hidden rounded-3xl bg-ink-2 ring-1 ring-bone/10 md:grid-cols-[1.1fr_1fr]"
      >
        <motion.div aria-hidden style={{ background: spotlight }} className="pointer-events-none absolute inset-0" />

        <div className="relative z-10 flex flex-col justify-between gap-10 p-8 md:p-14">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-mega text-scarlet md:text-xs">Pacote completo</p>
            <h2 className="mt-5 font-display text-5xl font-light leading-[0.95] md:text-7xl">
              O melhor pacote para o seu <em className="text-scarlet">best-seller</em>
            </h2>
          </div>
          <ul className="space-y-3">
            {items.map((it, i) => (
              <motion.li
                key={it}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 * i, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-4 border-b border-bone/10 pb-3 text-base md:text-lg"
              >
                <span className="text-scarlet">✦</span>
                {it}
              </motion.li>
            ))}
          </ul>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <p>
              <span className="block text-xs uppercase tracking-[0.25em] text-bone/50">por apenas</span>
              <span className="font-display text-6xl font-light md:text-7xl">R$ 199,90</span>
            </p>
            <a
              href={DM_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-blood px-7 py-4 text-xs font-bold uppercase tracking-[0.22em] transition-colors hover:bg-scarlet"
            >
              Garantir o meu
            </a>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden md:min-h-0">
          <motion.img
            src={postSrc('DeKCLKbxY3a')}
            alt="Arte de divulgação do pacote best-seller da Hórus"
            loading="lazy"
            initial={{ scale: 1.2 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 size-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-2 via-transparent to-transparent md:via-ink-2/10" />
        </div>
      </div>
    </section>
  )
}
