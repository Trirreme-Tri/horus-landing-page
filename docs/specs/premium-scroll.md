# Spec — Hórus: experiência premium de scroll

Status: **aprovada por Wellington em 14/10/2026** (capa do livro 3D: *Fúria Escarlate*) · Branch: `feat/premium-scroll` (sobre `fix/site-audit`, PR #1)

## Problema
O site já tem boa base (preloader, galeria horizontal, colunas em parallax, capas empilhadas).
Falta **profundidade** e **fio narrativo**: as seções são boas isoladamente, mas não contam uma
história contínua, e o efeito de camadas no hero é discreto. O pedido é um site que desperte
vontade de contratar a designer antes de chegar aos serviços.

## Jornada (o que o visitante sente, em ordem)
1. **Abertura** — mantida.
2. **Hero em profundidade (novo)** — o hero fica preso na tela por ~1 tela de scroll. As capas estão
   em 3 planos de profundidade (perto, meio, longe, com desfoque de lente). Ao rolar, a "câmera"
   avança: as capas da frente passam por você e saem da tela, o título encolhe por trás e uma frase
   manifesto aparece no centro.
3. **Sobre / Portfólio** — mantidos (já são fortes).
4. **"Anatomia de uma capa" (novo capítulo preso na tela)** — um livro 3D feito com uma capa real.
   Quatro etapas ligadas ao scroll: *rascunho* (preto e branco, desfocado, com guias de grade) →
   *cor* → *tipografia e acabamento* (nítido, brilho) → o livro **gira** e mostra a lombada.
   Textos curtos de cada etapa, ao lado.
5. **Do e-book à gráfica** — a seção vermelha passa a **entrar por uma cortina** (abre de um
   retângulo arredondado até a tela cheia) em vez de começar seca.
6. **Serviços, redes, pacote** — mantidos.
7. **Contato** — entra com a mesma cortina.
8. **Fio condutor (novo)** — marcador fixo e discreto de capítulo no canto ("I — Abertura",
   "II — Portfólio"…) que troca conforme a seção, como cabeçalho de livro.

## Escopo
- Dentro: itens 2, 4, 5, 7 e 8; ajustar o sobreposto do hero (capa "Reinado Submerso" cobre o
  texto "Design editorial" em 1440×900).
- **Fora:** vídeos; fotos novas; preços, números e textos comerciais existentes; cópia do edolus;
  novas dependências (só `motion` e `lenis`, que já existem); mudanças no deploy.

## Critérios de aceite (binários)
1. `npm run lint` sem avisos; `tsc -b` e `vite build` passam.
2. Nenhuma dependência nova no `package.json`.
3. JS gzip cresce no máximo **15 KB** (base: 147,08 KB).
4. Com `prefers-reduced-motion`, as sequências presas mostram o estado final, sem animação de scroll.
5. Em 390 px de largura, sem rolagem horizontal (`scrollWidth === clientWidth`).
6. Continua com um único `<h1>`.
7. Sem erros de JS no console (exceto Google Fonts, bloqueado no sandbox).
8. Capturas de tela, desktop 1440×900 e celular 390×844, de cada seção nova.
9. Preço (R$ 199,90) e números (+3.000, desde 2020) inalterados.

## Invariantes
- Conteúdo continua editável em `src/data.ts`.
- Links de Instagram/DM continuam iguais.

## Plano de verificação
Gates acima + Playwright em `vite preview` rolando a página em etapas.

## Rollout / rollback
PR para `main` → **merge humano = deploy automático**. Rollback: reverter o merge.

## Perguntas abertas (não bloqueantes)
- Os textos das 4 etapas da "Anatomia" são escritos por nós; **a Juliana deve revisar** antes do merge.
