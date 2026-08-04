import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const issues = [];
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (['.ts', '.tsx', '.css', '.html'].includes(extname(entry.name))) {
      const content = await readFile(path, 'utf8');
      const name = relative(root, path);
      if (/lorem ipsum|TODO|FIXME/i.test(content)) issues.push(`${name}: unfinished marker found`);
      if (/href=["']#["']/.test(content)) issues.push(`${name}: empty anchor target found`);
      if (/console\.(log|debug)\(/.test(content)) issues.push(`${name}: debug console statement found`);
      if (/onClick=\{\(\) => \{\}\}/.test(content)) issues.push(`${name}: empty click handler found`);
    }
  }
}
await walk(join(root, 'src'));
if (issues.length) { console.error(issues.join('\n')); process.exit(1); }
console.log('Lint checks passed.');
