const fs = require('node:fs');
const path = require('node:path');

const file = path.join(process.cwd(), 'server.ts');
let source = fs.readFileSync(file, 'utf8');

const startMarker = '  // Seed Data: Inquiries';
const endMarker = '  // Helper to record an audit log';
const start = source.indexOf(startMarker);
const end = source.indexOf(endMarker, start + startMarker.length);

if (start >= 0 && end > start) {
  source = source.slice(0, start) +
    '  // Production starts with no demo inquiries, case studies, or audit logs.\n' +
    '  let inquiries: Inquiry[] = [];\n' +
    '  let caseStudies: CaseStudy[] = [];\n' +
    '  let auditLogs: AuditLog[] = [];\n\n' +
    source.slice(end);
  fs.writeFileSync(file, source, 'utf8');
  console.log('Removed all hard-coded demo inquiry, case-study, and audit-log data.');
} else {
  console.log('Demo-data block already removed or markers not found; leaving server.ts unchanged.');
}
