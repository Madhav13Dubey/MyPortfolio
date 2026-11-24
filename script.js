document.documentElement.classList.add('js');

// Typewriter
const words = ['Web Developer', 'Competitive Programmer', 'AI/ML Enthusiast'];
const typed = document.getElementById('typed');
let w = 0, c = 0, erasing = false;
(function tick() {
  const word = words[w];
  typed.textContent = word.slice(0, c);
  if (!erasing && c === word.length) { erasing = true; return setTimeout(tick, 1400); }
  if (erasing && c === 0) { erasing = false; w = (w + 1) % words.length; return setTimeout(tick, 400); }
  c += erasing ? -1 : 1;
  setTimeout(tick, erasing ? 40 : 90);
})();

// Mobile menu + nav state
const nav = document.getElementById('nav');
const links = document.getElementById('links');
const btn = document.getElementById('menuBtn');
btn.addEventListener('click', () => btn.setAttribute('aria-expanded', links.classList.toggle('open')));
links.addEventListener('click', e => {
  if (e.target.tagName === 'A') { links.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
});
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 20), { passive: true });

// Active link on scroll
const navLinks = [...links.querySelectorAll('a:not(.pill)')];
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('active', a.hash === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

// Reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * 80 + 'ms';
  io.observe(el);
});

// Accessible tabs
const tabs = [...document.querySelectorAll('[role=tab]')];
tabs.forEach((t, i) => {
  t.addEventListener('click', () => select(t));
  t.addEventListener('keydown', e => {
    const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (d) { const n = tabs[(i + d + tabs.length) % tabs.length]; select(n); n.focus(); }
  });
});
function select(tab) {
  tabs.forEach(t => {
    const on = t === tab;
    t.setAttribute('aria-selected', on);
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
  });
}

// Contact form -> Google Sheet
const scriptURL = 'https://script.google.com/macros/s/AKfycbzbHE-TzBnty5jgnyCJm21iYOZsHt8a-43m76suO_tzCpeBtlFLihLUr6zTvqRMKWlU/exec';
const form = document.getElementById('form');
const msg = document.getElementById('msg');
form.addEventListener('submit', async e => {
  e.preventDefault();
  if (!form.checkValidity()) { form.reportValidity(); return; }
  const submit = form.querySelector('button');
  submit.disabled = true;
  msg.className = '';
  msg.textContent = 'Sending…';
  try {
    await fetch(scriptURL, { method: 'POST', body: new FormData(form) });
    msg.textContent = 'Message sent successfully. Thank you!';
    form.reset();
  } catch (err) {
    msg.className = 'err';
    msg.textContent = 'Something went wrong. Please email me directly.';
  } finally {
    submit.disabled = false;
    setTimeout(() => (msg.textContent = ''), 6000);
  }
});

document.getElementById('year').textContent = new Date().getFullYear();
