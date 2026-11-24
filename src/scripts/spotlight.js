// Feeds the pointer position into --mx/--my on cards so CSS can draw a hover glow.
export function initSpotlight() {
  document.addEventListener('pointermove', (e) => {
    const el = e.target.closest?.('.card, .project, .tabs');
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
}
