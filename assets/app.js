/* Online resume / portfolio — data-driven, zero dependencies.
   Data source: data/profile.json  →  generated data/profile.js (window.PROFILE)
   Rebuild everything with: python3 tools/build.py                              */
(function () {
  'use strict';

  /* ---------- i18n: UI chrome strings (data content lives in profile*.json) ---------- */
  var DICT = {
    zh: {
      'nav.about':'关于','nav.skills':'能力','nav.works':'作品','nav.services':'服务','nav.process':'流程','nav.contact':'联系',
      'hero.kicker':'available for freelance · remote','hero.works':'看作品','hero.services':'服务与报价','hero.pdf':'下载 PDF','hero.word':'下载 Word',
      'sec.about':'关于我','sec.aboutDesc':'about.md','sec.skills':'能力矩阵','sec.skillsDesc':'七个能力域 · 都有项目支撑','sec.works':'代表作品',
      'sec.services':'服务与参考报价','sec.servicesDesc':'起步价 · 以需求评估为准','sec.process':'怎么合作','sec.processDesc':'按周可演示，不做黑盒',
      'sec.boundary':'边界与原则','sec.boundaryDesc':'先把不做的说清楚','boundary.no':'// 不接','boundary.ok':'// 坚持',
      'contact.title':'有需求，直接聊','contact.desc':'说明目标、范围和时间，我给一页需求确认单和报价。远程为主，广州可面谈。',
      'contact.hint':'点击任一条可复制 · 电话与微信同号','foot.tech':'纯静态单页 · 零依赖 · 可部署 GitHub Pages / Vercel / Netlify',
      'doc.title':'Yuan Ou (Irving) 作品集 · 广告变现 × 数据可视化工程师',
      'doc.desc':'资深全栈 / 大前端工程师作品集：多端聚合广告 SDK、数据可视化大屏、中后台与跨端应用、微信小游戏。可承接整包开发、技术咨询与长期合作。',
      'label.pitch':'一句话定位：','label.role':'ROLE','label.location':'LOCATION','label.experience':'EXPERIENCE','label.focus':'FOCUS',
      'filter.all':'全部','filter.ads':'广告 / SDK','filter.viz':'可视化','filter.fullstack':'中后台 / 全栈','filter.game':'小游戏',
      'table.hash':'#','table.service':'服务','table.deliver':'交付内容','table.price':'参考起步价',
      'card.view':'查看','card.more':'展开详情 →','card.ariaView':'查看 ','card.ariaViewTail':' 详情与图片',
      'card.role':'角色：','lb.background':'// 背景','lb.approach':'// 做法','lb.result':'// 结果','lb.stack':'// 技术栈','lb.evidence':'证据：',
      'copy.aria':'复制','copy.ph':'这是待填占位符，请在 data/profile.json 中替换','copy.ok':'已复制：','copy.fail':'复制失败，请手动选中','copy.manual':'请手动复制：',
      'toast.theme':'主题已切换：','theme.names':{'deep-space':'A 深空终端','aurora-glass':'B 极光玻璃','neon-grid':'C 霓虹网格','blueprint':'D 工程蓝图'},
      'typed.lines':['从架构到上线，一个人全做','可接整包 / 咨询 / 长期合作'],
      'foot.meta':'数据源于 data/profile.json','foot.fallback':'作品集',
      'count.note':'熟练度','data.fail':'数据文件未加载：请运行 python3 tools/build.py'
    },
    en: {
      'nav.about':'About','nav.skills':'Skills','nav.works':'Work','nav.services':'Services','nav.process':'Process','nav.contact':'Contact',
      'hero.kicker':'available for freelance · remote','hero.works':'View work','hero.services':'Services & rates','hero.pdf':'Download PDF','hero.word':'Download Word',
      'sec.about':'About me','sec.aboutDesc':'about.md','sec.skills':'Skill matrix','sec.skillsDesc':'Seven domains, each backed by projects','sec.works':'Selected work',
      'sec.services':'Services & indicative rates','sec.servicesDesc':'Starting points · quoted per scope','sec.process':'How we work','sec.processDesc':'Weekly demos, no black box',
      'sec.boundary':'Boundaries & principles','sec.boundaryDesc':'What I do not take, stated up front','boundary.no':'// Not taking','boundary.ok':'// Standing by',
      'contact.title':'Have a project? Let’s talk','contact.desc':'Send the goal, scope and timeline; I reply with a one-page confirmation and a quote. Remote by default; face-to-face in Guangzhou possible.',
      'contact.hint':'Click any row to copy · phone and WeChat share the same number','foot.tech':'Pure static single page · zero dependencies · deployable to GitHub Pages / Vercel / Netlify',
      'doc.title':'Yuan Ou (Irving) — Ad Monetization & Mobile SDK Engineer',
      'doc.desc':'Ad monetization & mobile SDK engineer: mediation SDK, data visualization walls, admin and cross-platform apps, WeChat mini games.',
      'label.pitch':'In one line:','label.role':'ROLE','label.location':'LOCATION','label.experience':'EXPERIENCE','label.focus':'FOCUS',
      'filter.all':'All','filter.ads':'Ads / SDK','filter.viz':'Visualization','filter.fullstack':'Full-stack','filter.game':'Games',
      'table.hash':'#','table.service':'Service','table.deliver':'Deliverables','table.price':'Indicative rate',
      'card.view':'View','card.more':'Read more →','card.ariaView':'View ','card.ariaViewTail':' details and images',
      'card.role':'Role:','lb.background':'// Background','lb.approach':'// Approach','lb.result':'// Result','lb.stack':'// Stack','lb.evidence':'Evidence:',
      'copy.aria':'Copy ','copy.ph':'This is an unfilled placeholder; replace it in data/profile.en.json','copy.ok':'Copied: ','copy.fail':'Copy failed, please select manually','copy.manual':'Please copy manually: ',
      'toast.theme':'Theme switched: ','theme.names':{'deep-space':'A Deep Space','aurora-glass':'B Aurora Glass','neon-grid':'C Neon Grid','blueprint':'D Blueprint'},
      'typed.lines':['From architecture to release, end to end','Packages / consulting / long-term work'],
      'foot.meta':'Data from data/profile.en.json','foot.fallback':'portfolio',
      'count.note':'Proficiency','data.fail':'Data failed to load: run python3 tools/build.py'
    }
  };
  var LANG = 'zh';
  var T = function (key) { var d = DICT[LANG]; return (d && d[key] != null) ? d[key] : key; };
  var PF = function () { return LANG === 'en' ? (window.PROFILE_EN || window.PROFILE) : window.PROFILE; };
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
  function boot() {
    try { LANG = localStorage.getItem('portfolio-lang') === 'en' ? 'en' : 'zh'; } catch (e) {}
    var d = PF();
    if (d) { P = d; start(); }
    else {
      var url = LANG === 'en' ? 'data/profile.en.json' : 'data/profile.json';
      fetch(url).then(function (r) { return r.json(); }).then(function (data) { P = data; start(); })
        .catch(function () { toast(T('data.fail')); });
    }
  }
  function start() {
    try { renderAll(); } catch (e) { console.error('[portfolio] render failed', e); }
    initTheme(); initMotion(); initInteractions(); initLang();
  }
  boot();

  /* ---------- render ---------- */
  function renderAll() {
    var id = P.identity;
    document.documentElement.lang = LANG === 'en' ? 'en' : 'zh-CN';
    document.title = T('doc.title');
    var dm = $('meta[name=description]'); if (dm) dm.setAttribute('content', T('doc.desc'));
    $('#brandName').textContent = isPH(id.name) ? 'portfolio' : String(id.name).toLowerCase().replace(/\s+/g, '-');
    $('#heroName').textContent = id.name;
    $('#heroRole').textContent = id.role + ' · ' + id.location;
    $('#heroPitch').textContent = id.pitch;
    $('#footMeta').textContent = '© ' + new Date().getFullYear() + ' · ' + (isPH(id.name) ? T('foot.fallback') : id.name) + ' · ' + T('foot.meta');

    $('#factsGrid').innerHTML = P.facts.map(function (f) {
      return '<div class="fact reveal"><div class="num"><span class="count" data-to="' + esc(f.value) + '">' + esc(f.value) + '</span><small>' + esc(f.unit) + '</small></div>' +
        '<div class="lbl">' + esc(f.label) + '</div><div class="note">' + esc(f.note) + '</div></div>';
    }).join('');

    var intro = id.intro.split(/\n\n+/).filter(Boolean);
    $('#aboutText').innerHTML = intro.map(function (t) { return '<p class="reveal">' + esc(t) + '</p>'; }).join('') +
      '<p class="reveal"><strong>'+T('label.pitch')+'</strong>' + esc(id.focus) + '。</p>';
    $('#sideInfo').innerHTML = '<h3>// identity</h3><dl>' +
      '<dt>' + T('label.role') + '</dt><dd>' + esc(id.role) + '</dd>' +
      '<dt>' + T('label.location') + '</dt><dd>' + esc(id.location) + '</dd>' +
      (isPH(id.experience) ? '' : '<dt>' + T('label.experience') + '</dt><dd>' + esc(id.experience) + '</dd>') +
      '<dt>' + T('label.focus') + '</dt><dd>' + esc(id.focus) + '</dd></dl>';

    $('#skillGrid').innerHTML = P.skills.map(function (s) {
      return '<article class="skill-card reveal" style="--level:' + Number(s.level) + '%">' +
        '<div class="skill-top"><h3>' + esc(s.name) + '</h3>' + (s.tag ? '<span class="tag">' + esc(s.tag) + '</span>' : '') + '</div>' +
        '<div class="bar" role="img" aria-label="' + T('count.note') + ' ' + Number(s.level) + ' / 100"><i></i></div>' +
        '<ul>' + s.items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul></article>';
    }).join('');

    var cats = [{ k: 'all', n: T('filter.all') }, { k: 'ads', n: T('filter.ads') }, { k: 'visualization', n: T('filter.viz') },
      { k: 'fullstack', n: T('filter.fullstack') }, { k: 'game', n: T('filter.game') }];
    $('#filterBar').innerHTML = cats.map(function (c, i) {
      return '<button data-cat="' + c.k + '" aria-pressed="' + (i === 0) + '">' + esc(c.n) + '</button>';
    }).join('');

    $('#workGrid').innerHTML = P.projects.map(function (p) {
      return '<article class="work-card reveal" data-cat="' + esc(p.category) + '" data-id="' + esc(p.id) + '">' +
        '<div class="work-media" data-open="' + esc(p.id) + '" role="button" tabindex="0" aria-label="' + T('card.ariaView') + ' ' + esc(p.title) + '' + T('card.ariaViewTail') + '">' +
          '<img src="' + esc(p.image) + '" alt="' + esc(p.alt) + '" loading="lazy">' +
          '<span class="no">' + esc(p.no) + '</span></div>' +
        '<div class="work-body">' +
          '<h3>' + esc(p.title) + '</h3><p class="sub">' + esc(p.subtitle) + '</p>' +
          '<div class="work-metrics">' + p.metrics.map(function (m) {
            return '<div><b>' + esc(m.value) + '</b><span>' + esc(m.label) + '</span></div>';
          }).join('') + '</div>' +
          '<p class="ctx">' + esc(p.context) + '</p>' +
          '<div class="chips">' + p.stack.map(function (s) { return '<span class="chip">' + esc(s) + '</span>'; }).join('') + '</div></div>' +
        '<button class="work-more" data-open="' + esc(p.id) + '">' + T('card.more') + '</button></article>';
    }).join('');

    $('#extrasGrid').innerHTML = P.extras.map(function (e) {
      return '<div class="extra reveal"><h4>' + esc(e.name) + ' <span class="st">' + esc(e.status) + '</span></h4><p>' + esc(e.desc) + '</p></div>';
    }).join('');

    $('#serviceRows').innerHTML = '<div class="row head"><span>'+T('table.hash')+'</span><span>'+T('table.service')+'</span><span>'+T('table.deliver')+'</span><span style="text-align:right">'+T('table.price')+'</span></div>' +
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
      return '<button class="contact-item reveal" data-copy="' + esc(c.value) + '" aria-label="' + T('copy.aria') + ' ' + esc(c.label) + '">' +
        '<div class="k">' + esc(c.label.toUpperCase()) + '</div><div class="v ' + (isPH(c.value) ? 'ph' : '') + '">' + esc(c.display || c.value) + '</div></button>';
    }).join('');
  }

  /* ---------- language ---------- */
  function applyDataI18n() {
    $$('[data-i18n]').forEach(function (el) {
      var v = T(el.getAttribute('data-i18n'));
      if (typeof v === 'string') el.textContent = v;
    });
  }
  function refreshReveal() {
    // 语言切换重渲染后，新节点默认 opacity:0；立即标记可见，避免依赖滚动观察造成空白。
    $$('.reveal').forEach(function (el) { el.classList.add('in-view'); });
    $$('.count').forEach(function (el) { if (!el.dataset.done) { el.dataset.done = '1'; el.textContent = el.dataset.to; } });
    var typed = $('#typed'); if (typed) typed.textContent = P.identity.focus;
  }
  function switchLang(next) {
    if (next === LANG) return;
    var d = next === 'en' ? (window.PROFILE_EN || window.PROFILE) : window.PROFILE;
    if (!d) { toast(T('data.fail')); return; }
    LANG = next; P = d;
    try { localStorage.setItem('portfolio-lang', next); } catch (e) {}
    document.documentElement.lang = next === 'en' ? 'en' : 'zh-CN';
    document.title = T('doc.title');
    var dm = $('meta[name=description]'); if (dm) dm.setAttribute('content', T('doc.desc'));
    var dl = $('#dlPdf'), dw = $('#dlWord');
    if (dl) dl.setAttribute('href', next === 'en' ? 'downloads/Irving-Ou-Resume-EN.pdf' : 'downloads/Irving-简历.pdf');
    if (dw) dw.setAttribute('href', next === 'en' ? 'downloads/Irving-Ou-Resume-EN.docx' : 'downloads/Irving-简历-v2.docx');
    $('#langZh').setAttribute('aria-pressed', String(next === 'zh'));
    $('#langEn').setAttribute('aria-pressed', String(next === 'en'));
    try { renderAll(); } catch (e) { console.error('[portfolio] re-render failed', e); }
    applyDataI18n();
    refreshReveal();
  }
  function initLang() {
    applyDataI18n();
    $('#langZh').setAttribute('aria-pressed', String(LANG === 'zh'));
    $('#langEn').setAttribute('aria-pressed', String(LANG === 'en'));
    var dl = $('#dlPdf'), dw = $('#dlWord');
    if (dl) dl.setAttribute('href', LANG === 'en' ? 'downloads/Irving-Ou-Resume-EN.pdf' : 'downloads/Irving-简历.pdf');
    if (dw) dw.setAttribute('href', LANG === 'en' ? 'downloads/Irving-Ou-Resume-EN.docx' : 'downloads/Irving-简历-v2.docx');
    $('#langZh').addEventListener('click', function () { switchLang('zh'); });
    $('#langEn').addEventListener('click', function () { switchLang('en'); });
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
        toast(T('toast.theme') + T('theme.names')[b.dataset.t]);
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
    var lines = [P.identity.focus].concat(T('typed.lines'));
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
        '<p class="sub">' + esc(p.subtitle) + '　|　' + T('card.role') +  + esc(p.role) + '</p>' +
        '<h4>' + T('lb.background') + '</h4><p>' + esc(p.context) + '</p>' +
        '<h4>' + T('lb.approach') + '</h4><ul>' + p.approach.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>' +
        '<h4>' + T('lb.result') + '</h4><p>' + esc(p.result) + '</p>' +
        '<h4>' + T('lb.stack') + '</h4><p>' + esc(p.stack.join(' · ')) + '</p>' +
        '<div class="ev">' + T('lb.evidence') +  + esc(p.evidence) + '</div></div>';
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
        if (isPH(v)) { toast(T('copy.ph')); return; }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(v).then(function () { toast(T('copy.ok') + v); },
            function () { toast(T('copy.fail')); });
        } else { toast(T('copy.manual') + v); }
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
