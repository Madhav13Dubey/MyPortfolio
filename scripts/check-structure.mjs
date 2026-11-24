// Fails CI when the repository layout drifts from the documented structure.
import { existsSync, readdirSync } from 'node:fs';

const required = [
  'index.html',
  'src/main.js',
  'src/styles',
  'src/scripts',
  'src/assets/images',
  'public/favicon.svg',
  'public/robots.txt',
  'tests/unit',
  'tests/e2e',
  '.github/workflows/ci.yml',
  '.github/pull_request_template.md',
  '.editorconfig',
  '.gitattributes',
  '.nvmrc',
  '.env.example',
];

// Anything of these types at the repo root means a file was dropped in the wrong place.
const strayAtRoot = /\.(png|jpe?g|webp|gif|css)$/i;

const errors = [
  ...required.filter((p) => !existsSync(p)).map((p) => `Missing required path: ${p}`),
  ...readdirSync('.')
    .filter((f) => strayAtRoot.test(f))
    .map((f) => `Stray file at repo root (move to src/ or public/): ${f}`),
];

if (errors.length > 0) {
  process.stderr.write(`${errors.join('\n')}\n`);
  process.exit(1);
}
process.stdout.write('structure OK\n');
