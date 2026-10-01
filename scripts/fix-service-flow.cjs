const fs = require('fs');
const path = require('path');

const root = process.cwd();
const appPath = path.join(root, 'src', 'App.tsx');
if (!fs.existsSync(appPath)) throw new Error(`Missing ${appPath}`);

let app = fs.readFileSync(appPath, 'utf8');

// 1) Always resolve the complete service object before opening the scope modal.
// ServicesPage has a lightweight card model; the modal requires the full model.
app = app.replace(
  /onSelectDesk=\{setSelectedDeskModal\}/g,
  `onSelectDesk={(desk) => {\n              const fullDesk = ADVISORY_DESKS.find((item) => item.id === desk.id);\n              setSelectedDeskModal(fullDesk || desk);\n            }}`
);

// 2) Ensure the assessment page always has a working return control.
const contactStart = /\{activeTab === 'contact' && \(\s*<div className="py-20 px-6 max-w-3xl mx-auto space-y-12">/;
if (!app.includes('data-navigalex-assessment-back')) {
  app = app.replace(contactStart, (match) => `${match}\n            <button\n              type="button"\n              data-navigalex-assessment-back\n              onClick={() => { setActiveTab('services'); window.history.pushState(null, '', '/services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}\n              className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900"\n            >\n              ← Back to Services\n            </button>`);
}

// 3) Prevent oversized scope/privacy/guardrail dialogs from being vertically clipped.
app = app.replace(
  /fixed inset-0 z-50 bg-black\/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn/g,
  'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-2 sm:p-4 overflow-y-auto overscroll-contain animate-fadeIn'
);
app = app.replace(
  /max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8/g,
  'max-w-3xl w-full max-h-[calc(100dvh-1rem)] overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-5 shadow-2xl border border-slate-200 my-0'
);

// 4) Keep modal headers visible while the service content scrolls.
app = app.replace(
  /flex items-start justify-between border-b border-slate-200 pb-4/g,
  'sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 pb-4 bg-white'
);

fs.writeFileSync(appPath, app, 'utf8');
console.log('Service flow protection applied: full service data resolved, assessment back button ensured, and responsive modal scrolling/visibility fixed.');
