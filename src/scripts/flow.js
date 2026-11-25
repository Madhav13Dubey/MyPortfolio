// Animates the Text-to-SQL pipeline: steps light up one after another, then the loop restarts.
// Runs only while the flow is on screen; with reduced motion every step is simply shown as done.
const STEP_MS = 1500;
const HOLD_MS = 2600;

export function initFlow() {
  const flow = document.querySelector('.flow');
  if (!flow) return;
  const steps = [...flow.children];

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    steps.forEach((s) => s.classList.add('is-done'));
    flow.style.setProperty('--fill', '100%');
    return;
  }

  let n = -1;
  let timer;
  const show = () => {
    steps.forEach((s, k) => {
      s.classList.toggle('is-active', k === n);
      s.classList.toggle('is-done', k < n);
    });
    const fill = n < 0 ? 0 : n >= steps.length ? flow.offsetHeight : steps[n].offsetTop + 19;
    flow.style.setProperty('--fill', `${fill}px`);
  };
  const tick = () => {
    n = n >= steps.length ? -1 : n + 1;
    show();
    timer = setTimeout(tick, n >= steps.length ? HOLD_MS : STEP_MS);
  };

  new IntersectionObserver(
    ([e]) => {
      clearTimeout(timer);
      if (e.isIntersecting) tick();
    },
    { threshold: 0.35 },
  ).observe(flow);
}
