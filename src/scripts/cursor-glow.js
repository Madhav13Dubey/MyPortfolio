// Soft colour blob that trails the pointer behind the page content (CSS: .cursor-glow).
export function initCursorGlow() {
  const glow = document.querySelector('.cursor-glow');
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!glow || !fine || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let x = innerWidth / 2;
  let y = innerHeight / 2;
  let tx = x;
  let ty = y;
  let running = false;

  const tick = () => {
    x += (tx - x) * 0.12; // ease toward the pointer for a smooth trail
    y += (ty - y) * 0.12;
    glow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    if (Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) requestAnimationFrame(tick);
    else running = false;
  };

  document.addEventListener('pointermove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    glow.classList.add('on');
    if (!running) {
      running = true;
      requestAnimationFrame(tick);
    }
  });
  document.documentElement.addEventListener('pointerleave', () => glow.classList.remove('on'));
}
