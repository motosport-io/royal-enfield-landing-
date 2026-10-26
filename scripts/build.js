#!/usr/bin/env node
// Vercel build: copies the public site into dist/ and lists the gallery images.
// assets/data/gallery.json is generated from whatever is in assets/images/gallery/,
// so uploading images there is enough for the gallery to appear (no code change).
// Run locally:  node scripts/build.js && npx serve dist
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'dist');
const PUBLIC = ['index.html', 'terms.html', 'privacy.html', 'assets'];
const SKIP = new Set(['README.md', '.gitkeep', '.DS_Store']);
const IMAGE = /\.(webp|avif|jpe?g|png)$/i;

function copy(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) if (!SKIP.has(name)) copy(path.join(src, name), path.join(dest, name));
  } else {
    fs.copyFileSync(src, dest);
  }
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT);
for (const item of PUBLIC) copy(path.join(ROOT, item), path.join(OUT, item));

const galleryDir = path.join(ROOT, 'assets', 'images', 'gallery');
const files = fs.existsSync(galleryDir)
  ? fs.readdirSync(galleryDir).filter(f => IMAGE.test(f)).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
  : [];
const gallery = files.map(f => ({ src: '/assets/images/gallery/' + encodeURIComponent(f), file: f }));
fs.mkdirSync(path.join(OUT, 'assets', 'data'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'assets', 'data', 'gallery.json'), JSON.stringify(gallery, null, 1));

console.log('Built dist/ with', gallery.length, 'gallery image(s)');
