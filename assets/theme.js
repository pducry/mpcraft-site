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

  // Password gate — client-side (deterrent only, NOT real security)
  // To change the password: compute SHA-256 of new password and replace HASH below.
  // Bash: echo -n "newpassword" | shasum -a 256
  const GATE = {
    KEY: 'site-auth',
    HASH: 'ca2939e54e8d2e4072813097a8fff904b9c9b804ba46b90e5fdc7c63ed5c9805', // mpcraft2026
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
