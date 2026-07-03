/* ============================================================================
   SDET Mastery — SPA
   Hash router + 3 vistas (home / módulo / repaso) sobre window.SDET_CONTENT.
   Contenido = Markdown tematizado. Progreso persistido en localStorage.
   ========================================================================== */
(function () {
  'use strict';

  var C = window.SDET_CONTENT || { courses: [], modules: {} };
  var COURSES = C.courses;
  var MODULES = C.modules;
  var root = document.getElementById('root');

  /* --------------------------------------------------------- persistencia */
  var LS = {
    read: function (k, fb) {
      try { return JSON.parse(localStorage.getItem(k)) || fb; } catch (e) { return fb; }
    },
    write: function (k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
    }
  };
  var checks = LS.read('sdet:checks', {});   // { "slug#c0": true }
  var marks = LS.read('sdet:marks', {});     // { "slug#q0": "known"|"review" }
  var seeded = LS.read('sdet:seeded', {});   // { slug: true }
  var answers = LS.read('sdet:answers', {}); // { "slug#q0": "markdown override" }
  function saveChecks() { LS.write('sdet:checks', checks); }
  function saveMarks() { LS.write('sdet:marks', marks); }
  function saveAnswers() { LS.write('sdet:answers', answers); }

  var DEFAULT_NAME = 'Mauro J.';
  function getName() { try { return localStorage.getItem('sdet:name') || DEFAULT_NAME; } catch (e) { return DEFAULT_NAME; } }
  function setName(v) { try { localStorage.setItem('sdet:name', v); } catch (e) {} }
  function initials(name) {
    var p = String(name).trim().split(/\s+/);
    return (((p[0] || '')[0] || '') + ((p[1] || '')[0] || '')).toUpperCase() || 'S';
  }
  function answerFor(id, baseline) { return (answers[id] != null) ? answers[id] : baseline; }

  /* -------------------------------------------------------------- helpers */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function md2html(s) { return marked.parse(s || ''); }

  /* ---------------------------------------------------- markdown → secciones
     Un módulo se divide en secciones cortando en los H2 que empiezan con un
     emoji (carácter no-ASCII). Los H2 ASCII (p.ej. "## Matriz de riesgo")
     quedan dentro de la sección actual. */
  var EMOJI_META = {
    '🗺️': { icon: 'indigo', kicker: 'indigo' },
    '🗺': { icon: 'indigo', kicker: 'indigo' },
    '📖': { icon: '', kicker: '' },
    '🔨': { icon: 'amber', kicker: 'amber' },
    '🎯': { icon: 'teal', kicker: 'teal' },
    '✅': { icon: 'teal', kicker: 'teal' },
    '💬': { icon: 'indigo', kicker: 'indigo' },
    '🔗': { icon: 'teal', kicker: 'teal' },
    '🧭': { icon: '', kicker: '' },
    '🎤': { icon: 'indigo', kicker: 'indigo' },
    '🏆': { icon: 'amber', kicker: 'amber' }
  };

  function isEmojiHeading(line) {
    var m = /^##\s+(.+)$/.exec(line);
    if (!m) return null;
    var first = m[1].charCodeAt(0);
    // non-ASCII leading char => emoji-prefixed section heading
    if (first < 128) return null;
    return m[1].trim();
  }

  function splitEmoji(headingText) {
    // "🗺️ Mapa visual — qué evalúa" -> { emoji:"🗺️", title:"Mapa visual — ..." }
    var sp = headingText.indexOf(' ');
    if (sp === -1) return { emoji: headingText, title: '' };
    return { emoji: headingText.slice(0, sp), title: headingText.slice(sp + 1).trim() };
  }

  var _cache = {};
  function parseModule(slug) {
    if (_cache[slug]) return _cache[slug];
    var mod = MODULES[slug];
    var lines = (mod.markdown || '').split('\n');
    var i = 0, n = lines.length;
    var subtitle = '';

    // skip to after H1 and capture the leading blockquote as subtitle
    while (i < n && !/^#\s+/.test(lines[i])) i++;
    if (i < n) i++; // consume H1
    while (i < n) {
      var l = lines[i];
      if (/^\s*$/.test(l)) { i++; continue; }
      if (/^>\s?/.test(l)) {
        subtitle += l.replace(/^>\s?/, '').replace(/\*\*Resultado:\*\*\s*/i, '').trim() + ' ';
        i++;
      } else break;
    }
    subtitle = subtitle.trim();

    var sections = [];
    var cur = null;
    for (; i < n; i++) {
      var head = isEmojiHeading(lines[i]);
      if (head) {
        var s = splitEmoji(head);
        cur = { emoji: s.emoji, title: s.title, body: [] };
        sections.push(cur);
      } else if (cur) {
        cur.body.push(lines[i]);
      }
      // lines before the first emoji-section are dropped (only intro/H1 area)
    }
    sections.forEach(function (sec, idx) {
      sec.body = sec.body.join('\n').trim();
      sec.num = idx + 1;
      sec.id = 'sec-' + idx;
      var base = sec.emoji.replace(/️/g, '');
      sec.type = base === '✅' ? 'checklist' : (base === '💬' ? 'interview' : 'generic');
      sec.meta = EMOJI_META[sec.emoji] || EMOJI_META[base] || { icon: '', kicker: '' };
    });

    var parsed = { slug: slug, subtitle: subtitle, sections: sections };
    _cache[slug] = parsed;
    return parsed;
  }

  /* ----------------------------------------------------- checklist parsing */
  function parseChecklist(body) {
    var lines = body.split('\n');
    var items = [], cur = null, preamble = [];
    for (var i = 0; i < lines.length; i++) {
      var m = /^- \[([ xX])\]\s+(.*)$/.exec(lines[i]);
      if (m) {
        cur = { done: m[1].toLowerCase() === 'x', text: m[2], note: [] };
        items.push(cur);
      } else if (cur && /^\s+\S/.test(lines[i])) {
        cur.note.push(lines[i].replace(/^ {2}/, ''));
      } else if (cur && /^\s*$/.test(lines[i])) {
        cur.note.push('');
      } else if (!cur) {
        preamble.push(lines[i]);
      }
    }
    items.forEach(function (it) { it.note = it.note.join('\n').trim(); });
    return { preamble: preamble.join('\n').trim(), items: items };
  }

  /* ---------------------------------------------------- interview parsing  */
  function parseInterview(body) {
    var out = [];
    // 1) <details><summary>Q</summary>A</details>  (módulo especial)
    var re = /<details>\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g, dm;
    while ((dm = re.exec(body))) {
      out.push({ q: cleanQ(dm[1]), a: dm[2].trim() });
    }
    if (out.length) return { type: 'details', items: out };

    // 2) numbered list "1. *"question"* (pista)\n  - answer"
    var lines = body.split('\n'), cur = null, preamble = [];
    for (var i = 0; i < lines.length; i++) {
      var m = /^\d+\.\s+(.*)$/.exec(lines[i]);
      if (m) {
        cur = { q: cleanQ(m[1]), a: [] };
        out.push(cur);
      } else if (cur && /^\s+\S/.test(lines[i])) {
        cur.a.push(lines[i].replace(/^ {2}/, ''));
      } else if (cur && /^\s*$/.test(lines[i])) {
        cur.a.push('');
      } else if (!cur) {
        preamble.push(lines[i]);
      }
    }
    if (!out.length) return null;
    out.forEach(function (o) { o.a = o.a.join('\n').trim(); });
    return { type: 'list', items: out, preamble: preamble.join('\n').trim() };
  }
  function cleanQ(s) {
    return String(s).trim()
      .replace(/^\*+/, '').replace(/\*+$/, '')
      .replace(/^"|"$/g, '').replace(/^"|"$/g, '').trim();
  }

  /* --------------------------------------------------------- progreso calc */
  function checklistOf(slug) {
    var p = parseModule(slug);
    for (var i = 0; i < p.sections.length; i++)
      if (p.sections[i].type === 'checklist')
        return parseChecklist(p.sections[i].body).items;
    return [];
  }
  function ensureSeeded(slug) {
    if (seeded[slug]) return;
    var items = checklistOf(slug), changed = false;
    for (var i = 0; i < items.length; i++) {
      var k = slug + '#c' + i;
      if (checks[k] === undefined && items[i].done) { checks[k] = true; changed = true; }
    }
    seeded[slug] = true;
    LS.write('sdet:seeded', seeded);
    if (changed) saveChecks();
  }
  function moduleProgress(slug) {
    ensureSeeded(slug);
    var items = checklistOf(slug), total = items.length, done = 0;
    for (var i = 0; i < total; i++) if (checks[slug + '#c' + i]) done++;
    return { total: total, done: done, pct: total ? done / total : null };
  }
  function courseProgress(course) {
    var itemsDone = 0, itemsTotal = 0, modsComplete = 0, modsWithCk = 0;
    course.modules.forEach(function (m) {
      var p = moduleProgress(m.slug);
      if (p.total > 0) {
        itemsTotal += p.total; itemsDone += p.done; modsWithCk++;
        if (p.pct === 1) modsComplete++;
      }
    });
    return {
      pct: itemsTotal ? itemsDone / itemsTotal : 0,
      modsComplete: modsComplete, modsWithCk: modsWithCk
    };
  }
  function overallPct() {
    var d = 0, t = 0;
    COURSES.forEach(function (c) {
      c.modules.forEach(function (m) {
        var p = moduleProgress(m.slug); d += p.done; t += p.total;
      });
    });
    return t ? Math.round((d / t) * 100) : 0;
  }

  /* ------------------------------------------------------------ rich md    */
  function renderRich(md, container) {
    var blocks = [];
    var pre = (md || '').replace(/```mermaid\n([\s\S]*?)```/g, function (m, code) {
      blocks.push(code); return '\n@@MERMAID_' + (blocks.length - 1) + '@@\n';
    });
    var htmlStr = marked.parse(pre);
    function repl(m, idx) { return '<div class="mermaid">' + esc(blocks[+idx]) + '</div>'; }
    htmlStr = htmlStr.replace(/<p>@@MERMAID_(\d+)@@<\/p>/g, repl).replace(/@@MERMAID_(\d+)@@/g, repl);
    container.innerHTML = htmlStr;
    postProcess(container);
  }

  function postProcess(container) {
    // tables -> scrollable wrapper
    container.querySelectorAll('table').forEach(function (t) {
      if (t.parentElement && t.parentElement.classList.contains('sd-tablewrap')) return;
      var w = el('div', 'sd-tablewrap');
      t.parentNode.insertBefore(w, t); w.appendChild(t);
    });
    // code blocks -> chrome + highlight
    container.querySelectorAll('pre > code').forEach(function (code) {
      var pre = code.parentElement;
      if (pre.parentElement && pre.parentElement.classList.contains('sd-code')) return;
      var lang = (code.className.match(/language-(\w+)/) || [])[1] || 'code';
      var wrap = el('div', 'sd-code');
      var bar = el('div', 'sd-code-bar');
      bar.appendChild(el('span', 'sd-code-lang', esc(lang)));
      var btn = el('button', 'sd-code-copy', 'Copiar'); btn.setAttribute('data-copy', '1');
      bar.appendChild(btn);
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(bar); wrap.appendChild(pre);
      try { if (window.hljs) hljs.highlightElement(code); } catch (e) {}
    });
    // mermaid
    var nodes = container.querySelectorAll('.mermaid');
    if (nodes.length && window.mermaid) {
      try { mermaid.run({ nodes: nodes }); } catch (e) {}
    }
  }

  // copy handler (delegado)
  document.addEventListener('click', function (ev) {
    var btn = ev.target.closest && ev.target.closest('[data-copy]');
    if (!btn) return;
    var pre = btn.closest('.sd-code').querySelector('pre');
    if (!pre) return;
    var txt = pre.innerText;
    var done = function () {
      var o = btn.textContent; btn.textContent = '✓ Copiado'; btn.style.color = '#5eead4';
      setTimeout(function () { btn.textContent = o; btn.style.color = ''; }, 1400);
    };
    if (navigator.clipboard && navigator.clipboard.writeText)
      navigator.clipboard.writeText(txt).then(done).catch(done);
    else done();
  });

  /* --------------------------------------------------------------- router */
  function go(hash) { location.hash = hash; }
  function parseRoute() {
    var h = (location.hash || '#/').replace(/^#/, '');
    if (h === '/repaso') return { view: 'review' };
    var m = /^\/modulo\/(.+)$/.exec(h);
    if (m && MODULES[decodeURIComponent(m[1])]) return { view: 'module', slug: decodeURIComponent(m[1]) };
    return { view: 'home' };
  }

  /* ----------------------------------------------------------------- nav   */
  function navEl(active) {
    var nav = el('nav', 'sd-nav');
    var inner = el('div', 'sd-nav-inner');
    var logo = el('a', 'sd-logo');
    logo.href = '#/';
    logo.innerHTML = '<span class="sd-logo-mark"><span class="sd-logo-dot"></span></span>' +
      '<span class="sd-logo-text">SDET <b>Mastery</b></span>';
    var links = el('div', 'sd-nav-links');
    var a1 = el('a', 'sd-navlink' + (active === 'home' || active === 'module' ? ' is-active' : ''), 'Programa');
    a1.href = '#/';
    var a2 = el('a', 'sd-navlink' + (active === 'review' ? ' is-active' : ''), 'Repaso');
    a2.href = '#/repaso';
    var pct = overallPct();
    var name = getName();
    var user = el('span', 'sd-nav-user');
    var txt = el('span', 'sd-nav-user-txt');
    var nameEl = el('span', 'sd-nav-name');
    nameEl.textContent = name; nameEl.title = 'Clic para editar tu nombre'; nameEl.style.cursor = 'pointer';
    var lvl = el('span', 'sd-nav-level', 'Nivel Senior · ' + pct + '%');
    txt.appendChild(nameEl); txt.appendChild(lvl);
    var avatar = el('span', 'sd-avatar', esc(initials(name)));
    user.appendChild(txt); user.appendChild(avatar);
    nameEl.addEventListener('click', function () {
      var inp = el('input', 'sd-name-input'); inp.value = getName();
      nameEl.replaceWith(inp); inp.focus(); inp.select();
      var committed = false;
      function commit() {
        if (committed) return; committed = true;
        var v = inp.value.trim() || DEFAULT_NAME;
        setName(v); nameEl.textContent = v; avatar.textContent = initials(v);
        inp.replaceWith(nameEl);
      }
      inp.addEventListener('blur', commit);
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); inp.blur(); }
        if (e.key === 'Escape') { inp.value = getName(); inp.blur(); }
      });
    });
    links.appendChild(a1); links.appendChild(a2);
    links.appendChild(el('span', 'sd-nav-sep')); links.appendChild(user);
    inner.appendChild(logo); inner.appendChild(links);
    nav.appendChild(inner);
    return nav;
  }

  /* ---------------------------------------------------------------- HOME   */
  function ringSvg(pct, accent) {
    var r = 27, circ = 2 * Math.PI * r, off = circ * (1 - pct);
    return '<svg width="66" height="66" viewBox="0 0 66 66">' +
      '<circle cx="33" cy="33" r="27" fill="none" stroke="#1e2432" stroke-width="4.5"></circle>' +
      '<circle cx="33" cy="33" r="27" fill="none" stroke="' + accent + '" stroke-width="4.5" stroke-linecap="round" ' +
      'stroke-dasharray="' + circ.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '" ' +
      'transform="rotate(-90 33 33)" style="transition:stroke-dashoffset .6s ease;filter:drop-shadow(0 0 5px ' + accent + '88);"></circle>' +
      '</svg>';
  }

  var COURSE_ACCENT = {
    'especial': '#5eead4',
    'curso-1-fundamentos': '#5eead4',
    'curso-2-profundizando': '#2dd4bf',
    'curso-3-especializaciones': '#818cf8',
    'curso-4-ai-native': '#a78bfa'
  };
  function accentOf(id) { return COURSE_ACCENT[id] || '#5eead4'; }

  function renderHome() {
    var main = el('main', 'sd-main sd-fade');

    // hero
    var hero = el('header', 'sd-hero');
    hero.innerHTML =
      '<span class="sd-kicker"><span class="sd-kicker-line"></span>Programa Senior · 4 cursos · 35 módulos</span>' +
      '<h1 class="sd-hero-h1">Domina el testing<br><i>de sistemas que</i> <b>piensan.</b></h1>' +
      '<p class="sd-hero-p">De los fundamentos del testing a la evaluación de agentes con LLM. ' +
      'Un currículo construido como se estudia de verdad: leer poco, <b>construir mucho</b>, y defenderlo en entrevista.</p>';
    var search = el('div', 'sd-search');
    search.innerHTML = '<span class="sd-search-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg></span>' +
      '<input class="sd-search-input" placeholder="Buscar módulo: RAG, Playwright, guardrails, k6…">';
    hero.appendChild(search);
    var stats = el('div', 'sd-stats',
      '<div class="sd-stat"><span class="sd-stat-num">35</span><span class="sd-stat-label">módulos guiados</span></div>' +
      '<div class="sd-stat-sep"></div>' +
      '<div class="sd-stat"><span class="sd-stat-num">7</span><span class="sd-stat-label">secciones por módulo</span></div>' +
      '<div class="sd-stat-sep"></div>' +
      '<div class="sd-stat"><span class="sd-stat-num accent">1</span><span class="sd-stat-label">spine project real</span></div>');
    hero.appendChild(stats);
    main.appendChild(hero);

    var listWrap = el('div');
    main.appendChild(listWrap);

    function renderCourses(query) {
      listWrap.innerHTML = '';
      var q = (query || '').trim().toLowerCase();
      if (q) {
        var results = [];
        COURSES.forEach(function (c) {
          c.modules.forEach(function (m) {
            if (m.title.toLowerCase().indexOf(q) !== -1)
              results.push({ course: c, m: m });
          });
        });
        var sec = el('section', 'sd-results');
        sec.appendChild(el('div', 'sd-results-head',
          '<h2>Resultados</h2><span>' + results.length + ' coincidencias</span>'));
        if (!results.length) {
          sec.appendChild(el('div', 'sd-empty', 'Sin coincidencias para "' + esc(query) + '".'));
        } else {
          var grid = el('div', 'sd-resultgrid');
          results.forEach(function (r) {
            var a = el('a', 'sd-resultcard');
            a.href = '#/modulo/' + r.m.slug;
            a.innerHTML = '<span class="sd-resultcard-tag" style="color:' + accentOf(r.course.id) + '">' +
              esc(r.course.name) + ' · ' + esc(r.m.num) + '</span>' +
              '<span class="sd-resultcard-title">' + esc(r.m.title) + '</span>';
            grid.appendChild(a);
          });
          sec.appendChild(grid);
        }
        listWrap.appendChild(sec);
        return;
      }

      COURSES.forEach(function (c) {
        var accent = accentOf(c.id);
        var cp = courseProgress(c);
        var sec = el('section', 'sd-course');
        var head = el('div', 'sd-course-head');
        var ring = el('div', 'sd-ring',
          ringSvg(cp.pct, accent) + '<span class="sd-ring-label">' + Math.round(cp.pct * 100) + '%</span>');
        var meta = el('div', 'sd-course-meta');
        var label = cp.modsWithCk ? (cp.modsComplete + ' de ' + cp.modsWithCk + ' módulos') : c.modules.length + ' módulos';
        meta.innerHTML = '<div class="sd-course-metatop">' +
          '<span class="sd-course-kicker" style="color:' + accent + '">' + esc(c.name.split(' · ')[0]) + '</span>' +
          '<span class="sd-course-progress">' + label + '</span></div>' +
          '<h2 class="sd-course-name">' + esc(c.name) + '</h2>';
        head.appendChild(ring); head.appendChild(meta);
        sec.appendChild(head);

        var grid = el('div', 'sd-modgrid');
        var firstIncomplete = -1;
        c.modules.forEach(function (m, i) {
          if (firstIncomplete === -1 && moduleProgress(m.slug).pct !== 1) firstIncomplete = i;
        });
        c.modules.forEach(function (m, i) {
          var p = moduleProgress(m.slug);
          var done = p.pct === 1 && p.total > 0;
          var current = i === firstIncomplete && !done;
          var stateLabel = p.total === 0 ? '—' : (done ? '100%' : (p.done ? Math.round(p.pct * 100) + '%' : (current ? 'en curso' : '—')));
          var barW = p.total ? Math.round(p.pct * 100) + '%' : '0%';
          var dotColor = done ? accent : (current ? '#fbbf24' : '#333b4a');
          var a = el('a', 'sd-modcard' + (done ? ' is-done' : (current ? ' is-current' : '')));
          a.href = '#/modulo/' + m.slug;
          a.innerHTML =
            '<span class="sd-modcard-ghost">' + esc((i + 1 < 10 ? '0' : '') + (i + 1)) + '</span>' +
            '<div class="sd-modcard-top"><span class="sd-modcard-num" style="color:' + (done ? accent : '#7f8798') + '">' + esc(m.num.toUpperCase()) + '</span>' +
            '<span class="sd-modcard-dot" style="background:' + dotColor + (done ? ';box-shadow:0 0 8px ' + accent : '') + '"></span></div>' +
            '<span class="sd-modcard-title">' + esc(stripNum(m.title)) + '</span>' +
            '<div class="sd-modcard-foot"><div class="sd-modbar"><div class="sd-modbar-fill" style="width:' + barW + ';background:' + accent + '"></div></div>' +
            '<span class="sd-modcard-state">' + stateLabel + '</span></div>';
          grid.appendChild(a);
        });
        sec.appendChild(grid);
        listWrap.appendChild(sec);
      });
    }

    renderCourses('');
    search.querySelector('input').addEventListener('input', function (e) {
      renderCourses(e.target.value);
    });
    return main;
  }
  function stripNum(title) {
    return title.replace(/^Módulo\s+\d+\s+—\s+/, '').replace(/^Spec\s+\d+\s+·\s+Módulo\s+\d+\s+—\s+/, '');
  }

  /* -------------------------------------------------------------- MODULE   */
  function renderModule(slug) {
    var mod = MODULES[slug];
    var parsed = parseModule(slug);
    var course = COURSES.filter(function (c) {
      return c.modules.some(function (m) { return m.slug === slug; });
    })[0];
    var accent = course ? accentOf(course.id) : '#5eead4';

    var frag = document.createDocumentFragment();

    // breadcrumb
    var cw = el('div', 'sd-crumbs-wrap');
    var cr = el('div', 'sd-crumbs');
    var back = el('a', 'sd-crumb-link', 'Programa'); back.href = '#/';
    cr.appendChild(back);
    cr.appendChild(el('span', 'sd-crumb-sep', '/'));
    cr.appendChild(el('span', 'sd-crumb-cur', esc(mod.crumb || (course ? course.name : ''))));
    cr.appendChild(el('span', 'sd-crumb-sep', '/'));
    cr.appendChild(el('span', 'sd-crumb-cur', esc(mod.num)));
    cw.appendChild(cr); frag.appendChild(cw);

    var read = el('div', 'sd-read sd-fade');
    var article = el('article', 'sd-article');

    // hero
    article.appendChild(el('div', 'sd-mod-kicker',
      '<span class="sd-kicker-line"></span>' + esc((course ? course.name.split(' (')[0] : '') + ' · ' + mod.num)));
    article.appendChild(el('h1', 'sd-mod-h1', esc(stripNum(mod.title))));
    if (parsed.subtitle) article.appendChild(el('p', 'sd-mod-sub', esc(parsed.subtitle)));
    var meta = el('div', 'sd-mod-meta');
    meta.appendChild(el('span', 'sd-chip', esc(mod.num)));
    if (course) meta.appendChild(el('span', 'sd-chip', '◈ ' + esc(course.name.split(' · ').slice(1).join(' · ') || course.name)));
    article.appendChild(meta);

    // mobile TOC
    var tocm = el('div', 'sd-toc-mobile');
    tocm.appendChild(el('span', 'sd-toc-mobile-label', 'En este módulo'));
    var tscroll = el('div', 'sd-toc-mobile-scroll');
    parsed.sections.forEach(function (s) {
      var a = el('a', 'sd-toc-pill', esc(s.emoji) + ' ' + esc(shortTitle(s.title)));
      a.href = '#' + s.id;
      a.addEventListener('click', tocClick(s.id));
      tscroll.appendChild(a);
    });
    tocm.appendChild(tscroll); article.appendChild(tocm);

    // sections
    parsed.sections.forEach(function (s) {
      article.appendChild(renderSection(s, slug, accent));
    });

    // footer nav
    var foot = el('div', 'sd-modfoot');
    var fb = el('a', 'sd-modfoot-back', '← Volver al programa'); fb.href = '#/';
    var fc = el('a', 'sd-modfoot-cta', 'Repasar el banco de preguntas →'); fc.href = '#/repaso';
    foot.appendChild(fb); foot.appendChild(fc);
    article.appendChild(foot);

    read.appendChild(article);

    // aside TOC
    var aside = el('aside', 'sd-toc-side');
    aside.appendChild(el('span', 'sd-toc-label', 'En este módulo'));
    var tnav = el('nav', 'sd-toc-nav');
    parsed.sections.forEach(function (s) {
      var a = el('a', 'sd-toc-link');
      a.href = '#' + s.id; a.dataset.target = s.id;
      a.innerHTML = '<span class="sd-toc-icon">' + esc(s.emoji) + '</span>' + esc(shortTitle(s.title));
      a.addEventListener('click', tocClick(s.id));
      tnav.appendChild(a);
    });
    aside.appendChild(tnav);
    var pmod = moduleProgress(slug);
    var card = el('div', 'sd-toc-card');
    card.innerHTML = '<span class="sd-toc-card-label">PROGRESO DEL MÓDULO</span>' +
      '<div class="sd-toc-card-row"><span class="sd-toc-card-num" data-modpct>' +
      (pmod.total ? Math.round(pmod.pct * 100) + '%' : '—') + '</span><span class="sd-toc-card-unit">checklist</span></div>';
    aside.appendChild(card);
    read.appendChild(aside);

    frag.appendChild(read);

    // scroll-spy after mount
    setTimeout(function () { setupSpy(read); }, 0);
    return frag;
  }

  function shortTitle(t) {
    var map = { 'Mapa visual': 'Mapa', 'Concepto': 'Concepto', 'Lab guiado': 'Lab', 'El reto': 'Reto',
      'Checklist de dominio': 'Checklist', 'Preguntas de entrevista': 'Entrevista', 'Conexiones': 'Conexiones' };
    var base = t.split(' — ')[0].split(' (')[0].trim();
    return map[base] || base;
  }
  function tocClick(id) {
    return function (e) {
      e.preventDefault();
      var t = document.getElementById(id);
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
  }

  // Bloque de respuesta editable (override en localStorage, no toca los .md)
  function answerBlock(id, baseline, label) {
    var wrap = el('div', 'sd-answer');
    function view() {
      wrap.innerHTML = '';
      var head = el('div', 'sd-answer-head');
      head.appendChild(el('span', 'sd-qa-answer-label', label || 'Tu respuesta'));
      if (answers[id] != null) head.appendChild(el('span', 'sd-answer-edited', 'editado'));
      var btn = el('button', 'sd-answer-edit', '✎ Editar');
      head.appendChild(btn); wrap.appendChild(head);
      var body = el('div', 'sd-answer-view sd-md');
      var md = answerFor(id, baseline);
      renderRich(md && md.trim() ? md : '_Sin respuesta escrita todavía. Clic en Editar._', body);
      wrap.appendChild(body);
      btn.addEventListener('click', edit);
    }
    function edit() {
      wrap.innerHTML = '';
      var ta = el('textarea', 'sd-answer-input');
      ta.value = answerFor(id, baseline) || ''; ta.rows = 7;
      ta.setAttribute('spellcheck', 'false');
      wrap.appendChild(ta);
      var act = el('div', 'sd-answer-actions');
      var save = el('button', 'sd-answer-btn sd-answer-save', 'Guardar');
      var cancel = el('button', 'sd-answer-btn', 'Cancelar');
      var reset = el('button', 'sd-answer-btn sd-answer-reset', 'Restaurar original');
      act.appendChild(save); act.appendChild(cancel);
      if (answers[id] != null) act.appendChild(reset);
      wrap.appendChild(act);
      act.appendChild(el('span', 'sd-answer-hint', 'Se guarda solo en este navegador (Markdown permitido).'));
      ta.focus();
      save.addEventListener('click', function () { answers[id] = ta.value; saveAnswers(); view(); });
      cancel.addEventListener('click', view);
      reset.addEventListener('click', function () { delete answers[id]; saveAnswers(); view(); });
    }
    view();
    return wrap;
  }

  function renderSection(s, slug, accent) {
    var sec = el('section', 'sd-section'); sec.id = s.id;
    var head = el('div', 'sd-section-head');
    head.innerHTML =
      '<span class="sd-section-icon ' + s.meta.icon + '">' + esc(s.emoji) + '</span>' +
      '<div style="flex:1;min-width:0"><span class="sd-section-kicker ' + s.meta.kicker + '">Sección ' +
      (s.num < 10 ? '0' : '') + s.num + '</span>' +
      '<h2 class="sd-section-h2">' + esc(s.title) + '</h2></div>';
    sec.appendChild(head);

    if (s.type === 'checklist') sec.appendChild(renderChecklist(s, slug));
    else if (s.type === 'interview') {
      var iv = parseInterview(s.body);
      if (iv) sec.appendChild(renderInterview(iv, slug));
      else { var b = el('div', 'sd-section-body sd-md'); renderRich(s.body, b); sec.appendChild(b); }
    } else {
      var body = el('div', 'sd-section-body sd-md');
      renderRich(s.body, body);
      sec.appendChild(body);
    }
    return sec;
  }

  function renderChecklist(s, slug) {
    var box = el('div', 'sd-section-body');
    var data = parseChecklist(s.body);
    var wrap = el('div');
    if (data.preamble) { var pm = el('div', 'sd-md'); renderRich(data.preamble, pm); wrap.appendChild(pm); }

    var total = data.items.length;
    function doneCount() { var d = 0; for (var i = 0; i < total; i++) if (checks[slug + '#c' + i]) d++; return d; }

    var progress = el('div', 'sd-check-progress');
    var fill = el('div', 'sd-check-progress-fill'); progress.appendChild(fill);
    wrap.appendChild(progress);

    var list = el('div', 'sd-checklist');
    data.items.forEach(function (it, i) {
      var key = slug + '#c' + i;
      var on = !!checks[key];
      var item = el('div', 'sd-check-item' + (on ? ' is-done' : ''));

      // fila: checkbox (marca) + texto + chevron (despliega la nota)
      var row = el('div', 'sd-check-row');
      var box = el('span', 'sd-check-box', '<span class="sd-check-mark">' + (on ? '✓' : '') + '</span>');
      var main = el('span', 'sd-check-main',
        '<span class="sd-check-text">' + md2html(it.text).replace(/^<p>|<\/p>\s*$/g, '') + '</span>');
      var hasNote = !!(it.note || answers[key] != null);
      var chev = el('span', 'sd-check-chev' + (hasNote ? ' has-note' : ''), '⌄');
      chev.title = 'Ver / editar tu respuesta';
      row.appendChild(box); row.appendChild(main); row.appendChild(chev);
      item.appendChild(row);

      // acordeón con la respuesta editable (baseline = nota escrita en el .md)
      var noteWrap = el('div', 'sd-check-note-wrap'); noteWrap.style.display = 'none';
      noteWrap.appendChild(answerBlock(key, it.note, 'Mi respuesta'));
      item.appendChild(noteWrap);

      // marcar/desmarcar SOLO desde el checkbox (no elimina nada más)
      box.addEventListener('click', function (e) {
        e.stopPropagation();
        checks[key] = !checks[key]; saveChecks();
        var nowOn = !!checks[key];
        item.classList.toggle('is-done', nowOn);
        box.querySelector('.sd-check-mark').textContent = nowOn ? '✓' : '';
        updateProgress();
      });
      // desplegar el acordeón desde el resto de la fila
      row.addEventListener('click', function (e) {
        if (e.target.closest('.sd-check-box') || e.target.closest('a')) return;
        var open = noteWrap.style.display === 'none';
        noteWrap.style.display = open ? 'block' : 'none';
        item.classList.toggle('is-open', open);
      });
      list.appendChild(item);
    });
    wrap.appendChild(list);
    box.appendChild(wrap);

    function updateProgress() {
      var d = doneCount(), pct = total ? Math.round((d / total) * 100) : 0;
      fill.style.width = pct + '%';
      var mp = document.querySelector('[data-modpct]');
      if (mp) mp.textContent = pct + '%';
    }
    setTimeout(updateProgress, 0);
    return box;
  }

  function renderInterview(iv, slug) {
    var box = el('div', 'sd-section-body');
    if (iv.preamble) { var pm = el('div', 'sd-md'); renderRich(iv.preamble, pm); box.appendChild(pm); }
    var qa = el('div', 'sd-qa');
    iv.items.forEach(function (it, i) {
      var item = el('div', 'sd-qa-item');
      var head = el('div', 'sd-qa-head');
      head.innerHTML = '<span class="sd-qa-num">Q' + (i + 1) + '</span>' +
        '<span class="sd-qa-q">' + esc(it.q) + '</span><span class="sd-qa-chev">⌄</span>';
      var body = el('div', 'sd-qa-body');
      body.style.display = 'none';
      var inner = el('div', 'sd-qa-body-inner');
      inner.appendChild(answerBlock(slug + '#q' + i, it.a, 'Tu respuesta'));
      body.appendChild(inner);
      head.addEventListener('click', function () {
        var open = item.classList.toggle('is-open');
        body.style.display = open ? 'block' : 'none';
      });
      item.appendChild(head); item.appendChild(body);
      qa.appendChild(item);
    });
    box.appendChild(qa);
    return box;
  }

  function setupSpy(read) {
    var links = read.querySelectorAll('.sd-toc-link');
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (l) { map[l.dataset.target] = l; });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('is-active'); });
          if (map[en.target.id]) map[en.target.id].classList.add('is-active');
        }
      });
    }, { rootMargin: '-82px 0px -70% 0px' });
    read.querySelectorAll('.sd-section').forEach(function (s) { obs.observe(s); });
  }

  /* -------------------------------------------------------------- REVIEW   */
  var review = { deck: null, idx: 0, revealed: false, order: null };
  function buildDeck() {
    var deck = [];
    COURSES.forEach(function (c) {
      c.modules.forEach(function (m) {
        var p = parseModule(m.slug);
        p.sections.forEach(function (s) {
          if (s.type !== 'interview') return;
          var iv = parseInterview(s.body);
          if (!iv) return;
          iv.items.forEach(function (it, i) {
            deck.push({ id: m.slug + '#q' + i, q: it.q, a: it.a, mod: m.title, course: c.name });
          });
        });
      });
    });
    return deck;
  }
  function deckOrder() {
    if (!review.deck) review.deck = buildDeck();
    var n = review.deck.length;
    if (review.order && review.order.length === n) return review.order;
    review.order = Array.from({ length: n }, function (_, i) { return i; });
    return review.order;
  }

  function renderReview() {
    var deck = review.deck || (review.deck = buildDeck());
    var order = deckOrder();
    var n = deck.length;
    var main = el('main', 'sd-review sd-fade');
    if (!n) { main.appendChild(el('div', 'sd-empty', 'No hay preguntas en el banco todavía.')); return main; }

    var real = order[review.idx] != null ? order[review.idx] : 0;
    var card = deck[real];
    var known = 0, rev = 0;
    Object.keys(marks).forEach(function (k) { if (marks[k] === 'known') known++; else if (marks[k] === 'review') rev++; });
    var curMark = marks[card.id];

    var head = el('div', 'sd-review-head');
    head.innerHTML = '<div><span class="sd-review-kicker">Modo repaso · flashcards</span>' +
      '<h1 class="sd-review-title">Banco de preguntas de entrevista</h1></div>';
    var rb = el('a', 'sd-review-back', '← Programa'); rb.href = '#/';
    head.appendChild(rb);
    main.appendChild(head);

    var session = el('div', 'sd-session');
    session.innerHTML = '<div class="sd-session-bar"><div class="sd-session-fill" style="width:' +
      Math.round(((review.idx + 1) / n) * 100) + '%"></div></div>' +
      '<span class="sd-session-pos">' + (review.idx + 1) + ' / ' + n + '</span>';
    main.appendChild(session);

    var chips = el('div', 'sd-review-chips');
    chips.innerHTML = '<span class="sd-review-chip known">✓ ' + known + ' dominadas</span>' +
      '<span class="sd-review-chip review">↻ ' + rev + ' por repasar</span>' +
      '<span class="sd-review-chip">' + (curMark === 'known' ? '✓ dominada' : (curMark === 'review' ? '↻ marcada' : 'sin marcar')) + '</span>';
    main.appendChild(chips);

    var cardEl = el('div', 'sd-card');
    var inner = el('div', 'sd-card-inner');
    inner.appendChild(el('span', 'sd-card-kicker', 'Pregunta ' + (review.idx + 1) + ' de ' + n + ' · ' + esc(card.course.split(' · ')[0])));
    var qwrap = el('div', 'sd-card-qwrap');
    qwrap.appendChild(el('p', 'sd-card-q', esc(card.q)));
    inner.appendChild(qwrap);

    var foot = el('div', 'sd-card-foot');
    if (review.revealed) {
      var ans = el('div', 'sd-card-answer');
      ans.appendChild(answerBlock(card.id, card.a, 'Tu respuesta'));
      foot.appendChild(ans);
    } else {
      var rvb = el('button', 'sd-reveal-btn', 'Revelar respuesta');
      rvb.addEventListener('click', function () { review.revealed = true; rerenderReview(); });
      foot.appendChild(rvb);
    }
    inner.appendChild(foot);
    cardEl.appendChild(inner);
    main.appendChild(cardEl);

    if (review.revealed) {
      var mrow = el('div', 'sd-mark-row');
      var br = el('button', 'sd-mark-btn sd-mark-review', '↻ Repasar de nuevo');
      br.addEventListener('click', function () { mark('review'); });
      var bk = el('button', 'sd-mark-btn sd-mark-known', '✓ La sabía');
      bk.addEventListener('click', function () { mark('known'); });
      mrow.appendChild(br); mrow.appendChild(bk);
      main.appendChild(mrow);
    }

    var navRow = el('div', 'sd-nav-row');
    var prev = el('button', 'sd-nav-btn', '← Anterior');
    prev.addEventListener('click', function () { review.idx = (review.idx - 1 + n) % n; review.revealed = false; rerenderReview(); });
    var shuf = el('button', 'sd-shuffle-btn', '⤨ Mezclar');
    shuf.addEventListener('click', function () {
      var arr = Array.from({ length: n }, function (_, i) { return i; });
      for (var i = n - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
      review.order = arr; review.idx = 0; review.revealed = false; rerenderReview();
    });
    var next = el('button', 'sd-nav-btn', 'Siguiente →');
    next.addEventListener('click', function () { review.idx = (review.idx + 1) % n; review.revealed = false; rerenderReview(); });
    navRow.appendChild(prev); navRow.appendChild(shuf); navRow.appendChild(next);
    main.appendChild(navRow);

    function mark(kind) {
      marks[card.id] = kind; saveMarks();
      review.idx = (review.idx + 1) % n; review.revealed = false; rerenderReview();
    }
    return main;
  }
  function rerenderReview() { mount(); }

  /* --------------------------------------------------------------- mount   */
  function mount() {
    var route = parseRoute();
    root.innerHTML = '';
    root.appendChild(navEl(route.view));
    if (route.view === 'module') root.appendChild(renderModule(route.slug));
    else if (route.view === 'review') root.appendChild(renderReview());
    else root.appendChild(renderHome());
  }

  var _lastView = null, _lastSlug = null;
  function onRoute() {
    var r = parseRoute();
    var changed = r.view !== _lastView || r.slug !== _lastSlug;
    _lastView = r.view; _lastSlug = r.slug;
    mount();
    if (changed) window.scrollTo(0, 0);
  }

  // init
  if (window.mermaid) {
    mermaid.initialize({
      startOnLoad: false, theme: 'dark', securityLevel: 'loose',
      themeVariables: { fontFamily: 'inherit', primaryColor: '#1b1f2a', primaryBorderColor: '#5eead4', lineColor: '#818cf8', primaryTextColor: '#e7e9ee' }
    });
  }
  if (window.marked) marked.setOptions({ gfm: true, breaks: false });
  window.addEventListener('hashchange', onRoute);
  onRoute();
})();
