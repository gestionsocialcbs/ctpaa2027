/* CTPAA 2027 · Lector HTML5 — sin dependencias */
(() => {
  'use strict';

  const TOTAL = 98;
  const RATIO = 1615 / 2090;               // ancho / alto de página
  const pad3 = n => String(n).padStart(3, '0');
  const V = '3';  // incrementar al reemplazar las páginas (evita caché del navegador)
  const src = n => `pages/p${pad3(n)}.webp?v=${V}`;
  const thumb = n => `thumbs/t${pad3(n)}.webp?v=${V}`;

  /* ── Estructura del documento (páginas reales del PDF) ── */
  const C = { ps: 'var(--guinda)', dc: 'var(--oro)', cfd: 'var(--verde)', cat: 'var(--seg-cat)' };
  const TOC = [
    { n: '', t: 'Portada', p: 1 },
    { n: '', t: 'Validación', p: 2 },
    { n: '', t: 'Contenido', p: 3 },
    { n: '01', t: 'Introducción', p: 4 },
    { n: '02', t: 'Objetivo', p: 5 },
    { n: '03', t: 'Marco estratégico', p: 6, c: [
      { t: 'Alineación a la Ley del Seguro Social', p: 6 },
      { t: 'Mapa estratégico de la DPES', p: 7 },
      { t: 'Nuevo modelo y ejes estratégicos', p: 7 } ] },
    { n: '04', t: 'Propuesta de crecimiento 2027', p: 9, c: [
      { t: 'Líneas de acción', p: 9 },
      { t: 'Comportamiento histórico del PAA', p: 10 },
      { t: 'Meta mínima de inscripción por OOAD', p: 11 } ] },
    { n: '05', t: 'Estrategias de Bienestar Social 2027', p: 12 },
    { n: '06', t: 'Fundamentos y premisas para el registro del PAA', p: 13, c: [
      { t: 'Ámbito, responsables y sujetos', p: 13 },
      { t: 'Premisa para la programación', p: 14 },
      { t: 'Personal, cursos y Centros de Extensión', p: 15 },
      { t: 'Programación, registro y autorización', p: 17 } ] },
    { n: '07', t: 'Premisas de programación por área', p: 19, c: [
      { t: 'Promoción de la Salud (PASS y CASSAAM)', p: 20, area: C.ps, k: '1' },
      { t: 'Desarrollo Cultural', p: 44, area: C.dc, k: '2' },
      { t: 'Cultura Física y Deporte', p: 60, area: C.cfd, k: '3' },
      { t: 'Capacitación y Adiestramiento Técnico', p: 73, area: C.cat, k: '4' },
      { t: 'CECART', p: 83, area: C.cat, k: '4' } ] },
    { n: '08', t: 'Calendario y agenda vigente', p: 87, c: [
      { t: 'Calendario de procesos operativos 2027', p: 87 },
      { t: 'Cuenta de días hábiles', p: 88 },
      { t: 'Agenda de Salud y Bienestar Social 2027', p: 89 } ] },
    { n: '09', t: 'Clasificación de Unidades Operativas', p: 90 },
    { n: '10', t: 'Catálogo de Centros de Extensión', p: 92 },
    { n: '11', t: 'Definiciones', p: 93 },
    { n: 'A', t: 'Anexo 1 · Estados y municipios prioritarios', p: 95 },
    { n: '', t: 'Contraportada', p: 98 }
  ];

  /* Segmentos de la barra de avance (inicio, fin, color, etiqueta) */
  const SEGMENTS = [
    [1, 3, 'var(--ink-3)', 'Portada y contenido'],
    [4, 4, 'var(--verde)', '01 · Introducción'],
    [5, 5, 'var(--verde)', '02 · Objetivo'],
    [6, 8, 'var(--verde)', '03 · Marco estratégico'],
    [9, 11, 'var(--verde)', '04 · Propuesta de crecimiento 2027'],
    [12, 12, 'var(--verde)', '05 · Estrategias de Bienestar Social'],
    [13, 18, 'var(--verde)', '06 · Fundamentos y premisas'],
    [19, 19, 'var(--verde)', '07 · Premisas de programación por área'],
    [20, 43, C.ps, '07.1 · Promoción de la Salud'],
    [44, 59, C.dc, '07.2 · Desarrollo Cultural'],
    [60, 72, C.cfd, '07.3 · Cultura Física y Deporte'],
    [73, 86, C.cat, '07.4 · Capacitación y Adiestramiento Técnico'],
    [87, 89, 'var(--verde)', '08 · Calendario y agenda vigente'],
    [90, 91, 'var(--verde)', '09 · Clasificación de Unidades Operativas'],
    [92, 92, 'var(--verde)', '10 · Catálogo de Centros de Extensión'],
    [93, 94, 'var(--verde)', '11 · Definiciones'],
    [95, 97, 'var(--verde)', 'Anexo 1 · Estados y municipios prioritarios'],
    [98, 98, 'var(--ink-3)', 'Contraportada']
  ];
  const segOf = p => SEGMENTS.find(s => p >= s[0] && p <= s[1]);

  /* Zonas activas del índice impreso (página 3), coordenadas en puntos PDF */
  const HOTSPOTS = [
    [151, 161, 4], [175, 185, 5], [199, 209, 6], [216.5, 227, 6], [233, 243.5, 7], [249.5, 260, 7],
    [272.7, 283.2, 9], [290.7, 301.2, 9], [307.2, 317.7, 10], [323.7, 334.2, 11], [347, 357.5, 12],
    [371, 381.5, 13], [389, 399.5, 13], [405.5, 416, 14], [422, 432.5, 15], [438.5, 449, 17],
    [461.7, 472.2, 19], [479, 489.5, 20], [495.5, 506, 44], [512, 522.5, 60], [529.2, 539.7, 73],
    [552.5, 563, 87], [569.7, 580.2, 87], [586.2, 596.7, 88], [602.7, 613.2, 89], [626, 636.5, 90],
    [650.7, 661.2, 92], [674.7, 685.2, 93], [698.7, 709.2, 95]
  ];

  /* ── Referencias ── */
  const $ = id => document.getElementById(id);
  const body = document.body;
  const stage = $('stage'), book = $('book'), wrap = stage.parentElement;
  const range = $('range'), pageInput = $('pageInput'), bubble = $('bubble');
  const TEXT = window.CTPAA_TEXT || [];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const store = {
    get(k, d) { try { const v = localStorage.getItem('ctpaa27:' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('ctpaa27:' + k, JSON.stringify(v)); } catch {} }
  };

  const defaultMode = () => innerWidth < 760 ? 'scroll' : 'single';
  const state = {
    page: 1,
    mode: store.get('mode', defaultMode()),
    zoom: 1
  };
  if (!['scroll', 'single', 'spread'].includes(state.mode)) state.mode = defaultMode();
  if (innerWidth < 400 && state.mode === 'spread') state.mode = 'single';

  /* ── Construcción de páginas ── */
  function makePage(n, eager) {
    const fig = document.createElement('figure');
    fig.className = 'page';
    fig.id = 'page-' + n;
    fig.dataset.p = n;
    const img = new Image(1615, 2090);
    img.alt = `Página ${n} de ${TOTAL}`;
    img.decoding = 'async';
    img.loading = eager ? 'eager' : 'lazy';
    img.draggable = false;
    img.src = src(n);
    fig.append(img);
    if (TEXT[n - 1]) {
      const t = document.createElement('div');
      t.className = 'ptext';
      t.textContent = TEXT[n - 1];
      fig.append(t);
    }
    if (n === 3) {
      for (const [y0, y1, target] of HOTSPOTS) {
        const a = document.createElement('a');
        a.className = 'hot';
        a.href = '#p=' + target;
        const item = flatToc.filter(i => i.p === target).pop();
        a.setAttribute('aria-label', `Ir a ${item ? item.t : 'página ' + target}, página ${target}`);
        a.style.left = (50 / 612 * 100) + '%';
        a.style.width = ((562 - 50) / 612 * 100) + '%';
        a.style.top = ((y0 - 3) / 792 * 100) + '%';
        a.style.height = ((y1 - y0 + 6) / 792 * 100) + '%';
        a.addEventListener('click', e => { e.preventDefault(); goTo(target); });
        fig.append(a);
      }
    }
    return fig;
  }

  /* Pliegos: en modo Libro la portada queda a la derecha (como un libro impreso) */
  const lrOf = p => {
    if (state.mode !== 'spread') return { one: true, l: null, r: p };
    if (p === 1) return { l: null, r: 1 };
    const s = p % 2 === 0 ? p : p - 1;
    return { l: s, r: s + 1 <= TOTAL ? s + 1 : null };
  };
  const spreadOf = p => { const s = lrOf(p); return s.one ? [p] : [s.l, s.r].filter(Boolean); };
  const spreadIndex = p => state.mode === 'spread' ? (p === 1 ? 0 : Math.floor(p / 2)) : p - 1;

  let scrollPages = [];
  function render(dir) {
    book.className = 'book mode-' + state.mode;
    wrap.className = 'stage-wrap mode-' + state.mode;
    book.textContent = '';
    if (state.mode === 'scroll') {
      const frag = document.createDocumentFragment();
      scrollPages = [];
      for (let n = 1; n <= TOTAL; n++) {
        const f = makePage(n, Math.abs(n - state.page) < 2);
        scrollPages.push(f);
        frag.append(f);
      }
      book.append(frag);
      sizeScroll();
      jumpScroll(state.page, false);
    } else {
      const s = lrOf(state.page);
      const sp = layoutPaged(s.one ? { S: state.page } : { L: s.l, R: s.r });
      if (dir && !reduceMotion) sp.classList.add('fade');
      stage.scrollTo(0, 0);
      preload();
    }
    updateUI();
  }

  function sizeScroll() {
    const w = stage.clientWidth - (innerWidth < 760 ? 20 : 48);
    const base = Math.min(w, 980);
    book.style.setProperty('--pw', Math.round(base * state.zoom) + 'px');
  }

  /* Geometría de los modos paginados */
  let geo = { pw: 0, ph: 0, cols: 1 };
  function sizePaged() {
    const padding = innerWidth < 760 ? 24 : 48;
    const h = stage.clientHeight - padding, w = stage.clientWidth - padding;
    const cols = state.mode === 'spread' ? 2 : 1;
    const fit = Math.min(h, w / (cols * RATIO));
    const ph = Math.floor(fit * state.zoom), pw = Math.round(ph * RATIO);
    geo = { pw, ph, cols };
    const sp = book.querySelector('.spread');
    if (!sp) return;
    sp.style.width = cols * pw + 'px';
    sp.style.height = ph + 'px';
    sp.querySelectorAll(':scope > .slot').forEach(sl => {
      sl.style.width = pw + 'px';
      sl.style.height = ph + 'px';
      sl.style.left = (sl.dataset.side === 'R' && cols === 2 ? pw : 0) + 'px';
    });
  }
  function layoutPaged(slots) {
    book.textContent = '';
    const sp = document.createElement('div');
    sp.className = 'spread';
    const add = (side, n) => {
      const d = document.createElement('div');
      d.className = 'slot ' + side + (n ? ' paper' : '');
      d.dataset.side = side;
      if (n) d.append(makePage(n, true));
      const c = document.createElement('div');
      c.className = 'cast';
      d.append(c);
      sp.append(d);
    };
    if ('S' in slots) add('S', slots.S);
    else { add('L', slots.L); add('R', slots.R); }
    book.append(sp);
    sizePaged();
    return sp;
  }
  function preload() {
    const nxt = spreadOf(state.page);
    [nxt[nxt.length - 1] + 1, nxt[nxt.length - 1] + 2, nxt[0] - 1, nxt[0] - 2].forEach(n => {
      if (n >= 1 && n <= TOTAL) { const i = new Image(); i.src = src(n); }
    });
  }

  /* ── Cambio de página animado (hoja que se curva en 3D, como en el PAT DATMP 2027) ── */
  const DUR = 1050, EASE = 'cubic-bezier(.42,.02,.28,1)';
  let busy = false, queued = null;
  function pageFace(n, w, h) {
    if (!n) {
      const d = document.createElement('div');
      d.className = 'blank';
      d.style.width = w + 'px'; d.style.height = h + 'px';
      return d;
    }
    const i = new Image();
    i.src = src(n); i.alt = ''; i.draggable = false;
    i.style.cssText = `display:block;width:${w}px;height:${h}px`;
    return i;
  }
  function mkFace(cls, content, off, sw, h) {
    const d = document.createElement('div');
    d.className = 'cface ' + cls;
    d.style.width = (sw + 1) + 'px'; d.style.height = h + 'px';
    content.style.position = 'absolute'; content.style.top = '0'; content.style.left = (off + .5) + 'px';
    d.append(content);
    const sh = document.createElement('div');
    sh.className = 'cshade';
    d.append(sh);
    return { el: d, sh };
  }
  function makeCurl(host, x, w, h, front, back, origin) {
    const root = document.createElement('div');
    root.className = 'curl';
    root.setAttribute('aria-hidden', 'true');
    root.style.cssText = `left:${x}px;top:0;width:${w}px;height:${h}px`;
    const n = innerWidth < 640 ? 7 : 12, sw = w / n, L = origin === 'left', strips = [];
    let parent = root;
    for (let i = 0; i < n; i++) {
      const s = document.createElement('div');
      s.className = 'strip';
      s.style.left = (L ? (i === 0 ? 0 : sw) : (i === 0 ? w - sw : -sw)) + 'px';
      s.style.width = sw + 'px'; s.style.height = h + 'px';
      s.style.transformOrigin = (L ? 'left' : 'right') + ' center';
      const F = mkFace('front', pageFace(front, w, h), L ? -(i * sw) : -(w - (i + 1) * sw), sw, h);
      const B = mkFace('back', pageFace(back, w, h), L ? -(w - (i + 1) * sw) : -(i * sw), sw, h);
      s.append(F.el, B.el);
      parent.append(s);
      strips.push({ el: s, fs: F.sh, bs: B.sh });
      parent = s;
    }
    host.append(root);
    return { el: root, strips };
  }
  function curlRun(c, a0, a1, opFn, onEnd) {
    const n = c.strips.length, sg = a1 > a0 ? 1 : -1, maxB = (innerWidth < 640 ? 55 : 70) / n;
    const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    let t0 = null;
    function frame(ts) {
      if (t0 === null) t0 = ts;
      const t = Math.min(1, (ts - t0) / DUR), r = a0 + (a1 - a0) * ease(t);
      const b = Math.min(maxB * Math.pow(Math.sin(Math.PI * t), .7), Math.abs(a1 - r) / n);
      for (let i = 0; i < n; i++) {
        const st = c.strips[i], cs = Math.cos((r + sg * b * i) * Math.PI / 180);
        st.el.style.transform = 'rotateY(' + (i === 0 ? r : sg * b) + 'deg)';
        st.fs.style.opacity = ((1 - cs) * .3).toFixed(3);
        st.bs.style.opacity = ((1 + cs) * .3).toFixed(3);
      }
      if (opFn) c.el.style.opacity = opFn(t);
      if (t < 1) requestAnimationFrame(frame); else onEnd();
    }
    requestAnimationFrame(frame);
  }
  function castShadow(sp, side) {
    const cast = sp.querySelector(`.slot.${side} .cast`);
    if (cast && cast.animate) cast.animate([{ opacity: .9 }, { opacity: 0 }], { duration: DUR, easing: EASE, fill: 'forwards' });
  }
  function turn(to, dir) {
    busy = true;
    const from = state.page, A = lrOf(from), B = lrOf(to);
    state.page = to;
    updateUI();
    const { pw, ph } = geo;
    const finish = () => {
      busy = false;
      render();
      if (queued !== null) { const q = queued; queued = null; goTo(q); }
    };
    if (state.mode === 'spread') {
      if (dir > 0) {
        const sp = layoutPaged({ L: A.l, R: B.r });
        castShadow(sp, 'R');
        curlRun(makeCurl(sp, pw, pw, ph, A.r, B.l, 'left'), 0, -180, null, finish);
      } else {
        const sp = layoutPaged({ L: B.l, R: A.r });
        castShadow(sp, 'L');
        curlRun(makeCurl(sp, 0, pw, ph, A.l, B.r, 'right'), 0, 180, null, finish);
      }
    } else if (dir > 0) {
      const sp = layoutPaged({ S: to });
      curlRun(makeCurl(sp, 0, pw, ph, from, null, 'left'), 0, -175,
        t => t < .6 ? 1 : Math.max(0, 1 - (t - .6) / .4), finish);
    } else {
      const sp = layoutPaged({ S: from });
      curlRun(makeCurl(sp, 0, pw, ph, to, null, 'left'), -175, 0,
        t => t > .4 ? 1 : t / .4, finish);
    }
  }

  function jumpScroll(n, smooth) {
    const el = scrollPages[n - 1];
    if (!el) return;
    lockScrollSpy = true;
    stage.scrollTo({ top: el.offsetTop - (innerWidth < 760 ? 10 : 20), behavior: smooth && !reduceMotion ? 'smooth' : 'auto' });
    clearTimeout(lockTimer);
    lockTimer = setTimeout(() => { lockScrollSpy = false; }, smooth ? 700 : 80);
  }

  /* ── Navegación ── */
  function goTo(n, opts = {}) {
    n = Math.max(1, Math.min(TOTAL, parseInt(n, 10) || 1));
    if (state.mode === 'scroll') {
      const smooth = Math.abs(n - state.page) <= 1;
      state.page = n;
      jumpScroll(n, smooth);
      updateUI();
    } else if (busy) {
      queued = n;
    } else {
      const a = spreadIndex(state.page), b = spreadIndex(n);
      if (a === b && !opts.force) { state.page = n; updateUI(); }
      else if (Math.abs(b - a) === 1 && !reduceMotion && state.zoom <= 1.001) turn(n, b > a ? 1 : -1);
      else { state.page = n; render(b > a ? 1 : -1); }
    }
    if (innerWidth <= 1020 && opts.closePanel !== false && !body.classList.contains('panel-closed') && opts.fromPanel) togglePanel(false);
  }
  function step(d) {
    const base = busy && queued !== null ? queued : state.page;
    if (state.mode === 'spread') {
      const s = spreadOf(base);
      goTo(d > 0 ? s[s.length - 1] + 1 : s[0] - 1);
    } else goTo(base + d);
  }

  /* Seguimiento de página en modo continuo */
  let lockScrollSpy = false, lockTimer, spyRaf;
  stage.addEventListener('scroll', () => {
    if (state.mode !== 'scroll' || lockScrollSpy) return;
    cancelAnimationFrame(spyRaf);
    spyRaf = requestAnimationFrame(() => {
      const y = stage.scrollTop + stage.clientHeight * 0.35;
      let cur = 1;
      for (let i = 0; i < scrollPages.length; i++) {
        if (scrollPages[i].offsetTop <= y) cur = i + 1; else break;
      }
      if (cur !== state.page) { state.page = cur; updateUI(); }
    });
  }, { passive: true });

  /* ── Interfaz ── */
  const tocLinks = [], thumbLinks = [];
  const flatToc = [];
  TOC.forEach(it => { flatToc.push(it); (it.c || []).forEach(c => flatToc.push({ ...c, parent: it })); });

  function buildToc() {
    const ol = $('toc');
    TOC.forEach(it => {
      const li = document.createElement('li');
      li.append(tocLink(it, it.n));
      if (it.c) {
        const sub = document.createElement('ol');
        sub.className = 'sub';
        it.c.forEach(c => {
          const sli = document.createElement('li');
          const a = tocLink(c, c.k || '');
          if (c.area) { a.classList.add('area'); a.style.setProperty('--c', c.area); }
          sli.append(a);
          sub.append(sli);
        });
        li.append(sub);
      }
      ol.append(li);
    });
  }
  function tocLink(it, num) {
    const a = document.createElement('a');
    a.href = '#p=' + it.p;
    a.dataset.p = it.p;
    a.innerHTML = `<span class="num"></span><span class="t"></span><span class="pg"></span>`;
    a.querySelector('.num').textContent = num;
    a.querySelector('.t').textContent = it.t;
    a.querySelector('.pg').textContent = it.p;
    a.addEventListener('click', e => { e.preventDefault(); goTo(it.p, { fromPanel: true }); });
    tocLinks.push({ a, it });
    return a;
  }

  function buildThumbs() {
    const ol = $('thumbs');
    for (let n = 1; n <= TOTAL; n++) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#p=' + n;
      const img = new Image(220, 285);
      img.loading = 'lazy'; img.decoding = 'async'; img.alt = ''; img.src = thumb(n);
      a.append(img, document.createTextNode(n));
      a.setAttribute('aria-label', 'Página ' + n);
      a.addEventListener('click', e => { e.preventDefault(); goTo(n, { fromPanel: true }); });
      li.append(a); ol.append(li);
      thumbLinks.push(a);
    }
  }

  function buildTrack() {
    const track = $('track');
    SEGMENTS.forEach(s => {
      const i = document.createElement('i');
      i.style.flex = (s[1] - s[0] + 1);
      const b = document.createElement('b');
      b.style.setProperty('--c', s[2]);
      i.append(b);
      track.append(i);
    });
  }

  function scrollInPane(el, pane) {
    const r = el.getBoundingClientRect(), pr = pane.getBoundingClientRect();
    if (r.top < pr.top + 8 || r.bottom > pr.bottom - 8) pane.scrollTop += r.top - pr.top - pane.clientHeight / 2 + r.height / 2;
  }
  let hashTimer;
  function updateUI() {
    const p = state.page;
    const shown = state.mode === 'scroll' ? [p] : spreadOf(p);
    const last = shown[shown.length - 1];
    range.value = p;
    range.setAttribute('aria-valuetext', `Página ${p} de ${TOTAL}`);
    if (document.activeElement !== pageInput) pageInput.value = shown.length > 1 ? `${shown[0]}–${last}` : p;
    pageInput.style.width = shown.length > 1 ? '64px' : '';
    $('prev').disabled = $('edgePrev').disabled = shown[0] <= 1;
    $('next').disabled = $('edgeNext').disabled = last >= TOTAL;

    // Índice: el elemento más profundo cuya página <= actual
    let cur = null;
    tocLinks.forEach(({ it }) => { if (it.p <= last) cur = it; });
    tocLinks.forEach(({ a, it }) => {
      const on = it === cur;
      if (on && a.getAttribute('aria-current') !== 'true' && !$('pane-toc').hidden) scrollInPane(a, $('pane-toc'));
      a.setAttribute('aria-current', on ? 'true' : 'false');
    });
    thumbLinks.forEach((a, i) => {
      const on = shown.includes(i + 1);
      if (on && i + 1 === shown[0] && a.getAttribute('aria-current') !== 'true' && !$('pane-thumbs').hidden) scrollInPane(a, $('pane-thumbs'));
      a.setAttribute('aria-current', on ? 'true' : 'false');
    });
    const seg = segOf(p);
    $('sectionName').textContent = seg ? seg[3] : '';

    // Avance por segmentos
    const bars = $('track').children;
    SEGMENTS.forEach((s, i) => {
      const f = p >= s[1] ? 1 : p < s[0] ? 0 : (p - s[0] + 1) / (s[1] - s[0] + 1);
      bars[i].firstChild.style.setProperty('--f', f);
    });

    clearTimeout(hashTimer);
    hashTimer = setTimeout(() => {
      history.replaceState(null, '', '#p=' + p);
      store.set('page', p);
    }, 250);
  }

  /* ── Panel lateral ── */
  function togglePanel(open) {
    const willOpen = open ?? body.classList.contains('panel-closed');
    body.classList.toggle('panel-closed', !willOpen);
    $('btnPanel').setAttribute('aria-expanded', willOpen);
    $('scrim').hidden = !(willOpen && innerWidth <= 1020);
    if (state.mode !== 'scroll') setTimeout(() => { sizePaged(); }, 260);
    else setTimeout(() => { const p = state.page; sizeScroll(); jumpScroll(p, false); }, 260);
    if (willOpen) {
      const cur = document.querySelector('.thumbs a[aria-current="true"]');
      if (cur && !$('pane-thumbs').hidden) cur.scrollIntoView({ block: 'center' });
    }
  }
  $('btnPanel').addEventListener('click', () => togglePanel());
  $('scrim').addEventListener('click', () => togglePanel(false));

  const tabs = ['toc', 'thumbs', 'search'];
  function selectTab(name) {
    tabs.forEach(t => {
      const on = t === name;
      $('tab-' + t).setAttribute('aria-selected', on);
      $('tab-' + t).tabIndex = on ? 0 : -1;
      $('pane-' + t).hidden = !on;
    });
    if (name === 'thumbs') {
      const cur = document.querySelector('.thumbs a[aria-current="true"]');
      if (cur) cur.scrollIntoView({ block: 'center' });
    }
    if (name === 'search') setTimeout(() => $('q').focus(), 30);
  }
  tabs.forEach((t, i) => {
    const el = $('tab-' + t);
    el.addEventListener('click', () => selectTab(t));
    el.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        selectTab(n); $('tab-' + n).focus();
      }
    });
  });

  /* ── Modos y zoom ── */
  function setMode(m) {
    if (m === state.mode) return;
    state.mode = m;
    state.zoom = 1;
    store.set('mode', m);
    syncModeButtons();
    render();
  }
  function syncModeButtons() {
    document.querySelectorAll('.seg button').forEach(b => b.setAttribute('aria-checked', b.dataset.mode === state.mode));
    $('zoomVal').textContent = Math.round(state.zoom * 100) + '%';
  }
  document.querySelectorAll('.seg button').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));

  const ZMIN = 0.5, ZMAX = 3;
  function setZoom(z) {
    z = Math.max(ZMIN, Math.min(ZMAX, Math.round(z * 100) / 100));
    if (z === state.zoom) return;
    if (state.mode === 'scroll') {
      const el = scrollPages[state.page - 1];
      const rel = el ? (stage.scrollTop - el.offsetTop) / el.offsetHeight : 0;
      state.zoom = z; sizeScroll();
      if (el) { lockScrollSpy = true; stage.scrollTop = el.offsetTop + rel * el.offsetHeight; setTimeout(() => lockScrollSpy = false, 60); }
    } else {
      const cx = (stage.scrollLeft + stage.clientWidth / 2) / Math.max(stage.scrollWidth, 1);
      const cy = (stage.scrollTop + stage.clientHeight / 2) / Math.max(stage.scrollHeight, 1);
      state.zoom = z; sizePaged();
      stage.scrollLeft = cx * stage.scrollWidth - stage.clientWidth / 2;
      stage.scrollTop = cy * stage.scrollHeight - stage.clientHeight / 2;
    }
    $('zoomVal').textContent = Math.round(z * 100) + '%';
  }
  $('zoomIn').addEventListener('click', () => setZoom(state.zoom + 0.25));
  $('zoomOut').addEventListener('click', () => setZoom(state.zoom - 0.25));
  $('zoomVal').addEventListener('click', () => setZoom(1));
  stage.addEventListener('wheel', e => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    setZoom(state.zoom * (e.deltaY < 0 ? 1.1 : 1 / 1.1));
  }, { passive: false });
  book.addEventListener('click', e => {
    if (state.mode === 'scroll' || e.target.closest('a') || state.zoom > 1.001) return;
    const sp = book.querySelector('.spread');
    if (!sp) return;
    const r = sp.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right) return;
    step(e.clientX - r.left > r.width / 2 ? 1 : -1);
  });

  /* ── Controles inferiores ── */
  $('prev').addEventListener('click', () => step(-1));
  $('next').addEventListener('click', () => step(1));
  $('edgePrev').addEventListener('click', () => step(-1));
  $('edgeNext').addEventListener('click', () => step(1));
  range.addEventListener('input', () => { showBubble(+range.value); });
  range.addEventListener('change', () => { goTo(range.value); hideBubble(); });

  const scrub = range.parentElement;
  function showBubble(p, x) {
    const seg = segOf(p);
    bubble.innerHTML = '<strong></strong><span></span>';
    bubble.firstChild.textContent = 'p. ' + p;
    bubble.lastChild.textContent = seg ? seg[3] : '';
    const w = scrub.clientWidth;
    const px = x ?? ((p - 1) / (TOTAL - 1)) * w;
    bubble.hidden = false;
    const bw = bubble.offsetWidth;
    bubble.style.left = Math.max(bw / 2, Math.min(w - bw / 2, px)) + 'px';
  }
  function hideBubble() { bubble.hidden = true; }
  scrub.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    const r = scrub.getBoundingClientRect();
    const x = Math.max(0, Math.min(r.width, e.clientX - r.left));
    showBubble(Math.round(x / r.width * (TOTAL - 1)) + 1, x);
  });
  scrub.addEventListener('pointerleave', hideBubble);
  range.addEventListener('blur', hideBubble);

  $('gotoForm').addEventListener('submit', e => {
    e.preventDefault();
    const n = parseInt(pageInput.value, 10);
    if (n >= 1 && n <= TOTAL) { goTo(n); stage.focus({ preventScroll: true }); }
    else { toast(`Escribe un número entre 1 y ${TOTAL}.`); updateUI(); }
  });
  pageInput.addEventListener('focus', () => { pageInput.value = state.page; pageInput.select(); });
  pageInput.addEventListener('blur', () => updateUI());

  /* ── Teclado ── */
  document.addEventListener('keydown', e => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.altKey) return;
    if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) { e.preventDefault(); setZoom(state.zoom + 0.25); return; }
    if ((e.ctrlKey || e.metaKey) && e.key === '-') { e.preventDefault(); setZoom(state.zoom - 0.25); return; }
    if ((e.ctrlKey || e.metaKey) && e.key === '0') { e.preventDefault(); setZoom(1); return; }
    if (e.ctrlKey || e.metaKey) return;
    const paged = state.mode !== 'scroll';
    switch (e.key) {
      case 'ArrowRight': if (paged || stage.scrollWidth <= stage.clientWidth) { e.preventDefault(); step(1); } break;
      case 'ArrowLeft': if (paged || stage.scrollWidth <= stage.clientWidth) { e.preventDefault(); step(-1); } break;
      case 'PageDown': if (paged) { e.preventDefault(); step(1); } break;
      case 'PageUp': if (paged) { e.preventDefault(); step(-1); } break;
      case 'Home': e.preventDefault(); goTo(1); break;
      case 'End': e.preventDefault(); goTo(TOTAL); break;
      case '/': e.preventDefault(); if (body.classList.contains('panel-closed')) togglePanel(true); selectTab('search'); break;
      case 'Escape': if (innerWidth <= 1020 && !body.classList.contains('panel-closed')) togglePanel(false); break;
    }
  });

  /* ── Gestos táctiles (modos paginados, sin zoom) ── */
  let touch = null;
  stage.addEventListener('touchstart', e => {
    if (state.mode === 'scroll' || state.zoom > 1 || e.touches.length > 1) { touch = null; return; }
    touch = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
  }, { passive: true });
  stage.addEventListener('touchend', e => {
    if (!touch) return;
    const dx = e.changedTouches[0].clientX - touch.x, dy = e.changedTouches[0].clientY - touch.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5 && Date.now() - touch.t < 700) step(dx < 0 ? 1 : -1);
    touch = null;
  }, { passive: true });

  /* ── Búsqueda ── */
  const strip = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  let INDEX = null;
  function buildIndex() {
    INDEX = TEXT.map(raw => {
      const orig = raw.replace(/\s+/g, ' ');
      let norm = '', map = [];
      for (let i = 0; i < orig.length; i++) {
        const n = strip(orig[i]);
        for (let k = 0; k < n.length; k++) { norm += n[k]; map.push(i); }
      }
      return { orig, norm, map };
    });
  }
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function search(q) {
    const results = $('results'), status = $('searchStatus');
    results.textContent = '';
    const nq = strip(q.trim()).replace(/\s+/g, ' ');
    if (nq.length < 2) { status.textContent = 'Busca por clave (p. ej. 23401), nombre de actividad o concepto.'; return; }
    if (!INDEX) buildIndex();
    let pagesHit = 0, total = 0;
    const frag = document.createDocumentFragment();
    INDEX.forEach((pg, i) => {
      let idx = pg.norm.indexOf(nq), count = 0, first = idx;
      while (idx !== -1) { count++; idx = pg.norm.indexOf(nq, idx + nq.length); }
      if (!count) return;
      pagesHit++; total += count;
      const s = pg.map[first], e = pg.map[first + nq.length - 1] + 1;
      const a0 = Math.max(0, s - 55), a1 = Math.min(pg.orig.length, e + 75);
      const snippet = (a0 > 0 ? '…' : '') + esc(pg.orig.slice(a0, s)) + '<mark>' + esc(pg.orig.slice(s, e)) + '</mark>' + esc(pg.orig.slice(e, a1)) + (a1 < pg.orig.length ? '…' : '');
      const seg = segOf(i + 1);
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#p=' + (i + 1);
      a.innerHTML = `<span class="r-head"><span>Página ${i + 1}</span><span>${count} ${count === 1 ? 'coincidencia' : 'coincidencias'}</span></span>` +
        `<span class="r-sec" style="display:block;font-size:11.5px;color:var(--ink-3);margin-bottom:2px">${esc(seg ? seg[3] : '')}</span>${snippet}`;
      a.addEventListener('click', ev => { ev.preventDefault(); goTo(i + 1, { fromPanel: true }); });
      li.append(a); frag.append(li);
    });
    results.append(frag);
    status.textContent = pagesHit
      ? `${total} ${total === 1 ? 'coincidencia' : 'coincidencias'} en ${pagesHit} ${pagesHit === 1 ? 'página' : 'páginas'}.`
      : `Sin resultados para “${q.trim()}”. Prueba con otra palabra o con la clave de la actividad.`;
  }
  let qTimer;
  $('q').addEventListener('input', e => { clearTimeout(qTimer); qTimer = setTimeout(() => search(e.target.value), 160); });
  $('searchForm').addEventListener('submit', e => { e.preventDefault(); search($('q').value); const f = $('results').querySelector('a'); if (f) f.click(); });

  /* ── Compartir, pantalla completa, descarga ── */
  let toastTimer;
  function toast(msg, action) {
    const t = $('toast');
    t.textContent = msg;
    if (action) {
      const b = document.createElement('button');
      b.textContent = action.label;
      b.addEventListener('click', () => { action.fn(); t.classList.remove('show'); });
      t.append(b);
      t.style.pointerEvents = 'auto';
    } else t.style.pointerEvents = 'none';
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), action ? 6000 : 2600);
  }
  $('btnShare').addEventListener('click', async () => {
    const url = location.href.split('#')[0] + '#p=' + state.page;
    try { await navigator.clipboard.writeText(url); toast(`Enlace a la página ${state.page} copiado.`); }
    catch { prompt('Copia este enlace:', url); }
  });
  $('btnFull').addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  });
  document.addEventListener('fullscreenchange', () => setTimeout(onResize, 120));
  $('btnDownload').addEventListener('click', () => toast('Descargando el PDF (36 MB)…'));

  /* ── Redimensionar ── */
  let rzTimer, lastW = innerWidth;
  function onResize() {
    if (state.mode === 'scroll') { const p = state.page; sizeScroll(); jumpScroll(p, false); }
    else { if (state.mode === 'spread' && innerWidth < 400) { setMode('single'); return; } if (!busy) sizePaged(); }
    if ((lastW > 1020) !== (innerWidth > 1020)) togglePanel(innerWidth > 1020);
    lastW = innerWidth;
  }
  addEventListener('resize', () => { clearTimeout(rzTimer); rzTimer = setTimeout(onResize, 120); });

  /* ── Hash (#p=N) ── */
  const fromHash = () => { const m = location.hash.match(/p=(\d+)/); return m ? +m[1] : null; };
  addEventListener('hashchange', () => { const n = fromHash(); if (n && n !== state.page) goTo(n); });

  /* ── Inicio ── */
  buildToc();
  buildThumbs();
  buildTrack();
  syncModeButtons();
  if (innerWidth <= 1020) { body.classList.add('panel-closed'); $('btnPanel').setAttribute('aria-expanded', 'false'); }
  const hashPage = fromHash();
  const saved = store.get('page', 1);
  state.page = Math.max(1, Math.min(TOTAL, hashPage || 1));
  render();
  if (!hashPage && saved > 1 && saved <= TOTAL) {
    toast(`Te quedaste en la página ${saved}.`, { label: 'Continuar', fn: () => goTo(saved) });
  }
})();
