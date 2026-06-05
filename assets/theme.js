(function () {
  const html = document.documentElement;

  function bind(buttonId, className, storageKey) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    btn.setAttribute('aria-pressed', html.classList.contains(className) ? 'true' : 'false');
    btn.addEventListener('click', () => {
      const on = html.classList.toggle(className);
      try { localStorage.setItem(storageKey, on ? className : ''); } catch (e) {}
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  bind('font-toggle', 'serif', 'font');

  // Slideshow controller — supports mixed images + video, multiple instances per page
  // Images: 0.55s each. Video: plays to end (max 0.9s), then advances.
  (function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const slideshows = document.querySelectorAll('.slideshow');
    if (!slideshows.length) return;

    slideshows.forEach((ss) => {
      const slides = Array.from(ss.children);
      if (!slides.length) return;
      let idx = 0;

      function show(i) {
        slides.forEach((s, n) => {
          s.style.opacity = n === i ? '1' : '0';
          if (s.tagName === 'VIDEO') {
            if (n === i) { s.currentTime = 0; s.play().catch(() => {}); }
            else s.pause();
          }
        });
      }

      function next() {
        idx = (idx + 1) % slides.length;
        show(idx);
        const slide = slides[idx];
        if (slide.tagName === 'VIDEO') {
          setTimeout(next, 900);
        } else {
          setTimeout(next, 550);
        }
      }

      show(0);
      setTimeout(next, 550);
    });
  })();

  // Lang toggle — pt <-> es, persisted in localStorage
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const cur = html.getAttribute('lang') === 'es' ? 'es' : 'pt';
      const next = cur === 'pt' ? 'es' : 'pt';
      html.setAttribute('lang', next);
      try { localStorage.setItem('lang', next); } catch (e) {}
    });
  }

  // Password gate — client-side (deterrent only, NOT real security)
  const GATE = {
    KEY: 'site-auth-v2',
    HASH: '1372b011bd1ac1f9b2eca9d84657fe47edfe72384e400d446d05884ae83b47ac', // mpcraft
  };
  if (html.classList.contains('authed')) return;

  const form = document.getElementById('gate-form');
  const input = document.getElementById('gate-input');
  const errorEl = document.getElementById('gate-error');
  if (!form || !input) return;

  async function sha256(text) {
    const buf = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  setTimeout(() => input.focus(), 50);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    const hash = await sha256(value);
    if (hash === GATE.HASH) {
      try { localStorage.setItem(GATE.KEY, '1'); } catch (e) {}
      html.classList.add('authed');
    } else {
      if (errorEl) errorEl.classList.add('show');
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 350);
      input.select();
    }
  });

})();
