const fs = require('node:fs');
const path = require('node:path');

const file = path.join(process.cwd(), 'server.ts');
let source = fs.readFileSync(file, 'utf8');

function emptySeedArray(name) {
  const re = new RegExp(`(\\b(?:let|const)\\s+${name}\\s*:\\s*[^=]+?=\\s*)\\[[\\s\\S]*?\\](\\s*;)`);
  const next = source.replace(re, '$1[]$2');
  source = next;
}

emptySeedArray('inquiries');
emptySeedArray('caseStudies');
emptySeedArray('auditLogs');

source = source.replace(
  /\\n\\s*\/\/ Pre-seed some initial activity logs[\\s\\S]*?(?=\\n\\s*\/\/ Seed Data: Inquiries)/,
  '\\n'
);

source = source.replace(
  /\\n\\s*visitorSessions\\.set\\('V-103214'[\\s\\S]*?(?=\\n\\s*\/\/ Seed Data: Inquiries)/,
  '\\n'
);

fs.writeFileSync(file, source, 'utf8');
console.log('All hard-coded demo inquiries, case studies, audit logs, and seeded visitor records removed before server start.');
