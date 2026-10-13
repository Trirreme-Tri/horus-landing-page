export const INSTAGRAM_URL = 'https://www.instagram.com/horuseditorialdesign/'
export const DM_URL = 'https://ig.me/m/horuseditorialdesign'

export type Cover = { slug: string; title: string; author: string }

const cover = (slug: string, title: string, author: string): Cover => ({ slug, title, author })

export const covers: Cover[] = [
  cover('furia-escarlate', 'Fúria Escarlate', 'A. Z. Florence'),
  cover('nos-labios-do-inimigo', 'Nos Lábios do Inimigo', 'S. P. Rezena'),
  cover('apaixonada-pelo-mafioso-errado', 'Apaixonada pelo Mafioso Errado', 'Lia Carson'),
  cover('o-caminho-para-as-estrelas', 'O Caminho para as Estrelas', 'Alice Bacivangi'),
  cover('declinio-do-amor', 'Declínio do Amor', 'Thamy Bastida'),
  cover('reinado-submerso', 'Reinado Submerso', 'Juliana Ramos'),
  cover('sob-o-encanto-da-raposa', 'Sob o Encanto da Raposa', 'Lya Almeida'),
  cover('senador-e-a-bailarina', 'O Senador e a Bailarina', 'Cléo Luz'),
  cover('coroa-escarlate', 'Coroa Escarlate', 'Helen Melchior'),
  cover('nao-me-odeie', 'Não Me Odeie', 'Silvie Basset'),
  cover('obscenos-e-mafiosos', 'Obscenos & Mafiosos', 'Lyssa Silver'),
  cover('um-amor-sob-as-marcas-do-tempo', 'Um Amor sob as Marcas do Tempo', 'Natalia Artemis'),
  cover('nossa-melodia', 'Nossa Melodia', 'Mih Franklim'),
  cover('don', 'Don', 'Tay Ferreira'),
  cover('doce-dominio', 'Doce Domínio', 'A. E. Gabriel'),
  cover('jogos-de-poder', 'Jogos de Poder', 'Olivia Uviplais'),
  cover('motivos-para-ficar', 'Motivos para Ficar', 'Loid Alves'),
  cover('deliciosamente-proibido', 'Deliciosamente Proibido', 'Ray Freire'),
  cover('um-acordo-com-o-bad-boy', 'Um Acordo com o Bad Boy', 'Vivy Keury'),
  cover('sob-a-protecao-do-magnata', 'Sob a Proteção do Magnata', 'Vitória Constance'),
  cover('coracao-quebrado', 'Coração Quebrado', 'Isa Gomes'),
  cover('the-best-date', 'The Best Date', 'Ariane Fonseca'),
  cover('amor-com-data-marcada', 'Amor com Data Marcada', 'Carol S. Wahl'),
]

/** Caminho de imagem em public/img respeitando o base path (GitHub Pages serve em /horus-landing-page/). */
export const img = (path: string) => `${import.meta.env.BASE_URL}img/${path}`
export const coverSrc = (slug: string) => img(`covers/${slug}.webp`)
export const postSrc = (id: string) => img(`posts/${id}.webp`)

export const services = [
  {
    name: 'Capa para e-book',
    note: 'A vitrine do seu livro na Amazon e no Kindle Unlimited.',
    image: coverSrc('apaixonada-pelo-mafioso-errado'),
  },
  {
    name: 'Capa para livro físico',
    note: 'Capa, lombada e quarta capa prontas para a gráfica.',
    image: img('print/wrap-gianni.webp'),
  },
  {
    name: 'Diagramação',
    note: 'O miolo do livro com a mesma alma da capa.',
    image: img('print/wrap-bracos-do-mafioso.webp'),
  },
  {
    name: 'Marcadores',
    note: 'Brindes que os leitores guardam (e postam).',
    image: postSrc('DbBF5LXkbM6_2'),
  },
  {
    name: 'Banners & divulgação',
    note: 'Pré-venda, lançamento, combos e campanhas.',
    image: img('print/banner-combo.webp'),
  },
  {
    name: 'Posts para redes sociais',
    note: 'Personagens, trechos e teasers que fazem o leitor salvar.',
    image: postSrc('DNYD9cTAhF__3'),
  },
  {
    name: 'Chaveiros & brindes',
    note: 'Seus personagens fora das páginas.',
    image: postSrc('Db5rHiCkbxp_1'),
  },
]

export const socialPosts = [
  postSrc('DNYD9cTAhF__4'),
  postSrc('DNWrtNpxsjI'),
  postSrc('DU9oWMTkd1Z'),
  postSrc('DNYD9cTAhF__2'),
  postSrc('DNYPAadNDi7'),
  postSrc('DNYD9cTAhF__3'),
  postSrc('DNdPQUIg_gC'),
  postSrc('DNYD9cTAhF__5'),
  postSrc('DNgvozYNlqF'),
  postSrc('DVBeLCtESrG'),
]

export const printWorks = [
  { src: img('print/wrap-gianni.webp'), title: 'A Maldição de Gianni', author: 'N. S. Fittz', tag: 'Capa completa' },
  { src: img('print/wrap-bracos-do-mafioso.webp'), title: 'Nos Braços do Mafioso', author: 'Sarah Mercury', tag: 'Trilogia · Livro 1' },
  { src: img('print/wrap-irresistivel.webp'), title: 'Irresistível', author: 'Vall Chruscielski', tag: 'Capa completa' },
  { src: img('print/wrap-rei-benjamin.webp'), title: 'O Rei Benjamin', author: 'Maria D’Silva', tag: 'Capa completa' },
  { src: img('print/wrap-inesperada-atracao.webp'), title: 'Inesperada Atração', author: 'Lucy Foster', tag: 'Adaptação para físico' },
]
