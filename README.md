# Hórus Design Editorial — landing page

Landing page do perfil [@horuseditorialdesign](https://www.instagram.com/horuseditorialdesign/).

Stack: Vite + React + TypeScript + Tailwind CSS v4 + [Motion](https://motion.dev) + [Lenis](https://lenis.darkroom.engineering) (scroll suave).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
```

## Estrutura

- `src/data.ts` — textos, capas, serviços, links (Instagram/DM). **É aqui que se edita conteúdo.**
- `src/components/sections/` — uma seção da página por arquivo, na ordem do `App.tsx`.
- `src/components/ui/` — componentes de animação reutilizáveis (text reveal, velocity marquee, tilt card, magnetic, preloader, cursor…).
- `public/img/` — imagens otimizadas (webp) extraídas de `assets/` (PDF do portfólio + posts do Instagram).

## Usando componentes do 21st.dev

O projeto segue a convenção shadcn que os componentes do 21st.dev esperam:

- alias `@/` → `src/`
- `cn()` em `@/lib/utils`
- componentes em `@/components/ui/`

Basta colar o componente em `src/components/ui/<nome>.tsx`, instalar as dependências que ele pedir e usá-lo numa seção.
Se ele importar de `framer-motion`, troque por `motion/react` (é o mesmo pacote, nome novo).

Cores e fontes do tema ficam em `src/index.css` (`--color-blood`, `--color-bone`, `--font-display`…), então dá para usar `bg-blood`, `text-bone`, `font-display` etc. direto nas classes.

## Deploy

Cada push na `main` publica automaticamente em **https://trirreme-tri.github.io/horus-landing-page/** via GitHub Actions (`.github/workflows/deploy.yml`).
O `base` do Vite é `/horus-landing-page/` no build; por isso imagens em `public/` devem ser referenciadas com o helper `img()` de `src/data.ts`.
