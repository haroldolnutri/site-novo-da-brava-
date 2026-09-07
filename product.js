/* ============================================================
   BRAVA CANECAS — página de produto (produto.html)
   ============================================================ */

(() => {
  const { esc, isFavorite, toggleFavorite, waLink, qtyTiers, heartIcon, toast, shareOrCopy } = Brava;

  const app = document.querySelector('#app');
  const crumbCat = document.querySelector('#crumbCat');
  const crumbName = document.querySelector('#crumbName');
  const mobileCta = document.querySelector('#mobileCta');

  const id = Number(new URLSearchParams(location.search).get('id'));
  const product = PRODUCTS[id];

  const waIcon = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.7 14.2c-.2.6-1.4 1.2-2 1.3-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.6.7 1.9.8 2 .1.2.1.4 0 .6-.6 1.2-1.2 1.1-.6 2 .9 1.6 1.7 2.1 3.1 2.8.2.1.4.1.5-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.5.7 1.8.9.3.1.5.2.5.4.1.2.1.7-.1 1.2Z"/></svg>';
  const shareIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-3.9M8.6 13.5l6.8 3.9"/></svg>';
  const chevronIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';

  if (!product) {
    app.innerHTML = `
      <div class="not-found">
        <h2>Produto não encontrado</h2>
        <p>Esse item pode ter saído do catálogo ou o link está incorreto.</p>
        <a href="index.html">Voltar ao catálogo</a>
      </div>`;
    document.querySelector('.breadcrumb')?.setAttribute('hidden', '');
    document.querySelector('.back')?.setAttribute('hidden', '');
    Brava.mountFloatStack();
    return;
  }

  document.title = `${product.name} | Brava Canecas`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', `${product.name}, ${product.price}. Peça direto pelo WhatsApp na Brava Canecas.`);

  crumbCat.textContent = product.category;
  crumbCat.href = `index.html?cat=${encodeURIComponent(product.category)}`;
  crumbName.textContent = product.name;

  function cardHtml(p) {
    const i = PRODUCTS.indexOf(p);
    const fav = isFavorite(p);
    const list = qtyTiers(p);
    const tiers = list.map((t, idx) => `
      <div class="tier ${idx === list.length - 1 && list.length > 1 ? 'best' : ''}"><span>${t.qty}+ un.</span><strong>${esc(t.price)}</strong></div>`).join('');
    return `
      <article class="card">
        <a class="photo" href="produto.html?id=${i}" aria-label="Ver detalhes de ${esc(p.name)}">
          <img loading="lazy" src="assets/${p.image}" alt="${esc(p.name)}" onerror="this.style.display='none'">
          <span class="tag"><span>${esc(p.category)}</span></span>
        </a>
        <button class="fav-btn ${fav ? 'active' : ''}" data-fav-toggle="${i}" aria-pressed="${fav}" aria-label="Favoritar ${esc(p.name)}">
          ${heartIcon(fav)}
        </button>
        <div class="body">
          <h3>${esc(p.name)}</h3>
          <div class="price">${esc(p.price)}</div>
          <div class="unit-label">valor unitário</div>
          ${tiers ? `<div class="tiers">${tiers}</div>` : ''}
          <div class="actions">
            <a class="action details" href="produto.html?id=${i}">Ver detalhes</a>
            <a class="action wa" target="_blank" rel="noopener" href="${waLink(p, WA)}">${waIcon}Pedir</a>
          </div>
        </div>
      </article>`;
  }

  function bindCardFavButtons(root) {
    root.querySelectorAll('[data-fav-toggle]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const p = PRODUCTS[Number(btn.dataset.favToggle)];
        const nowFav = toggleFavorite(p);
        btn.classList.toggle('active', nowFav);
        btn.setAttribute('aria-pressed', String(nowFav));
        btn.innerHTML = heartIcon(nowFav);
        toast(nowFav ? 'Adicionado aos favoritos' : 'Removido dos favoritos', heartIcon(nowFav));
      });
    });
  }

  const gallery = [product.image, ...(product.gallery || [])];
  const tiers = qtyTiers(product);
  const fav = isFavorite(product);
  const related = PRODUCTS
    .filter((p) => p.category === product.category && p !== product)
    .slice(0, 8);

  app.innerHTML = `
    <div class="detail-grid">
      <div>
        <div class="detail-photo">
          <img id="mainPhoto" src="assets/${product.image}" alt="${esc(product.name)}" onerror="this.style.display='none'">
          <button class="fav-btn ${fav ? 'active' : ''}" id="favBtn" aria-pressed="${fav}" aria-label="Favoritar ${esc(product.name)}">
            ${heartIcon(fav)}
          </button>
        </div>
        ${gallery.length > 1 ? `
          <div class="gallery-thumbs" id="galleryThumbs">
            ${gallery.map((g, i) => `
              <button class="gthumb ${i === 0 ? 'active' : ''}" data-src="assets/${g}" aria-label="Ver foto ${i + 1}">
                <img src="assets/${g}" alt="" onerror="this.style.display='none'">
              </button>`).join('')}
          </div>` : ''}
      </div>

      <div class="panel">
        <div class="panel-head">
          <span class="cat-tag">${esc(product.category)}</span>
          <div class="icon-actions">
            <button id="favBtnSecondary" class="icon-action" aria-pressed="${fav}" aria-label="${fav ? 'Remover dos favoritos' : 'Favoritar produto'}" title="Favoritar">${heartIcon(fav)}</button>
            <button id="shareBtn" class="icon-action" aria-label="Compartilhar produto" title="Compartilhar">${shareIcon}</button>
          </div>
        </div>

        <h1>${esc(product.name)}</h1>

        <div class="price-block">
          <div class="detail-price">${esc(product.price)}</div>
          <div class="unit-label">valor unitário</div>
        </div>

        ${product.description ? `<p class="desc">${esc(product.description)}</p>` : ''}

        ${tiers.length ? `
          <div class="price-table">
            <span class="label">Preço especial por quantidade</span>
            ${tiers.map((t, idx) => `
              <div class="price-row ${idx === tiers.length - 1 && tiers.length > 1 ? 'best' : ''}"><span>A partir de ${t.qty} peças</span><strong>${esc(t.price)}</strong></div>`).join('')}
            <span class="price-table-note">Desconto por quantidade válido para pagamento via Pix</span>
          </div>` : ''}

        <div class="cta-group">
          <a class="bigwa" target="_blank" rel="noopener" href="${waLink(product, WA)}">${waIcon}Pedir pelo WhatsApp</a>
          <a class="art-link" href="https://canva.link/ahxp8y3r3so7f2g" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>
            Ver catálogo de artes para personalizar
          </a>
        </div>

        ${product.pageImage ? `
          <div class="source">
            <button class="source-toggle" id="sourceToggle" aria-expanded="false">
              Ver esta peça na página original do catálogo ${chevronIcon}
            </button>
            <div class="source-body" id="sourceBody">
              <img src="assets/${product.pageImage}" alt="Página original do catálogo com ${esc(product.name)}" loading="lazy">
            </div>
          </div>` : ''}
      </div>
    </div>

    ${related.length ? `
      <section class="related">
        <h3>Você também pode gostar</h3>
        <div class="related-row">${related.map(cardHtml).join('')}</div>
      </section>` : ''}
  `;

  // troca de foto na galeria
  document.querySelectorAll('#galleryThumbs .gthumb').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelector('#mainPhoto').src = btn.dataset.src;
      document.querySelectorAll('#galleryThumbs .gthumb').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // favoritar (foto principal + botão secundário, sincronizados)
  function setFavUI(nowFav) {
    const main = document.querySelector('#favBtn');
    const secondary = document.querySelector('#favBtnSecondary');
    main.classList.toggle('active', nowFav);
    main.setAttribute('aria-pressed', String(nowFav));
    main.innerHTML = heartIcon(nowFav);
    secondary.setAttribute('aria-pressed', String(nowFav));
    secondary.setAttribute('aria-label', nowFav ? 'Remover dos favoritos' : 'Favoritar produto');
    secondary.innerHTML = heartIcon(nowFav);
  }
  function handleFavClick() {
    const nowFav = toggleFavorite(product);
    setFavUI(nowFav);
    toast(nowFav ? 'Adicionado aos favoritos' : 'Removido dos favoritos', heartIcon(nowFav));
  }
  document.querySelector('#favBtn').addEventListener('click', handleFavClick);
  document.querySelector('#favBtnSecondary').addEventListener('click', handleFavClick);

  // compartilhar
  document.querySelector('#shareBtn').addEventListener('click', () => {
    shareOrCopy(product.name, location.href);
  });

  // página original do catálogo (opcional)
  const sourceToggle = document.querySelector('#sourceToggle');
  if (sourceToggle) {
    sourceToggle.addEventListener('click', () => {
      const open = sourceToggle.getAttribute('aria-expanded') === 'true';
      sourceToggle.setAttribute('aria-expanded', String(!open));
      document.querySelector('#sourceBody').classList.toggle('open', !open);
    });
  }

  bindCardFavButtons(document.querySelector('.related-row') || document);

  // barra fixa de pedido (mobile)
  mobileCta.innerHTML = `
    <div class="mc-price"><span>valor unitário</span><strong>${esc(product.price)}</strong></div>
    <a target="_blank" rel="noopener" href="${waLink(product, WA)}">${waIcon}Pedir pelo WhatsApp</a>
  `;

  Brava.mountFloatStack();
})();
