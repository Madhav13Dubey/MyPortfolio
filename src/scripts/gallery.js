// Project viewer: a modal that opens only on request (system architecture, or the 12-screen tour).
// Images are loaded lazily from src/assets/images/text2sql/ the moment a slide is shown.
const urls = import.meta.glob('/src/assets/images/text2sql/**/*.webp', {
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

const DECK = [
  [
    'What is Text-to-SQL?',
    'Plain-English questions converted into SQL, bridging non-technical users and relational databases.',
  ],
  [
    'Problem statement',
    'Why data access stays locked behind SQL expertise, and where existing tools fall short.',
  ],
  [
    'Project objectives',
    'Natural language to SQL, RAG-enhanced accuracy, a friendly interface and less SQL dependency.',
  ],
  ['Technology stack', 'NLP, RAG, LLMs, PostgreSQL and a vector database (ChromaDB / FAISS).'],
  [
    'LLM vs RAG-based generation',
    'Supplying the exact database schema to the LLM reduces hallucinations.',
  ],
  [
    'What is RAG?',
    'Retrieval-Augmented Generation: fetch the relevant schema context before the model writes SQL.',
  ],
  [
    'System architecture',
    'A multi-stage pipeline built to keep query validity and execution safe.',
  ],
  [
    'Input guardrails',
    'A hybrid, sequential "waterfall" check so only safe, relevant questions reach the database.',
  ],
  [
    'RAG retriever',
    'Schema memory in a vector database: indexing, semantic search and context injection.',
  ],
  [
    'Prompt builder',
    'Combines the question, retrieved schema and strict rules into a grounded prompt.',
  ],
  [
    'LLM and SQL generation',
    'The model returns the SQL query along with an explanation of how it works.',
  ],
  ['SQL validator', 'Blocks forbidden keywords like DROP, DELETE and UPDATE before anything runs.'],
  ['SQL executor', 'Runs the validated query against PostgreSQL and fetches the raw rows.'],
  ['Result formatter', 'Turns raw rows into a short, human-readable summary.'],
  ['Setup and onboarding (1/2)', 'From first launch to connecting a database.'],
  ['Setup and onboarding (2/2)', 'Schema scan, confirmation and the first query.'],
  ['Visual output', 'A question answered with generated SQL, an AI summary and the raw result.'],
  [
    'Guardrails in action',
    'Off-topic questions and destructive requests are rejected with a clear error.',
  ],
  [
    'Key features',
    'Friendly UI, context-aware generation, high accuracy, scalable design and validated output.',
  ],
  [
    'Advantages',
    'No SQL knowledge needed, faster data access, better productivity and fewer errors.',
  ],
  [
    'Real-world applications',
    'Analytics, dashboards, support, education, healthcare and e-commerce.',
  ],
  [
    'Future enhancements',
    'Multi-database support, voice input, fine-tuned models and query optimisation.',
  ],
  ['Conclusion', 'RAG-based text-to-SQL can democratise database access for non-technical users.'],
  ['Thank you', 'Natural Language to SQL Conversion Using RAG-Based Architecture.'],
].map(([title, caption], k) => ({
  file: `deck/${String(k + 1).padStart(2, '0')}`,
  title,
  caption,
}));

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
  let mode = 'arch';
  let isTour = false;

  const load = (file) => urls[`/src/assets/images/text2sql/${file}.webp`]?.();

  async function show(n) {
    i = (n + slides.length) % slides.length;
    const s = slides[i];
    title.textContent = s.title;
    cap.textContent = s.caption;
    kicker.textContent = isTour
      ? `${mode === 'deck' ? 'Slide' : 'Step'} ${i + 1} of ${slides.length}`
      : 'Truvis.ai · Text-to-SQL';
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

  function open(m) {
    mode = m;
    isTour = m !== 'arch';
    slides = { arch: ARCH, tour: TOUR, deck: DECK }[m];
    dlg.classList.toggle('single', !isTour);
    dlg.classList.toggle('deck', m === 'deck');
    dots.replaceChildren(
      ...slides.map((s, k) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute(
          'aria-label',
          `Go to ${mode === 'deck' ? 'slide' : 'step'} ${k + 1}: ${s.title}`,
        );
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
