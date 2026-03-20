/* ═══════════════════════════════════════════
   LOADER
═══════════════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('out'), 2100);
});

/* ═══════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════ */
const cur = document.getElementById('cur');
const cur2 = document.getElementById('cur2');
let mx = 0, my = 0, tx = 0, ty = 0;

if (window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
  });
  (function loop() {
    tx += (mx - tx) * 0.13;
    ty += (my - ty) * 0.13;
    cur2.style.left = tx + 'px';
    cur2.style.top  = ty + 'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a, button, .gc').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cur-big'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cur-big'));
  });
}

/* ═══════════════════════════════════════════
   NAVBAR SCROLL
═══════════════════════════════════════════ */
const nav = document.getElementById('nav');
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      nav.classList.toggle('solid', window.scrollY > 60);
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

/* ═══════════════════════════════════════════
   HAMBURGER MENU
═══════════════════════════════════════════ */
const ham     = document.getElementById('ham');
const mobNav  = document.getElementById('mobNav');

function closeMobNav() { ham.classList.remove('on'); mobNav.classList.remove('on'); }
function openMobNav()  { ham.classList.add('on');    mobNav.classList.add('on'); }

ham.addEventListener('click', e => {
  e.stopPropagation();
  ham.classList.contains('on') ? closeMobNav() : openMobNav();
});
mobNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobNav));
document.addEventListener('click', e => {
  if (mobNav.classList.contains('on') && !nav.contains(e.target)) closeMobNav();
});
window.addEventListener('scroll', () => {
  if (mobNav.classList.contains('on')) closeMobNav();
}, { passive: true });

/* ═══════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════ */
// Stagger grid children
document.querySelectorAll('.pgrid, .why-grid, .t-grid, .steps, .faq-grid').forEach(grid => {
  Array.from(grid.children).forEach((c, i) => { c.dataset.delay = i * 75; });
});

const rvObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('in'), +(e.target.dataset.delay || 0));
      rvObs.unobserve(e.target);
    }
  });
}, { threshold: 0.09, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.rv').forEach(el => rvObs.observe(el));

/* ═══════════════════════════════════════════
   STAT COUNTERS
═══════════════════════════════════════════ */
const cObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target, target = +el.dataset.count, start = performance.now();
      (function step(now) {
        const p = Math.min((now - start) / 1800, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * target);
        if (p < 1) requestAnimationFrame(step);
      })(start);
      cObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => cObs.observe(el));

/* ═══════════════════════════════════════════
   PRODUCT FILTERS
═══════════════════════════════════════════ */
const fBtns = document.querySelectorAll('.fb');
const cards = document.querySelectorAll('.pc');
const visCount = document.getElementById('visCount');

function updateCount() {
  if (visCount) visCount.textContent = [...cards].filter(c => !c.classList.contains('hide')).length;
}

fBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    fBtns.forEach(b => b.classList.remove('act'));
    btn.classList.add('act');
    const f = btn.dataset.f;
    cards.forEach(c => {
      const match = f === 'all' || c.dataset.cat === f;
      if (!match) {
        c.classList.add('fading');
        setTimeout(() => { c.classList.add('hide'); c.classList.remove('fading'); }, 270);
      } else {
        c.classList.remove('hide');
        c.offsetHeight; // reflow
        setTimeout(() => c.classList.remove('fading'), 10);
      }
    });
    setTimeout(updateCount, 300);
  });
});

/* ═══════════════════════════════════════════
   ACTIVE NAV LINK
═══════════════════════════════════════════ */
const navAs  = document.querySelectorAll('.nav-a');
const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a => a.classList.toggle('act', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { threshold: 0.35 });
document.querySelectorAll('section[id]').forEach(s => secObs.observe(s));

/* ═══════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════ */
const cform  = document.getElementById('cform');
const formOk = document.getElementById('formOk');

if (cform) {
  cform.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('cname').value.trim();
    const mob  = document.getElementById('cmob').value.trim();
    if (!name || !mob) {
      [document.getElementById('cname'), document.getElementById('cmob')].forEach(inp => {
        if (!inp.value.trim()) {
          inp.style.borderColor = '#FF4D6D';
          setTimeout(() => inp.style.borderColor = '', 2000);
        }
      });
      return;
    }
    const btn  = cform.querySelector('button[type=submit]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span>Sending...</span>';
    btn.disabled  = true;
    setTimeout(() => {
      formOk.classList.add('show');
      cform.reset();
      btn.innerHTML = orig;
      btn.disabled  = false;
      setTimeout(() => formOk.classList.remove('show'), 5500);
    }, 1300);
  });
}

/* ═══════════════════════════════════════════
   SMOOTH SCROLL
═══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ═══════════════════════════════════════════
   PARALLAX ORBS
═══════════════════════════════════════════ */
let scrollY = 0;
window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });
(function parallax() {
  document.querySelectorAll('.orb').forEach((o, i) => {
    o.style.transform = `translateY(${scrollY * (i + 1) * 0.08}px)`;
  });
  document.querySelectorAll('.fe').forEach((f, i) => {
    f.style.transform = `translateY(${scrollY * ((i % 3 + 1) * 0.04)}px)`;
  });
  requestAnimationFrame(parallax);
})();

/* ═══════════════════════════════════════════
   GALLERY HOVER
═══════════════════════════════════════════ */
document.querySelectorAll('.gi').forEach(gi => {
  gi.addEventListener('mouseenter', () => { const img = gi.querySelector('img'); if (img) img.style.transform = 'scale(1.08)'; });
  gi.addEventListener('mouseleave', () => { const img = gi.querySelector('img'); if (img) img.style.transform = ''; });
});

/* ═══════════════════════════════════════════
   FAQ ACCORDION
═══════════════════════════════════════════ */
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-q').addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

/* ═══════════════════════════════════════════
   LIVE TIMING WIDGET (IST)
═══════════════════════════════════════════ */
(function checkTiming() {
  const now = new Date();
  // IST = UTC + 5h30m
  const ist   = new Date(now.getTime() + 5.5 * 3600 * 1000);
  const h     = ist.getUTCHours();
  const m     = ist.getUTCMinutes();
  const mins  = h * 60 + m;
  const open  = mins >= 420 && mins < 1260; // 7:00–21:00
  const badge = document.getElementById('openBadge');
  const text  = document.getElementById('openText');
  if (badge && text) {
    badge.className = 'open-badge ' + (open ? 'open' : 'closed');
    text.textContent = open ? 'Open Right Now' : 'Closed — Opens 7 AM';
  }
})();
