(function () {
  'use strict';

  // TROCAR: endereço completo e horário
  const ESTUDIO = { endereco: 'Méier, Rio de Janeiro - RJ', horario: 'Atendimento com hora marcada' };

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const temIO = 'IntersectionObserver' in window;

  // Reveal first: CSS hides .js .rv until .is-in, so nothing below may block it.
  const rvs = $$('.rv');
  const mostrar = el => el.classList.add('is-in');
  if (reduz || !temIO) rvs.forEach(mostrar);
  else {
    const io = new IntersectionObserver((ents, obs) => ents.forEach(en => {
      if (en.isIntersecting) { mostrar(en.target); obs.unobserve(en.target); }
    }), { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    rvs.forEach(el => io.observe(el));
  }

  // Local + ano
  const q = encodeURIComponent(ESTUDIO.endereco);
  $$('[data-endereco]').forEach(el => { el.textContent = ESTUDIO.endereco; });
  $$('[data-horario]').forEach(el => { el.textContent = ESTUDIO.horario; });
  $$('[data-maps-link]').forEach(el => { el.href = 'https://www.google.com/maps/search/?api=1&query=' + q; });
  $$('[data-maps-embed]').forEach(el => {
    const src = 'https://www.google.com/maps?q=' + q + '&output=embed';
    if (el.getAttribute('src') !== src) el.src = src; // reassigning reloads the map
  });
  $$('[data-ano]').forEach(el => { el.textContent = new Date().getFullYear(); });

  // Filtro do portfólio
  const botoes = $$('.filtro [data-filtro]');
  const obras = $$('.obra');
  botoes.forEach(b => b.addEventListener('click', () => {
    const f = b.dataset.filtro;
    botoes.forEach(o => o.setAttribute('aria-pressed', String(o === b)));
    obras.forEach(o => { o.hidden = f !== 'todos' && o.dataset.estilo !== f; });
  }));

  // Lightbox (sem <dialog>, o link abre a imagem normalmente)
  const dlg = $('#lightbox');
  if (dlg && typeof dlg.showModal === 'function') {
    const foto = $('img', dlg);
    let origem = null;
    obras.forEach(a => a.addEventListener('click', e => {
      if (e.ctrlKey || e.metaKey || e.shiftKey) return; // keep "open in new tab"
      e.preventDefault();
      origem = a;
      foto.src = a.href;
      foto.alt = $('img', a)?.alt || '';
      dlg.showModal();
    }));
    $('.lightbox__fechar', dlg)?.addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', () => {
      foto.removeAttribute('src');
      origem?.focus();
    });
  }

  // Parallax: progresso p ∈ [0,1] equivalente às timelines do CSS
  function progresso(range, rect, vh, scrollY, scrollH) {
    const p = range === 'exit' ? -rect.top / rect.height
      : range === 'page' ? scrollY / (scrollH - vh)
      : (vh - rect.top) / (vh + rect.height);
    return Math.min(1, Math.max(0, p || 0)); // || 0: NaN when page is not scrollable
  }
  console.assert(progresso('cover', { top: 800, height: 100 }, 800) === 0 &&
    progresso('cover', { top: -100, height: 100 }, 800) === 1, 'px cover');
  console.assert(progresso('exit', { top: 0, height: 100 }) === 0 &&
    progresso('exit', { top: -100, height: 100 }) === 1, 'px exit');
  console.assert(progresso('page', null, 800, 0, 1800) === 0 &&
    progresso('page', null, 800, 1000, 1800) === 1, 'px page');

  // Fallback only: without scroll-timeline the CSS pauses .px animations and we scrub them.
  if (reduz || !window.CSS || CSS.supports('animation-timeline: view()')) return;

  const pxs = $$('.px');
  const perto = new Set(pxs.filter(el => el.dataset.pxRange === 'page'));
  const resto = pxs.filter(el => !perto.has(el));
  if (temIO) {
    const io = new IntersectionObserver(ents => {
      ents.forEach(en => { en.isIntersecting ? perto.add(en.target) : perto.delete(en.target); });
      agendar(); // newly near elements need a first position
    }, { rootMargin: '20% 0px' });
    resto.forEach(el => io.observe(el));
  } else resto.forEach(el => perto.add(el));

  let pendente = false;
  function atualizar() {
    pendente = false;
    const vh = innerHeight, sy = scrollY, sh = document.documentElement.scrollHeight;
    // shortcut: the rect includes the element's own animated transform (CSS view() ignores it),
    // so big translates lag slightly; switch to offsetTop math if it ever jitters.
    // Read all rects before writing to avoid layout thrash.
    // 'exit' layers share their section's view-timeline in CSS, so measure the section.
    const alvos = Array.from(perto, el => {
      const r = el.dataset.pxRange;
      const box = (r === 'exit' ? el.closest('section') || el : el).getBoundingClientRect();
      return [el, progresso(r, box, vh, sy, sh) * 1000];
    });
    alvos.forEach(([el, t]) => {
      // getAnimations at update time: CSS animations may not exist yet at init
      if (el.getAnimations) el.getAnimations().forEach(a => { a.currentTime = t; });
    });
  }
  const agendar = () => {
    if (!pendente) { pendente = true; requestAnimationFrame(atualizar); }
  };
  addEventListener('scroll', agendar, { passive: true });
  addEventListener('resize', agendar);
  addEventListener('load', agendar);
  agendar();
})();
