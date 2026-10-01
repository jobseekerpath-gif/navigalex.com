const fs = require('fs');
const path = require('path');

const root = process.cwd();
const appPath = path.join(root, 'src', 'App.tsx');

if (!fs.existsSync(appPath)) {
  throw new Error(`Missing ${appPath}`);
}

let app = fs.readFileSync(appPath, 'utf8');

const oldDeskHandler = 'onSelectDesk={setSelectedDeskModal}';
const newDeskHandler = `onSelectDesk={(desk) => {\n              const fullDesk = ADVISORY_DESKS.find((item) => item.id === desk.id);\n              setSelectedDeskModal(fullDesk || desk);\n            }}`;

if (app.includes(oldDeskHandler)) {
  app = app.replace(oldDeskHandler, newDeskHandler);
}

const contactMarker = `        {/* CONTACT & ASSESSMENT TAB */}\n        {activeTab === 'contact' && (\n          <div className=\"py-20 px-6 max-w-3xl mx-auto space-y-12\">`;
const contactReplacement = `        {/* CONTACT & ASSESSMENT TAB */}\n        {activeTab === 'contact' && (\n          <div className=\"py-20 px-6 max-w-3xl mx-auto space-y-12\">\n            <button\n              type=\"button\"\n              onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}\n              className=\"inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900\"\n            >\n              ← Back to website\n            </button>`;

if (app.includes(contactMarker) && !app.includes('← Back to website')) {
  app = app.replace(contactMarker, contactReplacement);
}

fs.writeFileSync(appPath, app, 'utf8');
console.log('Service flow protection applied: full service data resolved before scope modal; assessment page back button added.');
