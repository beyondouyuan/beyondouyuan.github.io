/* Online resume / portfolio — data-driven, zero dependencies.
   Data source: data/profile.json  →  generated data/profile.js (window.PROFILE)
   Rebuild everything with: python3 tools/build.py                              */
(function () {
  'use strict';
  var P = window.PROFILE || null;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var isPH = function (v) { return /〔/.test(String(v)); };
  var toastTimer;
  function toast(msg) {
    var t = $('#toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  /* ---------- boot: allow fetch fallback when profile.js is missing ---------- */
  function boot(data) {
    P = data;
    try { renderAll(); } catch (e) { console.error('[portfolio] render failed', e); }
    initTheme(); initMotion(); initInteractions();
  }
  if (P) { boot(P); }
  else {
    fetch('data/profile.json').then(function (r) { return r.json(); }).then(boot)
      .catch(function () { toast('数据文件未加载：请运行 python3 tools/build.py'); });
  }

  /* ---------- render ---------- */
  function renderAll() {
    var id = P.identity;
    document.documentElement.lang = 'zh-CN';
    document.title = 'Yuan Ou (Irving) 作品集 · 广告变现 × 数据可视化工程师';
    $('#brandName').textContent = isPH(id.name) ? 'portfolio' : String(id.name).toLowerCase().replace(/\s+/g, '-');
    $('#heroName').textContent = id.name;
    $('#heroRole').textContent = id.role + ' · ' + id.location;
    $('#heroPitch').textContent = id.pitch;
    $('#footMeta').textContent = '© ' + new Date().getFullYear() + ' · ' + (isPH(id.name) ? '作品集' : id.name) + ' · 数据源于 data/profile.json';

    $('#factsGrid').innerHTML = P.facts.map(function (f) {
      return '<div class="fact reveal"><div class="num"><span class="count" data-to="' + esc(f.value) + '">' + esc(f.value) + '</span><small>' + esc(f.unit) + '</small></div>' +
        '<div class="lbl">' + esc(f.label) + '</div><div class="note">' + esc(f.note) + '</div></div>';
    }).join('');

    var intro = id.intro.split(/\n\n+/).filter(Boolean);
    $('#aboutText').innerHTML = intro.map(function (t) { return '<p class="reveal">' + esc(t) + '</p>'; }).join('') +
      '<p class="reveal"><strong>一句话定位：</strong>' + esc(id.focus) + '。</p>';
    $('#sideInfo').innerHTML = '<h3>// identity</h3><dl>' +
      '<dt>ROLE</dt><dd>' + esc(id.role) + '</dd>' +
      '<dt>LOCATION</dt><dd>' + esc(id.location) + '</dd>' +
      (isPH(id.experience) ? '' : '<dt>EXPERIENCE</dt><dd>' + esc(id.experience) + '</dd>') +
      '<dt>FOCUS</dt><dd>' + esc(id.focus) + '</dd></dl>';

    $('#skillGrid').innerHTML = P.skills.map(function (s) {
      return '<article class="skill-card reveal" style="--level:' + Number(s.level) + '%">' +
        '<div class="skill-top"><h3>' + esc(s.name) + '</h3>' + (s.tag ? '<span class="tag">' + esc(s.tag) + '</span>' : '') + '</div>' +
        '<div class="bar" role="img" aria-label="熟练度 ' + Number(s.level) + ' / 100"><i></i></div>' +
        '<ul>' + s.items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul></article>';
    }).join('');

    var cats = [{ k: 'all', n: '全部' }, { k: 'ads', n: '广告 / SDK' }, { k: 'visualization', n: '可视化' },
      { k: 'fullstack', n: '中后台 / 全栈' }, { k: 'game', n: '小游戏' }];
    $('#filterBar').innerHTML = cats.map(function (c, i) {
      return '<button data-cat="' + c.k + '" aria-pressed="' + (i === 0) + '">' + esc(c.n) + '</button>';
    }).join('');

    $('#workGrid').innerHTML = P.projects.map(function (p) {
      return '<article class="work-card reveal" data-cat="' + esc(p.category) + '" data-id="' + esc(p.id) + '">' +
        '<div class="work-media" data-open="' + esc(p.id) + '" role="button" tabindex="0" aria-label="查看 ' + esc(p.title) + ' 详情与图片">' +
          '<img src="' + esc(p.image) + '" alt="' + esc(p.alt) + '" loading="lazy">' +
          '<span class="no">' + esc(p.no) + '</span></div>' +
        '<div class="work-body">' +
          '<h3>' + esc(p.title) + '</h3><p class="sub">' + esc(p.subtitle) + '</p>' +
          '<div class="work-metrics">' + p.metrics.map(function (m) {
            return '<div><b>' + esc(m.value) + '</b><span>' + esc(m.label) + '</span></div>';
          }).join('') + '</div>' +
          '<p class="ctx">' + esc(p.context) + '</p>' +
          '<div class="chips">' + p.stack.map(function (s) { return '<span class="chip">' + esc(s) + '</span>'; }).join('') + '</div></div>' +
        '<button class="work-more" data-open="' + esc(p.id) + '">展开详情 →</button></article>';
    }).join('');

    $('#extrasGrid').innerHTML = P.extras.map(function (e) {
      return '<div class="extra reveal"><h4>' + esc(e.name) + ' <span class="st">' + esc(e.status) + '</span></h4><p>' + esc(e.desc) + '</p></div>';
    }).join('');

    $('#serviceRows').innerHTML = '<div class="row head"><span>#</span><span>服务</span><span>交付内容</span><span style="text-align:right">参考起步价</span></div>' +
      P.services.map(function (s) {
        return '<div class="row reveal"><span class="p">' + esc(s.priority) + '</span><span class="name">' + esc(s.name) +
          '</span><span class="deliver">' + esc(s.deliver) + '</span><span class="price">' + esc(s.price) + '</span></div>';
      }).join('');
    $('#priceNote').textContent = P.priceNote;

    $('#timeline').innerHTML = P.process.map(function (s) {
      return '<div class="tstep reveal"><span class="dot"></span><div class="s">' + esc(s.step) + '</div>' +
        '<h4>' + esc(s.name) + '</h4><div class="t">' + esc(s.time) + '</div><p>' + esc(s.desc) + '</p></div>';
    }).join('');
    $('#boundaryNo').innerHTML = P.boundaries.no.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
    $('#boundaryOk').innerHTML = P.boundaries.principles.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');

    $('#contactGrid').innerHTML = id.contacts.filter(function (c) { return !isPH(c.value); }).map(function (c) {
      return '<button class="contact-item reveal" data-copy="' + esc(c.value) + '" aria-label="复制' + esc(c.label) + '">' +
        '<div class="k">' + esc(c.label.toUpperCase()) + '</div><div class="v ' + (isPH(c.value) ? 'ph' : '') + '">' + esc(c.display || c.value) + '</div></button>';
    }).join('');
  }

  /* ---------- theme ---------- */
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem('portfolio-theme'); } catch (e) {}
    setTheme(saved && P.meta.themes.indexOf(saved) >= 0 ? saved : (P.meta.theme || 'deep-space'));
    $$('.theme-switch button').forEach(function (b) {
      b.addEventListener('click', function () {
        setTheme(b.dataset.t);
        try { localStorage.setItem('portfolio-theme', b.dataset.t); } catch (e) {}
        toast('主题已切换：' + ({ 'deep-space': 'A 深空终端', 'aurora-glass': 'B 极光玻璃', 'neon-grid': 'C 霓虹网格', 'blueprint': 'D 工程蓝图' })[b.dataset.t]);
      });
    });
  }
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    $$('.theme-switch button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.t === t)); });
  }

  /* ---------- motion ---------- */
  function initMotion() {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal').forEach(function (el) { el.classList.add('in-view'); });
      $$('.count').forEach(function (el) { el.textContent = el.dataset.to; });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in-view');
        $$('.count', e.target).forEach(countUp);
        if (e.target.classList.contains('count')) countUp(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(function (el) { io.observe(el); });
    $$('.count').forEach(function (el) { io.observe(el); });
    if (reduced) {
      $$('.reveal').forEach(function (el) { el.classList.add('in-view'); });
      $$('.count').forEach(function (el) { el.textContent = el.dataset.to; });
      $('#typed').textContent = P.identity.focus;
      return;
    }
    typewriter();
    starfield();
    tilt();
    aurora();
  }
  function countUp(el) {
    if (el.dataset.done) return; el.dataset.done = '1';
    var to = parseFloat(el.dataset.to);
    if (isNaN(to) || reduced) { el.textContent = el.dataset.to; return; }
    // rAF 在后台标签页会被节流：兜底触发后必须停止 rAF 覆盖，否则数字会停在中间值
    var alive = true;
    setTimeout(function () { alive = false; el.textContent = el.dataset.to; }, 1400);
    el.textContent = '0';
    var t0 = performance.now(), dur = 900;
    (function step(t) {
      if (!alive) return;
      var k = Math.min(1, (t - t0) / dur);
      el.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(step);
      else { alive = false; el.textContent = el.dataset.to; }
    })(t0);
  }
  function typewriter() {
    var el = $('#typed'); if (!el) return;
    var lines = [P.identity.focus, '从架构到上线，一个人全做', '可接整包 / 咨询 / 长期合作'];
    var li = 0, ci = 0, deleting = false;
    el.textContent = '';
    (function tick() {
      var line = lines[li];
      if (!deleting) {
        el.textContent = line.slice(0, ++ci);
        if (ci === line.length) { deleting = true; return setTimeout(tick, 2600); }
        setTimeout(tick, 62 + Math.random() * 55);
      } else {
        el.textContent = line.slice(0, --ci);
        if (ci === 0) { deleting = false; li = (li + 1) % lines.length; return setTimeout(tick, 320); }
        setTimeout(tick, 28);
      }
    })();
  }
  function starfield() {
    var c = $('#starfield'); if (!c) return;
    var ctx = c.getContext('2d'); if (!ctx) return;
    var pts = [], w = 0, h = 0, dpr = Math.min(2, window.devicePixelRatio || 1), mouse = { x: -999, y: -999 };
    function resize() {
      w = window.innerWidth; h = window.innerHeight;
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
      c.style.width = w + 'px'; c.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.min(110, Math.round(w * h / 16000));
      pts = Array.from({ length: n }, function () {
        return { x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22, r: Math.random() * 1.4 + .5 };
      });
    }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      var css = getComputedStyle(document.documentElement);
      var stroke = css.getPropertyValue('--primary').trim() || '#00E5FF';
      var line = css.getPropertyValue('--line-strong').trim() || 'rgba(126,166,220,.34)';
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        var dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 12000 && d2 > 1) { var f = (12000 - d2) / 12000 * .9; p.x += dx / Math.sqrt(d2) * f; p.y += dy / Math.sqrt(d2) * f; }
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], ex = p.x - q.x, ey = p.y - q.y, dd = ex * ex + ey * ey;
          if (dd < 15000) { ctx.globalAlpha = (1 - dd / 15000) * .16; ctx.strokeStyle = line; ctx.lineWidth = .6;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
        }
        ctx.globalAlpha = .55; ctx.fillStyle = stroke;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }
    resize(); frame();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  }
  function aurora() {
    var a = $('#aurora'); if (!a) return;
    window.addEventListener('mousemove', function (e) {
      a.style.left = e.clientX + 'px'; a.style.top = e.clientY + 'px';
    }, { passive: true });
  }
  function tilt() {
    if (!fine) return;
    $$('.work-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = 'perspective(900px) rotateX(' + (-y * 5).toFixed(2) + 'deg) rotateY(' + (x * 5).toFixed(2) + 'deg) translateZ(0)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  /* ---------- interactions ---------- */
  function initInteractions() {
    var byId = {}; P.projects.forEach(function (p) { byId[p.id] = p; });

    $$('#filterBar button').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('#filterBar button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        var cat = b.dataset.cat;
        $$('.work-card').forEach(function (card) {
          card.classList.toggle('hidden', cat !== 'all' && card.dataset.cat !== cat);
        });
      });
    });

    var lb = $('#lightbox'), lastFocus = null;
    function openLB(id) {
      var p = byId[id]; if (!p || !lb) return;
      lastFocus = document.activeElement;
      $('#lbIn').innerHTML = '<img class="lb-img" src="' + esc(p.image) + '" alt="' + esc(p.alt) + '">' +
        '<div class="lb-body">' +
        '<h3>' + esc(p.no) + ' · ' + esc(p.title) + '</h3>' +
        '<p class="sub">' + esc(p.subtitle) + '　|　角色：' + esc(p.role) + '</p>' +
        '<h4>// 背景</h4><p>' + esc(p.context) + '</p>' +
        '<h4>// 做法</h4><ul>' + p.approach.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>' +
        '<h4>// 结果</h4><p>' + esc(p.result) + '</p>' +
        '<h4>// 技术栈</h4><p>' + esc(p.stack.join(' · ')) + '</p>' +
        '<div class="ev">证据：' + esc(p.evidence) + '</div></div>';
      lb.classList.add('open'); document.body.style.overflow = 'hidden';
      $('#lbClose').focus();
    }
    function closeLB() {
      lb.classList.remove('open'); document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    document.addEventListener('click', function (e) {
      var target = e.target && e.target.nodeType === 1 ? e.target : (e.target && e.target.parentElement);
      if (!target || !target.closest) return;
      var t = target.closest('[data-open]');
      if (t) { openLB(t.dataset.open); return; }
      if (target === lb) closeLB();
      var cp = target.closest('[data-copy]');
      if (cp) {
        var v = cp.dataset.copy;
        if (isPH(v)) { toast('这是待填占位符，请在 data/profile.json 中替换'); return; }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(v).then(function () { toast('已复制：' + v); },
            function () { toast('复制失败，请手动选中'); });
        } else { toast('请手动复制：' + v); }
        return;
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('open')) { closeLB(); return; }
      var target = e.target && e.target.classList ? e.target : null;
      if (target && (e.key === 'Enter' || e.key === ' ') && target.classList.contains('work-media')) {
        e.preventDefault(); openLB(target.dataset.open);
      }
    });
    $('#lbClose').addEventListener('click', closeLB);

    var mt = $('#menuToggle'), nav = $('#nav');
    mt.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      mt.setAttribute('aria-expanded', String(open));
    });
    $$('#nav a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); mt.setAttribute('aria-expanded', 'false'); });
    });

    var bar = $('#progress');
    function onScroll() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
      var cur = '';
      $$('main section').forEach(function (s) {
        if (s.getBoundingClientRect().top <= 120) cur = s.id;
      });
      $$('#nav a').forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + cur); });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
