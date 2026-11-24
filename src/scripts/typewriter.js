// Typewriter role line. `frame` is pure so it can be unit-tested without timers.
export function frame(state, words) {
  const { w, c, erasing } = state;
  const word = words[w];
  const text = word.slice(0, c);
  if (!erasing && c === word.length) return { text, next: { w, c, erasing: true }, delay: 1400 };
  if (erasing && c === 0) {
    return { text, next: { w: (w + 1) % words.length, c: 0, erasing: false }, delay: 400 };
  }
  return { text, next: { w, c: c + (erasing ? -1 : 1), erasing }, delay: erasing ? 40 : 90 };
}

export function initTypewriter(el, words) {
  if (!el) return;
  let state = { w: 0, c: 0, erasing: false };
  const tick = () => {
    const { text, next, delay } = frame(state, words);
    el.textContent = text;
    state = next;
    setTimeout(tick, delay);
  };
  tick();
}
