const fs = require('fs');
const path = require('path');

const file = path.resolve('server.ts');
let source = fs.readFileSync(file, 'utf8');

const protectedBlock = `app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    const pathname = req.path || '';
    if (pathname.startsWith('/assets/') || /\\.(js|mjs|css|map|png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|eot)$/.test(pathname)) {
      return res.status(404).end();
    }
    return res.sendFile(path.resolve('dist/index.html'));
  });`;

if (source.includes('const pathname = req.path ||') && source.includes("pathname.startsWith('/assets/')")) {
  console.log('SPA asset fallback protection already present.');
  process.exit(0);
}

const fallbackPattern = /app\.use\(\(req, res, next\) => \{\s*if \(req\.method !== ['\"]GET['\"] && req\.method !== ['\"]HEAD['\"]\)\s*\{?\s*return next\(\);\s*\}?\s*res\.sendFile\(path\.resolve\(['\"]dist\/index\.html['\"]\)\);\s*\}\);/m;

if (!fallbackPattern.test(source)) {
  console.log('SPA fallback block not found; leaving server.ts unchanged.');
  process.exit(0);
}

source = source.replace(fallbackPattern, protectedBlock);
fs.writeFileSync(file, source, 'utf8');
console.log('SPA asset fallback protection applied.');
