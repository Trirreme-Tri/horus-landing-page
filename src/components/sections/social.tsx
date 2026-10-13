import type { CSSProperties } from 'react'
import { INSTAGRAM_URL, socialPosts } from '@/data'

/** Carrossel infinito de posts: duas fileiras correndo em sentidos opostos. */
export function Social() {
  const half = Math.ceil(socialPosts.length / 2)
  const rows = [socialPosts.slice(0, half), socialPosts.slice(half)]

  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      <div className="mx-auto mb-12 max-w-7xl px-4 md:mb-16 md:px-8">
        <p className="text-[10px] font-semibold uppercase tracking-mega text-scarlet md:text-xs">Redes sociais</p>
        <h2 className="mt-6 max-w-4xl font-display text-5xl font-light leading-[0.95] md:text-8xl">
          Posts que fazem o leitor <em className="text-scarlet">salvar</em>, comentar e comprar.
        </h2>
      </div>

      <div className="space-y-4 md:space-y-6 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        {rows.map((row, r) => (
          <div key={r} className="group flex overflow-hidden">
            <div
              className="animate-marquee flex w-max gap-4 group-hover:[animation-play-state:paused] md:gap-6"
              style={{ '--duration': '55s', animationDirection: r ? 'reverse' : 'normal' } as CSSProperties}
            >
              {[...row, ...row].map((src, i) => (
                <a
                  key={i}
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="Instagram"
                  aria-hidden={i >= row.length}
                  tabIndex={i >= row.length ? -1 : undefined}
                  className="block w-[48vw] shrink-0 overflow-hidden rounded-xl md:w-[19vw]"
                >
                  <img
                    src={src}
                    alt={i < row.length ? 'Post da Hórus no Instagram' : ''}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-block border-b border-bone/30 pb-1 text-xs font-semibold uppercase tracking-[0.3em] text-bone/80 transition hover:border-scarlet hover:text-bone"
        >
          @horuseditorialdesign
        </a>
      </div>
    </section>
  )
}
