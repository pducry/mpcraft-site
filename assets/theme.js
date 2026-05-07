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

})();
