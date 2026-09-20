import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, 'dist');
// An explicit public-file list keeps backups and project notes off the website.
const pages = [
  'index.html', 'pricing.html', 'our-process.html', 'privacy.html', 'terms.html',
  'audit/index.html', 'styles.css', 'performance.css', 'secondary.css',
  'home-flow.css', 'offers.css', 'downloaded-visuals.css', 'gbp-visuals.css', 'main.js',
  'performance.js', 'robots.txt', 'sitemap.xml', 'site.webmanifest',
  'favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png',
  'apple-touch-icon.png', 'icon-192.png', 'icon-512.png',
];
const assetTypes = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.avif', '.ico', '.woff', '.woff2', '.ttf', '.otf', '.txt']);
let count = 0;
async function copy(relative) {
  const target = join(output, relative);
  await mkdir(dirname(target), { recursive: true });
  await cp(join(root, relative), target);
  count++;
}
async function copyAssets(relative) {
  for (const entry of await readdir(join(root, relative), { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const path = join(relative, entry.name);
    if (entry.isDirectory()) await copyAssets(path);
    else if (entry.isFile() && assetTypes.has(extname(entry.name).toLowerCase())) await copy(path);
  }
}
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const page of pages) await copy(page);
for (const directory of ['assets', 'fonts', 'img']) await copyAssets(directory);
console.log(`Built ${count} public files in dist/. Backups and project notes excluded.`);
