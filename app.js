/* ============================================================
   BRAVA CANECAS — catálogo (index.html)
   ============================================================ */

(() => {
  const { esc, idOf, isFavorite, toggleFavorite, waLink, qtyTiers, heartIcon, toast } = Brava;

  const grid = document.querySelector('#grid');
  const q = document.querySelector('#q');
  const searchBox = document.querySelector('#searchBox');
  const clearBtn = document.querySelector('#clearSearch');
  const chipRow = document.querySelector('#chips');
  const count = document.querySelector('#count');
  const empty = document.querySelector('#empty');
  const sortSelect = document.querySelector('#sort');

  const categories = ['Todos', ...new Set(PRODUCTS.map((p) => p.category))];

  const state = {
    active: 'Todos',
    showFavorites: false,
    term: '',
    sort: 'relevancia',
  };

  const priceNumber = (str) => Number(String(str).replace(/[^\d,]/g, '').replace(',', '.')) || 0;

  function countFor(cat) {
    return PRODUCTS.filter((p) => p.category === cat).length;
  }

  function renderChips() {
    const favCount = Brava.getFavorites().size;
    const catsHtml = categories.map((c) => `
      <button class="chip ${!state.showFavorites && c === state.active ? 'active' : ''}" data-cat="${esc(c)}">
        ${esc(c)} <span class="n">${c === 'Todos' ? PRODUCTS.length : countFor(c)}</span>
      </button>`).join('');

    const favChip = `
      <button class="chip fav ${state.showFavorites ? 'active' : ''}" data-fav="1">
        ${heartIcon(state.showFavorites)} Favoritos ${favCount ? `<span class="n">${favCount}</span>` : ''}
      </button>`;

    chipRow.innerHTML = catsHtml + favChip;

    chipRow.querySelectorAll('[data-cat]').forEach((b) => {
      b.onclick = () => { state.active = b.dataset.cat; state.showFavorites = false; renderChips(); render(); };
    });
    chipRow.querySelector('[data-fav]').onclick = () => {
      state.showFavorites = !state.showFavorites;
      renderChips();
      render();
    };
  }

  function sortList(list) {
    const l = [...list];
    if (state.sort === 'menor') l.sort((a, b) => priceNumber(a.price) - priceNumber(b.price));
    else if (state.sort === 'maior') l.sort((a, b) => priceNumber(b.price) - priceNumber(a.price));
    else if (state.sort === 'az') l.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    return l;
  }

  function cardHtml(p) {
    const i = PRODUCTS.indexOf(p);
    const fav = isFavorite(p);
    const list = qtyTiers(p);
    const tiers = list.map((t, idx) => `
      <div class="tier ${idx === list.length - 1 && list.length > 1 ? 'best' : ''}"><span>${t.qty}+ peças</span><strong>${esc(t.price)}</strong></div>`).join('');

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
          ${tiers ? `<div class="tiers">${tiers}</div><div class="tiers-note">Desconto por quantidade válido para pagamento via Pix</div>` : ''}
          <div class="actions">
            <a class="action details" href="produto.html?id=${i}">Ver detalhes</a>
            <a class="action wa" target="_blank" rel="noopener" href="${waLink(p, WA)}">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.7 14.2c-.2.6-1.4 1.2-2 1.3-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.6.7 1.9.8 2 .1.2.1.4 0 .6-.6 1.2-1.2 1.1-.6 2 .9 1.6 1.7 2.1 3.1 2.8.2.1.4.1.5-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.5.7 1.8.9.3.1.5.2.5.4.1.2.1.7-.1 1.2Z"/></svg>
              Pedir
            </a>
          </div>
        </div>
      </article>`;
  }

  function render() {
    const term = state.term.trim().toLowerCase();
    let list = PRODUCTS.filter((p) => {
      const matchCat = state.active === 'Todos' || p.category === state.active;
      const matchTerm = !term || (`${p.name} ${p.category} ${p.description || ''}`).toLowerCase().includes(term);
      const matchFav = !state.showFavorites || isFavorite(p);
      return matchCat && matchTerm && matchFav;
    });
    list = sortList(list);

    count.textContent = `${list.length} produto${list.length === 1 ? '' : 's'}`;
    empty.hidden = !!list.length;
    grid.innerHTML = list.map(cardHtml).join('');

    grid.querySelectorAll('[data-fav-toggle]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const p = PRODUCTS[Number(btn.dataset.favToggle)];
        const nowFav = toggleFavorite(p);
        btn.classList.toggle('active', nowFav);
        btn.setAttribute('aria-pressed', String(nowFav));
        btn.innerHTML = heartIcon(nowFav);
        toast(nowFav ? 'Adicionado aos favoritos' : 'Removido dos favoritos', heartIcon(nowFav));
        renderChips();
        if (state.showFavorites && !nowFav) render();
      });
    });
  }

  q.addEventListener('input', () => {
    state.term = q.value;
    searchBox.classList.toggle('has-value', !!q.value);
    render();
  });
  clearBtn.addEventListener('click', () => {
    q.value = '';
    state.term = '';
    searchBox.classList.remove('has-value');
    q.focus();
    render();
  });
  sortSelect.addEventListener('change', () => { state.sort = sortSelect.value; render(); });

  document.querySelector('#resetFilters')?.addEventListener('click', () => {
    state.active = 'Todos';
    state.showFavorites = false;
    state.term = '';
    q.value = '';
    searchBox.classList.remove('has-value');
    renderChips();
    render();
  });

  Brava.mountFloatStack();
  renderChips();
  render();
})();
