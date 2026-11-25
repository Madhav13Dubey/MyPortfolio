// Size budgets. Default: every source asset <= 300 KB.
// With --dist: the production build must stay within the bundle budgets below.
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const KB = 1024;
const MAX_ASSET = 300 * KB;
const DIST_BUDGET = { '.js': 60 * KB, '.css': 40 * KB, total: 3072 * KB };

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
  );
}

const errors = [];
if (process.argv.includes('--dist')) {
  const files = walk('dist');
  const sum = (ext) =>
    files.filter((f) => f.endsWith(ext)).reduce((n, f) => n + statSync(f).size, 0);
  for (const ext of ['.js', '.css']) {
    if (sum(ext) > DIST_BUDGET[ext])
      errors.push(`dist ${ext} total exceeds ${DIST_BUDGET[ext] / KB} KB`);
  }
  // Downloadable documents (.pptx) are not part of the page weight.
  const total = files.filter((f) => !f.endsWith('.pptx')).reduce((n, f) => n + statSync(f).size, 0);
  if (total > DIST_BUDGET.total) errors.push(`dist total exceeds ${DIST_BUDGET.total / KB} KB`);
} else {
  for (const f of [...walk('src/assets'), ...walk('public')]) {
    if (f.endsWith('.pdf') || f.endsWith('.pptx')) continue;
    if (statSync(f).size > MAX_ASSET)
      errors.push(`${f} is over ${MAX_ASSET / KB} KB - run npm run images:optimize`);
  }
}

if (errors.length > 0) {
  process.stderr.write(`${errors.join('\n')}\n`);
  process.exit(1);
}
process.stdout.write('assets OK\n');
