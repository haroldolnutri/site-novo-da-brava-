/* ============================================================
   BRAVA CANECAS — utilitários compartilhados
   Usado por index.html (app.js) e produto.html (product.js).
   ============================================================ */

const Brava = (() => {
  const FAV_KEY = 'brava_favoritos';

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));

  // slug estável por produto (o nome é único no catálogo)
  const idOf = (p) => p.name;

  function getFavorites() {
    try {
      return new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]'));
    } catch {
      return new Set();
    }
  }

  function saveFavorites(set) {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify([...set]));
    } catch { /* armazenamento indisponível — segue sem persistir */ }
  }

  function toggleFavorite(product) {
    const favs = getFavorites();
    const id = idOf(product);
    const isFav = favs.has(id);
    isFav ? favs.delete(id) : favs.add(id);
    saveFavorites(favs);
    return !isFav;
  }

  function isFavorite(product) {
    return getFavorites().has(idOf(product));
  }

  function waMessage(p) {
    return `Olá! 😊 Vi o catálogo da Brava Canecas e gostaria de pedir: ${p.name} (${p.price}). Poderia me passar mais informações?`;
  }

  function waLink(p, wa) {
    return `https://wa.me/${wa}?text=${encodeURIComponent(waMessage(p))}`;
  }

  function cheapestTier(p) {
    if (!p.tiers || !p.tiers.length) return null;
    const toNum = (s) => Number(String(s).replace(/[^\d,]/g, '').replace(',', '.')) || Infinity;
    return p.tiers.reduce((min, t) => (toNum(t.price) < toNum(min.price) ? t : min), p.tiers[0]);
  }

  // remove níveis de quantidade duplicados, mantendo o menor preço de cada qtd
  function dedupeTiers(tiers) {
    if (!tiers || !tiers.length) return [];
    const toNum = (s) => Number(String(s).replace(/[^\d,]/g, '').replace(',', '.')) || Infinity;
    const map = new Map();
    tiers.forEach((t) => {
      const cur = map.get(t.qty);
      if (!cur || toNum(t.price) < toNum(cur.price)) map.set(t.qty, t);
    });
    return [...map.values()].sort((a, b) => a.qty - b.qty);
  }

  // faixas padrão "10+ peças" e "40+ peças" (quando existirem)
  function qtyTiers(p) {
    const deduped = dedupeTiers(p.tiers);
    return [10, 40].map((q) => deduped.find((t) => t.qty === q)).filter(Boolean);
  }

  const heartIcon = (filled) => `<svg viewBox="0 0 24 24"${filled ? ' style="fill:currentColor"' : ''}><path d="M12 21s-7.5-4.6-10-9.1C.5 8.4 2.3 5 5.8 5c2 0 3.4 1 6.2 3.8C14.8 6 16.2 5 18.2 5c3.5 0 5.3 3.4 3.8 6.9C19.5 16.4 12 21 12 21Z"/></svg>`;

  function toast(msg, iconSvg) {
    let el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.innerHTML = `${iconSvg || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>'}<span>${esc(msg)}</span>`;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 2200);
  }

  function mountFloatStack() {
    const stack = document.querySelector('.float-stack');
    if (!stack) return;
    const toTop = stack.querySelector('.to-top');
    if (!toTop) return;
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('show', window.scrollY > 480);
    }, { passive: true });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  function shareOrCopy(title, url) {
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url).then(() => toast('Link copiado!'));
    }
  }

  return {
    esc, idOf, getFavorites, toggleFavorite, isFavorite,
    waMessage, waLink, cheapestTier, dedupeTiers, qtyTiers, heartIcon, toast, mountFloatStack, shareOrCopy,
  };
})();
