const fs = require('fs');
const path = require('path');

const file = path.resolve('src/App.tsx');
let source = fs.readFileSync(file, 'utf8');
const lazyLine = "const ServicesPage = lazy(() => import('./pages/ServicesPage'));";
const staticLine = "import ServicesPage from './pages/ServicesPage';";

if (source.includes(lazyLine)) {
  source = source.replace(lazyLine, staticLine);
  fs.writeFileSync(file, source, 'utf8');
  console.log('Production stability: ServicesPage converted to a static import.');
} else if (source.includes(staticLine)) {
  console.log('Production stability: ServicesPage already static.');
} else {
  throw new Error('ServicesPage import marker not found in src/App.tsx');
}
