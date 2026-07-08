// ── Radar chart ──────────────────────────────────────────────────────────────
(function () {
  function buildRadarSVG(v) {
    var W = 460, H = 400, cx = 230, cy = 185, maxR = 128, max = 5;
    var axes = [
      { key: 'core',    label: 'Core',    a: -90, la: 'middle', ldy: -5 },
      { key: 'product', label: 'Product', a: -18, la: 'start',  ldy:  5 },
      { key: 'visual',  label: 'Visual',  a:  54, la: 'start',  ldy: 16 },
      { key: 'content', label: 'Content', a: 126, la: 'end',    ldy: 16 },
      { key: 'lead',    label: 'Lead',    a: 198, la: 'end',    ldy:  5 },
    ];
    function r(deg) { return deg * Math.PI / 180; }
    function px(dist, deg) { return (cx + dist * Math.cos(r(deg))).toFixed(1); }
    function py(dist, deg) { return (cy + dist * Math.sin(r(deg))).toFixed(1); }
    function pts(scale) { return axes.map(function(a){ return px((scale/max)*maxR, a.a)+','+py((scale/max)*maxR, a.a); }).join(' '); }

    var s = '';
    // grid levels 1–5
    [1,2,3,4,5].forEach(function(lv){
      s += '<polygon points="'+pts(lv)+'" fill="'+(lv===5?'rgba(99,102,241,0.04)':'none')+'" stroke="rgba(99,102,241,'+(lv===5?'0.22':'0.12')+')" stroke-width="'+(lv===5?'1.5':'1')+'"/>';
    });
    // scale numbers on the top (Core) axis
    [1,2,3,4,5].forEach(function(lv){
      var ty = (cy - (lv/max)*maxR - 4).toFixed(1);
      s += '<text x="'+(cx+6)+'" y="'+ty+'" text-anchor="start" font-family="Inter,sans-serif" font-size="9" fill="rgba(120,130,160,0.55)">'+lv+'</text>';
    });
    // axes
    axes.forEach(function(a){ s += '<line x1="'+cx+'" y1="'+cy+'" x2="'+px(maxR,a.a)+'" y2="'+py(maxR,a.a)+'" stroke="rgba(99,102,241,0.18)" stroke-width="1"/>'; });
    // data polygon
    var dataPts = axes.map(function(a){ var vr=(v[a.key]/max)*maxR; return px(vr,a.a)+','+py(vr,a.a); }).join(' ');
    s += '<polygon points="'+dataPts+'" fill="rgba(99,102,241,0.22)" stroke="rgba(129,140,248,1)" stroke-width="2" stroke-linejoin="round"/>';
    // dots
    axes.forEach(function(a){ var vr=(v[a.key]/max)*maxR; s += '<circle cx="'+px(vr,a.a)+'" cy="'+py(vr,a.a)+'" r="3.5" fill="rgba(129,140,248,1)" stroke="rgba(30,27,75,0.8)" stroke-width="1.5"/>'; });
    // category labels
    var lr = maxR + 28;
    axes.forEach(function(a){
      var lx = px(lr, a.a), ly = (parseFloat(py(lr,a.a)) + a.ldy).toFixed(1);
      s += '<text x="'+lx+'" y="'+ly+'" text-anchor="'+a.la+'" font-family="Inter,sans-serif" font-size="12" font-weight="500" letter-spacing="0.06em" fill="rgba(155,165,190,0.95)">'+a.label+'</text>';
    });
    // value labels
    axes.forEach(function(a){
      var vr=(v[a.key]/max)*maxR, vlr=vr+17;
      var vx=px(vlr,a.a), vy=(parseFloat(py(vlr,a.a))+5).toFixed(1);
      s += '<text x="'+vx+'" y="'+vy+'" text-anchor="middle" font-family="Inter,sans-serif" font-size="14" font-weight="700" fill="rgba(129,140,248,1)">'+v[a.key].toFixed(1)+'</text>';
    });
    return '<svg viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:'+W+'px;display:block;margin:0 auto;overflow:visible;">'+s+'</svg>';
  }

  document.querySelectorAll('.radar-chart').forEach(function(el) {
    el.innerHTML = buildRadarSVG({
      core:    +(el.dataset.core    || 0),
      product: +(el.dataset.product || 0),
      visual:  +(el.dataset.visual  || 0),
      content: +(el.dataset.content || 0),
      lead:    +(el.dataset.lead    || 0),
    });
  });
})();

function downloadPDF(name) {
  var prev = document.title;
  document.title = 'MPCraft · ' + name;
  window.print();
  document.title = prev;
}

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
