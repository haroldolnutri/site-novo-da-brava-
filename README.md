# Brava Canecas — Catálogo digital (versão premium 2.0)

Catálogo mobile-first totalmente responsivo, com busca, filtros por categoria,
ordenação, favoritos (salvos no navegador) e pedido direto pelo WhatsApp.

## Estrutura
- `index.html` — página do catálogo (hero, busca, filtros, grade de produtos)
- `produto.html` — página individual de cada produto, com relacionados e
  barra fixa de pedido no mobile
- `products.js` — banco de dados dos produtos (não precisa editar HTML/CSS
  para adicionar itens — basta adicionar um objeto novo neste arquivo)
- `site.js` — utilitários compartilhados (favoritos, link do WhatsApp, toast)
- `app.js` — lógica da página de catálogo
- `product.js` — lógica da página de produto
- `styles.css` — identidade visual e responsividade (mobile → tablet → desktop)
- `assets/` — imagens dos produtos e páginas do catálogo original

## Novidades desta versão
- Visual renovado (tipografia Fraunces + Manrope, paleta terracota/creme)
- Busca instantânea, ordenação por preço/nome e contagem de resultados
- Filtro por categoria com contadores + filtro de favoritos
- Favoritos salvos no navegador (não precisa de login)
- Grade de produtos 100% fluida (2 colunas no celular até 5 no desktop)
- Página de produto com produtos relacionados, botão de compartilhar e
  barra fixa de pedido no rodapé (mobile)
- Botão flutuante do WhatsApp + "voltar ao topo"
- Acessibilidade: navegação por teclado, textos alternativos, área de toque
  ampliada e respeito a "reduzir movimento"

## Adicionar um novo produto
Edite `products.js` e acrescente um objeto ao array `PRODUCTS`, seguindo o
mesmo formato dos existentes (`name`, `price`, `category`, `image`, `tiers`,
`description`, e opcionalmente `gallery` para fotos extras). A imagem deve
estar dentro da pasta `assets/`.

> O painel administrativo (`admin.html`) foi removido do projeto por
> segurança — como o site é estático (sem servidor/banco de dados), qualquer
> arquivo aqui dentro fica público assim que o repositório vai pro GitHub, e
> não existe forma de proteger de verdade um painel de edição num site desse
> tipo. Editar `products.js` direto é o jeito seguro de manter o catálogo.

## Catálogo de artes
O link "Catálogo de artes" aparece só na página de cada produto (dentro do
painel de detalhes e no rodapé de `produto.html`) e leva ao Canva com os
modelos de personalização: `https://canva.link/ahxp8y3r3so7f2g`. Para trocar
esse link no futuro, procure por essa URL em `product.js` e `produto.html`.

## Publicação no GitHub Pages
Envie todo o conteúdo para a raiz do repositório e ative Pages usando a
branch principal / root.
