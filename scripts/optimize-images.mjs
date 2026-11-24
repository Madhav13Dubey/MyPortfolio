// Usage: npm run images:optimize -- <file...> [--width=1200]
// Converts each image to a compressed .webp next to it (a "-src" suffix is dropped).
import path from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const width = Number(args.find((a) => a.startsWith('--width='))?.split('=')[1] ?? 1200);
const files = args.filter((a) => !a.startsWith('--'));

if (files.length === 0) {
  process.stderr.write('Usage: npm run images:optimize -- <file...> [--width=1200]\n');
  process.exit(1);
}

for (const file of files) {
  const { dir, name } = path.parse(file);
  const out = path.join(dir, `${name.replace(/-src$/, '')}.webp`);
  const info = await sharp(file)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(out);
  process.stdout.write(`${out} -> ${(info.size / 1024).toFixed(0)} KB\n`);
}
