// Project viewer: a modal that opens only on request (system architecture, or the 12-screen tour).
// Images are loaded lazily from src/assets/images/text2sql/ the moment a slide is shown.
const urls = import.meta.glob('/src/assets/images/text2sql/*.webp', {
  query: '?url',
  import: 'default',
});

const ARCH = [
  {
    file: 'architecture',
    title: 'System architecture',
    caption:
      'A multi-stage pipeline: API gateway (OAuth, rate limiting), input guardrails, RAG retriever with a vector DB, prompt builder, LLM SQL generator, SQL validator, executor with retry logic and a result formatter.',
  },
];

const TOUR = [
  [
    '01-landing',
    'Landing',
    'SQLMind opens with a clear empty state: connect a database, then just ask.',
  ],
  [
    '02-connect',
    'Connect your database',
    'Host, port, schema and a read-only user. Only table metadata is read, never the rows.',
  ],
  [
    '03-schema',
    'Schema discovery',
    'Tables and columns are scanned to build the SQL context the model works from.',
  ],
  ['04-ready', 'Setup complete', 'Start querying straight away, or browse the discovered catalog.'],
  [
    '05-pipeline-idle',
    'Ready to query',
    'Suggested prompts, plus a live tracker for every pipeline stage from guardrails to execution.',
  ],
  [
    '06-pipeline-running',
    'Pipeline in action',
    'Each stage lights up as the question moves through guardrails, retrieval, prompting, generation and validation.',
  ],
  [
    '07-result',
    'SQL and insights',
    'The generated SQL, an AI summary of the result and the raw response, with CSV export. (Sensitive data blurred.)',
  ],
  [
    '08-history',
    'Query history',
    'Every question is logged, searchable and filterable by source database.',
  ],
  [
    '09-databases',
    'Database connections',
    'Manage connections and see which one is active. (Connection details blurred.)',
  ],
  [
    '10-count',
    'Aggregate questions',
    'Plain-English questions become precise queries, like counting the assets in a table.',
  ],
  [
    '11-guardrail-offtopic',
    'Guardrail: off-topic',
    'Questions unrelated to the data are rejected before any SQL is generated.',
  ],
  [
    '12-guardrail-delete',
    'Guardrail: unsafe SQL',
    'Destructive requests are blocked: "Unauthorized SQL keywords detected."',
  ],
].map(([file, title, caption]) => ({ file, title, caption }));

export function initGallery() {
  const dlg = document.getElementById('viewer');
  if (!dlg) return;
  const $ = (id) => document.getElementById(id);
  const img = $('viewerImg');
  const title = $('viewerTitle');
  const kicker = $('viewerKicker');
  const cap = $('viewerCap');
  const bar = $('viewerBar');
  const count = $('viewerCount');
  const dots = $('viewerDots');
  const play = $('viewerPlay');
  const prev = $('viewerPrev');
  const next = $('viewerNext');

  let slides = [];
  let i = 0;
  let timer = null;
  let isTour = false;

  const load = (file) => urls[`/src/assets/images/text2sql/${file}.webp`]?.();

  async function show(n) {
    i = (n + slides.length) % slides.length;
    const s = slides[i];
    title.textContent = s.title;
    cap.textContent = s.caption;
    kicker.textContent = isTour ? `Step ${i + 1} of ${slides.length}` : 'Truvis.ai · Text-to-SQL';
    count.textContent = isTour ? `${String(i + 1).padStart(2, '0')} / ${slides.length}` : '';
    bar.style.width = `${((i + 1) / slides.length) * 100}%`;
    dots
      .querySelectorAll('button')
      .forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
    dlg.classList.remove('zoomed');
    img.classList.add('loading');
    const url = await load(s.file);
    if (slides[i] !== s) return; // user moved on while loading
    img.onload = () => img.classList.remove('loading');
    img.src = url;
    img.alt = `${s.title}: ${s.caption}`;
    if (isTour) load(slides[(i + 1) % slides.length].file); // warm the next slide
  }

  function stop() {
    clearInterval(timer);
    timer = null;
    play.setAttribute('aria-pressed', 'false');
    play.textContent = '▶ Auto-play';
  }
  function start() {
    play.setAttribute('aria-pressed', 'true');
    play.textContent = '❚❚ Pause';
    timer = setInterval(() => show(i + 1), 4500);
  }

  function open(mode) {
    isTour = mode === 'tour';
    slides = isTour ? TOUR : ARCH;
    dlg.classList.toggle('single', !isTour);
    dots.replaceChildren(
      ...slides.map((s, k) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', `Go to step ${k + 1}: ${s.title}`);
        b.textContent = String(k + 1);
        b.addEventListener('click', () => {
          stop();
          show(k);
        });
        return b;
      }),
    );
    dlg.showModal();
    show(0);
  }

  document
    .querySelectorAll('[data-viewer]')
    .forEach((b) => b.addEventListener('click', () => open(b.dataset.viewer)));
  prev.addEventListener('click', () => {
    stop();
    show(i - 1);
  });
  next.addEventListener('click', () => {
    stop();
    show(i + 1);
  });
  play.addEventListener('click', () => (timer ? stop() : start()));
  img.addEventListener('click', () => dlg.classList.toggle('zoomed'));
  $('viewerClose').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => e.target === dlg && dlg.close()); // backdrop click
  dlg.addEventListener('close', stop);
  dlg.addEventListener('keydown', (e) => {
    if (!isTour) return;
    if (e.key === 'ArrowRight') next.click();
    if (e.key === 'ArrowLeft') prev.click();
  });
}
