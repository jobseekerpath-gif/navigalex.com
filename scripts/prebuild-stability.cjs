const fs = require('fs');
const path = require('path');

const file = path.resolve('src/App.tsx');
let source = fs.readFileSync(file, 'utf8');

const lazyLine = "const ServicesPage = lazy(() => import('./pages/ServicesPage'));";
const staticLine = "import ServicesPage from './pages/ServicesPage';";

if (source.includes(lazyLine)) {
  source = source.replace(lazyLine, staticLine);
  console.log('Production stability: ServicesPage converted to a static import.');
} else if (source.includes(staticLine)) {
  console.log('Production stability: ServicesPage already static.');
} else {
  throw new Error('ServicesPage import marker not found in src/App.tsx');
}

// Fix the Services navigation handler. The JSX calls selectPersona(), but older
// App.tsx revisions did not define it. Vite transpiles this without type-checking,
// causing a runtime ReferenceError only when the Services page is opened.
const marker = "  if (activeTab === 'admin') {";
const helper = `  const selectPersona = (nextPersona: string) => {\n    const safePersona = PERSONA_OPTIONS.some((option) => option.key === nextPersona) ? nextPersona : 'all';\n    setPersona(safePersona);\n    const params = new URLSearchParams(window.location.search);\n    if (safePersona === 'all') params.delete('persona');\n    else params.set('persona', safePersona);\n    const query = params.toString();\n    window.history.pushState(null, '', '/services' + (query ? '?' + query : ''));\n    setActiveTab('services');\n    window.scrollTo({ top: 0, behavior: 'smooth' });\n  };\n\n`;

if (!source.includes('const selectPersona = (nextPersona: string)')) {
  if (!source.includes(marker)) {
    throw new Error('Services render marker not found in src/App.tsx');
  }
  source = source.replace(marker, helper + marker);
  console.log('Production stability: Services persona navigation handler injected.');
} else {
  console.log('Production stability: Services persona navigation handler already present.');
}

fs.writeFileSync(file, source, 'utf8');
