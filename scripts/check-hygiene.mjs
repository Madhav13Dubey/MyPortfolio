// Blocks debug leftovers, obvious secrets and the unmasked phone number from reaching main.
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const rules = [
  [/\bdebugger\b/, 'debugger statement'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key'],
  [/\b(ghp|gho|github_pat)_[A-Za-z0-9_]{20,}/, 'GitHub token'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'AWS access key'],
  [/\bxox[abp]-[A-Za-z0-9-]{10,}/, 'Slack token'],
  [/6006\s?9?0?1010/, 'unmasked phone number (use 6006XXXXXX)'],
];

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
  );
}

const files = [...walk('src'), ...walk('public'), 'index.html', 'README.md'].filter((f) =>
  /\.(js|css|html|md|json|txt|svg|xml)$/.test(f),
);

const errors = files.flatMap((f) => {
  const text = readFileSync(f, 'utf8');
  return rules.filter(([re]) => re.test(text)).map(([, label]) => `${f}: ${label}`);
});

if (errors.length > 0) {
  process.stderr.write(`${errors.join('\n')}\n`);
  process.exit(1);
}
process.stdout.write('hygiene OK\n');
