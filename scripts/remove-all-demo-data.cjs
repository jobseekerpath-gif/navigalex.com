const fs = require('node:fs');
const path = require('node:path');

const file = path.join(process.cwd(), 'server.ts');
let source = fs.readFileSync(file, 'utf8');
const NL = String.fromCharCode(10);

function emptySeedArray(name) {
  const re = new RegExp('(\\\\b(?:let|const)\\\\s+' + name + '\\\\s*:\\\\s*[^=]+?=\\\\s*)\\\\[[\\\\s\\\\S]*?\\\\](\\\\s*;)');
  source = source.replace(re, '$1[]$2');
}

emptySeedArray('inquiries');
emptySeedArray('caseStudies');
emptySeedArray('auditLogs');

source = source.replace(
  new RegExp(NL + '\\\\s*// Pre-seed some initial activity logs[\\\\s\\\\S]*?(?=' + NL + '\\\\s*// Seed Data: Inquiries)'),
  NL
);

source = source.replace(
  new RegExp(NL + '\\\\s*visitorSessions\\\\.set\\\\(\\\\'V-103214\\\\'[\\\\s\\\\S]*?(?=' + NL + '\\\\s*// Seed Data: Inquiries)'),
  NL
);

fs.writeFileSync(file, source, 'utf8');
console.log('Removed hard-coded demo inquiries, case studies, audit logs, and seeded visitor records before server start.');
