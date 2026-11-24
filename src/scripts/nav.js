// Floating navbar: mobile menu toggle, scrolled style, active-section highlight.
export function initNav() {
  const nav = document.getElementById('nav');
  const links = document.getElementById('links');
  const btn = document.getElementById('menuBtn');
  if (!nav || !links || !btn) return;

  btn.addEventListener('click', () =>
    btn.setAttribute('aria-expanded', String(links.classList.toggle('open'))),
  );
  links.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 20), {
    passive: true,
  });

  const navLinks = [...links.querySelectorAll('a:not(.pill)')];
  const spy = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          navLinks.forEach((a) => a.classList.toggle('active', a.hash === `#${e.target.id}`));
        }
      }),
    { rootMargin: '-45% 0px -50% 0px' },
  );
  document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));
}
