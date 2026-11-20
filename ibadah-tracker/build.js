const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const wwwDir = path.join(srcDir, 'www');

if (!fs.existsSync(wwwDir)) {
  fs.mkdirSync(wwwDir, { recursive: true });
}

const filesToCopy = [
  'index.html',
  'style.css',
  'app.js',
  'manifest.json',
  'sw.js',
  'icon-192.png',
  'icon-512.png'
];

for (const file of filesToCopy) {
  const src = path.join(srcDir, file);
  const dest = path.join(wwwDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file} -> www/${file}`);
  }
}

console.log('Build complete: www/ is ready.');
