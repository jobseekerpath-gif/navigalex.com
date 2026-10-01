const fs = require('fs');
const path = require('path');

const file = path.resolve('server.ts');
let source = fs.readFileSync(file, 'utf8');

const oldBlock = `app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') { return next(); }
    res.sendFile(path.resolve('dist/index.html'));
  });`;

const newBlock = `app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    const pathname = req.path || '';
    if (pathname.startsWith('/assets/') || /\\.(js|mjs|css|map|png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|eot)$/.test(pathname)) {
      return res.status(404).end();
    }
    return res.sendFile(path.resolve('dist/index.html'));
  });`;

if (source.includes(newBlock)) {
  console.log('SPA asset fallback protection already present.');
  process.exit(0);
}
if (!source.includes(oldBlock)) {
  throw new Error('Expected SPA fallback block not found in server.ts');
}
source = source.replace(oldBlock, newBlock);
fs.writeFileSync(file, source, 'utf8');
console.log('SPA asset fallback protection applied.');
